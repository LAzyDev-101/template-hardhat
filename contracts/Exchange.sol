//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Exchange is Ownable {
  struct SaleItem {
    address seller;
    uint256 price;
  }

  mapping(address => mapping(uint256 => SaleItem)) public saleItems;

  event SaleItemCreated(
    address indexed _nftAddress,
    uint256 indexed _tokenId,
    uint256 _price,
    address _seller
  );

  event SaleItemCanceled(address indexed _nftAddress, uint256 indexed _tokenId);

  event SaleItemSuccessful(
    address indexed _nftAddress,
    uint256 indexed _tokenId,
    uint256 price,
    address buyer
  );

  function createSaleItem(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _price
  ) external {
    address _seller = msg.sender;
    require(_owns(_nftAddress, _seller, _tokenId));
    require(_price > 0, "Price must greater than 0");

    _escrow(_nftAddress, _seller, _tokenId);

    saleItems[_nftAddress][_tokenId] = SaleItem(_seller, _price);

    emit SaleItemCreated(_nftAddress, _tokenId, _price, _seller);
  }

  function cancelSaleItem(address _nftAddress, uint256 _tokenId) external {
    SaleItem memory _item = saleItems[_nftAddress][_tokenId];
    require(_item.seller == msg.sender, "you can not do this");

    _transfer(_nftAddress, _item.seller, _tokenId);
    _cancelSaleItem(_nftAddress, _tokenId);
  }

  function buySaleItem(address _nftAddress, uint256 _tokenId) external payable {
    SaleItem memory _item = saleItems[_nftAddress][_tokenId];
    require(msg.value == _item.price, "Amount is invalid");

    payable(_item.seller).transfer(_item.price);
    _transfer(_nftAddress, msg.sender, _tokenId);
    _cancelSaleItem(_nftAddress, _tokenId);
    emit SaleItemSuccessful(_nftAddress, _tokenId, _item.price, msg.sender);
  }

  function _cancelSaleItem(address _nftAddress, uint256 _tokenId) private {
    delete saleItems[_nftAddress][_tokenId];
    emit SaleItemCanceled(_nftAddress, _tokenId);
  }

  function _transfer(
    address _nftAddress,
    address _receiver,
    uint256 _tokenId
  ) internal {
    IERC721 _nftContract = IERC721(_nftAddress);
    _nftContract.transferFrom(address(this), _receiver, _tokenId);
  }

  function _owns(
    address _nftAddress,
    address _claimant,
    uint256 _tokenId
  ) private view returns (bool) {
    IERC721 _nftContract = IERC721(_nftAddress);
    return (_nftContract.ownerOf(_tokenId) == _claimant);
  }

  function _escrow(
    address _nftAddress,
    address _owner,
    uint256 _tokenId
  ) private {
    IERC721 _nftContract = IERC721(_nftAddress);
    _nftContract.transferFrom(_owner, address(this), _tokenId);
  }
}

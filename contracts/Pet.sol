//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./trushCaller.sol";

contract PetToken is ERC721URIStorage, TrustCaller {
  uint256 public tokenId = 0;
  uint256 public maxToken = 50;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

  function mint(string memory tokenURI) public {
    require(tokenId < maxToken, "NFT are sold out");
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
    tokenId++;
  }

  function setMaxToken(uint256 newMaxToken) public onlyTrustCaller {
    maxToken = newMaxToken;
  }

  function setTokenURI(uint256 tokenId_, string memory tokenURI)
    public
    onlyTrustCaller
  {
    _setTokenURI(tokenId_, tokenURI);
  }
}

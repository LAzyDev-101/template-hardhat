import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Buy Add Sale Item Exchange Contract", function() {
  let exchange: any;
  let petContract: any;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function() {
    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy();
    await exchange.deployed();

    const PetContract = await ethers.getContractFactory('PetToken');
    petContract = await PetContract.deploy("Pet NFT", "PNFT");
    await petContract.deployed();

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    await petContract.connect(addr1).mint("testTokenURI");

  });

  it("Should Buy Item On Market And Emit Successfully", async function() {
    const price = ethers.utils.parseEther("0.1");
    const tokenId = 0;

    await petContract.connect(addr1).approve(exchange.address, tokenId);
    await exchange.connect(addr1).createSaleItem(petContract.address, tokenId, price);
    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);

    expect(
      await exchange.connect(addr2).buySaleItem(petContract.address, tokenId, { "value": price })
    ).to.be.emit(exchange, "SaleItemSuccessful")
      .withArgs(petContract.address, tokenId, price, addr2.address);

    expect(
      await exchange.saleItems(petContract.address, 0)
    ).to.be.deep.equal(["0x0000000000000000000000000000000000000000", ethers.utils.parseEther("0.0")]);


    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    expect(addr1BalanceBefore.add(price)).to.be.equal(addr1BalanceAfter);

  });

});


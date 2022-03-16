import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Add Sale Item Exchange Contract", function() {
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

  it("Should Create Sale Item And Emit Event Successfully", async function() {
    const price = ethers.utils.parseEther("0.1");
    const tokenId = 0;

    await petContract.connect(addr1).approve(exchange.address, 0);
    expect(
      await exchange.connect(addr1).createSaleItem(petContract.address, tokenId, price)
    ).to.be.emit(exchange, "SaleItemCreated")
      .withArgs(petContract.address, tokenId, price, addr1.address)

    expect(
      await exchange.saleItems(petContract.address, 0)
    ).to.be.deep.equal([addr1.address, price]);

  });

  it("Should Got Reverted When Create Sale Item Multiple Times ", async function() {
    const price = ethers.utils.parseEther("0.1");
    const tokenId = 0;

    await petContract.connect(addr1).approve(exchange.address, 0);
    expect(
      await exchange.connect(addr1).createSaleItem(petContract.address, tokenId, price)
    ).to.be.emit(exchange, "SaleItemCreated")
      .withArgs(petContract.address, tokenId, price, addr1.address)
    await expect(
      exchange.connect(addr1).createSaleItem(petContract.address, tokenId, price)
    ).to.be.revertedWith("")

  });

  it("Should Got Revert When Create Sale Item With Price equal zero", async function() {
    const price = ethers.utils.parseEther("0.0");
    const tokenId = 0;

    await petContract.connect(addr1).approve(exchange.address, 0);
    await expect(
      exchange.connect(addr1).createSaleItem(petContract.address, tokenId, price)
    ).to.be.revertedWith("Price must greater than 0");

  });

  it("Should Cancel SaleItem And Emit Event Successfully", async function() {
    const price = ethers.utils.parseEther("0.1");
    const tokenId = 0;

    await petContract.connect(addr1).approve(exchange.address, 0);
    expect(
      await exchange.connect(addr1).createSaleItem(petContract.address, tokenId, price)
    ).to.be.emit(exchange, "SaleItemCreated")
      .withArgs(petContract.address, tokenId, price, addr1.address)

    expect(
      await exchange.connect(addr1).cancelSaleItem(petContract.address, 0)
    ).to.be.emit(exchange, "SaleItemCanceled")
      .withArgs(petContract.address, tokenId)

    expect(
      await exchange.saleItems(petContract.address, 0)
    ).to.be.deep.equal(["0x0000000000000000000000000000000000000000", ethers.utils.parseEther("0.0")]);

    expect(await petContract.ownerOf(0)).to.be.equal(addr1.address)

  });

  it("Should Got Revert When Cancel SaleItem With Not Owner", async function() {
    const price = ethers.utils.parseEther("0.1");
    const tokenId = 0;

    await petContract.connect(addr1).approve(exchange.address, 0);
    expect(
      await exchange.connect(addr1).createSaleItem(petContract.address, tokenId, price)
    ).to.be.emit(exchange, "SaleItemCreated")
      .withArgs(petContract.address, tokenId, price, addr1.address)

    await expect(
      exchange.connect(addr2).cancelSaleItem(petContract.address, 0)
    ).to.be.revertedWith("you can not do this")

  });
});

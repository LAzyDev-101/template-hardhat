import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Exchange Contract Deploy", function() {

  let owner: SignerWithAddress;
  let addrs: SignerWithAddress[];
  it("Should return the owner succesfully", async function() {
    const Exchange = await ethers.getContractFactory("Exchange");
    const exchange = await Exchange.deploy();
    await exchange.deployed();

    [owner, ...addrs] = await ethers.getSigners();

    expect(await exchange.owner()).to.equal(owner.address);
  });

});

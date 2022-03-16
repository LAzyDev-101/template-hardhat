import { expect } from "chai";
import { ethers } from "hardhat";

describe("Pet Contract Deploy", function() {
  it("Should return the name and symbol succesfully", async function() {
    const Pet = await ethers.getContractFactory("PetToken");
    const pet = await Pet.deploy("Pet NFT", "PNFT");
    await pet.deployed();

    expect(await pet.name()).to.equal("Pet NFT");
    expect(await pet.symbol()).to.equal("PNFT");

  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Pet Contract Mint", function() {
  let petContract: any
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  before(async function() {
    const PetContract = await ethers.getContractFactory('PetToken');
    petContract = await PetContract.deploy("Pet NFT", "PNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    await petContract.deployed();
    petContract.connect(owner).setTrustCaller(owner.address, true);
  });

  it("Should Mint Pet Token NFT with set right owner and counter tokenId successfully", async function() {
    await petContract.connect(addr1).mint("testtokenURI");

    expect(await petContract.ownerOf(0)).to.be.equal(addr1.address);
    expect(await petContract.tokenId()).to.be.equal(1);
  });
});

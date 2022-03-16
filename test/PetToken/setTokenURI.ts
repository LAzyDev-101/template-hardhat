
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Pet Contract SetTokenURI", function() {
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

  it("Should SetTokenURI successfully", async function() {
    await petContract.connect(addr1).mint("testTokenURI");
    expect(await petContract.ownerOf(0)).to.be.equal(addr1.address);

    await petContract.connect(owner).setTokenURI(0, "https://ipfs.io/ipfs/QmWN8XR5pHPtim7zipWzHFDoX4Qxj6ukgwqwVtMQobigEm");
    expect(await petContract.tokenURI(0)).to.be.equal("https://ipfs.io/ipfs/QmWN8XR5pHPtim7zipWzHFDoX4Qxj6ukgwqwVtMQobigEm");
  });

  it("Should got revert when setTokenURI with not owner", async function() {
    await petContract.connect(addr1).mint("testTokenURI");
    expect(await petContract.ownerOf(0)).to.be.equal(addr1.address);

    await expect(
      petContract.connect(addr1).setTokenURI(0, "https://ipfs.io/ipfs/QmWN8XR5pHPtim7zipWzHFDoX4Qxj6ukgwqwVtMQobigEm")
    ).to.be.revertedWith("Caller is not trust")
  });
});

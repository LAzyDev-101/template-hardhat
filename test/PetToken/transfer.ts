
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Pet Contract Transfer", function() {
  let petContract: any
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function() {
    const PetContract = await ethers.getContractFactory('PetToken');
    petContract = await PetContract.deploy("Pet NFT", "PNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    await petContract.deployed();
    await petContract.connect(addr1).mint("testTokenURI");
    expect(await petContract.ownerOf(0)).to.be.equal(addr1.address);
  });

  it("Should TransferFrom Token to Addr2 By Owner", async function() {
    await petContract.connect(addr1).approve(owner.address, 0);
    expect(await petContract.getApproved(0)).to.be.equal(owner.address);

    await petContract.connect(owner).transferFrom(addr1.address, addr2.address, 0);
    expect(await petContract.ownerOf(0)).to.be.equal(addr2.address);

  });

  it("Should Got Reverted When Transfer Token to Addr2 By Owner Without Approved", async function() {
    await expect(
      petContract.connect(owner).transferFrom(addr1.address, addr2.address, 0)
    ).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');

  });
});

import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();
  const addr1 = accounts[1];

  const Pet = await ethers.getContractFactory("PetToken");

  const pet = Pet.attach(
    `${process.env.PetContractAddress}`
  );

  console.log("PetToken Contract Address:", pet.address);
  await pet.connect(addr1).mint("https://ipfs.io/ipfs/QmWN8XR5pHPtim7zipWzHFDoX4Qxj6ukgwqwVtMQobigEm");
  // await pet.setTokenURI(0, "https://ipfs.io/ipfs/QmWN8XR5pHPtim7zipWzHFDoX4Qxj6ukgwqwVtMQobigEm");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

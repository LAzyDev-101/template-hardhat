import { ethers } from "hardhat";

async function main() {
  const Pet = await ethers.getContractFactory("PetToken");
  const pet = await Pet.deploy("Pet NFT", "PNFT");
  await pet.deployed();
  const accounts = await ethers.getSigners();
  pet.connect(accounts[0]).setTrustCaller(accounts[0].address, true);

  const Exchange = await ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy();
  await exchange.deployed();

  console.log("PetToken deployed to: ", pet.address);
  console.log("Exchange deployed to: ", exchange.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

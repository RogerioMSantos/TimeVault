const hre = require("hardhat");

async function main() {

    // ethers is avaialble in the global scope
    const [deployer] = await hre.ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await hre.ethers.getContractFactory("VaultFactory");
    const token = await Token.deploy();
    await token.deployed();
  
    console.log("Token address:", token.address);
  
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  

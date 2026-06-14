const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploy script started");

  const HealthcareEHR = await hre.ethers.getContractFactory("HealthcareEHR");

  const contract = await HealthcareEHR.deploy();

  await contract.waitForDeployment();  // ✅ FIXED

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error("ERROR:", error);
  process.exitCode = 1;
});
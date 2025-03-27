const {task} = require("hardhat/config")

task("depoly-fundme").setAction(async(taskArgs, hre) =>{

    const fundMeFactory = await ethers.getContractFactory("FundMe")

    console.log("deploying...")
    const fundMe = await fundMeFactory.deploy(300)

    await fundMe.waitForDeployment()

    console.log("deployed..." + fundMe.target)
})

module.exports = {}
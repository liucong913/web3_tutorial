// function deployFunction(){
//     console.log("this is a depoly function")
// }

const { network } = require("hardhat")
const {developmentChains,networkConfig} = require("../helper-harhat-config")

//module.exports.default=deployFunction
// module.exports=async(hre)=>{
//     const getNamedAccounts = hre.getNamedAccounts

//     console.log("this is a depoly function")
// }

module.exports=async({getNamedAccounts, deployments})=>{

    const firstAccount = (await getNamedAccounts()).firstAccount
    const {deploy} = deployments

    let dataFeedAddr
    if(developmentChains.includes(network.name)) {
        const MockV3Aggregator =  await deployments.get("MockV3Aggregator")
        dataFeedAddr = MockV3Aggregator.address
    } else {
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
    }
    await deploy("FundMe", {
        from: firstAccount,
        args: [180, dataFeedAddr],
        log: true
    })
}

module.exports.tags = ["all", "fundme"]
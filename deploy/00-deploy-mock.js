const {DECIMAL, INITIAL_ANSWER, developmentChains} = require("../helper-harhat-config")

module.exports=async({getNamedAccounts, deployments})=>{

    if(developmentChains.includes(network.name)) {

        const firstAccount = (await getNamedAccounts()).firstAccount
        const {deploy} = deployments
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        })
    }
}

module.exports.tags = ["all", "mock"]
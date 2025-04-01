const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")
const helpers = require("@nomicfoundation/hardhat-networks-helps")

describe("test fundme contract", async function () {

    let fundMe
    let firstAccount

    beforeEach(async function () {

        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)

    })

    it("test if the owner is msg.sender", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the dataFeed is 0x694AA1769357215DE4FAC081bf1f309aDC325306", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })

    it("window closed", async function () {
        await helpers.time.increase(200)
        await helpers.mine()

        fundMe.fund({value: 10})
    })
})

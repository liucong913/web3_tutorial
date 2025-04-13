const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

describe("test fundme contract", async function () {

    let fundMe
    let firstAccount
    let mockV3Aggregator

    beforeEach(async function () {

        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
    })

    it("test if the owner is msg.sender", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the dataFeed is assigned correctly", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
    })

    it("window closed", async function () {

        await helpers.time.increase(200)
        await helpers.mine()

        fundMe.fund({value: 10})
    })

    it("window closed, value greater than minium, fund failed", async function () {

        await helpers.time.increase(1000)
        await helpers.mine()

        expect(fundMe.fund({value: ethers.parseEther("0.1")}))
            .to.be.revertedWith("window is closed")
    })

    it("window open, value is less than minium, fund fail", async function () {

        
        
    })
})

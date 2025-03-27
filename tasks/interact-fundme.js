const {task} = require("hardhat/config")

task("interact-fundme")
.addParam("addr", "fundMe contract address")
.setAction(async(taskArgs, hre) =>{

    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)

    const [firstAccount, secondAccount] = await ethers.getSigners()

    const fundTx = await fundMe.fund({value: ethers.parseEther("0.000000000000000001")})
    await fundTx.wait()

    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log('banlance of contract:' + balanceOfContract);

    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.000000000000000002")})
    await fundTxWithSecondAccount.wait()

    const balanceOfContractSecord = await ethers.provider.getBalance(fundMe.target)
    console.log('banlance of contract:' + balanceOfContractSecord);

    const firstAccountBalance = await fundMe.funderToAmount(firstAccount.address)
    const secondAccountBalance = await fundMe.funderToAmount(secondAccount.address)
    console.log('Balance of first account' + firstAccountBalance)
    console.log('Balance of second account' + secondAccountBalance)

})

module.exports = {}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract FundMe {

    AggregatorV3Interface public dataFeed;

    mapping(address => uint256) public funderToAmount;

    uint256 MINIMUM_VALUE = 2 * 10 ** 18;

    uint256 constant target = 6 * 10 ** 18;

    address public owner;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    address erc20Addr;

    bool public getFundSuccess = false;

    constructor(uint256 _lockTime, address dataFeedAddr) {
        dataFeed = AggregatorV3Interface(
            dataFeedAddr
        );
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    function fund() external payable {
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        require(block.timestamp < deploymentTimestamp + lockTime, "window is closed");
        funderToAmount[msg.sender] = msg.value;
    }

        function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice/ (10 ** 8);
    }

    function getFund() external {
        require(convertEthToUsd(address(this).balance) >= target, "target is not reached");
        require(msg.sender == owner, "this function can only be called by owner");
        require(block.timestamp >= deploymentTimestamp + lockTime, "window is not closed");
        payable(msg.sender).transfer(address(this).balance);
        getFundSuccess = true;
    }

    function transferOwnership(address newOwnser) public {
        require(msg.sender == owner, "this function can only be called by owner");
        owner = newOwnser;
    }

    function refund() external windowClose{
        require(convertEthToUsd(address(this).balance) < target, "target is reached");
        bool success;
        (success, ) = payable(msg.sender).call{value: funderToAmount[msg.sender]}("");
        funderToAmount[msg.sender] = 0;
    }

    modifier windowClose(){
        require(block.timestamp >= deploymentTimestamp + lockTime, "window is not closed");
        _;
    }

    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "you are not authorized to use this function");
        funderToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr(address _erc20Addr) public {
        require(msg.sender == owner, "this function can only be called by owner");
        erc20Addr = _erc20Addr;
    }
}
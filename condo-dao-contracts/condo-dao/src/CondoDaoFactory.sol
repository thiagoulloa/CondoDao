// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CondoDao.sol";

contract CondoDAOFactory {
    address[] public deployedDAOs;
    event CondoDAOCreated(address indexed daoAddress, address indexed creator);

    function createCondoDAO(string memory _name, address[] memory _committee, string[] memory _ids, uint256 _feeETH) external returns (address) {
        CondoDAO newDAO = new CondoDAO(_name, _committee, _ids, _feeETH);
        deployedDAOs.push(address(newDAO));
        emit CondoDAOCreated(address(newDAO), msg.sender);
        return address(newDAO);
    }

    function getDeployedDAOs() external view returns (address[] memory) {
        return deployedDAOs;
    }
}

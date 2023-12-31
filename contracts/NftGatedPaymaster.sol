// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.12;

import "./BasePaymaster.sol";
import { console } from "hardhat/console.sol";

/**
 * test paymaster, that pays for everything, without any check.
 */
contract NftGatedPaymaster is BasePaymaster {

    // Mapping of NFT collections we support
    mapping(address => bool) public erc721Contracts;
    address[] public erc721ContractsArray;

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
        // to support "deterministic address" factory
        // solhint-disable avoid-tx-origin
        if (tx.origin != msg.sender) {
            _transferOwnership(tx.origin);
        }
    }

    function addNFTCollection(address _newAddress) public onlyOwner {
        require(
            IERC721(_newAddress).supportsInterface(0x80ac58cd), // IERC721 interface ID
            "The contract does not implement the IERC721 interface"
        );
        if (!erc721Contracts[_newAddress]) {
            erc721ContractsArray.push(_newAddress);
            erc721Contracts[_newAddress] = true;
        }
    }

    function getAddressCount() public view returns (uint256) {
        return erc721ContractsArray.length;
    }

    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
    internal virtual override view
    returns (bytes memory context, uint256 validationData) {
        (userOp, userOpHash, maxCost);
        console.log(userOp.sender);
        bool ownsNFT = false;
        for (uint256 i = 0; i < erc721ContractsArray.length; i++) {
            if (hasBalanceForNFTCollection(erc721ContractsArray[i], userOp.sender)) ownsNFT = true;
        }
        require(ownsNFT, "Smart Account does not qualify for free gas.");
        return ("", 1);
    }

    function hasBalanceForNFTCollection(address _contractAddress, address _owner) internal view returns (bool) {
        return IERC721(_contractAddress).balanceOf(_owner) > 0;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./ERC721.sol";
import "./ECDSA.sol";
import "./IERC2981.sol";

/*
 *
 *  ______ _____ _____    _   _ ______ _______
 * |  ____|_   _|  __ \  | \ | |  ____|__   __|
 * | |__    | | | |__) | |  \| | |__     | |
 * |  __|   | | |  ___/  | . ` |  __|    | |
 * | |____ _| |_| |      | |\  | |       | |
 * |______|_____|_|      |_| \_|_|       |_|
 *
 */

contract EIPNFT is IERC2981, ERC721 {
    using ECDSA for bytes32;
    using Strings for uint256;
    using Strings for uint16;

    uint24 internal defaultBips;
    address public owner;
    address public paymasterRoyaltyReceiver;

    uint256 internal immutable top;
    uint256 internal immutable middle;

    mapping(uint256 => address) internal _receiverAddresses;

    struct MintInfo {
        uint256 mintCount;
        bool mintingComplete;
        string dateCreated;
        string eipDescription;
        uint8 tokenUriId;
    }

    // Minting Information for a given EIP
    mapping(uint256 => MintInfo) internal _mintInfo;

    // Mapping of token id to token uri id (for images)
    mapping(uint256 => uint8) internal _tokenUriMapping;


    uint256 private _currentTokenId = 0;

    constructor(address _owner, uint24 _defaultBips, address paymaster) ERC721("Ethereum Improvement Proposal - NFTs", "EIP", "") {
        owner = _owner;
        middle = 100000;
        top = 100000000000;
        defaultBips = _defaultBips;
        paymasterRoyaltyReceiver = paymaster;
    }

    function _encodeTokenId(uint256 eipNumber, uint256 tokenNumber) internal view returns (uint256) {
        return (top + (eipNumber * middle) + tokenNumber);
    }

    function _getEIPNumber(uint256 tokenId) internal view returns (uint256) {
        return (tokenId - top) / middle;
    }

    function _getTokenNumber(uint256 tokenId) internal view returns (uint256) {
        return (tokenId - top - (middle * _getEIPNumber(tokenId)));
    }

    function authenticatedMint(
        address _authorAddress,
        uint8 _tokenUriId
    ) public returns (uint256) {
        uint256 newTokenId = _getNextTokenId();
        _receiverAddresses[newTokenId] = _authorAddress;
        safeMint(newTokenId, _authorAddress);
        _tokenUriMapping[newTokenId] = _tokenUriId;
        _incrementTokenId();
        return newTokenId;
    }

    function _getNextTokenId() private view returns (uint256) {
        return _currentTokenId + 1;
    }

    function _incrementTokenId() private {
        _currentTokenId = _currentTokenId + 1;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }

    function verifyMint(
        uint96 _eipNumber,
        uint8 _maxMints,
        address _authorAddress,
        string memory _dateCreated,
        string memory _eipDescription,
        bytes memory _authSignature
    ) public view returns (bool) {
        require(msg.sender == _authorAddress, "Wrong sender");
        return
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(
                    abi.encodePacked(
                        abi.encodePacked(_eipNumber),
                        abi.encodePacked(_maxMints),
                        abi.encodePacked(_authorAddress),
                        abi.encodePacked(_dateCreated),
                        abi.encodePacked(_eipDescription)
                    )
                ),
                _authSignature
            ) == owner;
    }

    function safeMint(uint256 tokenId, address _authorAddress) internal virtual {
        super._safeMint(_authorAddress, tokenId, "");
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        uint256 eipNumber = _getEIPNumber(tokenId);
        string memory uri = string(abi.encodePacked(_tokenUriMapping[tokenId]));
        return uri;
    }

    /// @inheritdoc	IERC2981
    function royaltyInfo(uint256 _tokenId, uint256 value)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver = paymasterRoyaltyReceiver;
        royaltyAmount = (value * defaultBips) / 10000;
    }

    function transferOwnership(address newOwner) public {
        require(owner == msg.sender, "Unauthorized");
        require(newOwner != address(0));
        owner = newOwner;
    }
}
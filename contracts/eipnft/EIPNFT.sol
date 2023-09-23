// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./ERC721.sol";
import "./ECDSA.sol";
import "./EIPRender.sol";
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
        uint16 mintCount;
        bool mintingComplete;
        string dateCreated;
        string eipDescription;
    }

    // Minting Information for a given EIP
    mapping(uint256 => MintInfo) internal _mintInfo;

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
        uint96 _eipNumber,
        uint8 _maxMints,
        address _authorAddress,
        string memory _dateCreated,
        string memory _eipDescription
        // bytes memory _authSignature
    ) public {
        // require(
        //     verifyMint(_eipNumber, _maxMints, _authorAddress, _dateCreated, _eipDescription, _authSignature),
        //     "Not authorized"
        // );

        MintInfo storage currentMintInfo = _mintInfo[_eipNumber];
        uint256 tokenNumber = currentMintInfo.mintCount + 1;

        if (bytes(_dateCreated).length > 0) {
            currentMintInfo.dateCreated = _dateCreated;
        }

        if (bytes(_eipDescription).length > 0) {
            currentMintInfo.eipDescription = _eipDescription;
        }

        require(!currentMintInfo.mintingComplete, "Too many mints");

        // Set mintingComplete flag to true when on the last mint for an EIP.
        // Contract owner can't issue new NFTs for thie EIP after this point.
        if (tokenNumber == _maxMints) {
            currentMintInfo.mintingComplete = true;
        }

        if (super.balanceOf(_authorAddress) != 0) {
            for (uint256 i = 1; i <= _maxMints; i++) {
                uint256 currentTokenId = _encodeTokenId(_eipNumber, i);
                if (_exists(currentTokenId)) {
                    require(super.ownerOf(currentTokenId) != _authorAddress, "Already minted");
                }
            }
        }

        uint256 tokenId = _encodeTokenId(_eipNumber, tokenNumber);
        _receiverAddresses[tokenId] = _authorAddress;
        currentMintInfo.mintCount += 1;
        safeMint(tokenId, _authorAddress);
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
        string memory name = string(abi.encodePacked("EIP-", eipNumber.toString()));

        address currentOwner = super.ownerOf(tokenId);
        return
            EIPRender.generateMetadata(
                name,
                string(
                    abi.encodePacked(
                        "(",
                        _getTokenNumber(tokenId).toString(),
                        "/",
                        _mintInfo[eipNumber].mintCount.toString(),
                        ")"
                    )
                ),
                currentOwner,
                _mintInfo[eipNumber].dateCreated,
                _mintInfo[eipNumber].eipDescription
            );
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
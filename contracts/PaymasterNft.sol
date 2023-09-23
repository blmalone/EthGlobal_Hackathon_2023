pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract PaymasterNft is ERC721 {
    using Counters for Counters.Counter;
    // Optional mapping for token URIs
    mapping(uint256 => string) public _tokenURIs;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("GameItem", "ITM") {}

    function awardItem(address player, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _tokenURIs[newItemId] = tokenURI;

        return newItemId;
    }
}

// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract ElectricLaneNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["Kill", "Dance", "Kiss", "Take", "Bend", "Hate", "Loose", "Require", "Behind", "Run", "Lead", "Heal", "Peel", "Over", "Horrendous", "Lord"];
    string[] secondWords = ["Your", "Their", "Our", "My", "Pelicans", "XXX", "Cats", "Chickens", "Looser", "Nerd", "Genius", "Idiot", "Everything", "Together", "HAHAHA", "Ancient"];
    string[] thirdWords = ["Hatred", "Face", "Food", "Fling", "City", "Sex", "Travesty", "Bed", "Doornob", "Table", "Rain", "Mountain", "Hell", "Heaven", "hmmm", "wtf"];

    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];

    uint256 max_supply = 50;

    event NewElectricNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721 ("RandomWordsYEA", "RANDOM") {
        console.log("This is my NFT contract. Whoa!");
    }

    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256){
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getTotalNFTsMintedSoFar() public view returns (uint256){
        return _tokenIds.current();
    }

    function makeElectricNFT() public {
        require(_tokenIds.current() <= max_supply, "Maximum Number of NFTS's Minted");
        uint256 newItemId = _tokenIds.current();
        

        

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        string memory randomColor = pickRandomColor(newItemId);
        string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord, "</text></svg>"));
        

        string memory json = Base64.encode(
            bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    combinedWord,
                    '", "description": "A highly acclaimed collection of Random Words.", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
        );
        
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );


        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");


        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        _tokenIds.increment();

        emit NewElectricNFTMinted(msg.sender, newItemId);
    }
}


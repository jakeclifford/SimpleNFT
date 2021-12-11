import React from 'react';
import './styles/App.css';
import { ethers } from "ethers"
import twitterLogo from './assets/twitter-logo.svg';
import thedog from './assets/TheDog.png';
import ElectricLaneNft from './utils/ElectricLaneNft.json'

// Constants
const TWITTER_HANDLE = 'cliffdognft';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0xa19E2BC197e56e2E24C77f2D57c49D43F194B2a6"

const App = () => {

  
  const [currentAccount, setCurrentAccount] = React.useState("")
  const [mintedSoFar, setMintedSoFar] = React.useState(0)
  const [mining, setMining] = React.useState(false)
  

  const checkNetwork = async () => {
    const { ethereum } = window

    if (!ethereum) {
      console.log("Make Sure You Have Metamask")
      
      return
    } else {
      console.log("We have the ethereum Object", ethereum)
    }
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);


    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
	      alert("You are not connected to the Rinkeby Test Network!");
    return
      }
  }


  const checkIfWalletIsConnected = async () => {
    
    const { ethereum } = window

    if (!ethereum) {
      console.log("Make Sure You Have Metamask")
      
      return
    } else {
      console.log("We have the ethereum Object", ethereum)
    }

    const accounts = await ethereum.request({method: 'eth_accounts'})

    if (accounts.length != 0) {
      const account = accounts[0]
      console.log("Found authorized account:", account)
      setCurrentAccount(account)

      setupEventListener()
    } else {
      console.log("No Authorized Account Found")
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window

      if (!ethereum) {
        console.log("Get Metamask")
        return
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'})

      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])

      setupEventListener()
    } catch (error){
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ElectricLaneNft.abi, signer);
        connectedContract.on("NewElectricNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  
  const getTotalNFTsMintedSoFar = async () => {
    try {
      const {ethereum} = window 
      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ElectricLaneNft.abi, signer)
        
        let nftTxn = await connectedContract.getTotalNFTsMintedSoFar()

        const result =  parseInt(nftTxn,10)
        setMintedSoFar(result)

        } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const {ethereum} = window 
      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ElectricLaneNft.abi, signer)

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeElectricNFT()
        setMining(true)
        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setMining(false)
        getTotalNFTsMintedSoFar()
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  

    
  

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  React.useEffect(() => {
    checkNetwork()
    checkIfWalletIsConnected()
    getTotalNFTsMintedSoFar()
  }, [currentAccount])

  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Name The Dogy</p>
          <p className="sub-text">
            Give the Dogy a Name, WOOOOOOOF WOOOOOOOOF !!!!
          </p>
          <h2 className = 'minted'>{mintedSoFar - 1} / 50 Minted</h2>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : mining ?  <div class="lds-hourglass"></div> : (<button onClick={askContractToMintNft} className="cta-button connect-wallet-button">Mint NFT</button>)}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
        <a className="footer-text" href='https://testnets.opensea.io/collection/randomwordsyea-pas5ttlau1'>Check Out Collection on Opensea</a>
        <img className='thedog' src={thedog} />
      </div>
    </div>
  );
};

export default App;
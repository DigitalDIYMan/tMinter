import React from 'react';
import logo from './logo.svg';
import './App.css';
import aiImg from './all_2.png';

import { useState } from 'react';
import Web3 from 'web3';
import { ethers } from "ethers";

import abiOrigin from "./abi/abiPGS";


// Alchemy API key
const alchemyKey = process.env.REACT_APP_API_KEY;

// Polygon mainnet RPC URL
const polygonUrl = "https://polygon-mainnet.alchemyapi.io/v2/" + alchemyKey;

// NFT contract address




const nftContractAddress = "0xB1099ebbE89756483D982Ee81432C42C604043D6";

const nftContractAbi = abiOrigin;
console.log("nftContractAbi : ", nftContractAbi);


const onePrice = 0.00001;
const onePriceStr = onePrice.toString();


const App = () => {

  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");
  const [nftCount, setNftCount] = useState("");
  const [counter, setCounter] = useState(0);

  // async function getGasPrice() 
  // {
  //   let feeData = (await rpcProvider.getGasPrice()).toNumber();
  //   return feeData;
  // }

  // async function getNonce(walletParam : any) 
  // {
  //   let nonce = await rpcProvider.getTransactionCount(walletParam.address);
  //   return nonce;
  // }

  const mintNFTOnWeb3 = async (amount: Number) =>
  {
    try
    {
      const web3 = new Web3(window.ethereum);
      const nftCont = new web3.eth.Contract(JSON.parse(JSON.stringify(nftContractAbi)), nftContractAddress);
      console.log("nftCont : ", nftCont);

      
      const transPrice = web3.utils.toWei(onePriceStr, "ether");
      console.log("transPrice : ", transPrice);

      const totalPrice = Number(transPrice) * Number(amount);
      console.log("totalPrice : ", totalPrice);

      const rawTxn = await nftCont.methods.mintForAll(amount); 
      console.log("rawTxn : ", rawTxn);
      
      const gas = await rawTxn.estimateGas({from: wallet, value : totalPrice});
      const gasPrice = await web3.eth.getGasPrice();
      const data = rawTxn.encodeABI();
      console.log("data : ", data);

      const nonce = await web3.eth.getTransactionCount(wallet);
      const txData = 
      {
        from: wallet,
        to: nftCont.options.address,
        data: data,
        gas,
        gasPrice,
        nonce,
        value : totalPrice,
      };
      console.log("txData : ", txData);

      const receipt = await web3.eth.sendTransaction(txData);
      console.log(`Transaction hash : ${receipt.transactionHash}`);
      console.log("receipt : ",  receipt);

    }
    catch (e)
    {
      console.error("err : ", e)
    }
  };



  const getMainnetName = (mainnetID : Number) =>
  {
    let mainnetName = "";

    if (mainnetID === 1)
    {
      mainnetName = "Ethereum";
    }
    else if (mainnetID === 137)
    {
      mainnetName = "Polygon";
    }
    else if (mainnetID === 80001)
    {
      mainnetName = "Mumbai";
    }

    return mainnetName;
  };

  const connectWallet = async () => 
  {
    if (!window.ethereum) 
    {
      window.open(
        'https://metamask.io/download.html',
        '_blank' // <- This is what makes it open in a new window.
      );
      return;
    }

    try 
    {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const web3 = new Web3(window.ethereum);
      const network = await web3.eth.net.getId();
      const balance = await web3.eth.getBalance(accounts[0]);

      const networkName = getMainnetName(network);

      setWallet(accounts[0]);
      setNetwork(networkName);
      setBalance(web3.utils.fromWei(balance));
    } 
    catch (err) 
    {
      console.error(err);
    }
  };

  const changePolygonMainnet = async () => 
  {

    if (!window.ethereum) 
    {
      window.open(
        'https://metamask.io/download.html',
        '_blank' // <- This is what makes it open in a new window.
      );
      return;
    }

    try 
    {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });

      await connectWallet();

    } 
    catch (e : any) 
    {
      if (e.code === 4902) 
      {
        try 
        {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC', // 2-6 characters long
                  decimals: 18
                },
                blockExplorerUrls: ['https://polygonscan.com'],
                rpcUrls: ['https://polygon-rpc.com/'],
              },
            ],
          });

          await connectWallet();
        } 
        catch (addError) 
        {
          console.error(addError);
        }
      }
      // console.error(e)
    }
  };


  const changePolygonTestnet = async () => 
  {

    if (!window.ethereum) 
    {
      window.open(
        'https://metamask.io/download.html',
        '_blank' // <- This is what makes it open in a new window.
      );
      return;
    }

    try 
    {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      });

      await connectWallet();
    } 
    catch (e : any) 
    {
      if (e.code === 4902) 
      {
        try 
        {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'MUMBAI Testnet',
                nativeCurrency: {
                  name: 'tMATIC',
                  symbol: 'tMATIC', // 2-6 characters long
                  decimals: 18
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
              },
            ],
          });

          await connectWallet();
        } 
        catch (addError) 
        {
          console.error(addError);
        }
      }
      // console.error(e)
    }
  };



  return (
    <div className="App">
      <header className="App-header">
        <img src={aiImg} className="App-logo" alt="logo" />
        <p>
        PolyGirls are AI art girls born on Polygon Mainnet. 
        </p>
        <p>
        Their appearance is very diverse, beautiful, and very attractive. 
        </p>
        <p>
        Take a trip to Crypto World with them reborn as NFT in AI technology!
        </p>


        <button onClick={connectWallet}>Connect</button>
        <button onClick={changePolygonMainnet}>Change Polygon Mainnet</button>
        <button onClick={changePolygonTestnet}>Change Mumbai Testnet</button>

        <p></p>
        <button onClick={ ()=> mintNFTOnWeb3(counter)}>Minting</button>
        <p></p>
        <h4> Mint count : { counter } </h4>
        <div>
            <button onClick={()=> setCounter(counter + 1)}> Mint Count + 1 </button>
            <button onClick={()=> { 
                                    if (counter <= 0)
                                    {
                                      setCounter(0);
                                    }
                                    else 
                                    {
                                      setCounter(counter - 1); 
                                    }  

                                    } }> Mint Count - 1</button>
        </div>
        <p></p>
        <p></p>
        

        <div>{`Wallet: ${wallet}`}</div> 
        <div>{`Network: ${network}`}</div>
        <div style={{ marginLeft: "20px" }}>{`Balance: ${balance}`}</div>



      </header>



    </div>
  );


};

export default App;


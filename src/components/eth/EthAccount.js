import config from '../../config'

import contract from "../../artifacts/contracts/EthSignsEscrow.sol/EthSignsEscrow.json"
import api from '../../api';
import Web3Modal from "web3modal";
import Web3 from "web3";

const contractAddress = config.CONTRACT_ADDRESS


let web3
let nftContract

const setupWeb3 = async () => {
    // const providerOptions = {
    //     /* See Provider Options Section */
    //   };
    if (web3) return
    const web3Modal = new Web3Modal({
        network: "mainnet",
        connectTo: config.RPC_API_URL,
        cacheProvider: true,
        // providerOptions // required
    });

    const provider = await web3Modal.connect();


    web3 = new Web3(provider);
    nftContract = new web3.eth.Contract(contract.abi, contractAddress);

}


export const validateEthAccount = async (address) => {
    return !web3.utils.isAddress(address)
}


export const verifyMinted = async (signID, address) => {

    let isMinted = true
    await api({
        method: "GET",
        url: `users/verify/${signID}/${address}/`
    }).then(data => {
        isMinted = data.data.valid
    })
        .catch(err => {
            if (err.response) {
                console.log(err.response)
            } else if (err.request) {
                console.log(err.request)
            }
        })
    return isMinted
}

export const ethAction = async (signID, address, action) => {
    let resp = {}
    await api({
        method: "GET",
        url: `users/${signID}/?address=${address}&action=${action}`
    }).then(data => {
        resp = data.data
    })
        .catch(err => {
            if (err.response) {
                console.log(err.response)
            } else if (err.request) {
                console.log(err.request)
            }
        })
    return resp
}


export const ethBrowserPresent = async () => {

    return !!(window.ethereum || window.web3)
}


export const getAccount = async (connect = false) => {

    // let w3
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        await setupWeb3(true)
        const accounts = await web3.eth.getAccounts()
        return accounts[0] || null

    } else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
        //getting Permission to access
        await setupWeb3()
        if (connect) { window.ethereum.request({ method: 'eth_requestAccounts' }); }
        // web3 = new Web3(window.web3.currentProvider);
        // In legacy MetaMask acccounts are always exposed
        const accounts = await web3.eth.getAccounts()
        return accounts[0] || null

    } else {
        alert("No MetaMask detected, please install MetaMask first");
    }
}

export const adminWithdraw = async () => {
    const account = await getAccount()

    // const { transactionHash } = await nftContract.methods.withdraw().send({ from: account })
    let transactionHash = null
    let errorMessage = null
    await new Promise((resolve, reject) => {
        nftContract.methods.withdraw().send({ from: account })
            .once('transactionHash', function (hash) { transactionHash = hash; resolve(hash) })
            .on('error', function (error) { errorMessage = error.message; resolve(errorMessage); console.log({ error }) })

    })

    return { transactionHash, errorMessage }
}
export const getAdminBalance = async () => {
    const account = await getAccount()

    return await new Promise((resolve, _) => {
        nftContract.methods.balance().call({ from: account })
            .then(balance => { resolve(web3.utils.fromWei(balance)) })
        // .on('error', function (error) { console.log({ error }); resolve("Failed to load balance") })
    })
}
export const getTokenSupply = async () => {
    await setupWeb3()
    return await nftContract.methods.totalSupply().call()
}


export const getConnectedAccount = async () => {
    const ethBrowserPresent = !!(window.ethereum || window.web3)
    if (ethBrowserPresent) {
        return await getAccount()
    }
}



export const getAccountTokenIds = async () => {
    const account = await getAccount()
    const balance = await nftContract.methods.balanceOf(account).call()
    let tokenIds = []
    if (+balance > 0) {
        const range = [...Array(+balance).keys()];

        await Promise.all(range.map(async (i) => {
            const id = await nftContract.methods.tokenOfOwnerByIndex(account, i).call()
            tokenIds.push(+id)
        }))
    }
    return tokenIds
}

import config from '../../config'

import { createAlchemyWeb3 } from "@alch/alchemy-web3"
const web3 = createAlchemyWeb3(config.ALCHEMY_API_URL);
// const contract = require("./artifacts/contracts/MyNFT.sol/MyNFT.json");
// const contractAddress = "0x3A81ced09917adE002F269bD96014716bACC1BE2"
// // const contractAddress = "0xe888c1aCD85730bd9F63762e9bbbAa71c817edbE"
// const nftContract = new web3.eth.Contract(contract.abi, contractAddress);


export const ethBrowserPresent = async () => {

    return !!(window.ethereum || window.web3)
}
export const getConnectedAccount = async () => {
    const ethBrowserPresent = !!(window.ethereum || window.web3)
    if (ethBrowserPresent) {
        const accounts = await web3.eth.getAccounts()
        if (accounts[0]) {
            return accounts[0]
        }
    }
}



export const getAccount = async () => {
    if (window.ethereum || window.web3) {
        window.web3 = web3;
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Acccounts now exposed
            const accounts = await web3.eth.getAccounts()
            return accounts[0]
        } catch (error) {
            console.log(error)
            // User denied account access...
        }
    }
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
}

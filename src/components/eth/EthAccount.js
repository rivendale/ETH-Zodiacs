import config from '../../config'

import contract from "../../artifacts/contracts/EthsignsToken/EthsignsToken.json"
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
    await setupWeb3()
    return !web3.utils.isAddress(address)
}
export const getChainId = async () => {
    await setupWeb3()
    return await web3.eth.getChainId()
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



export const addressStats = async (address) => {

    let stats = null
    await api({
        method: "GET",
        url: `users/stats/${address}`
    }).then(({ data }) => {
        stats = data
    })
        .catch(err => {
            if (err.response) {
                console.log(err.response)
            } else if (err.request) {
                console.log(err.request)
            }
        })
    return { stats }
}


export const ethBrowserPresent = async () => {

    return !!(window.ethereum || window.web3)
}

// ethereum.on('accountsChanged', function(accounts=>{console.log(accounts)}));

export const getAccount = async (connect = false) => {

    // let w3
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        await setupWeb3()
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





const getTokenOwner = async (tokenId) => {
    return nftContract.methods.ownerOf(tokenId).call()
}
const ERROR_MAPPER = {
    "-32000": 'Insufficient funds in your account. 100 Matic required for minting',
    "4001": "Transaction cancelled"
}
export const payMintingFee = async ({ amountToSend }) => {
    const account = await getAccount()
    const nonce = await web3.eth.getTransactionCount(config.PUBLIC_KEY, 'latest')

    let weiAmount = web3.utils.toWei(amountToSend.toString(), 'ether')

    var rawTransaction = {
        "from": account,
        "nonce": web3.utils.toHex(nonce),
        "value": weiAmount,
    };

    let errorMessage = null
    let transactionHash = null

    return await new Promise((resolve, _) => {

        nftContract.methods.sendPayment().estimateGas(rawTransaction)
            .then(async function (gasAmount) {
                rawTransaction.gas = web3.utils.toHex(gasAmount)
                rawTransaction.gasPrice = web3.utils.toHex(await web3.eth.getGasPrice())
                rawTransaction.gasLimit = web3.utils.toHex(gasAmount * 2)

                nftContract.methods.sendPayment().send(rawTransaction)
                    .once('transactionHash', function (hash) {
                        transactionHash = hash; console.log({ hash });
                    })
                    .once('receipt', function (receipt) {
                        console.log({ receipt });
                        transactionHash = receipt.transactionHash;
                        resolve({ transactionHash })
                    })
                    .on('error', function (error) {
                        if (ERROR_MAPPER.hasOwnProperty(error.code?.toString())) {
                            errorMessage = ERROR_MAPPER[error.code?.toString()]
                        }
                        else {
                            errorMessage = error.message;
                        }
                        // console.log({ error });
                        resolve({ errorMessage })
                    })

            })
            .catch(function (error) {
                if (error?.stack?.toString().includes("-32000") || error.code?.toString() === "-32000") {
                    errorMessage = ERROR_MAPPER["-32000"]
                }
                else {
                    errorMessage = error.message;
                }
                resolve({ errorMessage })

            })
    })

}


export const transferToken = async (tokenIds, toAddress) => {
    await setupWeb3()

    let transactionHashes = []
    let errorMessage
    await Promise.all(tokenIds.map(async (i) => {
        const fromAddress = await getTokenOwner(i)

        // because the base ERC721 contract has two overloaded versions of the safeTranferFrom function,
        // we need to refer to it by its fully qualified name.
        // const tranferFn = contract['safeTransferFrom(address,address,uint256)']
        if (fromAddress === toAddress) {
            console.log("Same TO & From address")
            return { toAddress, fromAddress, i }
        }
        else {
            await new Promise((resolve, reject) => {
                nftContract.methods.safeTransferFrom(fromAddress, toAddress, i)
                    .send({
                        from: fromAddress
                    }).once('transactionHash', function (hash) { transactionHashes.push(hash); resolve(hash) })
                    // .once('receipt', function (receipt) { console.log({ receipt }) })
                    // .on('confirmation', function (confNumber, receipt) { console.log({ confNumber, receipt }) })
                    .on('error', function (error) { errorMessage = error.message; resolve(); console.log({ error }) })
                // .then(function (receipt) {
                //     const to = receipt.events.Transfer.returnValues.to
                //     const tkId = receipt.events.Transfer.tokenId
                //     return { to, tkId }
                // })
            })
        }
    }))

    return { transactionHashes, errorMessage }

}

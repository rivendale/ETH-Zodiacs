import config from '../../config'

import contract from "../../artifacts/contracts/EthSignsEscrow.sol/EthSignsEscrow.json"
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

export const payMintingFee = async () => {
    const account = await getAccount()
    const nonce = await web3.eth.getTransactionCount(config.PUBLIC_KEY, 'latest')
    let amountToSend = 400000000000000
    let weiAmount = web3.utils.toWei(amountToSend.toString(), 'wei')

    var rawTransaction = {
        "from": account,
        "nonce": web3.utils.toHex(nonce),
        "value": weiAmount,
    };

    let errorMessage = null
    let transactionHash = null

    return await new Promise((resolve, _) => {

        nftContract.methods.sendPayment().estimateGas({ from: account })
            .then(function (gasAmount) {
                rawTransaction.gasPrice = web3.utils.toHex(gasAmount * 800000)
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
                    .on('error', function (error) { errorMessage = error.message; console.log({ error }); resolve({ errorMessage }) })

            })
            .catch(function (error) {
                errorMessage = error.message;
                console.log({ error });
                resolve({ errorMessage })

            })
    })

}


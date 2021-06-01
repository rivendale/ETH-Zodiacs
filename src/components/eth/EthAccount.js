import config from '../../config'

// import { createAlchemyWeb3 } from "@alch/alchemy-web3"
import contract from "../../artifacts/contracts/EthSigns.sol/EthSigns.json"
// import ipfsHttpClient from 'ipfs-http-client'
import { NFTStorage } from 'nft.storage'
import api from '../../api';
import Web3Modal from "web3modal";
import Web3 from "web3";


// import all from 'it-all'
// import CID from 'cids'
// import uint8ArrayConcat from 'uint8arrays/concat'
// import uint8ArrayToString from 'uint8arrays/to-string'
// import all from 'it-all'
// import axios from 'axios'
// const web3 = createAlchemyWeb3(config.RPC_API_URL);
const contractAddress = config.CONTRACT_ADDRESS
// // const contractAddress = "0xC11E32173729c5AbF46D6AdC0acb5b66174ea379"
// const nftContract = new web3.eth.Contract(contract.abi, contractAddress);


// const { urlSource } = ipfsHttpClient
// let ipfs

// const ipfsAddOptions = {
//     cidVersion: 1,
//     hashAlg: 'sha2-256'
// }

// ipfs = ipfsHttpClient(config.ipfsApiUrl)

const client = new NFTStorage({ token: config.IPFS_API_KEY })


// const Web3 = require('web3')

// const web3 = new Web3(config.RPC_API_URL)
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

async function ipfsAddAsset(asset, assetMetadata) {
    // const imgData = await getFileFromUrl(imgUrl, "dragon.png")
    const cid = await client.storeDirectory([asset,
        new File([JSON.stringify(assetMetadata, null, 2)], 'metadata.json')])
    return { cid }
}

// getFileFromUrl(imgUrl, "dragon.png").then(data => {

//     ipfsAddAsset(data, { name: "dragon", type: "3" }).then(cid => console.log(cid))
// })


async function getFileFromUrl(url, name, defaultType = 'image/jpeg') {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
        type: response.headers.get('content-type') || defaultType,
    });
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


const payMintingFee = async () => {
    const account = await getAccount()
    const nonce = await web3.eth.getTransactionCount(config.PUBLIC_KEY, 'latest')
    let amountToSend = 400000000000000
    let weiAmount = web3.utils.toWei(amountToSend.toString(), 'wei')

    var rawTransaction = {
        "from": account,
        "nonce": web3.utils.toHex(nonce),
        "value": weiAmount,
    };
    const gasEstimate = await web3.eth.estimateGas(rawTransaction)

    // const gasPrice = web3.utils.toHex(web3.utils.toWei(gasEstimate.toString(), 'gwei') / 100)

    rawTransaction.gasPrice = web3.utils.toHex(web3.utils.toWei(gasEstimate.toString(), 'gwei') / 100)
    rawTransaction.gasLimit = web3.utils.toHex(gasEstimate * 2)

    let errorMessage = null
    let transactionHash = null
    // const me = await nftContract.methods.withdrawFee().send({ from: config.PUBLIC_KEY })
    // console.log(await nftContract.methods.withdraw().call())
    // console.log(await nftContract.methods.balance().call({ from: account }))
    // console.log(await nftContract.methods.setPaymentAddress("0xF174e5BE0320F7389FbE4D19a0B12f71F83D421b").send({ from: "0xF174e5BE0320F7389FbE4D19a0B12f71F83D421b" }))


    return await new Promise((resolve, _) => {
        nftContract.methods.sendPayment().send(rawTransaction)
            .once('transactionHash', function (hash) {
                transactionHash = hash; console.log({ hash });
            })
            .once('receipt', function (receipt) {
                console.log({ receipt });
                transactionHash = receipt.transactionHash;
                resolve({ transactionHash })
            })
            // .on('confirmation', function (confNumber, receipt) { console.log({ confNumber, receipt }) })
            .on('error', function (error) { errorMessage = error.message; console.log({ error }); resolve({ errorMessage }) })
        // .then(function (receipt) {
        //     const to = receipt.events.Transfer.returnValues.to
        //     const tkId = receipt.events.Transfer.tokenId
        //     return { to, tkId }
        // })
    })
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


const ensureIpfsUriPrefix = (cidOrURI) => {
    let uri = cidOrURI.toString()
    if (!uri.startsWith('ipfs://')) {
        uri = 'ipfs://' + cidOrURI
    }
    // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
    if (uri.startsWith('ipfs://ipfs/')) {
        uri = uri.replace('ipfs://ipfs/', 'ipfs://')
    }
    return uri
}

// async function getImageData(imageUrl) {
//     return await new Promise(async (resolve, reject) => {
//         await axios.get(imageUrl, {
//             responseType: 'arraybuffer'
//         })
//             .then(response => {
//                 const base64data = `data:image/${imageUrl.split('.').pop()};base64,${Buffer.from(response.data, 'binary').toString('base64')}`
//                 resolve(base64data)
//             })
//     })
// }

function stripIpfsUriPrefix(cidOrURI) {
    if (cidOrURI.startsWith('ipfs://')) {
        return cidOrURI.slice('ipfs://'.length)
    }
    return cidOrURI
}


// const getIPFS = async (cidOrURI) => {
//     const cid = stripIpfsUriPrefix(cidOrURI)
//     return uint8ArrayConcat(await all(ipfs.cat(cid)))
// }
// const getIPFSString = async (cidOrURI) => {
//     const bytes = await getIPFS(cidOrURI)
//     return uint8ArrayToString(bytes)
// }

// const getIPFSJSON = async (cidOrURI) => {
//     const str = await getIPFSString(cidOrURI)
//     return JSON.parse(str)
// }


// function extractCID(cidOrURI) {
//     // remove the ipfs:// prefix, split on '/' and return first path component (root CID)
//     const cidString = stripIpfsUriPrefix(cidOrURI).split('/')[0]
//     return new CID(cidString)
// }

// const _configurePinningService = async () => {
//     if (!config.pinningService) {
//         throw new Error(`No pinningService set up in minty config. Unable to pin.`)
//     }

//     // check if the service has already been added to js-ipfs
//     for (const svc of await ipfs.pin.remote.service.ls()) {
//         if (svc.service === config.pinningService.name) {
//             // service is already configured, no need to do anything
//             return
//         }
//     }

//     // add the service to IPFS
//     const { name, endpoint, key } = config.pinningService
//     if (!name) {
//         throw new Error('No name configured for pinning service')
//     }
//     if (!endpoint) {
//         throw new Error(`No endpoint configured for pinning service ${name}`)
//     }
//     if (!key) {
//         throw new Error(`No key configured for pinning service ${name}.` +
//             `If the config references an environment variable, e.g. '$$PINATA_API_TOKEN', ` +
//             `make sure that the variable is defined.`)
//     }
//     await ipfs.pin.remote.service.add(name, { endpoint, key })
// }

// const isPinned = async (cid) => {
//     if (typeof cid === 'string') {
//         cid = new CID(cid)
//     }

//     const opts = {
//         service: config.pinningService.name,
//         cid: [cid], // ls expects an array of cids
//     }
//     // eslint-disable-next-line no-unused-vars
//     for await (const _ of ipfs.pin.remote.ls(opts)) {
//         return true
//     }
//     return false
// }


// const pin = async (cidOrURI) => {
//     const cid = extractCID(cidOrURI)

//     // Make sure IPFS is set up to use our preferred pinning service.
//     await _configurePinningService()

//     // Check if we've already pinned this CID to avoid a "duplicate pin" error.
//     const pinned = await isPinned(cid)
//     if (pinned) {
//         return
//     }

//     try {
//         // Ask the remote service to pin the content.
//         // Behind the scenes, this will cause the pinning service to connect to our local IPFS node
//         // and fetch the data using Bitswap, IPFS's transfer protocol.
//         await ipfs.pin.remote.add(cid, { service: config.pinningService.name })
//     }
//     catch (error) {
//         console.log(error)
//     }

// }

// const pinNFTData = async (tokenId) => {
//     const { assetURI, metadataURI } = await pinTokenData(tokenId)
//     console.log(`🌿 Pinned all data for token id ${tokenId}`)
//     return { assetURI, metadataURI }
// }


const getNFTMetadata = async (tokenId) => {
    const nftURI = stripIpfsUriPrefix(await nftContract.methods.tokenURI(tokenId).call())
    // console.log(metadataURI)
    // const metadata = await getIPFSJSON(metadataURI)

    return { nftURI }
}

const getTokenOwner = async (tokenId) => {
    return nftContract.methods.ownerOf(tokenId).call()
}

function makeGatewayURL(ipfsURI) {
    return config.ipfsGatewayUrl + '/' + stripIpfsUriPrefix(ipfsURI)
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


const getNFT = async (tokenId) => {

    // const blockNumber = await web3.eth.getBlockNumber()
    // const provider = new web3.providers.Web3Provider(window.ethereum);
    // console.log(web3)

    // await transferNFT(tokenId)

    const { nftURI } = await getNFTMetadata(tokenId)

    const ownerAddress = await getTokenOwner(tokenId)
    const nftGatewayURL = makeGatewayURL(nftURI)
    const nft = { tokenId, nftURI, nftGatewayURL, ownerAddress }
    // if (metadata.image) {
    //     nft.assetURI = metadata.image
    //     nft.assetGatewayURL = makeGatewayURL(metadata.image)
    // }

    // if (fetchCreationInfo) {
    //     nft.creationInfo = await getCreationInfo(tokenId)
    // }
    return nft


    // console.log(metadata, metadataURI)
    // return receipt
}

export const getAccountTokens = async (tokenIds) => {

    let tokens = []

    await Promise.all(tokenIds.map(async (i) => {
        const token = await getNFT(i)
        tokens.push(token)
    }))

    return tokens

}
const sendSignedTransaction = async (data, gasAmount) => {
    const nonce = await web3.eth.getTransactionCount(config.PUBLIC_KEY, 'latest') //get latest nonce


    const tx = {
        'from': config.PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': gasAmount,
        'data': data
    };
    // if(fromAddress){
    //     tx.from = fromAddress
    // }
    const signPromise = web3.eth.accounts.signTransaction(tx, config.PRIVATE_KEY);
    return await new Promise((resolve, reject) => {
        signPromise.then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (err, hash) {
                if (!err) {
                    console.log("The hash of your transaction is:", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!");
                    resolve(hash);
                } else {
                    console.log("Something went wrong when submitting your transaction:", err)
                    // reject("Something went wrong when submitting your transaction", err)
                }
            });
        }).catch((err) => {
            console.log(" Promise failed:", err);
            reject("Promise failed:", err)
        })
    })
}


const mintMintyNFT = async (account, tokenURI) => {

    // The smart contract adds an ipfs:// prefix to all URIs,
    // so make sure to remove it so it doesn't get added twice
    //   metadataURI = stripIpfsUriPrefix(metadataURI)
    // the transaction
    const token = nftContract.methods.mintToken(account, tokenURI)
    const tokenId = await token.call()
    const gasAmount = await token.estimateGas({ from: config.PUBLIC_KEY })

    const hash = await sendSignedTransaction(token.encodeABI(), gasAmount)

    if (hash) {

        return { hash, tokenId }
    }

    // return await new Promise(async(resolve, reject) => {

    //     await token.estimateGas({ from: config.PUBLIC_KEY })
    //     .then(function (gasAmount) {

    //     .catch(function (error) {
    //         console.log(error)
    //     });
    // })


}


// const makeNFTMetadata = async (assetURI, options) => {
//     assetURI = ensureIpfsUriPrefix(assetURI)
//     options.image = assetURI
//     options.dateMinted = new Date() * 1000
//     return {
//         ...options
//     }
// }


// async function pinTokenData(tokenId) {
//     const { metadata, metadataURI } = await getNFTMetadata(tokenId)
//     const { image: assetURI } = metadata

//     // console.log({ metadata, metadataURI })

//     console.log(`Pinning asset data (${assetURI}) for token id ${tokenId}....`)
//     pin(assetURI)

//     console.log(`Pinning metadata (${metadataURI}) for token id ${tokenId}...`)
//     pin(metadataURI)

//     return { assetURI, metadataURI }
// }


export const createNFTFromAssetData = async (data) => {
    // const pin_ = await pinNFTData(12)
    // console.log(pin)

    const account = await getAccount()

    if (!account) return
    const imageURL = data.image_url


    // const content = await getImageData(data.image_url)
    // pinTokenData(6)
    delete data['image_url']
    delete data['hash']
    const basename = `${data.name.toLowerCase()}.${imageURL.split('.').pop()}`

    const asset = await getFileFromUrl(imageURL, basename)
    // console.log({ content, basename })

    const { cid: assetCid } = await ipfsAddAsset(asset, data)

    // When you add an object to IPFS with a directory prefix in its path,
    // IPFS will create a directory structure for you. This is nice, because
    // it gives us URIs with descriptive filenames in them e.g.
    // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/cat-pic.png' instead of
    // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM'
    // console.log(content, options)
    // add the asset to IPFS
    // const { cid: assetCid } = await ipfs.add(urlSource(imageURL), ipfsAddOptions)

    // // make the NFT metadata JSON
    const assetURI = ensureIpfsUriPrefix(assetCid)

    // const metadata = await makeNFTMetadata(assetURI, data)

    // add the metadata to IPFS
    // const { cid: metadataCid } = await ipfs.add({ path: '/nft/metadata.json', content: JSON.stringify(metadata) }, ipfsAddOptions)
    // const metadataURI = ensureIpfsUriPrefix(assetCid) + '/metadata.json'

    // get the address of the token owner from options, or use the default signing address if no owner is given
    let ownerAddress = await getAccount()
    // // if (!ownerAddress) {
    // //     ownerAddress = await defaultOwnerAddress()
    // // }

    // // mint a new token referencing the metadata URI

    const { transactionHash, errorMessage } = await payMintingFee()
    if (transactionHash) {

        const { hash, tokenId } = await mintMintyNFT(ownerAddress, assetURI)
        return { hash, tokenId, errorMessage }

    }

    // // format and return the results
    return { errorMessage }
}

import config from '../../config'

import { createAlchemyWeb3 } from "@alch/alchemy-web3"
import contract from "../../artifacts/contracts/Minty.sol/Minty.json"
import ipfsHttpClient from 'ipfs-http-client'

// import all from 'it-all'
import CID from 'cids'
import uint8ArrayConcat from 'uint8arrays/concat'
import uint8ArrayToString from 'uint8arrays/to-string'
import all from 'it-all'
const web3 = createAlchemyWeb3(config.ALCHEMY_API_URL);
const contractAddress = config.CONTRACT_ADDRESS
// const contractAddress = "0xC11E32173729c5AbF46D6AdC0acb5b66174ea379"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);


const { urlSource } = ipfsHttpClient
let ipfs

const ipfsAddOptions = {
    cidVersion: 1,
    hashAlg: 'sha2-256'
}

ipfs = ipfsHttpClient(config.ipfsApiUrl)




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


export const getAccountTokenIds = async () => {
    const account = await getAccount()
    const balance = await nftContract.methods.balanceOf(account).call()
    // console.log(balance)
    let tokenIds = []
    if (+balance > 0) {
        const range = [...Array(+balance).keys()];

        await Promise.all(range.map(async (i) => {
            const id = await nftContract.methods.tokenOfOwnerByIndex(account, i).call()
            pinTokenData(id)
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


// const getImageData = async (imageUrl) => {
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

const getIPFS = async (cidOrURI) => {
    const cid = stripIpfsUriPrefix(cidOrURI)
    return uint8ArrayConcat(await all(ipfs.cat(cid)))
}
const getIPFSString = async (cidOrURI) => {
    const bytes = await getIPFS(cidOrURI)
    return uint8ArrayToString(bytes)
}

const getIPFSJSON = async (cidOrURI) => {
    const str = await getIPFSString(cidOrURI)
    return JSON.parse(str)
}


function extractCID(cidOrURI) {
    // remove the ipfs:// prefix, split on '/' and return first path component (root CID)
    const cidString = stripIpfsUriPrefix(cidOrURI).split('/')[0]
    return new CID(cidString)
}

const _configurePinningService = async () => {
    if (!config.pinningService) {
        throw new Error(`No pinningService set up in minty config. Unable to pin.`)
    }

    // check if the service has already been added to js-ipfs
    for (const svc of await ipfs.pin.remote.service.ls()) {
        if (svc.service === config.pinningService.name) {
            // service is already configured, no need to do anything
            return
        }
    }

    // add the service to IPFS
    const { name, endpoint, key } = config.pinningService
    if (!name) {
        throw new Error('No name configured for pinning service')
    }
    if (!endpoint) {
        throw new Error(`No endpoint configured for pinning service ${name}`)
    }
    if (!key) {
        throw new Error(`No key configured for pinning service ${name}.` +
            `If the config references an environment variable, e.g. '$$PINATA_API_TOKEN', ` +
            `make sure that the variable is defined.`)
    }
    await ipfs.pin.remote.service.add(name, { endpoint, key })
}

const isPinned = async (cid) => {
    if (typeof cid === 'string') {
        cid = new CID(cid)
    }

    const opts = {
        service: config.pinningService.name,
        cid: [cid], // ls expects an array of cids
    }
    // eslint-disable-next-line no-unused-vars
    for await (const _ of ipfs.pin.remote.ls(opts)) {
        return true
    }
    return false
}


const pin = async (cidOrURI) => {
    const cid = extractCID(cidOrURI)

    // Make sure IPFS is set up to use our preferred pinning service.
    await _configurePinningService()

    // Check if we've already pinned this CID to avoid a "duplicate pin" error.
    const pinned = await isPinned(cid)
    if (pinned) {
        return
    }

    try {
        // Ask the remote service to pin the content.
        // Behind the scenes, this will cause the pinning service to connect to our local IPFS node
        // and fetch the data using Bitswap, IPFS's transfer protocol.
        await ipfs.pin.remote.add(cid, { service: config.pinningService.name })
    }
    catch (error) {
        console.log(error)
    }

}

// const pinNFTData = async (tokenId) => {
//     const { assetURI, metadataURI } = await pinTokenData(tokenId)
//     console.log(`🌿 Pinned all data for token id ${tokenId}`)
//     return { assetURI, metadataURI }
// }


const getNFTMetadata = async (tokenId) => {
    const metadataURI = stripIpfsUriPrefix(await nftContract.methods.tokenURI(tokenId).call())

    const metadata = await getIPFSJSON(metadataURI)

    return { metadataURI, metadata }
}

const getTokenOwner = async (tokenId) => {
    return nftContract.methods.ownerOf(tokenId).call()
}

function makeGatewayURL(ipfsURI) {
    return config.ipfsGatewayUrl + '/' + stripIpfsUriPrefix(ipfsURI)
}
export const transferToken = async (tokenId, toAddress) => {
    const fromAddress = await getTokenOwner(tokenId)

    // because the base ERC721 contract has two overloaded versions of the safeTranferFrom function,
    // we need to refer to it by its fully qualified name.
    // const tranferFn = contract['safeTransferFrom(address,address,uint256)']
    console.log({ fromAddress, toAddress })
    if (fromAddress === toAddress) {
        console.log("Same TO & From address")
        return { toAddress, fromAddress, tokenId }
    }
    else {
        nftContract.methods.safeTransferFrom(fromAddress, toAddress, tokenId)
            .send({
                from: fromAddress
            }).once('transactionHash', function (hash) { console.log({ hash }) })
            .once('receipt', function (receipt) { console.log({ receipt }) })
            .on('confirmation', function (confNumber, receipt) { console.log({ confNumber, receipt }) })
            .on('error', function (error) { console.log({ error }) })
            .then(function (receipt) {
                const to = receipt.events.Transfer.returnValues.to
                const tkId = receipt.events.Transfer.tokenId
                return { to, tkId }
            })
    }
    const owner = await getTokenOwner(tokenId)
    // // return await sendSignedTransaction(data)
    return { owner, fromAddress, tokenId }
}


const getNFT = async (tokenId) => {

    // const blockNumber = await web3.eth.getBlockNumber()
    // const provider = new web3.providers.Web3Provider(window.ethereum);
    // console.log(web3)

    // await transferNFT(tokenId)

    const { metadataURI, metadata } = await getNFTMetadata(tokenId)

    const ownerAddress = await getTokenOwner(tokenId)
    const metadataGatewayURL = makeGatewayURL(metadataURI)
    const nft = { tokenId, metadata, metadataURI, metadataGatewayURL, ownerAddress }
    if (metadata.image) {
        nft.assetURI = metadata.image
        nft.assetGatewayURL = makeGatewayURL(metadata.image)
    }

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
        }).then(data => {
            console.log({ data })
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


const makeNFTMetadata = async (assetURI, options) => {
    assetURI = ensureIpfsUriPrefix(assetURI)
    options.image = assetURI
    options.dateMinted = new Date() * 1000
    return {
        ...options
    }
}


async function pinTokenData(tokenId) {
    const { metadata, metadataURI } = await getNFTMetadata(tokenId)
    const { image: assetURI } = metadata

    // console.log({ metadata, metadataURI })

    console.log(`Pinning asset data (${assetURI}) for token id ${tokenId}....`)
    pin(assetURI)

    console.log(`Pinning metadata (${metadataURI}) for token id ${tokenId}...`)
    pin(metadataURI)

    return { assetURI, metadataURI }
}


export const createNFTFromAssetData = async (data) => {
    // const pin_ = await pinNFTData(12)
    // console.log(pin)

    const account = await getAccount()

    if (!account) return
    const imageURL = data.image_url


    // const content = await getImageData(data.image_url)
    // pinTokenData(6)
    delete data['image_url']
    // const basename = `${data.name.toLowerCase()}.${imageURL.split('.').pop()}`

    // console.log({ content, basename })

    // When you add an object to IPFS with a directory prefix in its path,
    // IPFS will create a directory structure for you. This is nice, because
    // it gives us URIs with descriptive filenames in them e.g.
    // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/cat-pic.png' instead of
    // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM'
    // const ipfsPath = '/nft/' + basename
    // console.log(content, options)
    // add the asset to IPFS
    const { cid: assetCid } = await ipfs.add(urlSource(imageURL), ipfsAddOptions)

    // // make the NFT metadata JSON
    const assetURI = ensureIpfsUriPrefix(assetCid)

    const metadata = await makeNFTMetadata(assetURI, data)

    // add the metadata to IPFS
    const { cid: metadataCid } = await ipfs.add({ path: '/nft/metadata.json', content: JSON.stringify(metadata) }, ipfsAddOptions)
    const metadataURI = ensureIpfsUriPrefix(metadataCid) + '/metadata.json'

    // get the address of the token owner from options, or use the default signing address if no owner is given
    let ownerAddress = await getAccount()
    // // if (!ownerAddress) {
    // //     ownerAddress = await defaultOwnerAddress()
    // // }

    // // mint a new token referencing the metadata URI
    const { hash, tokenId } = await mintMintyNFT(ownerAddress, metadataURI)

    // // format and return the results
    return { hash, tokenId }
}

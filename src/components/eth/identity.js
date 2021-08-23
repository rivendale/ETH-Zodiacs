import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'

import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'
const endpoint = "https://ceramic-clay.3boxlabs.com"

export const authenticate3Id = async (address) => {

    const ceramic = new CeramicClient(endpoint)
    const threeIdConnect = new ThreeIdConnect()
    const provider = new EthereumAuthProvider(window.ethereum, address)
    await threeIdConnect.connect(provider)
    const did = new DID({
        provider: threeIdConnect.getDidProvider(),
        resolver: {
            ...ThreeIdResolver.getResolver(ceramic)
        }
    })

    ceramic.setDID(did)
    ceramic.did.authenticate()
        .then((data) => {
            console.log(data)
        }).catch((err) => {
            console.log(err)
        }
        )
}


export const readProfile = async (address) => {
    const ceramic = new CeramicClient(endpoint)
    const idx = new IDX({ ceramic })

    let data = {}
    try {
        data = await idx.get(
            'basicProfile',
            `${address}@eip155:1`
        )

    } catch (error) {
        console.log('error: ', error)
    }
    return data
}

export const updateProfile = async (address, userData) => {
    const ceramic = new CeramicClient(endpoint)
    const threeIdConnect = new ThreeIdConnect()
    const provider = new EthereumAuthProvider(window.ethereum, address)

    await threeIdConnect.connect(provider)

    const did = new DID({
        provider: threeIdConnect.getDidProvider(),
        resolver: {
            ...ThreeIdResolver.getResolver(ceramic)
        }
    })

    ceramic.setDID(did)
    await ceramic.did.authenticate()

    const idx = new IDX({ ceramic })

    await idx.set('basicProfile', userData)

    return await idx.get('basicProfile', `${address}@eip155:1`)
}
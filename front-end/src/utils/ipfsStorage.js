import { Web3Storage } from "web3.storage";
import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import { importDAG } from '@ucanto/core/delegation'
import { CarReader } from '@ipld/car'
import * as Signer from '@ucanto/principal/ed25519'
// require("dotenv").config()

const web3storage_key = "z6MkkqyxuWvBpyNXpqrARUpKPiZBcPdQ7q5Y2JWseNLQhmjG";

export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

function GetAccessToken() {
  return web3storage_key;
}

function MakeStorageClient() {
  return new Web3Storage({ token: GetAccessToken() });
}

export const ipfsSaveContent = async (files) => {
  console.log("Uploading files to IPFS with web3.storage....");
  console.log(process.env.REACT_APP_KKEY)
  const principal = Signer.parse(process.env.REACT_APP_KEY)
  const store = new StoreMemory()
  const client = await Client.create({ principal, store })
  const proof = await parseProof(process.env.REACT_APP_KPROOF)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())
  const cid = await client.uploadDirectory(files)
  console.log("Stored files with cid:", cid);
  return cid;
};


async function parseProof (data) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks)
}

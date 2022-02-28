const sdk = require('node-appwrite')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

// Config

const client = new sdk.Client()
client.setEndpoint('http://localhost/v1') // Replace with your endpoint
client.setKey('YOUR API KEY') // Replace with your API Key
client.setProject('YOUR PROJECT ID') // Replace with your project ID
// client.setJWT('jwt') // Use this to authenticate with JWT generated from Client SDK
let collectionId
let bucketId
let documentId

// API Calls
//  api.createCollection()
//  api.listCollection()
//  api.addDoc()
//  api.listDoc()
//  api.uploadFile()
//  api.createUser(new Date().getTime() + '@example.com', 'user@123','Some User')
//  api.listUser()
//  api.getAccount() // Works only with JWT

// List of API Definitions

const createCollection = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running Create Collection API'))
  let response = await database.createCollection(
    'movies', // collection id, can set to `unique()` to let server auto generate
    'Movies', // Collection Name
    'document',
    ['role:all'], // Read permissions
    ['role:all'], // Write permissions
  )
  collectionId = response.$id
  console.log(response)
  response = await database.createStringAttribute(
    collectionId,
    'name',
    255,
    true,
  )
  console.log(response)
  response = await database.createIntegerAttribute(
    collectionId,
    'release_year',
    true,
    0,
    9999,
  )
  console.log(response)
}

const listCollection = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running List Collection API'))
  const response = await database.listCollections()
  const collection = response.collections[0]
  console.log(collection)
}

const getAccount = async () => {
  const account = new sdk.Account(client)
  console.log(chalk.greenBright('Running Get Account API'))
  const response = await account.get()
  console.log(response);
}

const addDoc = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running Add Document API'))
  const response = await database.createDocument(collectionId,
    'unique()',
    {
      name: 'Spider Man',
      release_year: 1920
    },
    ['role:all'], ['role:all']
  )
  documentId = response.$id
  console.log(response)
}

const listDoc = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running List Document API'))
  const response = await database.listDocuments(collectionId)
  console.log(response)
}

const deleteDoc = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running Delete Document API'))
  const response = await database.deleteDocument(collectionId, documentId)
  console.log(response)
}

const deleteCollection = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running Delete Collection API'))
  const response = await database.deleteCollection(collectionId)
  console.log(response)
}


const createBucket = async () => {
  const storage = new sdk.Storage(client)
  console.log(chalk.greenBright('Running Create Bucket API'))
  const response = await storage.createBucket('unique()', 'awesome bucket', 'file')
  bucketId = response.$id
  console.log(response)
}

const uploadFile = async () => {
  const storage = new sdk.Storage(client)
  console.log(chalk.greenBright('Running Upload File API'))
  const response = await storage.createFile(bucketId, 'unique()', path.join(__dirname, '/nature.jpg'), [], [])
  console.log(response)
}

const deleteBucket = async () => {
  const storage = new sdk.Storage(client)
  console.log(chalk.greenBright('Running Delete Bucket API'))
  const response = await storage.deleteBucket(bucketId)
  console.log(response)
}


const createUser = async (email, password, name) => {
  const users = new sdk.Users(client)
  console.log(chalk.greenBright('Running Create User API'))
  const response = await users.create('unique()', email, password, name)
  userId = response.$id
  console.log(response)
}

const listUser = async () => {
  const users = new sdk.Users(client)
  console.log(chalk.greenBright('Running List User API'))
  const response = await users.list()
  console.log(response)
}

const runAllTasks = async () => {
  await createCollection()
  await listCollection()
  await addDoc()
  await listDoc()
  await deleteDoc()
  await deleteCollection()
  await createBucket()
  await uploadFile()
  await deleteBucket()
  await createUser(new Date().getTime() + '@example.com', 'user@123', 'Some User')
  await listUser()
  // await getAccount() // works only with JWT
}

runAllTasks()
  .then(() => {
    console.log(chalk.green.bold('Successfully Ran playground!'))
  })
  .catch(err => {
    console.error(err)
  })

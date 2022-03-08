const sdk = require('node-appwrite');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Config
const client = new sdk.Client();
client.setEndpoint('http://YOUR_HOST/v1'); // Replace with your endpoint
client.setKey('YOUR API KEY'); // Replace with your API Key
client.setProject('YOUR PROJECT ID'); // Replace with your project ID
// client.setJWT('jwt') // Use this to authenticate with JWT generated from Client SDK

let collectionId;
let documentId;
let userId;
let bucketId;
let fileId;
let functionId;

// List of API Definitions
const createCollection = async () => {
  console.log(chalk.greenBright('Running Create Collection API'));

  const database = new sdk.Database(client);
  const response = await database.createCollection(
    "unique()", // ID of the collection
    'Movies', // Collection Name
    "collection", // Marking permission as collection-level
    ['role:all'], // Read permissions
    ['role:all'], // Write permissions
  );

  console.log(response);
  collectionId = response.$id;

  const nameAttributeResponse = await database.createStringAttribute(collectionId, 'name', 255, false, "Empty Name", false);
  console.log(nameAttributeResponse);

  const yearAttributeResponse = await database.createIntegerAttribute(collectionId, 'release_year', false, 0, 5000, 1970, false);
  console.log(yearAttributeResponse);

  console.log("Waiting a little to ensure attributes are created ...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

const listCollections = async () => {
  console.log(chalk.greenBright('Running List Collections API'));

  const database = new sdk.Database(client);
  const response = await database.listCollections();
  console.log(response);
}

const listAttributes = async () => {
  console.log(chalk.greenBright('Running List Attributes API'));

  const database = new sdk.Database(client);
  const response = await database.listAttributes(collectionId);
  console.log(response);
}

const getAccount = async () => {
  console.log(chalk.greenBright('Running Get Account API'));

  const account = new sdk.Account(client);
  const response = await account.get();
  console.log(response);
}

const addDocument = async () => {
  console.log(chalk.greenBright('Running Add Document API'));

  const database = new sdk.Database(client);
  const response = await database.createDocument(collectionId,
    "unique()",
    {
      name: 'Spider Man',
      release_year: 1920
    },
    ['role:all'], ['role:all']
  );
  console.log(response);
  documentId = response.$id;
}

const listDocuments = async () => {
  console.log(chalk.greenBright('Running List Documents API'));

  const database = new sdk.Database(client);
  const response = await database.listDocuments(collectionId);
  console.log(response);
}

const deleteDocument = async () => {
  console.log(chalk.greenBright("Running Delete Document API"));

  const database = new sdk.Database(client);
  const response = await database.deleteDocument(collectionId, documentId);
  console.log(response);
}

const deleteCollection = async () => {
  console.log(chalk.greenBright("Running Delete Collection API"));

  const database = new sdk.Database(client);
  const response = await database.deleteCollection(collectionId);
  console.log(response);
}

const createBucket = async () => {
  console.log(chalk.greenBright("Running Create Bucket API"));

  const storage = new sdk.Storage(client);

  const response = await storage.createBucket(
    "unique()",
    "All Files",
    "bucket",
    ["role:all"],
    ["role:all"]
  );
  console.log(response);
  bucketId = response.$id;
}

const uploadFile = async () => {
  console.log(chalk.greenBright('Running Upload File API'));

  const storage = new sdk.Storage(client);
  const response = await storage.createFile(bucketId, 'unique()', './resources/nature.jpg', ["role:all"], ["role:all"]);
  console.log(response);
  fileId = response.$id;
}

const listBuckets = async () => {
  console.log(chalk.greenBright("Running List Buckets API"));

  const storage = new sdk.Storage(client);
  const response = await storage.listBuckets();
  console.log(response);
}

const listFiles = async () => {
  console.log(chalk.greenBright("Running List Files API"));

  const storage = new sdk.Storage(client);
  const response = await storage.listFiles(bucketId);
  console.log(response);
}

const deleteFile = async () => {
  console.log(chalk.greenBright("Running Delete File API"));

  const storage = new sdk.Storage(client);
  const response = await storage.deleteFile(bucketId, fileId);
  console.log(response);
}

const deleteBucket = async () => {
  console.log(chalk.greenBright("Running Delete Bucket API"));

  const storage = new sdk.Storage(client);
  const response = await storage.deleteBucket(bucketId);
  console.log(response);
}

const createUser = async (email, password, name) => {
  console.log(chalk.greenBright('Running Create User API'));

  const users = new sdk.Users(client);
  const response = await users.create('unique()', email, password, name);
  console.log(response);
  userId = response.$id;
}

const listUsers = async () => {
  console.log(chalk.greenBright('Running List Users API'));

  const users = new sdk.Users(client);
  const response = await users.list();
  console.log(response);
}

const deleteUser = async () => {
  console.log(chalk.greenBright('Running Delete User API'));

  const users = new sdk.Users(client);
  const response = await users.delete(userId);
  console.log(response);
}

const createFunction = async () => {
  console.log(chalk.greenBright('Running Create Function API'));

  const functions = new sdk.Functions(client);
  const response = await functions.create(
    "unique()",
    "Node Hello World",
    ["role:all"],
    "node-16.0"
  );
  console.log(response);
  functionId = response.$id;
}

const listFunctions = async () => {
  console.log(chalk.greenBright('Running List Functions API'));

  const functions = new sdk.Functions(client);
  let response = await functions.list();
  console.log(response);
}

const uploadDeployment = async () => {
  console.log(chalk.greenBright('Running Upload Deployment API'));

  const functions = new sdk.Functions(client);
  let response = await functions.createDeployment(functionId, "index.js", "./resources/code.tar.gz", true);
  console.log(response);


  console.log("Waiting a little to ensure deployment has built ...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

const executeSync = async () => {
  console.log(chalk.greenBright('Running Execute Function API (sync)'));

  const functions = new sdk.Functions(client);
  let response = await functions.createExecution(functionId, '', false);
  console.log(response);
}

const executeAsync = async () => {
  console.log(chalk.greenBright('Running Execute Function API (async)'));

  const functions = new sdk.Functions(client);
  let response = await functions.createExecution(functionId, '', true);
  console.log(response);
  const executionId = response.$id;

  console.log("Waiting a little to ensure execution is finished ...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  let asyncResponse = await functions.getExecution(functionId, executionId);
  console.log(asyncResponse);
}

const deleteFunction = async () => {
  console.log(chalk.greenBright('Running Delete function API'));

  const functions = new sdk.Functions(client);
  const response = await functions.delete(functionId);
  console.log(response);
}

const runAllTasks = async () => {
  await createCollection();
  await listCollections();
  await listAttributes();

  await addDocument();
  await listDocuments();

  await deleteDocument();
  await deleteCollection();

  await createBucket();
  await listBuckets();

  await uploadFile();
  await listFiles();

  await deleteFile();
  await deleteBucket();

  // await getAccount() // works only with JWT
  await createUser(new Date().getTime() + '@example.com', 'user@123', 'Some User');
  await listUsers();
  await deleteUser();

  await createFunction();
  await listFunctions();
  await uploadDeployment();
  await executeSync();
  await executeAsync();
  await deleteFunction();
}

runAllTasks()
  .then(() => {
    console.log(chalk.green.bold('Successfully Ran playground!'))
  })
  .catch(err => {
    console.error(err)
  })

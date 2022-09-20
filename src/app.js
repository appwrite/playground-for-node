const { Client, Databases, Functions, Account, Users, Storage, InputFile, Query, Permission, Role, ID } = require('node-appwrite');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Config
const client = new Client()
    .setEndpoint('YOUR_ENDPOINT')   // Replace with your endpoint
    .setProject('YOUR_PROJECT_ID')  // Replace with your project ID
    .setKey('YOUR_API_KEY');        // Replace with your API Key
   //.setJWT('jwt');                // Use this to authenticate with JWT generated from Client SDK

const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);
const users = new Users(client);
const account = new Account(client);

let databaseId;
let collectionId;
let documentId;
let userId;
let bucketId;
let fileId;
let functionId;
let executionId;

// List of API Definitions
const createCollection = async () => {
    console.log(chalk.greenBright('Running Create Collection API'));

    const databaseResponse = await databases.create(ID.unique(), "Default");

    databaseId = databaseResponse.$id;

    console.log(databaseResponse);

    const response = await databases.createCollection(
        databaseId,         // ID of the collection
        ID.unique(),        // Collection ID
        "Collection", // Collection Name
        [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );

    console.log(response);
    collectionId = response.$id;

    const nameAttributeResponse = await databases.createStringAttribute(
        databaseId,
        collectionId,
        'name',
        255,
        false,
        "Empty Name",
        false
    );
    console.log(nameAttributeResponse);

    const yearAttributeResponse = await databases.createIntegerAttribute(
        databaseId,
        collectionId,
        'release_year',
        false,
        0, 5000,
        1970,
        false
    );
    console.log(yearAttributeResponse);

    console.log("Waiting a little to ensure attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const yearIndexResponse = await databases.createIndex(
        databaseId,
        collectionId,
        'key_release_year_asc',
        'key',
        ['release_year'],
        ['ASC'],
    );
    console.log(yearIndexResponse);

    console.log("Waiting a little to ensure index is created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const listCollections = async () => {
    console.log(chalk.greenBright('Running List Collections API'));

    const response = await databases.listCollections(databaseId);

    console.log(response);
}

const listAttributes = async () => {
    console.log(chalk.greenBright('Running List Attributes API'));

    const response = await databases.listAttributes(databaseId, collectionId);

    console.log(response);
}

const getAccount = async () => {
    console.log(chalk.greenBright('Running List Users API'));

    const response = await account.get();

    console.log(response);
}

const addDocument = async () => {
    console.log(chalk.greenBright('Running Add Document API'));

    const response = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
            name: 'Spider Man',
            release_year: 1920
        },
        [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );
    documentId = response.$id;

    console.log(response);
}

const listDocuments = async () => {
    console.log(chalk.greenBright('Running List Documents API'));

    const response = await databases.listDocuments(
        databaseId,
        collectionId,
        [
            Query.equal('release_year', 1920),
        ]
    );

    console.log(response);
}

const deleteDocument = async () => {
    console.log(chalk.greenBright("Running Delete Document API"));

    const response = await databases.deleteDocument(
        databaseId,
        collectionId,
        documentId
    );

    console.log(response);
}

const deleteCollection = async () => {
    console.log(chalk.greenBright("Running Delete Collection API"));

    const response = await databases.deleteCollection(databaseId, collectionId);
    console.log(response);
}

const createBucket = async () => {
    console.log(chalk.greenBright("Running Create Bucket API"));

    const response = await storage.createBucket(
        ID.unique(),
        "All Files",
        [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );
    bucketId = response.$id;

    console.log(response);
}

const uploadFile = async () => {
    console.log(chalk.greenBright('Running Upload File API'));

    const response = await storage.createFile(
        bucketId,
        ID.unique(),
        InputFile.fromPath("./resources/nature.jpg", "nature.jpg"),
        [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );
    fileId = response.$id;

    console.log(response);
}

const listBuckets = async () => {
    console.log(chalk.greenBright("Running List Buckets API"));

    const response = await storage.listBuckets();

    console.log(response);
}

const listFiles = async () => {
    console.log(chalk.greenBright("Running List Files API"));

    const response = await storage.listFiles(bucketId);

    console.log(response);
}

const deleteFile = async () => {
    console.log(chalk.greenBright("Running Delete File API"));

    const response = await storage.deleteFile(bucketId, fileId);

    console.log(response);
}

const deleteBucket = async () => {
    console.log(chalk.greenBright("Running Delete Bucket API"));

    const response = await storage.deleteBucket(bucketId);

    console.log(response);
}

const createUser = async (email, password, name) => {
    console.log(chalk.greenBright('Running Create User API'));

    const response = await users.create(
        ID.unique(),
        email,
        null,
        password,
        name
    );
    userId = response.$id;

    console.log(response);
}

const listUsers = async () => {
    console.log(chalk.greenBright('Running List Users API'));

    const response = await users.list();

    console.log(response);
}

const deleteUser = async () => {
    console.log(chalk.greenBright('Running Delete User API'));

    const response = await users.delete(userId);

    console.log(response);
}

const createFunction = async () => {
    console.log(chalk.greenBright('Running Create Function API'));

    const response = await functions.create(
        ID.unique(),
        "Node Hello World",
        [Role.any()],
        "node-16.0"
    );
    console.log(response);
    functionId = response.$id;
}

const listFunctions = async () => {
    console.log(chalk.greenBright('Running List Functions API'));

    let response = await functions.list();

    console.log(response);
}

const uploadDeployment = async () => {
    console.log(chalk.greenBright('Running Upload Deployment API'));

    let response = await functions.createDeployment(
        functionId,
        "index.js",
        InputFile.fromPath("./resources/code.tar.gz", "code.tar.gz"),
        true
    );

    console.log(response);

    console.log("Waiting a little to ensure deployment has built ...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
}

const executeSync = async () => {
    console.log(chalk.greenBright('Running Execute Function API (sync)'));

    let response = await functions.createExecution(functionId);

    console.log(response);
}

const executeAsync = async () => {
    console.log(chalk.greenBright('Running Execute Function API (async)'));

    let response = await functions.createExecution(functionId, '', true);
    console.log(response);
    executionId = response.$id;

    console.log("Waiting a little to ensure execution is finished ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let asyncResponse = await functions.getExecution(functionId, executionId);

    console.log(asyncResponse);
}

const deleteFunction = async () => {
    console.log(chalk.greenBright('Running Delete function API'));

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

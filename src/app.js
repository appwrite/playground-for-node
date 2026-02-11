const { Client, Databases, Functions, Account, Users, Storage, Query, Permission, Role, ID, Runtime, ExecutionMethod, IndexType } = require('node-appwrite');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { InputFile } = require('node-appwrite/file');

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
let deploymentId;
let variableId;

// List of API Definitions
const createDatabase = async () => {
    console.log(chalk.greenBright('Running Create Database API'));

    const response = await databases.create({
        databaseId: ID.unique(),
        name: "Default"
    });

    databaseId = response.$id;

    console.log(response);
}

const listDatabases = async () => {
    console.log(chalk.greenBright("Running List Databases API"));

    const response = await databases.list();

    console.log(response);
}

const getDatabase = async () => {
    console.log(chalk.greenBright("Running Get Database API"));

    const response = await databases.get({
        databaseId
    });

    console.log(response);
}

const updateDatabase = async () => {
    console.log(chalk.greenBright('Running Update Database API'));

    const response = await databases.update({
        databaseId,
        name: "Updated Database"
    });

    console.log(response);
}

const deleteDatabase = async () => {
    console.log(chalk.greenBright("Running Delete Database API"));

    const response = await databases.delete({
        databaseId
    });

    console.log(response);
}

const createCollection = async () => {
    console.log(chalk.greenBright('Running Create Collection API'));

    const response = await databases.createCollection({
        databaseId,
        collectionId: ID.unique(),
        name: "Collection",
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });

    collectionId = response.$id;
    console.log(response);

    const nameAttributeResponse = await databases.createStringAttribute({
        databaseId,
        collectionId,
        key: 'name',
        size: 255,
        required: false,
        xdefault: "Empty Name",
        array: false
    });
    console.log(nameAttributeResponse);

    const yearAttributeResponse = await databases.createIntegerAttribute({
        databaseId,
        collectionId,
        key: 'release_year',
        required: false,
        min: 0,
        max: 5000,
        xdefault: 1970,
        array: false
    });
    console.log(yearAttributeResponse);

    console.log("Waiting a little to ensure attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const yearIndexResponse = await databases.createIndex({
        databaseId,
        collectionId,
        key: 'key_release_year_asc',
        type: IndexType.Key,
        attributes: ['release_year'],
        orders: ['ASC'],
    });
    console.log(yearIndexResponse);

    console.log("Waiting a little to ensure index is created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const listCollections = async () => {
    console.log(chalk.greenBright('Running List Collections API'));

    const response = await databases.listCollections({
        databaseId
    });

    console.log(response);
}

const getCollection = async () => {
    console.log(chalk.greenBright("Running Get Collection API"));

    const response = await databases.getCollection({
        databaseId,
        collectionId
    });

    console.log(response);
}

const updateCollection = async () => {
    console.log(chalk.greenBright("Running Update Collection API"));

    const response = await databases.updateCollection({
        databaseId,
        collectionId,
        name: "Updated Collection"
    });

    console.log(response);
}

const deleteCollection = async () => {
    console.log(chalk.greenBright("Running Delete Collection API"));

    const response = await databases.deleteCollection({
        databaseId,
        collectionId
    });

    console.log(response);
}

const listAttributes = async () => {
    console.log(chalk.greenBright('Running List Attributes API'));

    const response = await databases.listAttributes({
        databaseId,
        collectionId
    });

    console.log(response);
}

const listIndexes = async () => {
    console.log(chalk.greenBright('Running List Indexes API'));

    const response = await databases.listIndexes({
        databaseId,
        collectionId
    });

    console.log(response);
}

const createDocument = async () => {
    console.log(chalk.greenBright('Running Add Document API'));

    const response = await databases.createDocument({
        databaseId,
        collectionId,
        documentId: ID.unique(),
        data: {
            name: 'Spider Man',
            release_year: 1920
        },
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });
    documentId = response.$id;

    console.log(response);
}

const listDocuments = async () => {
    console.log(chalk.greenBright('Running List Documents API'));

    const response = await databases.listDocuments({
        databaseId,
        collectionId,
        queries: [
            Query.equal('release_year', 1920),
        ]
    });

    console.log(response);
}

const getDocument = async () => {
    console.log(chalk.greenBright("Running Get Document API"));

    const response = await databases.getDocument({
        databaseId,
        collectionId,
        documentId
    });

    console.log(response);
}

const updateDocument = async () => {
    console.log(chalk.greenBright("Running Update Document API"));

    const response = await databases.updateDocument({
        databaseId,
        collectionId,
        documentId,
        data: {
            release_year: 2005
        }
    });

    console.log(response);
}

const deleteDocument = async () => {
    console.log(chalk.greenBright("Running Delete Document API"));

    const response = await databases.deleteDocument({
        databaseId,
        collectionId,
        documentId
    });

    console.log(response);
}

const createBucket = async () => {
    console.log(chalk.greenBright("Running Create Bucket API"));

    const response = await storage.createBucket({
        bucketId: ID.unique(),
        name: "All Files",
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });
    bucketId = response.$id;

    console.log(response);
}

const listBuckets = async () => {
    console.log(chalk.greenBright("Running List Buckets API"));

    const response = await storage.listBuckets();

    console.log(response);
}

const getBucket = async () => {
    console.log(chalk.greenBright("Running Get Bucket API"));

    const response = await storage.getBucket({
        bucketId
    });

    console.log(response);
}

const updateBucket = async () => {
    console.log(chalk.greenBright("Running Update Bucket API"));

    const response = await storage.updateBucket({
        bucketId,
        name: "Updated Bucket"
    });

    console.log(response);
}

const deleteBucket = async () => {
    console.log(chalk.greenBright("Running Delete Bucket API"));

    const response = await storage.deleteBucket({
        bucketId
    });

    console.log(response);
}

const uploadFile = async () => {
    console.log(chalk.greenBright('Running Upload File API'));

    const response = await storage.createFile({
        bucketId,
        fileId: ID.unique(),
        file: InputFile.fromPath("./resources/nature.jpg", "nature.jpg"),
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });
    fileId = response.$id;

    console.log(response);
}

const listFiles = async () => {
    console.log(chalk.greenBright("Running List Files API"));

    const response = await storage.listFiles({
        bucketId
    });

    console.log(response);
}

const getFile = async () => {
    console.log(chalk.greenBright("Running Get File API"));

    const response = await storage.getFile({
        bucketId,
        fileId
    });

    console.log(response);
}

const getFileDownload = async () => {
    console.log(chalk.greenBright("Running Get File Download API"));

    const response = await storage.getFileDownload({
        bucketId,
        fileId
    });

    console.log(`Downloaded file: ${response.byteLength} bytes`);
}

const getFilePreview = async () => {
    console.log(chalk.greenBright("Running Get File Preview API"));

    try {
        const response = await storage.getFilePreview({
            bucketId,
            fileId,
            width: 200,
            height: 200
        });

        console.log(`Preview file: ${response.byteLength} bytes`);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const updateFile = async () => {
    console.log(chalk.greenBright("Running Update File API"));

    const response = await storage.updateFile({
        bucketId,
        fileId,
        name: "abc",
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any()),
        ]
    });

    console.log(response);
}

const deleteFile = async () => {
    console.log(chalk.greenBright("Running Delete File API"));

    const response = await storage.deleteFile({
        bucketId,
        fileId
    });

    console.log(response);
}

const createUser = async () => {
    console.log(chalk.greenBright('Running Create User API'));

    const response = await users.create({
        userId: ID.unique(),
        email: new Date().getTime() + '@example.com',
        password: 'user@123',
        name: 'Some User'
    });
    userId = response.$id;

    console.log(response);
}

const listUsers = async () => {
    console.log(chalk.greenBright('Running List Users API'));

    const response = await users.list();

    console.log(response);
}

const getUser = async () => {
    console.log(chalk.greenBright('Running Get User API'));

    const response = await users.get({
        userId
    });

    console.log(response);
}

const getAccount = async () => {
    console.log(chalk.greenBright('Running List Users API'));

    const response = await account.get();

    console.log(response);
}

const updateUserName = async () => {
    console.log(chalk.greenBright('Running Update User Name API'));

    const response = await users.updateName({
        userId,
        name: 'Updated Name'
    });

    console.log(response);
}

const getUserPrefs = async () => {
    console.log(chalk.greenBright('Running Get User Preferences API'));

    const response = await users.getPrefs({
        userId
    });

    console.log(response);
}

const updateUserPrefs = async () => {
    console.log(chalk.greenBright('Running Update User Preferences API'));

    const response = await users.updatePrefs({
        userId,
        prefs: {
            theme: 'dark',
            language: 'en'
        }
    });

    console.log(response);
}

const deleteUser = async () => {
    console.log(chalk.greenBright('Running Delete User API'));

    const response = await users.delete({
        userId
    });

    console.log(response);
}

const createFunction = async () => {
    console.log(chalk.greenBright('Running Create Function API'));

    const response = await functions.create({
        functionId: ID.unique(),
        name: "Node Hello World",
        runtime: Runtime.Node180,
        execute: [Role.any()],
        entrypoint: "index.js",
        timeout: 15,
        enabled: true,
        logging: true
    });

    functionId = response.$id;

    console.log(response);
}

const listFunctions = async () => {
    console.log(chalk.greenBright('Running List Functions API'));

    let response = await functions.list();

    console.log(response);
}

const getFunction = async () => {
    console.log(chalk.greenBright('Running Get Function API'));

    let response = await functions.get({
        functionId
    });

    console.log(response);
}

const updateFunction = async () => {
    console.log(chalk.greenBright('Running Update Function API'));

    let response = await functions.update({
        functionId,
        name: "Updated Node Hello World",
        runtime: Runtime.Node180,
        execute: [Role.any()],
        entrypoint: "index.js",
        timeout: 30,
        enabled: true,
        logging: true
    });

    console.log(response);
}

const uploadDeployment = async () => {
    console.log(chalk.greenBright('Running Upload Deployment API'));

    let response = await functions.createDeployment({
        functionId,
        code: InputFile.fromPath("./resources/code.tar.gz", "code.tar.gz"),
        activate: true,
        entrypoint: "index.js"
    });

    deploymentId = response.$id;
    console.log(response);

    console.log("Waiting for deployment to be ready ...");
    
    // Poll for deployment status until it's ready
    let maxAttempts = 30;
    let attempts = 0;
    while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const deployment = await functions.getDeployment({
            functionId,
            deploymentId
        });
        console.log(`Deployment status: ${deployment.status}`);
        
        if (deployment.status === 'ready') {
            console.log("Deployment is ready!");
            break;
        } else if (deployment.status === 'failed') {
            throw new Error("Deployment failed to build");
        }
        attempts++;
    }
    
    if (attempts >= maxAttempts) {
        throw new Error("Deployment timed out waiting to be ready");
    }
}

const listDeployments = async () => {
    console.log(chalk.greenBright('Running List Deployments API'));

    let response = await functions.listDeployments({
        functionId
    });

    console.log(response);
}

const listExecutions = async () => {
    console.log(chalk.greenBright('Running List Executions API'));

    let response = await functions.listExecutions({
        functionId
    });

    console.log(response);
}

const createVariable = async () => {
    console.log(chalk.greenBright('Running Create Variable API'));

    let response = await functions.createVariable({
        functionId,
        key: 'MY_VAR',
        value: 'hello123'
    });

    variableId = response.$id;
    console.log(response);
}

const listVariables = async () => {
    console.log(chalk.greenBright('Running List Variables API'));

    let response = await functions.listVariables({
        functionId
    });

    console.log(response);
}

const getVariable = async () => {
    console.log(chalk.greenBright('Running Get Variable API'));

    let response = await functions.getVariable({
        functionId,
        variableId
    });

    console.log(response);
}

const updateVariable = async () => {
    console.log(chalk.greenBright('Running Update Variable API'));

    let response = await functions.updateVariable({
        functionId,
        variableId,
        key: 'MY_VAR',
        value: 'updated_value'
    });

    console.log(response);
}

const deleteVariable = async () => {
    console.log(chalk.greenBright('Running Delete Variable API'));

    let response = await functions.deleteVariable({
        functionId,
        variableId
    });

    console.log(response);
}

const executeSync = async () => {
    console.log(chalk.greenBright('Running Execute Function API (sync)'));

    let response = await functions.createExecution({
        functionId,
        body: "",
        async: false,
        xpath: "/",
        method: ExecutionMethod.GET,
        headers: {}
    });

    // sleep for 3 seconds
    console.log("Waiting a little to ensure execution is finished ...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(response);
}

const executeAsync = async () => {
    console.log(chalk.greenBright('Running Execute Function API (async)'));

    let response = await functions.createExecution({
        functionId,
        body: '',
        async: true
    });

    executionId = response.$id;

    console.log(response);

    console.log("Waiting a little to ensure execution is finished ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let asyncResponse = await functions.getExecution({
        functionId,
        executionId
    });

    console.log(asyncResponse);
}

const deleteFunction = async () => {
    console.log(chalk.greenBright('Running Delete function API'));

    const response = await functions.delete({
        functionId
    });

    console.log(response);
}

const runAllTasks = async () => {
    await createDatabase();
    await listDatabases();
    await getDatabase();
    await updateDatabase();

    await createCollection();
    await listCollections();
    await getCollection();
    await updateCollection();
    await listAttributes();
    await listIndexes();

    await createDocument();
    await listDocuments();
    await getDocument();
    await updateDocument();

    await deleteDocument();
    await deleteCollection();
    await deleteDatabase();

    await createBucket();
    await listBuckets();
    await getBucket();
    await updateBucket();

    await uploadFile();
    await listFiles();
    await getFile();
    await getFileDownload();
    await getFilePreview();
    await updateFile();

    await deleteFile();
    await deleteBucket();

    // await getAccount() // works only with JWT
    await createUser();
    await listUsers();
    await getUser();
    await updateUserName();
    await getUserPrefs();
    await updateUserPrefs();
    await deleteUser();

    await createFunction();
    await listFunctions();
    await getFunction();
    await updateFunction();
    await uploadDeployment();
    await listDeployments();
    await createVariable();
    await listVariables();
    await getVariable();
    await updateVariable();
    await deleteVariable();
    await executeSync();
    await executeAsync();
    await listExecutions();
    await deleteFunction();
}

runAllTasks()
    .then(() => {
        console.log(chalk.green.bold('Successfully ran playground!'))
    })
    .catch(err => {
        console.error(err)
    })

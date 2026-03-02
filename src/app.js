const { Client, Databases, Functions, Account, Users, Storage, TablesDB, Query, Permission, Role, ID, Runtime, ExecutionMethod, IndexType } = require('node-appwrite');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { InputFile } = require('node-appwrite/file');

// Config
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'YOUR_ENDPOINT')   // Replace with your endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID')  // Replace with your project ID
    .setKey(process.env.APPWRITE_API_KEY || 'YOUR_API_KEY');        // Replace with your API Key
   //.setJWT('jwt');                // Use this to authenticate with JWT generated from Client SDK

const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);
const users = new Users(client);
const account = new Account(client);
const tablesDB = new TablesDB(client);

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
let tablesDatabaseId;
let tableId;
let rowId;
let transactionId;

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

    try {
        const response = await storage.getFileDownload({
            bucketId,
            fileId
        });

        console.log(`Downloaded file: ${response.byteLength} bytes`);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
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
        runtime: Runtime.Node22,
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
        runtime: Runtime.Node22,
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

// TablesDB API Definitions

const createTablesDatabase = async () => {
    console.log(chalk.greenBright('Running TablesDB Create Database API'));

    const response = await tablesDB.create({
        databaseId: ID.unique(),
        name: "Tables Database"
    });

    tablesDatabaseId = response.$id;

    console.log(response);
}

const listTablesDatabases = async () => {
    console.log(chalk.greenBright('Running TablesDB List Databases API'));

    const response = await tablesDB.list();

    console.log(response);
}

const getTablesDatabase = async () => {
    console.log(chalk.greenBright('Running TablesDB Get Database API'));

    const response = await tablesDB.get({
        databaseId: tablesDatabaseId
    });

    console.log(response);
}

const updateTablesDatabase = async () => {
    console.log(chalk.greenBright('Running TablesDB Update Database API'));

    const response = await tablesDB.update({
        databaseId: tablesDatabaseId,
        name: "Updated Tables Database"
    });

    console.log(response);
}

const createTable = async () => {
    console.log(chalk.greenBright('Running TablesDB Create Table API'));

    const response = await tablesDB.createTable({
        databaseId: tablesDatabaseId,
        tableId: ID.unique(),
        name: "Movies",
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });

    tableId = response.$id;
    console.log(response);
}

const listTables = async () => {
    console.log(chalk.greenBright('Running TablesDB List Tables API'));

    const response = await tablesDB.listTables({
        databaseId: tablesDatabaseId
    });

    console.log(response);
}

const getTable = async () => {
    console.log(chalk.greenBright('Running TablesDB Get Table API'));

    const response = await tablesDB.getTable({
        databaseId: tablesDatabaseId,
        tableId
    });

    console.log(response);
}

const updateTable = async () => {
    console.log(chalk.greenBright('Running TablesDB Update Table API'));

    const response = await tablesDB.updateTable({
        databaseId: tablesDatabaseId,
        tableId,
        name: "Updated Movies"
    });

    console.log(response);
}

const createColumns = async () => {
    console.log(chalk.greenBright('Running TablesDB Create Columns API'));

    const stringCol = await tablesDB.createStringColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'title',
        size: 255,
        required: true
    });
    console.log(stringCol);

    const intCol = await tablesDB.createIntegerColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'year',
        required: false,
        min: 1888,
        max: 2100
    });
    console.log(intCol);

    const floatCol = await tablesDB.createFloatColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'rating',
        required: false,
        min: 0,
        max: 10
    });
    console.log(floatCol);

    const boolCol = await tablesDB.createBooleanColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'is_released',
        required: false,
        default: true
    });
    console.log(boolCol);

    console.log("Waiting a little to ensure columns are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const listTableColumns = async () => {
    console.log(chalk.greenBright('Running TablesDB List Columns API'));

    const response = await tablesDB.listColumns({
        databaseId: tablesDatabaseId,
        tableId
    });

    console.log(response);
}

const getTableColumn = async () => {
    console.log(chalk.greenBright('Running TablesDB Get Column API'));

    const response = await tablesDB.getColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'title'
    });

    console.log(response);
}

const createTableIndex = async () => {
    console.log(chalk.greenBright('Running TablesDB Create Index API'));

    const response = await tablesDB.createIndex({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'idx_year',
        type: IndexType.Key,
        columns: ['year']
    });
    console.log(response);

    console.log("Waiting a little to ensure index is created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const listTableIndexes = async () => {
    console.log(chalk.greenBright('Running TablesDB List Indexes API'));

    const response = await tablesDB.listIndexes({
        databaseId: tablesDatabaseId,
        tableId
    });

    console.log(response);
}

const createTableRow = async () => {
    console.log(chalk.greenBright('Running TablesDB Create Row API'));

    const response = await tablesDB.createRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId: ID.unique(),
        data: {
            title: 'Inception',
            year: 2010,
            rating: 8.8,
            is_released: true
        },
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });

    rowId = response.$id;
    console.log(response);
}

const listTableRows = async () => {
    console.log(chalk.greenBright('Running TablesDB List Rows API'));

    const response = await tablesDB.listRows({
        databaseId: tablesDatabaseId,
        tableId,
        queries: [
            Query.equal('year', 2010),
        ]
    });

    console.log(response);
}

const getTableRow = async () => {
    console.log(chalk.greenBright('Running TablesDB Get Row API'));

    const response = await tablesDB.getRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId
    });

    console.log(response);
}

const updateTableRow = async () => {
    console.log(chalk.greenBright('Running TablesDB Update Row API'));

    const response = await tablesDB.updateRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId,
        data: {
            rating: 9.0
        }
    });

    console.log(response);
}

const deleteTableRow = async () => {
    console.log(chalk.greenBright('Running TablesDB Delete Row API'));

    const response = await tablesDB.deleteRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId
    });

    console.log(response);
}

const deleteTableIndex = async () => {
    console.log(chalk.greenBright('Running TablesDB Delete Index API'));

    const response = await tablesDB.deleteIndex({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'idx_year'
    });

    console.log(response);
}

const deleteTableColumn = async () => {
    console.log(chalk.greenBright('Running TablesDB Delete Column API'));

    const response = await tablesDB.deleteColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'rating'
    });

    console.log(response);
}

const deleteTable = async () => {
    console.log(chalk.greenBright('Running TablesDB Delete Table API'));

    const response = await tablesDB.deleteTable({
        databaseId: tablesDatabaseId,
        tableId
    });

    console.log(response);
}

const deleteTablesDatabase = async () => {
    console.log(chalk.greenBright('Running TablesDB Delete Database API'));

    const response = await tablesDB.delete({
        databaseId: tablesDatabaseId
    });

    console.log(response);
}

// Transactions API Definitions

const createTransaction = async () => {
    console.log(chalk.greenBright('Running Create Transaction API'));

    const response = await tablesDB.createTransaction({
        ttl: 60
    });

    transactionId = response.$id;
    console.log(response);
}

const getTransaction = async () => {
    console.log(chalk.greenBright('Running Get Transaction API'));

    const response = await tablesDB.getTransaction({
        transactionId
    });

    console.log(response);
}

const listTransactions = async () => {
    console.log(chalk.greenBright('Running List Transactions API'));

    const response = await tablesDB.listTransactions();

    console.log(response);
}

const stageCreateRow = async () => {
    console.log(chalk.greenBright('Running Stage Create Row in Transaction'));

    const response = await tablesDB.createRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId: ID.unique(),
        data: {
            title: 'The Matrix',
            year: 1999,
            rating: 8.7,
            is_released: true
        },
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        transactionId
    });

    rowId = response.$id;
    console.log(response);
}

const stageUpdateRow = async () => {
    console.log(chalk.greenBright('Running Stage Update Row in Transaction'));

    const response = await tablesDB.updateRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId,
        data: {
            rating: 9.5
        },
        transactionId
    });

    console.log(response);
}

const stageOperations = async () => {
    console.log(chalk.greenBright('Running Create Operations (batch staging) API'));

    const response = await tablesDB.createOperations({
        transactionId,
        operations: [
            {
                action: 'create',
                databaseId: tablesDatabaseId,
                tableId,
                rowId: ID.unique(),
                data: { title: 'Interstellar', year: 2014, rating: 8.6, is_released: true }
            },
            {
                action: 'create',
                databaseId: tablesDatabaseId,
                tableId,
                rowId: ID.unique(),
                data: { title: 'The Dark Knight', year: 2008, rating: 9.0, is_released: true }
            }
        ]
    });

    console.log(response);
}

const commitTransaction = async () => {
    console.log(chalk.greenBright('Running Commit Transaction API'));

    const response = await tablesDB.updateTransaction({
        transactionId,
        commit: true
    });

    console.log(response);
}

const rollbackTransactionDemo = async () => {
    console.log(chalk.greenBright('Running Rollback Transaction Demo'));

    // Create a new transaction
    const tx = await tablesDB.createTransaction({ ttl: 60 });
    console.log('Created transaction for rollback demo:', tx.$id);

    // Stage a row creation
    await tablesDB.createRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId: ID.unique(),
        data: {
            title: 'To Be Rolled Back',
            year: 2025,
            rating: 1.0,
            is_released: false
        },
        transactionId: tx.$id
    });
    console.log('Staged a row creation inside rollback transaction');

    // Roll back — the staged row will NOT be persisted
    const rollbackResponse = await tablesDB.updateTransaction({
        transactionId: tx.$id,
        rollback: true
    });

    console.log('Rolled back transaction (status "failed" is expected — it means the rollback succeeded and no operations were persisted):', rollbackResponse);
}

const deleteTransaction = async () => {
    console.log(chalk.greenBright('Running Delete Transaction API'));

    // Create a throwaway transaction to demonstrate delete
    const tx = await tablesDB.createTransaction({ ttl: 60 });
    console.log('Created transaction to delete:', tx.$id);

    const response = await tablesDB.deleteTransaction({
        transactionId: tx.$id
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

    await createTablesDatabase();
    await listTablesDatabases();
    await getTablesDatabase();
    await updateTablesDatabase();

    await createTable();
    await listTables();
    await getTable();
    await updateTable();

    await createColumns();
    await listTableColumns();
    await getTableColumn();

    await createTableIndex();
    await listTableIndexes();

    await createTableRow();
    await listTableRows();
    await getTableRow();
    await updateTableRow();

    // Transactions API
    await createTransaction();
    await getTransaction();
    await listTransactions();
    await stageCreateRow();
    await stageUpdateRow();
    await stageOperations();
    await commitTransaction();
    await rollbackTransactionDemo();
    await deleteTransaction();

    await deleteTableRow();
    await deleteTableIndex();
    await deleteTableColumn();
    await deleteTable();
    await deleteTablesDatabase();
}

runAllTasks()
    .then(() => {
        console.log(chalk.green.bold('Successfully ran playground!'))
    })
    .catch(err => {
        console.error(err)
    })

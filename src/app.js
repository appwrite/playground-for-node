const { Client, Databases, Functions, Account, Users, Storage, TablesDB, Query, Permission, Role, ID, Runtime, ExecutionMethod, IndexType, RelationshipType, RelationMutate, MessagingProviderType } = require('node-appwrite');
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
let secondCollectionId;
let secondDocumentId;
let identityId;
let targetId;

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

// --- Additional Attribute Types ---

const createAdditionalAttributes = async () => {
    console.log(chalk.greenBright('Running Create Additional Attribute Types API'));

    const boolAttr = await databases.createBooleanAttribute({
        databaseId,
        collectionId,
        key: 'is_active',
        required: false,
        xdefault: true,
        array: false
    });
    console.log('Boolean attribute:', boolAttr);

    const floatAttr = await databases.createFloatAttribute({
        databaseId,
        collectionId,
        key: 'score',
        required: false,
        min: 0,
        max: 100,
        xdefault: 0.0,
        array: false
    });
    console.log('Float attribute:', floatAttr);

    const datetimeAttr = await databases.createDatetimeAttribute({
        databaseId,
        collectionId,
        key: 'created_at',
        required: false,
        array: false
    });
    console.log('Datetime attribute:', datetimeAttr);

    const emailAttr = await databases.createEmailAttribute({
        databaseId,
        collectionId,
        key: 'contact_email',
        required: false,
        array: false
    });
    console.log('Email attribute:', emailAttr);

    const enumAttr = await databases.createEnumAttribute({
        databaseId,
        collectionId,
        key: 'status',
        elements: ['draft', 'published', 'archived'],
        required: false,
        xdefault: 'draft',
        array: false
    });
    console.log('Enum attribute:', enumAttr);

    const ipAttr = await databases.createIpAttribute({
        databaseId,
        collectionId,
        key: 'ip_address',
        required: false,
        array: false
    });
    console.log('IP attribute:', ipAttr);

    const urlAttr = await databases.createUrlAttribute({
        databaseId,
        collectionId,
        key: 'website',
        required: false,
        array: false
    });
    console.log('URL attribute:', urlAttr);

    // Geo/spatial attributes
    try {
        const pointAttr = await databases.createPointAttribute({
            databaseId,
            collectionId,
            key: 'location',
            required: false
        });
        console.log('Point attribute:', pointAttr);

        const lineAttr = await databases.createLineAttribute({
            databaseId,
            collectionId,
            key: 'route',
            required: false
        });
        console.log('Line attribute:', lineAttr);

        const polygonAttr = await databases.createPolygonAttribute({
            databaseId,
            collectionId,
            key: 'boundary',
            required: false
        });
        console.log('Polygon attribute:', polygonAttr);
    } catch (err) {
        console.log(chalk.yellow(`Geo attributes skipped (may not be supported): ${err.message}`));
    }

    console.log("Waiting a little to ensure attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const getAttribute = async () => {
    console.log(chalk.greenBright('Running Get Attribute API'));

    const response = await databases.getAttribute({
        databaseId,
        collectionId,
        key: 'is_active'
    });

    console.log(response);
}

const updateAttributes = async () => {
    console.log(chalk.greenBright('Running Update Attributes API'));

    const boolUpdate = await databases.updateBooleanAttribute({
        databaseId,
        collectionId,
        key: 'is_active',
        required: false,
        xdefault: false
    });
    console.log('Updated boolean attribute:', boolUpdate);

    const stringUpdate = await databases.updateStringAttribute({
        databaseId,
        collectionId,
        key: 'name',
        required: false,
        xdefault: 'Updated Default',
        size: 255
    });
    console.log('Updated string attribute:', stringUpdate);

    const intUpdate = await databases.updateIntegerAttribute({
        databaseId,
        collectionId,
        key: 'release_year',
        required: false,
        xdefault: 2000,
        min: 0,
        max: 5000
    });
    console.log('Updated integer attribute:', intUpdate);

    const floatUpdate = await databases.updateFloatAttribute({
        databaseId,
        collectionId,
        key: 'score',
        required: false,
        xdefault: 50.0,
        min: 0,
        max: 100
    });
    console.log('Updated float attribute:', floatUpdate);

    const datetimeUpdate = await databases.updateDatetimeAttribute({
        databaseId,
        collectionId,
        key: 'created_at',
        required: false,
        xdefault: null
    });
    console.log('Updated datetime attribute:', datetimeUpdate);

    const emailUpdate = await databases.updateEmailAttribute({
        databaseId,
        collectionId,
        key: 'contact_email',
        required: false,
        xdefault: 'default@example.com'
    });
    console.log('Updated email attribute:', emailUpdate);

    const enumUpdate = await databases.updateEnumAttribute({
        databaseId,
        collectionId,
        key: 'status',
        elements: ['draft', 'published', 'archived', 'deleted'],
        required: false,
        xdefault: 'draft'
    });
    console.log('Updated enum attribute:', enumUpdate);

    const ipUpdate = await databases.updateIpAttribute({
        databaseId,
        collectionId,
        key: 'ip_address',
        required: false,
        xdefault: '127.0.0.1'
    });
    console.log('Updated IP attribute:', ipUpdate);

    const urlUpdate = await databases.updateUrlAttribute({
        databaseId,
        collectionId,
        key: 'website',
        required: false,
        xdefault: 'https://appwrite.io'
    });
    console.log('Updated URL attribute:', urlUpdate);

    // Geo/spatial attribute updates
    try {
        const pointUpdate = await databases.updatePointAttribute({
            databaseId,
            collectionId,
            key: 'location',
            required: false
        });
        console.log('Updated point attribute:', pointUpdate);

        const lineUpdate = await databases.updateLineAttribute({
            databaseId,
            collectionId,
            key: 'route',
            required: false
        });
        console.log('Updated line attribute:', lineUpdate);

        const polygonUpdate = await databases.updatePolygonAttribute({
            databaseId,
            collectionId,
            key: 'boundary',
            required: false
        });
        console.log('Updated polygon attribute:', polygonUpdate);
    } catch (err) {
        console.log(chalk.yellow(`Geo attribute updates skipped: ${err.message}`));
    }
}

const deleteAttribute = async () => {
    console.log(chalk.greenBright('Running Delete Attribute API'));

    const response = await databases.deleteAttribute({
        databaseId,
        collectionId,
        key: 'ip_address'
    });

    console.log(response);
}

const getIndex = async () => {
    console.log(chalk.greenBright('Running Get Index API'));

    const response = await databases.getIndex({
        databaseId,
        collectionId,
        key: 'key_release_year_asc'
    });

    console.log(response);
}

const deleteIndex = async () => {
    console.log(chalk.greenBright('Running Delete Index API'));

    const response = await databases.deleteIndex({
        databaseId,
        collectionId,
        key: 'key_release_year_asc'
    });

    console.log(response);
}

// --- Bulk Document Operations ---

const createDocuments = async () => {
    console.log(chalk.greenBright('Running Bulk Create Documents API'));

    const response = await databases.createDocuments({
        databaseId,
        collectionId,
        documents: [
            {
                $id: ID.unique(),
                name: 'Batman Begins', release_year: 2005, score: 8.2, is_active: true, status: 'published',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            },
            {
                $id: ID.unique(),
                name: 'The Dark Knight', release_year: 2008, score: 9.0, is_active: true, status: 'published',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            },
            {
                $id: ID.unique(),
                name: 'Interstellar', release_year: 2014, score: 8.7, is_active: true, status: 'published',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            }
        ]
    });
    documentId = response.documents[0].$id;

    console.log(response);
}

const upsertDocument = async () => {
    console.log(chalk.greenBright('Running Upsert Document API'));

    // Upsert existing document (update)
    const response = await databases.upsertDocument({
        databaseId,
        collectionId,
        documentId,
        data: {
            name: 'Batman Begins (Remastered)',
            release_year: 2005,
            score: 8.5
        },
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });

    console.log('Upserted (updated) document:', response);

    // Upsert new document (create)
    const newDocResponse = await databases.upsertDocument({
        databaseId,
        collectionId,
        documentId: ID.unique(),
        data: {
            name: 'Tenet',
            release_year: 2020,
            score: 7.4,
            is_active: true,
            status: 'published'
        },
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });

    console.log('Upserted (created) document:', newDocResponse);
}

const upsertDocuments = async () => {
    console.log(chalk.greenBright('Running Bulk Upsert Documents API'));

    const response = await databases.upsertDocuments({
        databaseId,
        collectionId,
        documents: [
            {
                $id: ID.unique(),
                name: 'Dunkirk', release_year: 2017, score: 7.8, is_active: true, status: 'published',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            },
            {
                $id: ID.unique(),
                name: 'Oppenheimer', release_year: 2023, score: 8.9, is_active: true, status: 'published',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            }
        ]
    });

    console.log(response);
}

const updateDocuments = async () => {
    console.log(chalk.greenBright('Running Bulk Update Documents API'));

    const response = await databases.updateDocuments({
        databaseId,
        collectionId,
        data: {
            status: 'archived'
        },
        queries: [
            Query.lessThan('release_year', 2010)
        ]
    });

    console.log(response);
}

const deleteDocuments = async () => {
    console.log(chalk.greenBright('Running Bulk Delete Documents API'));

    const response = await databases.deleteDocuments({
        databaseId,
        collectionId,
        queries: [
            Query.equal('status', 'archived')
        ]
    });

    console.log(response);
}

// --- Atomic Increment/Decrement ---

const incrementDocumentAttribute = async () => {
    console.log(chalk.greenBright('Running Increment Document Attribute API'));

    // First create a document to increment
    const doc = await databases.createDocument({
        databaseId,
        collectionId,
        documentId: ID.unique(),
        data: { name: 'Atomic Test', release_year: 2020, score: 5.0, is_active: true },
        permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
    });
    secondDocumentId = doc.$id;

    const response = await databases.incrementDocumentAttribute({
        databaseId,
        collectionId,
        documentId: secondDocumentId,
        attribute: 'score',
        value: 2.5,
        max: 100
    });

    console.log('Incremented score by 2.5:', response);
}

const decrementDocumentAttribute = async () => {
    console.log(chalk.greenBright('Running Decrement Document Attribute API'));

    const response = await databases.decrementDocumentAttribute({
        databaseId,
        collectionId,
        documentId: secondDocumentId,
        attribute: 'score',
        value: 1.0,
        min: 0
    });

    console.log('Decremented score by 1.0:', response);
}

// --- Databases Transactions API ---

const createDbTransaction = async () => {
    console.log(chalk.greenBright('Running Databases Create Transaction API'));

    const response = await databases.createTransaction({
        ttl: 60
    });

    transactionId = response.$id;
    console.log(response);
}

const getDbTransaction = async () => {
    console.log(chalk.greenBright('Running Databases Get Transaction API'));

    const response = await databases.getTransaction({
        transactionId
    });

    console.log(response);
}

const listDbTransactions = async () => {
    console.log(chalk.greenBright('Running Databases List Transactions API'));

    const response = await databases.listTransactions();

    console.log(response);
}

const dbTransactionOperations = async () => {
    console.log(chalk.greenBright('Running Databases Create Operations (batch) API'));

    const response = await databases.createOperations({
        transactionId,
        operations: [
            {
                action: 'create',
                databaseId,
                collectionId,
                documentId: ID.unique(),
                data: { name: 'Tx Movie 1', release_year: 2021, score: 7.0, is_active: true }
            },
            {
                action: 'create',
                databaseId,
                collectionId,
                documentId: ID.unique(),
                data: { name: 'Tx Movie 2', release_year: 2022, score: 8.0, is_active: true }
            }
        ]
    });

    console.log(response);
}

const commitDbTransaction = async () => {
    console.log(chalk.greenBright('Running Databases Commit Transaction API'));

    const response = await databases.updateTransaction({
        transactionId,
        commit: true
    });

    console.log(response);
}

const deleteDbTransaction = async () => {
    console.log(chalk.greenBright('Running Databases Delete Transaction API'));

    const tx = await databases.createTransaction({ ttl: 60 });
    console.log('Created databases transaction to delete:', tx.$id);

    const response = await databases.deleteTransaction({
        transactionId: tx.$id
    });

    console.log(response);
}

// --- Relationship Attribute ---

const createRelationshipDemo = async () => {
    console.log(chalk.greenBright('Running Create Relationship Attribute API'));

    // Create a second collection for the relationship
    const relCollection = await databases.createCollection({
        databaseId,
        collectionId: ID.unique(),
        name: "Directors",
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });
    secondCollectionId = relCollection.$id;

    await databases.createStringAttribute({
        databaseId,
        collectionId: secondCollectionId,
        key: 'director_name',
        size: 255,
        required: false
    });

    console.log("Waiting for attribute creation ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await databases.createRelationshipAttribute({
        databaseId,
        collectionId,
        relatedCollectionId: secondCollectionId,
        type: RelationshipType.ManyToOne,
        twoWay: true,
        key: 'director',
        twoWayKey: 'movies',
        onDelete: RelationMutate.SetNull
    });

    console.log('Relationship attribute created:', response);

    console.log("Waiting for relationship attribute creation ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const updateRelationshipAttribute = async () => {
    console.log(chalk.greenBright('Running Update Relationship Attribute API'));

    const response = await databases.updateRelationshipAttribute({
        databaseId,
        collectionId,
        key: 'director',
        onDelete: RelationMutate.Cascade
    });

    console.log(response);
}

const deleteRelationshipDemo = async () => {
    console.log(chalk.greenBright('Running Delete Relationship & Second Collection'));

    await databases.deleteAttribute({
        databaseId,
        collectionId,
        key: 'director'
    });

    console.log("Waiting for attribute deletion ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await databases.deleteCollection({
        databaseId,
        collectionId: secondCollectionId
    });

    console.log('Cleaned up relationship attribute and second collection');
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

const getFileView = async () => {
    console.log(chalk.greenBright("Running Get File View API"));

    try {
        const response = await storage.getFileView({
            bucketId,
            fileId
        });

        console.log(`View file: ${response.byteLength} bytes`);
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

// --- Additional Users API Methods ---

const updateUserEmail = async () => {
    console.log(chalk.greenBright('Running Update User Email API'));

    const response = await users.updateEmail({
        userId,
        email: 'updated_' + new Date().getTime() + '@example.com'
    });

    console.log(response);
}

const updateUserPassword = async () => {
    console.log(chalk.greenBright('Running Update User Password API'));

    const response = await users.updatePassword({
        userId,
        password: 'newPassword@456'
    });

    console.log(response);
}

const updateUserPhone = async () => {
    console.log(chalk.greenBright('Running Update User Phone API'));

    const response = await users.updatePhone({
        userId,
        number: '+14155551234'
    });

    console.log(response);
}

const updateUserStatus = async () => {
    console.log(chalk.greenBright('Running Update User Status API'));

    // Disable user
    const response = await users.updateStatus({
        userId,
        status: false
    });

    console.log('Disabled user:', response);

    // Re-enable user
    const reEnable = await users.updateStatus({
        userId,
        status: true
    });

    console.log('Re-enabled user:', reEnable);
}

const updateUserLabels = async () => {
    console.log(chalk.greenBright('Running Update User Labels API'));

    const response = await users.updateLabels({
        userId,
        labels: ['vip', 'betatester']
    });

    console.log(response);
}

const listUserLogs = async () => {
    console.log(chalk.greenBright('Running List User Logs API'));

    const response = await users.listLogs({
        userId
    });

    console.log(response);
}

const listUserMemberships = async () => {
    console.log(chalk.greenBright('Running List User Memberships API'));

    const response = await users.listMemberships({
        userId
    });

    console.log(response);
}

const listUserSessions = async () => {
    console.log(chalk.greenBright('Running List User Sessions API'));

    const response = await users.listSessions({
        userId
    });

    console.log(response);
}

const createUserSession = async () => {
    console.log(chalk.greenBright('Running Create User Session API'));

    try {
        const response = await users.createSession({
            userId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped (may require specific auth config): ${err.message}`));
    }
}

const deleteUserSessions = async () => {
    console.log(chalk.greenBright('Running Delete User Sessions API'));

    const response = await users.deleteSessions({
        userId
    });

    console.log(response);
}

const updateUserEmailVerification = async () => {
    console.log(chalk.greenBright('Running Update User Email Verification API'));

    const response = await users.updateEmailVerification({
        userId,
        emailVerification: true
    });

    console.log(response);
}

const updateUserPhoneVerification = async () => {
    console.log(chalk.greenBright('Running Update User Phone Verification API'));

    const response = await users.updatePhoneVerification({
        userId,
        phoneVerification: true
    });

    console.log(response);
}

const listUserIdentities = async () => {
    console.log(chalk.greenBright('Running List User Identities API'));

    try {
        const response = await users.listIdentities();

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const deleteUserIdentity = async () => {
    console.log(chalk.greenBright('Running Delete User Identity API'));

    try {
        // List identities first and delete one if available
        const identities = await users.listIdentities();
        if (identities.identities && identities.identities.length > 0) {
            const response = await users.deleteIdentity({
                identityId: identities.identities[0].$id
            });
            console.log(response);
        } else {
            console.log(chalk.yellow('No identities to delete'));
        }
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const updateUserMFA = async () => {
    console.log(chalk.greenBright('Running Update User MFA API'));

    try {
        // Enable MFA
        const response = await users.updateMFA({
            userId,
            mfa: true
        });
        console.log('Enabled MFA:', response);

        // Disable MFA
        const disableResponse = await users.updateMFA({
            userId,
            mfa: false
        });
        console.log('Disabled MFA:', disableResponse);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const listUserMFAFactors = async () => {
    console.log(chalk.greenBright('Running List User MFA Factors API'));

    try {
        const response = await users.listMFAFactors({
            userId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createUserMFARecoveryCodes = async () => {
    console.log(chalk.greenBright('Running Create User MFA Recovery Codes API'));

    try {
        const response = await users.createMFARecoveryCodes({
            userId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const getUserMFARecoveryCodes = async () => {
    console.log(chalk.greenBright('Running Get User MFA Recovery Codes API'));

    try {
        const response = await users.getMFARecoveryCodes({
            userId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const updateUserMFARecoveryCodes = async () => {
    console.log(chalk.greenBright('Running Update (Regenerate) User MFA Recovery Codes API'));

    try {
        const response = await users.updateMFARecoveryCodes({
            userId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const deleteUserMFAAuthenticator = async () => {
    console.log(chalk.greenBright('Running Delete User MFA Authenticator API'));

    try {
        const response = await users.deleteMFAAuthenticator({
            userId,
            type: 'totp'
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

// Legacy lowercase MFA aliases (same as uppercase variants)
const testLegacyMfaAliases = async () => {
    console.log(chalk.greenBright('Running Legacy MFA Alias Methods'));

    try {
        await users.updateMfa({ userId, mfa: false });
        console.log('users.updateMfa (alias) called successfully');
    } catch (err) {
        console.log(chalk.yellow(`updateMfa skipped: ${err.message}`));
    }

    try {
        await users.listMfaFactors({ userId });
        console.log('users.listMfaFactors (alias) called successfully');
    } catch (err) {
        console.log(chalk.yellow(`listMfaFactors skipped: ${err.message}`));
    }

    try {
        await users.createMfaRecoveryCodes({ userId });
        console.log('users.createMfaRecoveryCodes (alias) called successfully');
    } catch (err) {
        console.log(chalk.yellow(`createMfaRecoveryCodes skipped: ${err.message}`));
    }

    try {
        await users.getMfaRecoveryCodes({ userId });
        console.log('users.getMfaRecoveryCodes (alias) called successfully');
    } catch (err) {
        console.log(chalk.yellow(`getMfaRecoveryCodes skipped: ${err.message}`));
    }

    try {
        await users.updateMfaRecoveryCodes({ userId });
        console.log('users.updateMfaRecoveryCodes (alias) called successfully');
    } catch (err) {
        console.log(chalk.yellow(`updateMfaRecoveryCodes skipped: ${err.message}`));
    }

    try {
        await users.deleteMfaAuthenticator({ userId, type: 'totp' });
        console.log('users.deleteMfaAuthenticator (alias) called successfully');
    } catch (err) {
        console.log(chalk.yellow(`deleteMfaAuthenticator skipped: ${err.message}`));
    }
}

const createUserTarget = async () => {
    console.log(chalk.greenBright('Running Create User Target API'));

    try {
        const response = await users.createTarget({
            userId,
            targetId: ID.unique(),
            providerType: MessagingProviderType.Email,
            identifier: 'target_' + new Date().getTime() + '@example.com'
        });
        targetId = response.$id;

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const getUserTarget = async () => {
    console.log(chalk.greenBright('Running Get User Target API'));

    try {
        if (!targetId) { console.log(chalk.yellow('Skipped: no targetId')); return; }
        const response = await users.getTarget({
            userId,
            targetId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const listUserTargets = async () => {
    console.log(chalk.greenBright('Running List User Targets API'));

    try {
        const response = await users.listTargets({
            userId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const updateUserTarget = async () => {
    console.log(chalk.greenBright('Running Update User Target API'));

    try {
        if (!targetId) { console.log(chalk.yellow('Skipped: no targetId')); return; }
        const response = await users.updateTarget({
            userId,
            targetId,
            name: 'Updated Target'
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const deleteUserTarget = async () => {
    console.log(chalk.greenBright('Running Delete User Target API'));

    try {
        if (!targetId) { console.log(chalk.yellow('Skipped: no targetId')); return; }
        const response = await users.deleteTarget({
            userId,
            targetId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createUserJWT = async () => {
    console.log(chalk.greenBright('Running Create User JWT API'));

    try {
        const response = await users.createJWT({
            userId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createUserToken = async () => {
    console.log(chalk.greenBright('Running Create User Token API'));

    try {
        const response = await users.createToken({
            userId,
            length: 6,
            expire: 60
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

// --- Specialized User Creation (Hash Algorithms) ---

const createArgon2User = async () => {
    console.log(chalk.greenBright('Running Create Argon2 User API'));

    try {
        const response = await users.createArgon2User({
            userId: ID.unique(),
            email: 'argon2_' + new Date().getTime() + '@example.com',
            password: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+daw',
            name: 'Argon2 User'
        });
        console.log(response);
        await users.delete({ userId: response.$id });
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createBcryptUser = async () => {
    console.log(chalk.greenBright('Running Create Bcrypt User API'));

    try {
        const response = await users.createBcryptUser({
            userId: ID.unique(),
            email: 'bcrypt_' + new Date().getTime() + '@example.com',
            password: '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW',
            name: 'Bcrypt User'
        });
        console.log(response);
        await users.delete({ userId: response.$id });
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createMD5User = async () => {
    console.log(chalk.greenBright('Running Create MD5 User API'));

    try {
        const response = await users.createMD5User({
            userId: ID.unique(),
            email: 'md5_' + new Date().getTime() + '@example.com',
            password: '5d41402abc4b2a76b9719d911017c592',
            name: 'MD5 User'
        });
        console.log(response);
        await users.delete({ userId: response.$id });
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createSHAUser = async () => {
    console.log(chalk.greenBright('Running Create SHA User API'));

    try {
        const response = await users.createSHAUser({
            userId: ID.unique(),
            email: 'sha_' + new Date().getTime() + '@example.com',
            password: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
            name: 'SHA User'
        });
        console.log(response);
        await users.delete({ userId: response.$id });
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createPHPassUser = async () => {
    console.log(chalk.greenBright('Running Create PHPass User API'));

    try {
        const response = await users.createPHPassUser({
            userId: ID.unique(),
            email: 'phpass_' + new Date().getTime() + '@example.com',
            password: '$P$B5WY6IigCfNBkOVNJgrVOHFTlaJm3R/',
            name: 'PHPass User'
        });
        console.log(response);
        await users.delete({ userId: response.$id });
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createScryptUser = async () => {
    console.log(chalk.greenBright('Running Create Scrypt User API'));

    try {
        const response = await users.createScryptUser({
            userId: ID.unique(),
            email: 'scrypt_' + new Date().getTime() + '@example.com',
            password: 'f7f7ad57b9ba3a7f697c0d3cb429a007d48fb3e38b438b72c6e9a11797a68f92',
            passwordSalt: 'salt123',
            passwordCpu: 8,
            passwordMemory: 14,
            passwordParallel: 1,
            passwordLength: 64,
            name: 'Scrypt User'
        });
        console.log(response);
        await users.delete({ userId: response.$id });
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createScryptModifiedUser = async () => {
    console.log(chalk.greenBright('Running Create Scrypt Modified User API'));

    try {
        const response = await users.createScryptModifiedUser({
            userId: ID.unique(),
            email: 'scryptmod_' + new Date().getTime() + '@example.com',
            password: 'UlLCFMhENH0LTA==',
            passwordSalt: 'c2FsdA==',
            passwordSaltSeparator: 'Bw==',
            passwordSignerKey: 'XyEKE9RcTDeLEsL/RjwPDBv/RqDl8fb3gpYEOQaPihbxf1ZAtSOHCjuAAa7Q3oJpCo/Y7KTjfAn3OOdh0XAr/A==',
            name: 'Scrypt Modified User'
        });
        console.log(response);
        await users.delete({ userId: response.$id });
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
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

// --- Additional Functions API Methods ---

const listRuntimes = async () => {
    console.log(chalk.greenBright('Running List Runtimes API'));

    try {
        const response = await functions.listRuntimes();
        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped (requires public scope): ${err.message}`));
    }
}

const listSpecifications = async () => {
    console.log(chalk.greenBright('Running List Specifications API'));

    try {
        const response = await functions.listSpecifications();
        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped (requires public scope): ${err.message}`));
    }
}

const deleteDeployment = async () => {
    console.log(chalk.greenBright('Running Delete Deployment API'));

    // deploymentId is set from uploadDeployment
    try {
        const response = await functions.deleteDeployment({
            functionId,
            deploymentId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const deleteExecution = async () => {
    console.log(chalk.greenBright('Running Delete Execution API'));

    try {
        if (!executionId) { console.log(chalk.yellow('Skipped: no executionId')); return; }
        const response = await functions.deleteExecution({
            functionId,
            executionId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const getDeploymentDownload = async () => {
    console.log(chalk.greenBright('Running Get Deployment Download API'));

    try {
        const response = await functions.getDeploymentDownload({
            functionId,
            deploymentId
        });

        console.log(`Deployment download: ${response.byteLength} bytes`);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const updateFunctionDeployment = async () => {
    console.log(chalk.greenBright('Running Update Function Deployment (set active) API'));

    try {
        const response = await functions.updateFunctionDeployment({
            functionId,
            deploymentId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const updateDeploymentStatus = async () => {
    console.log(chalk.greenBright('Running Update Deployment Status API'));

    try {
        const response = await functions.updateDeploymentStatus({
            functionId,
            deploymentId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createDuplicateDeployment = async () => {
    console.log(chalk.greenBright('Running Create Duplicate Deployment API'));

    try {
        const response = await functions.createDuplicateDeployment({
            functionId,
            deploymentId
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createTemplateDeployment = async () => {
    console.log(chalk.greenBright('Running Create Template Deployment API'));

    try {
        const response = await functions.createTemplateDeployment({
            functionId,
            repository: 'https://github.com/appwrite/templates',
            owner: 'appwrite',
            rootDirectory: 'node/starter',
            type: 'branch',
            reference: 'main',
            activate: false
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped: ${err.message}`));
    }
}

const createVcsDeployment = async () => {
    console.log(chalk.greenBright('Running Create VCS Deployment API'));

    try {
        const response = await functions.createVcsDeployment({
            functionId,
            type: 'branch',
            reference: 'main',
            activate: false
        });

        console.log(response);
    } catch (err) {
        console.log(chalk.yellow(`Skipped (requires VCS installation): ${err.message}`));
    }
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

// --- Additional TablesDB Column Types ---

const createAdditionalColumns = async () => {
    console.log(chalk.greenBright('Running TablesDB Create Additional Column Types API'));

    const datetimeCol = await tablesDB.createDatetimeColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'release_date',
        required: false
    });
    console.log('Datetime column:', datetimeCol);

    const emailCol = await tablesDB.createEmailColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'contact_email',
        required: false
    });
    console.log('Email column:', emailCol);

    const enumCol = await tablesDB.createEnumColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'genre',
        elements: ['action', 'comedy', 'drama', 'sci-fi', 'thriller'],
        required: false,
        xdefault: 'drama'
    });
    console.log('Enum column:', enumCol);

    const ipCol = await tablesDB.createIpColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'server_ip',
        required: false
    });
    console.log('IP column:', ipCol);

    const urlCol = await tablesDB.createUrlColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'trailer_url',
        required: false
    });
    console.log('URL column:', urlCol);

    // Geo/spatial columns
    try {
        const pointCol = await tablesDB.createPointColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'filming_location',
            required: false
        });
        console.log('Point column:', pointCol);

        const lineCol = await tablesDB.createLineColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'tour_route',
            required: false
        });
        console.log('Line column:', lineCol);

        const polygonCol = await tablesDB.createPolygonColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'filming_area',
            required: false
        });
        console.log('Polygon column:', polygonCol);
    } catch (err) {
        console.log(chalk.yellow(`Geo columns skipped (may not be supported): ${err.message}`));
    }

    console.log("Waiting a little to ensure columns are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const updateColumns = async () => {
    console.log(chalk.greenBright('Running TablesDB Update Columns API'));

    const stringUpdate = await tablesDB.updateStringColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'title',
        required: true,
        xdefault: null,
        size: 500
    });
    console.log('Updated string column:', stringUpdate);

    const intUpdate = await tablesDB.updateIntegerColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'year',
        required: false,
        xdefault: 2000,
        min: 1800,
        max: 2200
    });
    console.log('Updated integer column:', intUpdate);

    const floatUpdate = await tablesDB.updateFloatColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'rating',
        required: false,
        xdefault: 5.0,
        min: 0,
        max: 10
    });
    console.log('Updated float column:', floatUpdate);

    const boolUpdate = await tablesDB.updateBooleanColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'is_released',
        required: false,
        xdefault: false
    });
    console.log('Updated boolean column:', boolUpdate);

    const datetimeUpdate = await tablesDB.updateDatetimeColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'release_date',
        required: false,
        xdefault: null
    });
    console.log('Updated datetime column:', datetimeUpdate);

    const emailUpdate = await tablesDB.updateEmailColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'contact_email',
        required: false,
        xdefault: 'movies@example.com'
    });
    console.log('Updated email column:', emailUpdate);

    const enumUpdate = await tablesDB.updateEnumColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'genre',
        elements: ['action', 'comedy', 'drama', 'sci-fi', 'thriller', 'horror'],
        required: false,
        xdefault: 'action'
    });
    console.log('Updated enum column:', enumUpdate);

    const ipUpdate = await tablesDB.updateIpColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'server_ip',
        required: false,
        xdefault: '192.168.1.1'
    });
    console.log('Updated IP column:', ipUpdate);

    const urlUpdate = await tablesDB.updateUrlColumn({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'trailer_url',
        required: false,
        xdefault: 'https://example.com/trailer'
    });
    console.log('Updated URL column:', urlUpdate);

    // Geo/spatial column updates
    try {
        const pointUpdate = await tablesDB.updatePointColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'filming_location',
            required: false
        });
        console.log('Updated point column:', pointUpdate);

        const lineUpdate = await tablesDB.updateLineColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'tour_route',
            required: false
        });
        console.log('Updated line column:', lineUpdate);

        const polygonUpdate = await tablesDB.updatePolygonColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'filming_area',
            required: false
        });
        console.log('Updated polygon column:', polygonUpdate);
    } catch (err) {
        console.log(chalk.yellow(`Geo column updates skipped: ${err.message}`));
    }
}

const getTableIndex = async () => {
    console.log(chalk.greenBright('Running TablesDB Get Index API'));

    const response = await tablesDB.getIndex({
        databaseId: tablesDatabaseId,
        tableId,
        key: 'idx_year'
    });

    console.log(response);
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

// --- Bulk Row Operations ---

const createTableRows = async () => {
    console.log(chalk.greenBright('Running TablesDB Bulk Create Rows API'));

    const response = await tablesDB.createRows({
        databaseId: tablesDatabaseId,
        tableId,
        rows: [
            {
                $id: ID.unique(),
                title: 'Pulp Fiction', year: 1994, rating: 8.9, is_released: true, genre: 'thriller',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            },
            {
                $id: ID.unique(),
                title: 'Fight Club', year: 1999, rating: 8.8, is_released: true, genre: 'drama',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            },
            {
                $id: ID.unique(),
                title: 'Forrest Gump', year: 1994, rating: 8.8, is_released: true, genre: 'drama',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            }
        ]
    });

    console.log(response);
}

const upsertTableRow = async () => {
    console.log(chalk.greenBright('Running TablesDB Upsert Row API'));

    // Upsert existing row (update)
    const response = await tablesDB.upsertRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId,
        data: {
            title: 'Inception (Director\'s Cut)',
            year: 2010,
            rating: 9.2,
            is_released: true
        },
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });
    console.log('Upserted (updated) row:', response);

    // Upsert new row (create)
    const newRowResponse = await tablesDB.upsertRow({
        databaseId: tablesDatabaseId,
        tableId,
        rowId: ID.unique(),
        data: {
            title: 'Memento',
            year: 2000,
            rating: 8.4,
            is_released: true,
            genre: 'thriller'
        },
        permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });
    console.log('Upserted (created) row:', newRowResponse);
}

const upsertTableRows = async () => {
    console.log(chalk.greenBright('Running TablesDB Bulk Upsert Rows API'));

    const response = await tablesDB.upsertRows({
        databaseId: tablesDatabaseId,
        tableId,
        rows: [
            {
                $id: ID.unique(),
                title: 'The Prestige', year: 2006, rating: 8.5, is_released: true, genre: 'thriller',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            },
            {
                $id: ID.unique(),
                title: 'Insomnia', year: 2002, rating: 7.2, is_released: true, genre: 'thriller',
                $permissions: [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            }
        ]
    });

    console.log(response);
}

const updateTableRows = async () => {
    console.log(chalk.greenBright('Running TablesDB Bulk Update Rows API'));

    const response = await tablesDB.updateRows({
        databaseId: tablesDatabaseId,
        tableId,
        data: {
            genre: 'action'
        },
        queries: [
            Query.greaterThan('rating', 9.0)
        ]
    });

    console.log(response);
}

const deleteTableRows = async () => {
    console.log(chalk.greenBright('Running TablesDB Bulk Delete Rows API'));

    const response = await tablesDB.deleteRows({
        databaseId: tablesDatabaseId,
        tableId,
        queries: [
            Query.lessThan('rating', 7.5)
        ]
    });

    console.log(response);
}

// --- Atomic Row Column Operations ---

const incrementRowColumn = async () => {
    console.log(chalk.greenBright('Running TablesDB Increment Row Column API'));

    const response = await tablesDB.incrementRowColumn({
        databaseId: tablesDatabaseId,
        tableId,
        rowId,
        column: 'rating',
        value: 0.5,
        max: 10
    });

    console.log('Incremented rating by 0.5:', response);
}

const decrementRowColumn = async () => {
    console.log(chalk.greenBright('Running TablesDB Decrement Row Column API'));

    const response = await tablesDB.decrementRowColumn({
        databaseId: tablesDatabaseId,
        tableId,
        rowId,
        column: 'rating',
        value: 0.2,
        min: 0
    });

    console.log('Decremented rating by 0.2:', response);
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

// --- TablesDB Relationship Column ---

const createTablesRelationshipDemo = async () => {
    console.log(chalk.greenBright('Running TablesDB Create Relationship Column API'));

    // Create a second table for the relationship
    const relTable = await tablesDB.createTable({
        databaseId: tablesDatabaseId,
        tableId: ID.unique(),
        name: "Directors",
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    });
    const secondTableId = relTable.$id;

    await tablesDB.createStringColumn({
        databaseId: tablesDatabaseId,
        tableId: secondTableId,
        key: 'director_name',
        size: 255,
        required: false
    });

    console.log("Waiting for column creation ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        const response = await tablesDB.createRelationshipColumn({
            databaseId: tablesDatabaseId,
            tableId,
            relatedTableId: secondTableId,
            type: RelationshipType.ManyToOne,
            twoWay: true,
            key: 'director',
            twoWayKey: 'movies',
            onDelete: RelationMutate.SetNull
        });
        console.log('TablesDB relationship column created:', response);

        console.log("Waiting for relationship creation ...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Update relationship column
        const updateResponse = await tablesDB.updateRelationshipColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'director',
            onDelete: RelationMutate.Cascade
        });
        console.log('TablesDB relationship column updated:', updateResponse);

        // Cleanup
        await tablesDB.deleteColumn({
            databaseId: tablesDatabaseId,
            tableId,
            key: 'director'
        });

        console.log("Waiting for column deletion ...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
        console.log(chalk.yellow(`TablesDB relationship skipped: ${err.message}`));
    }

    await tablesDB.deleteTable({
        databaseId: tablesDatabaseId,
        tableId: secondTableId
    });

    console.log('Cleaned up TablesDB relationship demo');
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
    // ========================
    // Databases API
    // ========================
    await createDatabase();
    await listDatabases();
    await getDatabase();
    await updateDatabase();

    await createCollection();
    await listCollections();
    await getCollection();
    await updateCollection();

    // Additional attribute types
    await createAdditionalAttributes();
    await listAttributes();
    await getAttribute();
    await updateAttributes();
    await deleteAttribute();

    // Indexes
    await listIndexes();
    await getIndex();

    // Single document CRUD
    await createDocument();
    await listDocuments();
    await getDocument();
    await updateDocument();
    await deleteDocument();

    // Bulk document operations
    await createDocuments();
    await upsertDocument();
    await upsertDocuments();
    await updateDocuments();
    await deleteDocuments();

    // Atomic increment/decrement
    await incrementDocumentAttribute();
    await decrementDocumentAttribute();

    // Databases Transactions API
    await createDbTransaction();
    await getDbTransaction();
    await listDbTransactions();
    await dbTransactionOperations();
    await commitDbTransaction();
    await deleteDbTransaction();

    // Relationship attribute
    await createRelationshipDemo();
    await updateRelationshipAttribute();
    await deleteRelationshipDemo();

    // Cleanup: delete index, collection, database
    await deleteIndex();

    console.log("Waiting a little to ensure index is deleted ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await deleteCollection();
    await deleteDatabase();

    // ========================
    // Storage API
    // ========================
    await createBucket();
    await listBuckets();
    await getBucket();
    await updateBucket();

    await uploadFile();
    await listFiles();
    await getFile();
    await getFileDownload();
    await getFilePreview();
    await getFileView();
    await updateFile();

    await deleteFile();
    await deleteBucket();

    // ========================
    // Users API
    // ========================
    // await getAccount() // works only with JWT
    await createUser();
    await listUsers();
    await getUser();
    await updateUserName();
    await updateUserEmail();
    await updateUserPassword();
    await updateUserPhone();
    await updateUserStatus();
    await updateUserLabels();
    await getUserPrefs();
    await updateUserPrefs();
    await listUserLogs();
    await listUserMemberships();
    await listUserSessions();
    await createUserSession();
    await deleteUserSessions();
    await updateUserEmailVerification();
    await updateUserPhoneVerification();
    await listUserIdentities();
    await deleteUserIdentity();
    await updateUserMFA();
    await listUserMFAFactors();
    await createUserMFARecoveryCodes();
    await getUserMFARecoveryCodes();
    await updateUserMFARecoveryCodes();
    await deleteUserMFAAuthenticator();
    await testLegacyMfaAliases();
    await createUserTarget();
    await getUserTarget();
    await listUserTargets();
    await updateUserTarget();
    await deleteUserTarget();
    await createUserJWT();
    await createUserToken();
    await deleteUser();

    // Specialized user creation (hash algorithms)
    await createArgon2User();
    await createBcryptUser();
    await createMD5User();
    await createSHAUser();
    await createPHPassUser();
    await createScryptUser();
    await createScryptModifiedUser();

    // ========================
    // Functions API
    // ========================
    await listRuntimes();
    await listSpecifications();
    await createFunction();
    await listFunctions();
    await getFunction();
    await updateFunction();
    await uploadDeployment();
    await listDeployments();
    await getDeploymentDownload();
    await updateFunctionDeployment();
    await updateDeploymentStatus();
    await createDuplicateDeployment();
    await createTemplateDeployment();
    await createVcsDeployment();
    await createVariable();
    await listVariables();
    await getVariable();
    await updateVariable();
    await deleteVariable();
    await executeSync();
    await executeAsync();
    await listExecutions();
    await deleteExecution();
    await deleteDeployment();
    await deleteFunction();

    // ========================
    // TablesDB API
    // ========================
    await createTablesDatabase();
    await listTablesDatabases();
    await getTablesDatabase();
    await updateTablesDatabase();

    await createTable();
    await listTables();
    await getTable();
    await updateTable();

    await createColumns();
    await createAdditionalColumns();
    await updateColumns();
    await listTableColumns();
    await getTableColumn();

    await createTableIndex();
    await listTableIndexes();
    await getTableIndex();

    // Single row CRUD
    await createTableRow();
    await listTableRows();
    await getTableRow();
    await updateTableRow();

    // Bulk row operations
    await createTableRows();
    await upsertTableRow();
    await upsertTableRows();
    await updateTableRows();
    await deleteTableRows();

    // Atomic row column operations
    await incrementRowColumn();
    await decrementRowColumn();

    // TablesDB Relationship Column
    await createTablesRelationshipDemo();

    // TablesDB Transactions API
    await createTransaction();
    await getTransaction();
    await listTransactions();
    await stageCreateRow();
    await stageUpdateRow();
    await stageOperations();
    await commitTransaction();
    await rollbackTransactionDemo();
    await deleteTransaction();

    // Cleanup
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

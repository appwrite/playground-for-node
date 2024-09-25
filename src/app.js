require("dotenv").config();

const {
  Client,
  Databases,
  Functions,
  Account,
  Users,
  Storage,
  Query,
  Permission,
  Payload,
  Role,
  ID,
  Runtime,
  ExecutionMethod,
} = require("node-appwrite");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

// Config
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT)
  .setKey(process.env.APPWRITE_KEY)
  .setSelfSigned(true);

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
const createDatabase = async () => {
  console.log(chalk.greenBright("Running Create Database API"));

  const response = await databases.create(ID.unique(), "Default");

  databaseId = response.$id;

  console.log(response);
};

const listDatabases = async () => {
  console.log(chalk.greenBright("Running List Databases API"));

  const response = await databases.list();

  console.log(response);
};

const getDatabase = async () => {
  console.log(chalk.greenBright("Running Get Database API"));

  const response = await databases.get(databaseId);

  console.log(response);
};

const updateDatabase = async () => {
  console.log(chalk.greenBright("Running Update Database API"));

  const response = await databases.update(databaseId, "Updated Database");

  console.log(response);
};

const deleteDatabase = async () => {
  console.log(chalk.greenBright("Running Delete Database API"));

  const response = await databases.delete(databaseId);

  console.log(response);
};

const createCollection = async () => {
  console.log(chalk.greenBright("Running Create Collection API"));

  const response = await databases.createCollection(
    databaseId, // ID of the collection
    ID.unique(), // Collection ID
    "Collection", // Collection Name
    [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]
  );

  collectionId = response.$id;
  console.log(response);

  const nameAttributeResponse = await databases.createStringAttribute(
    databaseId,
    collectionId,
    "name",
    255,
    false,
    "Empty Name",
    false
  );
  console.log(nameAttributeResponse);

  const yearAttributeResponse = await databases.createIntegerAttribute(
    databaseId,
    collectionId,
    "release_year",
    false,
    0,
    5000,
    1970,
    false
  );
  console.log(yearAttributeResponse);

  console.log("Waiting a little to ensure attributes are created ...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const yearIndexResponse = await databases.createIndex(
    databaseId,
    collectionId,
    "key_release_year_asc",
    "key",
    ["release_year"],
    ["ASC"]
  );
  console.log(yearIndexResponse);

  console.log("Waiting a little to ensure index is created ...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const listCollections = async () => {
  console.log(chalk.greenBright("Running List Collections API"));

  const response = await databases.listCollections(databaseId);

  console.log(response);
};

const getCollection = async () => {
  console.log(chalk.greenBright("Running Get Collection API"));

  const response = await databases.getCollection(databaseId, collectionId);

  console.log(response);
};

const updateCollection = async () => {
  console.log(chalk.greenBright("Running Update Collection API"));

  const response = await databases.updateCollection(
    databaseId,
    collectionId,
    "Updated Collection"
  );

  console.log(response);
};

const deleteCollection = async () => {
  console.log(chalk.greenBright("Running Delete Collection API"));

  const response = await databases.deleteCollection(databaseId, collectionId);

  console.log(response);
};

const listAttributes = async () => {
  console.log(chalk.greenBright("Running List Attributes API"));

  const response = await databases.listAttributes(databaseId, collectionId);

  console.log(response);
};

const createDocument = async () => {
  console.log(chalk.greenBright("Running Add Document API"));

  const response = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      name: "Spider Man",
      release_year: 1920,
    },
    [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]
  );
  documentId = response.$id;

  console.log(response);
};

const listDocuments = async () => {
  console.log(chalk.greenBright("Running List Documents API"));

  const response = await databases.listDocuments(databaseId, collectionId, [
    Query.equal("release_year", 1920),
  ]);

  console.log(response);
};

const getDocument = async () => {
  console.log(chalk.greenBright("Running Get Document API"));

  const response = await databases.getDocument(
    databaseId,
    collectionId,
    documentId
  );

  console.log(response);
};

const updateDocument = async () => {
  console.log(chalk.greenBright("Running Update Document API"));

  const response = await databases.updateDocument(
    databaseId,
    collectionId,
    documentId,
    {
      release_year: 2005,
    }
  );

  console.log(response);
};

const deleteDocument = async () => {
  console.log(chalk.greenBright("Running Delete Document API"));

  const response = await databases.deleteDocument(
    databaseId,
    collectionId,
    documentId
  );

  console.log(response);
};

const createBucket = async () => {
  console.log(chalk.greenBright("Running Create Bucket API"));

  const response = await storage.createBucket(ID.unique(), "All Files", [
    Permission.read(Role.any()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);
  bucketId = response.$id;

  console.log(response);
};

const listBuckets = async () => {
  console.log(chalk.greenBright("Running List Buckets API"));

  const response = await storage.listBuckets();

  console.log(response);
};

const getBucket = async () => {
  console.log(chalk.greenBright("Running Get Bucket API"));

  const response = await storage.getBucket(bucketId);

  console.log(response);
};

const updateBucket = async () => {
  console.log(chalk.greenBright("Running Update Bucket API"));

  const response = await storage.updateBucket(bucketId, "Updated Bucket");

  console.log(response);
};

const deleteBucket = async () => {
  console.log(chalk.greenBright("Running Delete Bucket API"));

  const response = await storage.deleteBucket(bucketId);

  console.log(response);
};

const uploadFile = async () => {
  console.log(chalk.greenBright("Running Upload File API"));

  const response = await storage.createFile(
    bucketId,
    ID.unique(),
    Payload.fromBinary(fs.readFileSync("./resources/nature.jpg"), "nature.jpg"),
    [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]
  );
  fileId = response.$id;

  console.log(response);
};

const listFiles = async () => {
  console.log(chalk.greenBright("Running List Files API"));

  const response = await storage.listFiles(bucketId);

  console.log(response);
};

const getFile = async () => {
  console.log(chalk.greenBright("Running Get File API"));

  const response = await storage.getFile(bucketId, fileId);

  console.log(response);
};

const updateFile = async () => {
  console.log(chalk.greenBright("Running Update File API"));

  const response = await storage.updateFile(bucketId, fileId, "abc", [
    Permission.read(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any()),
  ]);

  console.log(response);
};

const deleteFile = async () => {
  console.log(chalk.greenBright("Running Delete File API"));

  const response = await storage.deleteFile(bucketId, fileId);

  console.log(response);
};

const createUser = async () => {
  console.log(chalk.greenBright("Running Create User API"));

  const response = await users.create(
    ID.unique(),
    new Date().getTime() + "@example.com",
    undefined,
    "user@123",
    "Some User"
  );
  userId = response.$id;

  console.log(response);
};

const listUsers = async () => {
  console.log(chalk.greenBright("Running List Users API"));

  const response = await users.list();

  console.log(response);
};

const getUser = async () => {
  console.log(chalk.greenBright("Running Get User API"));

  const response = await users.get(userId);

  console.log(response);
};

const getAccount = async () => {
  console.log(chalk.greenBright("Running List Users API"));

  const response = await account.get();

  console.log(response);
};

const updateUserName = async () => {
  console.log(chalk.greenBright("Running Update User Name API"));

  const response = await users.updateName(userId, "Updated Name");

  console.log(response);
};

const deleteUser = async () => {
  console.log(chalk.greenBright("Running Delete User API"));

  const response = await users.delete(userId);

  console.log(response);
};

const createFunction = async () => {
  console.log(chalk.greenBright("Running Create Function API"));

  const response = await functions.create(
    ID.unique(),
    "Node Hello World",
    Runtime.Node180,
    [Role.any()],
    [],
    "",
    15,
    true,
    true,
    "index.js",
    ""
  );

  functionId = response.$id;

  console.log(response);
};

const listFunctions = async () => {
  console.log(chalk.greenBright("Running List Functions API"));

  let response = await functions.list();

  console.log(response);
};

const getFunction = async () => {
  console.log(chalk.greenBright("Running Get Function API"));

  let response = await functions.get(functionId);

  console.log(response);
};

const uploadDeployment = async () => {
  console.log(chalk.greenBright("Running Upload Deployment API"));

  let response = await functions.createDeployment(
    functionId,
    Payload.fromBinary(
      fs.readFileSync("./resources/code.tar.gz"),
      "code.tar.gz"
    ),
    true,
    "index.js"
  );

  console.log(response);

  console.log("Waiting a little to ensure deployment has built ...");
  await new Promise((resolve) => setTimeout(resolve, 3000));
};

const listDeployments = async () => {
  console.log(chalk.greenBright("Running List Deployments API"));

  let response = await functions.listDeployments(functionId);

  console.log(response);
};

const executeSync = async () => {
  console.log(chalk.greenBright("Running Execute Function API (sync)"));

  let response = await functions.createExecution(
    functionId,
    undefined,
    // @ts-ignore
    false,
    "/",
    ExecutionMethod.GET,
    {}
  );

  // sleep for 3 seconds
  console.log("Waiting a little to ensure execution is finished ...");
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log(response);
};

const executeAsync = async () => {
  console.log(chalk.greenBright("Running Execute Function API (async)"));

  let response = await functions.createExecution(functionId, undefined, true);

  executionId = response.$id;

  console.log(response);

  console.log("Waiting a little to ensure execution is finished ...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let asyncResponse = await functions.getExecution(functionId, executionId);

  console.log(asyncResponse);
};

const deleteFunction = async () => {
  console.log(chalk.greenBright("Running Delete function API"));

  const response = await functions.delete(functionId);

  console.log(response);
};

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
  await updateFile();

  await deleteFile();
  await deleteBucket();

  // await getAccount() // works only with JWT
  await createUser();
  await listUsers();
  await getUser();
  await updateUserName();
  await deleteUser();

  await createFunction();
  await listFunctions();
  await uploadDeployment();
  await listDeployments();
  await executeSync();
  await executeAsync();
  await deleteFunction();
};

runAllTasks()
  .then(() => {
    console.log(chalk.green.bold("Successfully ran playground!"));
  })
  .catch((err) => {
    console.error(err);
  });

const {Client, Databases, Functions, Account, Users, Storage, Query, Permission, Role, ID, RelationshipType} = require('node-appwrite');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const {InputFile} = require('node-appwrite/file')

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
let relatedCollectionId;
let relatedCollection2Id;
let actorsCollectionId;
let directorsCollectionId;
let reviewsCollectionId;
let documentId;
let relatedDocumentId;
let actorDocumentId;
let directorDocumentId;
let reviewDocumentId;
let userId;
let bucketId;
let fileId;
let functionId;
let executionId;

// List of API Definitions
const createDatabase = async () => {
    console.log(chalk.greenBright('Running Create Database API'));

    const response = await databases.create(ID.unique(), "Default");

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

    const response = await databases.get(databaseId);

    console.log(response);
}

const updateDatabase = async () => {
    console.log(chalk.greenBright('Running Update Database API'));

    const response = await databases.update(
        databaseId,
        "Updated Database"
    );

    console.log(response);
}

const deleteDatabase = async () => {
    console.log(chalk.greenBright("Running Delete Database API"));

    const response = await databases.delete(databaseId);

    console.log(response);
}

const createCollection = async () => {
    console.log(chalk.greenBright('Running Create Collection API'));

    const response = await databases.createCollection(
        databaseId,         // ID of the collection
        ID.unique(),        // Collection ID
        "Movies", // Collection Name
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

const createRelatedCollection = async () => {
    console.log(chalk.greenBright('Running Create Related Collection API'));

    const response = await databases.createCollection(
        databaseId,
        ID.unique(),
        "Categories",
        [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );

    relatedCollectionId = response.$id;
    console.log(response);

    const categoryNameAttributeResponse = await databases.createStringAttribute(
        databaseId,
        relatedCollectionId,
        'category_name',
        255,
        false,
        "Unknown Category",
        false
    );
    console.log(categoryNameAttributeResponse);

    console.log("Waiting a little to ensure category attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const createRelatedCollection2 = async () => {
    console.log(chalk.greenBright('Running Create Related Collection API'));

    const response = await databases.createCollection(
        databaseId,
        ID.unique(),
        "Pieces",
        [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
        ]
    );

    relatedCollection2Id = response.$id;
    console.log(response);

    const categoryNameAttributeResponse = await databases.createStringAttribute(
        databaseId,
        relatedCollection2Id,
        'piece_name',
        255,
        false,
        "Unknown Piece",
        false
    );
    console.log(categoryNameAttributeResponse);

    console.log("Waiting a little to ensure category attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const createActorsCollection = async () => {
    console.log(chalk.greenBright('Running Create Actors Collection API'));

    const response = await databases.createCollection(
        databaseId,
        ID.unique(),
        "Actors",
        [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );

    actorsCollectionId = response.$id;
    console.log(response);

    const nameAttributeResponse = await databases.createStringAttribute(
        databaseId,
        actorsCollectionId,
        'name',
        255,
        false,
        "Unknown Actor",
        false
    );
    console.log(nameAttributeResponse);

    const ageAttributeResponse = await databases.createIntegerAttribute(
        databaseId,
        actorsCollectionId,
        'age',
        false,
        16, 120,
        25,
        false
    );
    console.log(ageAttributeResponse);

    const nationalityAttributeResponse = await databases.createStringAttribute(
        databaseId,
        actorsCollectionId,
        'nationality',
        100,
        false,
        "Unknown",
        false
    );
    console.log(nationalityAttributeResponse);

    console.log("Waiting a little to ensure actor attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const createDirectorsCollection = async () => {
    console.log(chalk.greenBright('Running Create Directors Collection API'));

    const response = await databases.createCollection(
        databaseId,
        ID.unique(),
        "Directors",
        [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );

    directorsCollectionId = response.$id;
    console.log(response);

    const nameAttributeResponse = await databases.createStringAttribute(
        databaseId,
        directorsCollectionId,
        'name',
        255,
        false,
        "Unknown Director",
        false
    );
    console.log(nameAttributeResponse);

    const experienceAttributeResponse = await databases.createIntegerAttribute(
        databaseId,
        directorsCollectionId,
        'years_experience',
        false,
        0, 70,
        5,
        false
    );
    console.log(experienceAttributeResponse);

    const awardWinnerAttributeResponse = await databases.createBooleanAttribute(
        databaseId,
        directorsCollectionId,
        'award_winner',
        false,
        false,
        false
    );
    console.log(awardWinnerAttributeResponse);

    console.log("Waiting a little to ensure director attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const createReviewsCollection = async () => {
    console.log(chalk.greenBright('Running Create Reviews Collection API'));

    const response = await databases.createCollection(
        databaseId,
        ID.unique(),
        "Reviews",
        [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );

    reviewsCollectionId = response.$id;
    console.log(response);

    const ratingAttributeResponse = await databases.createIntegerAttribute(
        databaseId,
        reviewsCollectionId,
        'rating',
        false,
        1, 10,
        5,
        false
    );
    console.log(ratingAttributeResponse);

    const reviewTextAttributeResponse = await databases.createStringAttribute(
        databaseId,
        reviewsCollectionId,
        'review_text',
        1000,
        false,
        "No review provided",
        false
    );
    console.log(reviewTextAttributeResponse);

    const reviewerNameAttributeResponse = await databases.createStringAttribute(
        databaseId,
        reviewsCollectionId,
        'reviewer_name',
        100,
        false,
        "Anonymous",
        false
    );
    console.log(reviewerNameAttributeResponse);

    const dateAttributeResponse = await databases.createDatetimeAttribute(
        databaseId,
        reviewsCollectionId,
        'review_date',
        false,
        null,
        false
    );
    console.log(dateAttributeResponse);

    console.log("Waiting a little to ensure review attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

const addRelationshipAttributes = async () => {
    console.log(chalk.greenBright('Adding Complex Relationship Attributes'));

    // Movies -> Categories (Many-to-One)
    const movieCategoryRelationship = await databases.createRelationshipAttribute(
        databaseId,
        collectionId,
        relatedCollectionId,
        RelationshipType.ManyToOne,
        true,
        'category',
        'movies'
    );
    console.log('Movies -> Categories:', movieCategoryRelationship);

    // Categories -> Pieces (One-to-One)
    const categoryPieceRelationship = await databases.createRelationshipAttribute(
        databaseId,
        relatedCollectionId,
        relatedCollection2Id,
        RelationshipType.OneToOne,
        true,
        'piece',
        'category'
    );
    console.log('Categories -> Pieces:', categoryPieceRelationship);

    // Movies -> Actors (Many-to-Many)
    const movieActorsRelationship = await databases.createRelationshipAttribute(
        databaseId,
        collectionId,
        actorsCollectionId,
        RelationshipType.ManyToMany,
        false,
        'actors',
        'movies'
    );
    console.log('Movies -> Actors:', movieActorsRelationship);

    // Movies -> Directors (Many-to-One)
    const movieDirectorRelationship = await databases.createRelationshipAttribute(
        databaseId,
        collectionId,
        directorsCollectionId,
        RelationshipType.ManyToOne,
        true,
        'director',
        'directed_movies'
    );
    console.log('Movies -> Directors:', movieDirectorRelationship);

    // Reviews -> Movies (Many-to-One)
    const reviewMovieRelationship = await databases.createRelationshipAttribute(
        databaseId,
        reviewsCollectionId,
        collectionId,
        RelationshipType.ManyToOne,
        true,
        'movie',
        'reviews'
    );
    console.log('Reviews -> Movies:', reviewMovieRelationship);

    // Reviews -> Actors (Many-to-One) - actors can have reviews too
    const reviewActorRelationship = await databases.createRelationshipAttribute(
        databaseId,
        reviewsCollectionId,
        actorsCollectionId,
        RelationshipType.ManyToOne,
        false,
        'actor',
        'actor_reviews'
    );
    console.log('Reviews -> Actors:', reviewActorRelationship);

    // Directors -> Categories (One-to-Many) - directors might specialize in categories
    const directorCategoryRelationship = await databases.createRelationshipAttribute(
        databaseId,
        directorsCollectionId,
        relatedCollectionId,
        RelationshipType.OneToMany,
        false,
        'preferred_categories',
        'preferred_by_director'
    );
    console.log('Directors -> Categories:', directorCategoryRelationship);

    console.log("Waiting a little to ensure all relationship attributes are created ...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
}

const listCollections = async () => {
    console.log(chalk.greenBright('Running List Collections API'));

    const response = await databases.listCollections(databaseId);

    console.log(response);
}

const getCollection = async () => {
    console.log(chalk.greenBright("Running Get Collection API"));

    const response = await databases.getCollection(databaseId, collectionId);

    console.log(response);
}

const updateCollection = async () => {
    console.log(chalk.greenBright("Running Update Collection API"));

    const response = await databases.updateCollection(
        databaseId,
        collectionId,
        "Updated Collection"
    );

    console.log(response);
}

const deleteCollection = async () => {
    console.log(chalk.greenBright("Running Delete Collection API"));

    const response = await databases.deleteCollection(databaseId, collectionId);

    console.log(response);
}

const listAttributes = async () => {
    console.log(chalk.greenBright('Running List Attributes API'));

    const response = await databases.listAttributes(databaseId, collectionId);

    console.log(response);
}

const createActorDocument = async () => {
    console.log(chalk.greenBright('Running Create Actor Document API'));

    const response = await databases.createDocument(
        databaseId,
        actorsCollectionId,
        ID.unique(),
        {
            name: 'Robert Downey Jr.',
            age: 59,
            nationality: 'American'
        },
        [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );
    actorDocumentId = response.$id;

    console.log('Actor Document:', response);
}

const createDirectorDocument = async () => {
    console.log(chalk.greenBright('Running Create Director Document API'));

    const response = await databases.createDocument(
        databaseId,
        directorsCollectionId,
        ID.unique(),
        {
            name: 'Jon Favreau',
            years_experience: 25,
            award_winner: true,
            preferred_categories: [relatedDocumentId]
        },
        [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );
    directorDocumentId = response.$id;

    console.log('Director Document:', response);
}

const createCategoryDocument = async () => {
    console.log(chalk.greenBright('Running Create Category Document API'));

    const response = await databases.createDocument(
        databaseId,
        relatedCollectionId,
        ID.unique(),
        {
            category_name: 'Action',
            piece: {
                piece_name: 'Action Adventure Piece'
            }
        },
        [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
        ]
    );
    relatedDocumentId = response.$id;

    console.log('Category Document:', response);
}

const createDocument = async () => {
    console.log(chalk.greenBright('Running Add Movie Document API'));

    const response = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
            name: 'Iron Man',
            release_year: 2008,
            category: relatedDocumentId,
            director: directorDocumentId,
            actors: [actorDocumentId]
        },
        [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );
    documentId = response.$id;

    console.log('Movie Document:', response);
}

// Arrays to store all document IDs
let categoryDocs = [];
let actorDocs = [];
let directorDocs = [];
let movieDocs = [];
let reviewDocs = [];
let pieceDocs = [];

const createMultipleCategories = async () => {
    console.log(chalk.greenBright('Creating Multiple Categories'));
    
    const categories = [
        { name: 'Action', piece: 'Action Adventure Piece' },
        { name: 'Drama', piece: 'Emotional Drama Piece' },
        { name: 'Comedy', piece: 'Funny Comedy Piece' },
        { name: 'Sci-Fi', piece: 'Futuristic Sci-Fi Piece' },
        { name: 'Horror', piece: 'Scary Horror Piece' },
        { name: 'Romance', piece: 'Romantic Love Piece' },
        { name: 'Thriller', piece: 'Suspenseful Thriller Piece' }
    ];

    for (const category of categories) {
        const response = await databases.createDocument(
            databaseId,
            relatedCollectionId,
            ID.unique(),
            {
                category_name: category.name,
                piece: {
                    piece_name: category.piece
                }
            },
            [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
            ]
        );
        categoryDocs.push(response);
        console.log(`Created category: ${category.name}`);
    }
}

const createMultipleActors = async () => {
    console.log(chalk.greenBright('Creating Multiple Actors'));
    
    const actors = [
        { name: 'Robert Downey Jr.', age: 59, nationality: 'American' },
        { name: 'Scarlett Johansson', age: 40, nationality: 'American' },
        { name: 'Chris Evans', age: 43, nationality: 'American' },
        { name: 'Mark Ruffalo', age: 57, nationality: 'American' },
        { name: 'Chris Hemsworth', age: 41, nationality: 'Australian' },
        { name: 'Jeremy Renner', age: 53, nationality: 'American' },
        { name: 'Tom Holland', age: 28, nationality: 'British' },
        { name: 'Benedict Cumberbatch', age: 48, nationality: 'British' },
        { name: 'Paul Rudd', age: 55, nationality: 'American' }
    ];

    for (const actor of actors) {
        const response = await databases.createDocument(
            databaseId,
            actorsCollectionId,
            ID.unique(),
            actor,
            [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        actorDocs.push(response);
        console.log(`Created actor: ${actor.name}`);
    }
}

const createMultipleDirectors = async () => {
    console.log(chalk.greenBright('Creating Multiple Directors'));
    
    const directors = [
        { name: 'Jon Favreau', experience: 25, award_winner: true, categories: [0, 3] },
        { name: 'Anthony Russo', experience: 20, award_winner: true, categories: [0, 6] },
        { name: 'Joe Russo', experience: 20, award_winner: true, categories: [0, 6] },
        { name: 'Joss Whedon', experience: 30, award_winner: false, categories: [0, 2] },
        { name: 'Ryan Coogler', experience: 15, award_winner: true, categories: [0, 1] },
        { name: 'Taika Waititi', experience: 18, award_winner: false, categories: [0, 2] },
        { name: 'Scott Derrickson', experience: 22, award_winner: false, categories: [3, 4] },
        { name: 'Peyton Reed', experience: 25, award_winner: false, categories: [0, 2] }
    ];

    for (const director of directors) {
        const preferredCategories = director.categories.map(index => categoryDocs[index].$id);
        
        const response = await databases.createDocument(
            databaseId,
            directorsCollectionId,
            ID.unique(),
            {
                name: director.name,
                years_experience: director.experience,
                award_winner: director.award_winner,
                preferred_categories: preferredCategories
            },
            [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        directorDocs.push(response);
        console.log(`Created director: ${director.name}`);
    }
}

const createMultipleMovies = async () => {
    console.log(chalk.greenBright('Creating Multiple Movies'));
    
    const movies = [
        { name: 'Iron Man', year: 2008, categoryIndex: 0, directorIndex: 0, actorIndexes: [0] },
        { name: 'The Avengers', year: 2012, categoryIndex: 0, directorIndex: 3, actorIndexes: [0, 1, 2, 3, 4, 5] },
        { name: 'Iron Man 3', year: 2013, categoryIndex: 0, directorIndex: 0, actorIndexes: [0] },
        { name: 'Captain America: The Winter Soldier', year: 2014, categoryIndex: 6, directorIndex: 1, actorIndexes: [2, 1] },
        { name: 'Avengers: Age of Ultron', year: 2015, categoryIndex: 0, directorIndex: 3, actorIndexes: [0, 1, 2, 3, 4, 5] },
        { name: 'Black Panther', year: 2018, categoryIndex: 0, directorIndex: 4, actorIndexes: [1] },
        { name: 'Thor: Ragnarok', year: 2017, categoryIndex: 2, directorIndex: 5, actorIndexes: [4, 3] },
        { name: 'Spider-Man: Homecoming', year: 2017, categoryIndex: 0, directorIndex: 0, actorIndexes: [6, 0] },
        { name: 'Doctor Strange', year: 2016, categoryIndex: 3, directorIndex: 6, actorIndexes: [7] },
        { name: 'Ant-Man', year: 2015, categoryIndex: 2, directorIndex: 7, actorIndexes: [8] }
    ];

    for (const movie of movies) {
        const selectedActors = movie.actorIndexes.map(index => actorDocs[index].$id);
        
        const response = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                name: movie.name,
                release_year: movie.year,
                category: categoryDocs[movie.categoryIndex].$id,
                director: directorDocs[movie.directorIndex].$id,
                actors: selectedActors
            },
            [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        movieDocs.push(response);
        console.log(`Created movie: ${movie.name}`);
    }
}

const createMultipleReviews = async () => {
    console.log(chalk.greenBright('Creating Multiple Reviews'));
    
    const reviews = [
        { rating: 9, text: 'Amazing superhero movie! Robert Downey Jr. was perfect as Tony Stark.', reviewer: 'Movie Critic', movieIndex: 0, actorIndex: 0 },
        { rating: 8, text: 'Great ensemble cast and spectacular action sequences.', reviewer: 'Film Enthusiast', movieIndex: 1, actorIndex: 1 },
        { rating: 7, text: 'Good sequel but not as strong as the first Iron Man.', reviewer: 'Comic Book Fan', movieIndex: 2, actorIndex: 0 },
        { rating: 9, text: 'Chris Evans delivers a powerful performance as Captain America.', reviewer: 'Action Movie Lover', movieIndex: 3, actorIndex: 2 },
        { rating: 6, text: 'Too much CGI, but the character development is solid.', reviewer: 'Cinema Student', movieIndex: 4, actorIndex: 3 },
        { rating: 10, text: 'Black Panther is a masterpiece of storytelling and representation.', reviewer: 'Cultural Critic', movieIndex: 5, actorIndex: 1 },
        { rating: 8, text: 'Taika Waititi brings humor and heart to Thor.', reviewer: 'Comedy Fan', movieIndex: 6, actorIndex: 4 },
        { rating: 9, text: 'Tom Holland is the perfect Spider-Man for a new generation.', reviewer: 'Teen Movie Reviewer', movieIndex: 7, actorIndex: 6 },
        { rating: 8, text: 'Benedict Cumberbatch brings gravitas to the mystical arts.', reviewer: 'Fantasy Film Fan', movieIndex: 8, actorIndex: 7 },
        { rating: 7, text: 'Paul Rudd makes Ant-Man surprisingly entertaining.', reviewer: 'Casual Viewer', movieIndex: 9, actorIndex: 8 },
        { rating: 10, text: 'Robert Downey Jr. is the heart of the MCU.', reviewer: 'MCU Superfan', movieIndex: 0, actorIndex: 0 },
        { rating: 9, text: 'Scarlett Johansson brings depth to Black Widow.', reviewer: 'Character Study Enthusiast', movieIndex: 1, actorIndex: 1 }
    ];

    for (const review of reviews) {
        const response = await databases.createDocument(
            databaseId,
            reviewsCollectionId,
            ID.unique(),
            {
                rating: review.rating,
                review_text: review.text,
                reviewer_name: review.reviewer,
                review_date: new Date().toISOString(),
                movie: movieDocs[review.movieIndex].$id,
                actor: review.actorIndex !== undefined ? actorDocs[review.actorIndex].$id : null
            },
            [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        reviewDocs.push(response);
        console.log(`Created review for: ${movieDocs[review.movieIndex].name}`);
    }
}

const createReviewDocument = async () => {
    console.log(chalk.greenBright('Running Create Review Document API'));

    const response = await databases.createDocument(
        databaseId,
        reviewsCollectionId,
        ID.unique(),
        {
            rating: 9,
            review_text: 'Amazing superhero movie! Robert Downey Jr. was perfect as Tony Stark.',
            reviewer_name: 'Movie Critic',
            review_date: new Date().toISOString(),
            movie: documentId,
            actor: actorDocumentId
        },
        [
            Permission.read(Role.any()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );
    reviewDocumentId = response.$id;

    console.log('Review Document:', response);
}

const queryMoviesWithRelations = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING MOVIES WITH ALL RELATIONS ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        collectionId,
    );
    
    console.log(chalk.green(`Found ${response.total} movies:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryActorsWithMovies = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING ACTORS WITH MOVIE RELATIONS ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        actorsCollectionId,
        [
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} actors:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryDirectorsWithCategories = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING DIRECTORS WITH CATEGORY PREFERENCES ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        directorsCollectionId,
        [
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} directors:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryCategoriesWithPieces = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING CATEGORIES WITH PIECES (One-to-One) ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        relatedCollectionId,
        [
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} categories:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryReviewsWithMoviesAndActors = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING REVIEWS WITH MOVIE AND ACTOR RELATIONS ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        reviewsCollectionId,
        [
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} reviews:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryMoviesByCategory = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING MOVIES BY CATEGORY (Action Movies) ==='));
    
    // Find Action category
    const actionCategory = categoryDocs.find(cat => cat.category_name === 'Action');
    if (!actionCategory) {
        console.log(chalk.red('Action category not found'));
        return;
    }
    
    const response = await databases.listDocuments(
        databaseId,
        collectionId,
        [
            Query.equal('category', actionCategory.$id),
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} action movies:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryMoviesByYearRange = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING MOVIES BY YEAR RANGE (2015-2020) ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        collectionId,
        [
            Query.greaterThanEqual('release_year', 2015),
            Query.lessThanEqual('release_year', 2020),
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} movies from 2015-2020:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryHighRatedReviews = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING HIGH-RATED REVIEWS (Rating >= 9) ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        reviewsCollectionId,
        [
            Query.greaterThanEqual('rating', 9),
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} high-rated reviews:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryActorsByNationality = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING ACTORS BY NATIONALITY (American) ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        actorsCollectionId,
        [
            Query.equal('nationality', 'American'),
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} American actors:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryAwardWinningDirectors = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING AWARD-WINNING DIRECTORS ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        directorsCollectionId,
        [
            Query.equal('award_winner', true),
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} award-winning directors:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const queryMoviesOrderedByYear = async () => {
    console.log(chalk.blue.bold('\n=== QUERYING MOVIES ORDERED BY RELEASE YEAR ==='));
    
    const response = await databases.listDocuments(
        databaseId,
        collectionId,
        [
            Query.orderAsc('release_year'),
            Query.limit(25)
        ]
    );
    
    console.log(chalk.green(`Found ${response.total} movies ordered by year:`));
    console.log(JSON.stringify(response, null, 2));
    return response;
}

const displayFullDatabaseStructure = async () => {
    console.log(chalk.blue.bold('\n=== COMPLETE DATABASE STRUCTURE ==='));
    
    // Categories
    console.log(chalk.yellow.bold('\n📂 CATEGORIES (' + categoryDocs.length + ')'));
    for (let i = 0; i < categoryDocs.length; i++) {
        const category = categoryDocs[i];
        console.log(chalk.cyan(`  ${i + 1}. ${category.category_name}`));
        console.log(chalk.gray(`     └── Piece: ${category.piece?.piece_name || 'N/A'}`));
    }
    
    // Actors
    console.log(chalk.yellow.bold('\n🎭 ACTORS (' + actorDocs.length + ')'));
    for (let i = 0; i < actorDocs.length; i++) {
        const actor = actorDocs[i];
        console.log(chalk.cyan(`  ${i + 1}. ${actor.name} (${actor.nationality}, age ${actor.age})`));
        
        // Find movies for this actor
        const actorMovies = movieDocs.filter(movie => 
            movie.actors && movie.actors.includes(actor.$id)
        );
        if (actorMovies.length > 0) {
            console.log(chalk.gray(`     └── Movies: ${actorMovies.map(m => m.name).join(', ')}`));
        }
        
        // Find reviews for this actor
        const actorReviews = reviewDocs.filter(review => review.actor === actor.$id);
        if (actorReviews.length > 0) {
            console.log(chalk.gray(`     └── Reviews: ${actorReviews.length} reviews`));
        }
    }
    
    // Directors
    console.log(chalk.yellow.bold('\n🎬 DIRECTORS (' + directorDocs.length + ')'));
    for (let i = 0; i < directorDocs.length; i++) {
        const director = directorDocs[i];
        console.log(chalk.cyan(`  ${i + 1}. ${director.name} (${director.years_experience} years, ${director.award_winner ? 'Award Winner' : 'No Awards'})`));
        
        // Find preferred categories
        if (director.preferred_categories && director.preferred_categories.length > 0) {
            const preferredCats = categoryDocs.filter(cat => 
                director.preferred_categories.includes(cat.$id)
            );
            console.log(chalk.gray(`     └── Preferred Categories: ${preferredCats.map(c => c.category_name).join(', ')}`));
        }
        
        // Find directed movies
        const directedMovies = movieDocs.filter(movie => movie.director === director.$id);
        if (directedMovies.length > 0) {
            console.log(chalk.gray(`     └── Directed: ${directedMovies.map(m => m.name).join(', ')}`));
        }
    }
    
    // Movies
    console.log(chalk.yellow.bold('\n🎥 MOVIES (' + movieDocs.length + ')'));
    for (let i = 0; i < movieDocs.length; i++) {
        const movie = movieDocs[i];
        const category = categoryDocs.find(c => c.$id === movie.category);
        const director = directorDocs.find(d => d.$id === movie.director);
        const actors = actorDocs.filter(a => movie.actors && movie.actors.includes(a.$id));
        const movieReviews = reviewDocs.filter(r => r.movie === movie.$id);
        const avgRating = movieReviews.length > 0 ? (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1) : 'N/A';
        
        console.log(chalk.cyan(`  ${i + 1}. ${movie.name} (${movie.release_year})`));
        console.log(chalk.gray(`     ├── Category: ${category?.category_name || 'N/A'}`));
        console.log(chalk.gray(`     ├── Director: ${director?.name || 'N/A'}`));
        console.log(chalk.gray(`     ├── Actors: ${actors.map(a => a.name).join(', ') || 'N/A'}`));
        console.log(chalk.gray(`     └── Reviews: ${movieReviews.length} (Avg Rating: ${avgRating})`));
    }
    
    // Reviews
    console.log(chalk.yellow.bold('\n⭐ REVIEWS (' + reviewDocs.length + ')'));
    for (let i = 0; i < reviewDocs.length; i++) {
        const review = reviewDocs[i];
        const movie = movieDocs.find(m => m.$id === review.movie);
        const actor = actorDocs.find(a => a.$id === review.actor);
        
        console.log(chalk.cyan(`  ${i + 1}. ${review.reviewer_name} - ${review.rating}/10`));
        console.log(chalk.gray(`     ├── Movie: ${movie?.name || 'N/A'}`));
        console.log(chalk.gray(`     ├── Actor: ${actor?.name || 'N/A'}`));
        console.log(chalk.gray(`     └── "${review.review_text.substring(0, 60)}${review.review_text.length > 60 ? '...' : ''}"`));
    }
    
    // Summary Statistics
    console.log(chalk.blue.bold('\n📊 RELATIONSHIP STATISTICS'));
    console.log(chalk.green(`• Total Collections: 6`));
    console.log(chalk.green(`• Total Documents: ${categoryDocs.length + actorDocs.length + directorDocs.length + movieDocs.length + reviewDocs.length}`));
    console.log(chalk.green(`• Total Relationships: 7 different relationship types`));
    
    console.log(chalk.magenta('\n🔗 RELATIONSHIP TYPES:'));
    console.log(chalk.white('  1. Movies → Categories (Many-to-One)'));
    console.log(chalk.white('  2. Categories → Pieces (One-to-One)'));
    console.log(chalk.white('  3. Movies → Actors (Many-to-Many)'));
    console.log(chalk.white('  4. Movies → Directors (Many-to-One)'));
    console.log(chalk.white('  5. Reviews → Movies (Many-to-One)'));
    console.log(chalk.white('  6. Reviews → Actors (Many-to-One)'));
    console.log(chalk.white('  7. Directors → Categories (One-to-Many)'));
    
    console.log(chalk.blue.bold('\n=== END DATABASE STRUCTURE ===\n'));
}

const listDocuments = async () => {
    console.log(chalk.greenBright('Running List Documents API'));

    const response = await databases.listDocuments(
        databaseId,
        collectionId,
        [
            Query.limit(1),
        ],
    );

    console.dir(response, {depth: null});
}

const getDocument = async () => {
    console.log(chalk.greenBright("Running Get Document API"));

    const response = await databases.getDocument(
        databaseId,
        collectionId,
        documentId
    );

    console.log(response);
}

const updateDocument = async () => {
    console.log(chalk.greenBright("Running Update Document API"));

    const response = await databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        {
            release_year: 2005
        }
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

const listBuckets = async () => {
    console.log(chalk.greenBright("Running List Buckets API"));

    const response = await storage.listBuckets();

    console.log(response);
}

const getBucket = async () => {
    console.log(chalk.greenBright("Running Get Bucket API"));

    const response = await storage.getBucket(bucketId);

    console.log(response);
}

const updateBucket = async () => {
    console.log(chalk.greenBright("Running Update Bucket API"));

    const response = await storage.updateBucket(
        bucketId,
        "Updated Bucket"
    );

    console.log(response);
}

const deleteBucket = async () => {
    console.log(chalk.greenBright("Running Delete Bucket API"));

    const response = await storage.deleteBucket(bucketId);

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

const listFiles = async () => {
    console.log(chalk.greenBright("Running List Files API"));

    const response = await storage.listFiles(bucketId);

    console.log(response);
}

const getFile = async () => {
    console.log(chalk.greenBright("Running Get File API"));

    const response = await storage.getFile(bucketId, fileId);

    console.log(response);
}

const updateFile = async () => {
    console.log(chalk.greenBright("Running Update File API"));

    const response = await storage.updateFile(
        bucketId,
        fileId,
        "abc",
        [
            Permission.read(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any()),
        ]
    );

    console.log(response);
}

const deleteFile = async () => {
    console.log(chalk.greenBright("Running Delete File API"));

    const response = await storage.deleteFile(bucketId, fileId);

    console.log(response);
}

const createUser = async () => {
    console.log(chalk.greenBright('Running Create User API'));

    const response = await users.create(
        ID.unique(),
        new Date().getTime() + '@example.com',
        null,
        'user@123',
        'Some User'
    );
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

    const response = await users.get(userId);

    console.log(response);
}

const getAccount = async () => {
    console.log(chalk.greenBright('Running List Users API'));

    const response = await account.get();

    console.log(response);
}

const updateUserName = async () => {
    console.log(chalk.greenBright('Running Update User Name API'));

    const response = await users.updateName(userId, 'Updated Name');

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
        "node-16.0",
        [Role.any()],
        [],
        '',
        15,
        true,
        true,
        "index.js",
        ''
    );

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

    let response = await functions.get(functionId);

    console.log(response);
}

const uploadDeployment = async () => {
    console.log(chalk.greenBright('Running Upload Deployment API'));

    let response = await functions.createDeployment(
        functionId,
        InputFile.fromPath("./resources/code.tar.gz", "code.tar.gz"),
        true,
        "index.js"
    );

    console.log(response);

    console.log("Waiting a little to ensure deployment has built ...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
}

const listDeployments = async () => {
    console.log(chalk.greenBright('Running List Deployments API'));

    let response = await functions.listDeployments(functionId);

    console.log(response);
}

const executeSync = async () => {
    console.log(chalk.greenBright('Running Execute Function API (sync)'));

    let response = await functions.createExecution(functionId, "", false, "/", "GET", {});

    // sleep for 3 seconds
    console.log("Waiting a little to ensure execution is finished ...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(response);
}

const executeAsync = async () => {
    console.log(chalk.greenBright('Running Execute Function API (async)'));

    let response = await functions.createExecution(functionId, '', true);

    executionId = response.$id;

    console.log(response);

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
    console.log(chalk.blue.bold('=== Creating Complex Database Structure with Multiple Documents ==='));
    
    // Step 1: Create database
    await createDatabase();
    
    // Step 2: Create all collections with attributes
    console.log(chalk.yellow('\n📋 Creating Collections...'));
    await createCollection(); // Movies
    await createRelatedCollection(); // Categories
    await createRelatedCollection2(); // Pieces
    await createActorsCollection(); // Actors
    await createDirectorsCollection(); // Directors
    await createReviewsCollection(); // Reviews
    
    // Step 3: Add complex relationships between collections
    console.log(chalk.yellow('\n🔗 Adding Relationships...'));
    await addRelationshipAttributes();
    
    // Step 4: Create multiple documents with complex relationships
    console.log(chalk.yellow('\n📄 Creating Documents...'));
    await createMultipleCategories(); // 7 categories with pieces
    await createMultipleActors(); // 9 actors
    await createMultipleDirectors(); // 8 directors with category preferences
    await createMultipleMovies(); // 10 movies with directors, categories, and actors
    await createMultipleReviews(); // 12 reviews for movies and actors
    
    // Step 5: Display the complete database structure
    await displayFullDatabaseStructure();

    console.log(chalk.green.bold('\n=== DATABASE CREATION COMPLETE - STARTING COMPREHENSIVE QUERIES ==='));
    console.log(chalk.yellow('\nDatabase Summary:'));
    console.log(chalk.yellow('• 7 Categories (each with a One-to-One Piece)'));
    console.log(chalk.yellow('• 9 Actors (with Many-to-Many Movie relationships)'));
    console.log(chalk.yellow('• 8 Directors (with One-to-Many Category preferences)'));
    console.log(chalk.yellow('• 10 Movies (with complex relationships to all other entities)'));
    console.log(chalk.yellow('• 12 Reviews (connected to both Movies and Actors)'));
    console.log(chalk.yellow('• Total: 46 documents across 6 collections with 7 relationship types'));

    // Step 6: Execute comprehensive queries to show relationships and full document structure
    console.log(chalk.magenta.bold('\n🔍 EXECUTING COMPREHENSIVE QUERIES WITH FULL RELATIONSHIPS\n'));
    
    // Query all collections with their full relationship data
    await queryMoviesWithRelations();
    await queryActorsWithMovies();
    await queryDirectorsWithCategories();
    await queryCategoriesWithPieces();
    await queryReviewsWithMoviesAndActors();
    
    // Query with filters to show specific relationship combinations
    await queryMoviesByCategory();
    await queryMoviesByYearRange();
    await queryHighRatedReviews();
    await queryActorsByNationality();
    await queryAwardWinningDirectors();
    await queryMoviesOrderedByYear();

    console.log(chalk.green.bold('\n=== ALL QUERIES COMPLETED - RELATIONSHIPS FULLY DEMONSTRATED ==='));
    
    // await deleteDocument();
    // await deleteCollection();
    // await deleteDatabase();
    //
    // await createBucket();
    // await listBuckets();
    // await getBucket();
    // await updateBucket();
    //
    // await uploadFile();
    // await listFiles();
    // await getFile();
    // await updateFile();
    //
    // await deleteFile();
    // await deleteBucket();
    //
    // // await getAccount() // works only with JWT
    // await createUser();
    // await listUsers();
    // await getUser();
    // await updateUserName();
    // await deleteUser();
    //
    // await createFunction();
    // await listFunctions();
    // await uploadDeployment();
    // await listDeployments();
    // await executeSync();
    // await executeAsync();
    // await deleteFunction();
}

runAllTasks()
    .then(() => {
        console.log(chalk.green.bold('Successfully ran playground!'))
    })
    .catch(err => {
        console.error(err)
    })

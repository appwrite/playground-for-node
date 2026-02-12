export default async ({ req, res, log, error }) => {
    log("Hello from Appwrite Functions!");
    return res.json({
        message: "Hello from Appwrite Functions 👋"
    });
};

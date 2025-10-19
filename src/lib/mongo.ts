import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("Missing env: NEXT_PUBLIC_MONGODB_URI");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    // so the connection persists across hot reloads in dev
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    clientPromise = client.connect();
}

// Export a helper to get the db
export async function getDb(dbName = "admin") {
    const client = await clientPromise;
    return client.db(dbName);
}

// Optional: quick connection test (run once at startup)
clientPromise
    .then(async (c) => {
        await c.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB");
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));

export default clientPromise;

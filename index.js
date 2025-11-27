const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb"); // ✅ Import ServerApiVersion
require("dotenv").config();

const app = express();
const port = 4000;

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in the .env file.");
  process.exit(1); // ✅ Exit if no URI
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server connected!");
});

async function run() {
  try {
    await client.connect();
    const db = client.db("EJP-auth");
    const usersColl = db.collection("users");
    const productsColl = db.collection("next_products");

    // ✅ Complete route
    app.get("/all-products", async (req, res) => {
      try {
        const result = await productsColl.find().toArray();
        res.json(result);
      } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("DB error:", error);
  }
}

run(); // ✅ Call run()

app.listen(port, () => {
  console.log("server is running at port", port);
});

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 4000;

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in the .env file.");
  process.exit(1);
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

    app.get("/all-products", async (req, res) => {
      try {
        const result = await productsColl.find().toArray();
        res.json(result);
      } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
      }
    });
    app.get("/products/:id", async (req, res) => {
      try {
        const productId = req.params.id;
        // const query = productId ? { product_id: new ObjectId(productId) } : null;
        const result = await productsColl.findOne({ product_id: productId });
        if (!result) return res.send("no products found");
        res.send(result);
      } catch (error) {
        res.send("database error");
      }
    });

    app.post("/add-product", async (req, res) => {
      try {
        // console.log("url was hitted");

        const product = req.body;
        await productsColl.insertOne(product);
        return res
          .status(201)
          .send({ success: true, message: "Product was added successfully!" });
      } catch (error) {
        console.error(error);
        res.status(500).send("request error");
      }
    });

    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error("DB error:", error);
  }
}

run();

app.listen(port, () => {
  console.log("server is running at port", port);
});

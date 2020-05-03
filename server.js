const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

// Setting the View Engine to EJS
app.set("view engine", "ejs");

// using bodyParser to Parsing the body and add id to request
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Using JSON to JSON Parsing
app.use(bodyParser.json());

// Call the main.js
app.use(express.static("public"));

MongoClient.connect(
  "mongodb+srv://root:root@cluster0-n0jtc.mongodb.net/test?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  }
).then((client) => {
  console.log("Connected to Database");
  const db = client.db("star-wars-quotes");
  const quotesCollection = db.collection("quotes");

  // GET Normal GET /
  app.get("/", (req, res) => {
    const cursor = db
      .collection("quotes")
      .find()
      .toArray()
      .then((result) => {
        // console.log(result);
        res.render("index.ejs", {
          quotes: result,
        });
      })
      .catch((err) => console.error(err));
    // res.sendFile(__dirname + "/views/index.html");
  });

  // POST QUOTES POST /quotes
  app.post("/quotes", (req, res) => {
    quotesCollection
      .insertOne(req.body)
      .then((result) => {
        res.redirect("/");
      })
      .catch((error) => console.error(error));
  });

  // PUT QUOTES PUT /quoutes
  //Adding a comment
  app.put("/quotes", (req, res) => {
    console.log(req.body);
    quotesCollection
      .findOneAndUpdate(
        { name: "Allah" },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote,
          },
        },
        {
          upsert: true,
        }
      )
      .then((result) => {
        res.json('Success');
      })
      .catch((error) => console.error(error));
  });
});

// Porting and Listen to PORT
app.listen(3000, () => {
  console.log(`Listening to port 3000`);
});

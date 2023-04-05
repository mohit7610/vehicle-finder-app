// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import cors from "cors";
import mysql from "mysql";
import bodyParser from "body-parser";


const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();  




app.use(cors());

// parse application/json
app.use(bodyParser.json());


// const db = mysql.createConnection({
//   host: "localhost",
//   user: "ubuntu",
//   password: "9YwhtVtUWeTm58",
//   database: "vehicle_finder",
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "react",
});

app.use(express.json());

// get brand values
app.get("/api/getbrand",(req, res) => {

  const sql = "SELECT * FROM brand";

  db.query(sql,(err, data) => {
    if(err) return res.json(err);
    return res.json(data);
  })
});

// get model values
app.get("/api/getmodel",(req, res) => {

  const sql = "SELECT * FROM model";

  db.query(sql,(err, data) => {
    if(err) return res.json(err);
    return res.json(data);
  })
});


// add brand value
app.post("/api/addbrand",(req, res) => {

  const sql = "INSERT INTO brand (`brand`) VALUES (?)";

  const values = [
    req.body.brand,
  ];

  db.query(sql, [values],(err, data) => {
    if(err) return res.json(err);
    return res.json(values);
  })
});


// add model value
app.post("/api/addmodel",(req, res) => {

  const sql = "INSERT INTO model (`selectbrandmodel`,`model`) VALUES (?)";

  const values = [
    req.body.selectbrandmodel,
    req.body.model,
  ];

  db.query(sql, [values],(err, data) => {
    if(err) return res.json(err);
    return res.json(values);
  })
});

// add generation value
app.post("/api/addgeneration",(req, res) => {

  const sql = "INSERT INTO generation (`selectbrandgeneration`,`selectmodelgeneration`,`generation`) VALUES (?)";

  const values = [
    req.body.selectbrandgeneration,
    req.body.selectmodelgeneration,
    req.body.generation,
  ];

  db.query(sql, [values],(err, data) => {
    if(err) return res.json(err);
    return res.json(values);
  })
});



//connect to database
db.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});


app.listen(8081, () => {
  console.log("Server running successfully on 8081");
});


// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);





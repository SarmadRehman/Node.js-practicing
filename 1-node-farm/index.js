const fs = require("fs");
const http = require("http");
const url = require("url");

// // Blocking synchronous code way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// // variable for new file
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on
// ${Date.now()}`;
// // creating a new file with the new content
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written");

// SERVER
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  //overview
  if (pathName === "/" || pathName === "./overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(tempOverview);
    //product
  } else if (pathName === "/product") {
    res.end("This is the Product");
    //api
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    //page not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

// Specify a port to listen on
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

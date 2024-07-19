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

// taking html card page and json object
const replaceHtml = (temp, prod) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, prod.productName);
  output = output.replace(/{%IMAGE%}/g, prod.image);
  output = output.replace(/{%PRICE%}/g, prod.price);
  output = output.replace(/{%FROM%}/g, prod.from);
  output = output.replace(/{%NUTRIENTS%}/g, prod.nutrients);
  output = output.replace(/{%QUANTITY%}/g, prod.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, prod.description);
  output = output.replace(/{%ID%}/g, prod.id);
  if (!prod.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

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

// reading and parsing the data in JSON
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// creating server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    //taking card and data over for each item and making up the html page
    const cardsHtml = dataObj.map((el) => replaceHtml(tempCard, el)).join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceHtml(tempProduct, product);
    res.end(output);

    //api
  } else if (pathname === "/api") {
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

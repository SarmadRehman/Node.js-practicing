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
const data = fs.readFile(
  `${__dirname}/dev-data/data.json`,
  "utf-8",
  (err, data) => {
    const dataObj = JSON.parse(data);
  }
);
const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "./overview") {
    res.end("This is the Overview");
  } else if (pathName === "/product") {
    res.end("This is the Product");
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
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

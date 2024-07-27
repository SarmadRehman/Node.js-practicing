const fs = require("fs");
const http = require("http");
const url = require("url");
// function externally included
const replaceHtml = require("./modules/replaceHtml");
const slugify = require("slugify");

// html overview template
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

// html card
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

// product container template
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// reading and parsing the data in JSON
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//slugs created through Slugify
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

//slugs updated in the data.json file

const updatedData = dataObj.map((e, index) => {
  if (!e.hasOwnProperty("slug")) {
    return { ...e, slug: slugs[index] };
  } else {
    return e;
  }
});

// for updating the data.json file to add slugs in each object
const isUpdated = JSON.stringify(dataObj) !== JSON.stringify(updatedData);

if (isUpdated) {
  fs.writeFileSync(
    `${__dirname}/dev-data/data.json`,
    JSON.stringify(updatedData, null, 2)
  );

  console.log("Data updated in data.json");
} else {
  console.log("No updates needed in data.json");
}
// ===> Creating server instance
const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);
  console.log("the query is:", query, "\n", "pathname is here : ", pathname);
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
// Product page
//   } else if (pathname.startsWith("/product")) {
//     const slug = pathname.split("/product/")[1];
//     console.log("Slug: ", slug);
//     const product = dataObj.find((p) => p.slug === slug);

//     if (product) {
//       res.writeHead(200, { "Content-type": "text/html" });
//       const output = replaceHtml(tempProduct, product);
//       res.end(output);
//     } else {
//       res.writeHead(404, { "Content-type": "text/html" });
//       res.end("<h1>Product not found</h1>");
//     }

//     // API
//   } else if (pathname === "/api") {
//     res.writeHead(200, { "Content-type": "application/json" });
//     res.end(data);

//     // Page not found
//   } else {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//       "my-own-header": "hello world",
//     });
//     res.end("<h1>Page not found</h1>");
//   }
// });

// Specify a port to listen on
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

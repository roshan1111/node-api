const http = require("http");
const qs = require("querystring");
const fs = require("fs");
const port = 3004;
let countries = require("./data");
// console.log(countries)

const server = http.createServer((req, res) => {
  let url = req.url;
  if (url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Hello World </h1>");
    res.end();
  } else if (url === "/api/countries" && req.method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(countries));
      res.end();
    } catch (err) {
      console.log(err);
    }
  } else if (url.match(/\/api\/countries\/([0-9])+/) && req.method === "GET") {
    try {
      const requestUrl = url.split("/");
      const id = requestUrl[3];
      // console.log(id)
      const country = countries.find((country) => country.id === Number(id));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(country));
      res.end();
    } catch (err) {
      console.log(err);
    }
  } else if (
    url.match(/\/api\/countries\/([0-9])+/) &&
    req.method === "DELETE"
  ) {
    try {
      const requestUrl = url.split("/");
      const id = requestUrl[3];
      // console.log(id)
      countries = countries.filter((country) => country.id !== Number(id));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(countries));
      res.end();
    } catch (err) {
      console.log(err);
    }
  } else if (url === "/api/countries" && req.method === "POST") {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        // console.log(qs.parse(body))
        let countryName = qs.parse(body);
        let newCountry = {
          id: Math.floor(4 + Math.random() * 1000),
          name: countryName["name"],
        };
        countries.push(newCountry);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(countries));
        res.end();
      });
    } catch (err) {
      console.log(err);
    }
  } 
  
  else {
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "file not found" }));
      res.end();
    } catch (err) {
      console.log(err);
    }
  }
});

server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}/`);
});

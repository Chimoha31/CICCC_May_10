const http = require("http");
const fs = require("fs");
const html = require("fs").readFileSync("./index.html");
const html2 = require("fs").readFileSync("./index2.html");
const PORT = 8000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write(html);
    res.end();
  }
  if (url === "/write-message") {
    res.write(html2);
    res.end();
  }

  if (url === "/write-message" && method === "POST") {
    // console.log(req.body)
    const body = [];

    req.on("data", (chunk) => {
      // console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      // console.log({ parsedBody });
      const message = parsedBody.split("=")[1];

      fs.writeFile("message.txt", message, (err) => {
        if (err) throw err;
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  if (url === "/read-message") {
    fs.readFile("message.txt", "utf8", function(err, content){
      if (err) throw err;
      console.log(content);
      res.end(content);
    });
  }
});
server.listen(PORT, () => console.log("Teddy is running"));

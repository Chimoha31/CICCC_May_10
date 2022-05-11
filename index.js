const http = require("http");
const fs = require("fs");
const PORT = 8000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write(`
          <html>
              <head>
                  <title>First Page</title>
              </head>
              <body>
               <h1>Hello Node</h1>
               <a href='http://localhost:8000/write-message'>TO WRITE MESSAGE</a>
               <br />
               <a href='http://localhost:8000/read-message'>TO READ MESSAGE</a>
              </body>
          </html>
      `);
    res.end();
  }
  if (url === "/write-message") {
    res.write(`
          <html>
              <head>
                  <title>First Page</title>
              </head>
              <body>
                  <form action="/write-message" method='POST'>
                      <input type="text" name="message" />
                      <button type="submit">Submit</button>
                  </form>
              </body>
          </html>
      `);
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

//This is what I did so far. I have something problem
//1. I wanted to create 'index.js' inside of the 'src' folder. But I got error...
//2. The 'write-message' part doesn't work. Not even finishing loading...

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log(req.method);
  const url = req.url;
  const method = req.method;

  console.log("hello");
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>First Page</title></head>");
    res.write("<body><h1>Hello NODE</h1>");
    res.write("<a href='/read-message'>Read message</a>");
    res.write("<a href='/write-message'>Write message</a>");
    res.write("</body></html>");
    return res.end();
  }

  if (url === "/read-message") {
    return fs.readFile("message.txt", "utf8", (err, data) => {
      if (err) throw err;
      const message = data.split("+").join(" ");
      res.setHeader("Content-Type", "text/html");
      res.write("<h1>" + message + "</h1>");
      return res.end();
    });
  }

  if (url === "/write-message" && method === "POST") {
    res.write("<html>");
    res.write("<head><title>First Page</title></head>");
    res.write(
      '<body><h1>Hello NODE</h1><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("<a href='/read-message'>Read message</a>");
    res.write("<a href='/write-message'>Write message</a>");
    res.write("</html>");
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) throw err;
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  //   if (url === "/read-message") {
  //     return fs.readFile("message.txt", "utf8", (err, data) => {
  //       if (err) throw err;
  //       const message = data.split("+").join(" ");
  //       res.setHeader("Content-Type", "text/html");
  //       res.write("<h1>" + message + "</h1>");
  //       return res.end();
  //     });
  //   }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

const Websocket = require("ws");
const http = require("http")
const path = require("path");
const fs = require("fs")

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    const filePath = path.join(__dirname, "index.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

const wss = new Websocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (event) => {
    const data = JSON.parse(event);

    if (
      data.type === "join" ||
      data.type === "leave" ||
      data.type === "message" ||
      data.type === "typing"
    ) {
      wss.clients.forEach((client) => {
        if (client != ws && client.readyState === Websocket.OPEN)
            client.send(JSON.stringify(data))
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});


server.listen(3000,() => {
  console.log("https://janhae4.github.io/Chat-basic-websocket/")
})
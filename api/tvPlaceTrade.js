import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("msg received from tradingview");
    console.log(req.body);
    const message = req.body;

    // Emit the message to all connected clients
    eventEmitter.emit("message", message);

    res.status(200).json();
  } else if (req.method === "GET") {
    // Set the Content-Type header to text/event-stream
    res.setHeader("Content-Type", "text/event-stream");
    // Set the Cache-Control header to no-cache
    res.setHeader("Cache-Control", "no-cache");

    // Send a "ping" message every 5 seconds to keep the connection alive
    const pingInterval = setInterval(() => {
      res.write(`event: ping\ndata: ${Date.now()}\n\n`);
    }, 5000);

    // Listen for new messages from the event emitter and broadcast them to the client as SSE events
    const handleEvent = (message) => {
      res.write(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
    };
    eventEmitter.on("message", handleEvent);

    // Close the SSE connection if the client closes the connection
    req.on("close", () => {
      clearInterval(pingInterval);
      eventEmitter.off("message", handleEvent);
    });
  } else {
    res.status(400).json({ message: "Unsupported method" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

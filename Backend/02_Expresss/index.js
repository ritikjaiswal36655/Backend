import express from "express"; // Import Express framework
const app = express(); // Create an Express application
import "dotenv/config";
import logger from "./logger.js"; // Import the custom logger
import morgan from "morgan";

const port = process.env.PORT; // Get the port number from environment variables
// �� Logger Middleware
const morganFormat = ":method :url :status :response-time ms"; // Define the log format

app.use(express.json()); // Middleware to parse JSON request bodies

// �� Custom logger middleware
// �� This middleware logs the request method, URL, status code, and response time
app.use(
  morgan(morganFormat, {
    stream: {
      write: message => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3]
        };
        logger.info(JSON.stringify(logObject));
      }
    }
  })
);
// Sample in-memory database (array) to store tea data
let teaData = [];
let nextId = 1; // Counter to assign unique IDs

// ✅ Home Route
app.get("/", (req, res) => {
  res.send("Hello, Express!"); // Responds with a simple text message
});

// ✅ Simple GET Route
app.get("/ice-tea", (req, res) => {
  res.send("Hello, Ice Tea"); // Another test route
});

// ✅ Create a new tea (POST request)
app.post("/teas", (req, res) => {
  logger.info("A Post Request was made!");
  const { name, price } = req.body;

  // 🔹 Validate the request data (name must be a string, price must be a number)
  if (!name || price == null || isNaN(price)) {
    return res.status(400).json({ error: "Invalid name or price" });
  }

  // Create a new tea object with a unique ID
  const newTea = {
    id: nextId++,
    name,
    price: parseFloat(price) // Convert price to a number
  };

  teaData.push(newTea); // Add the new tea to the database
  res.status(201).json(newTea); // Respond with the created tea object
});

// ✅ Get all teas (GET request)
app.get("/teas/list", (req, res) => {
  res.json(teaData); // Send all teas as a JSON response
});

// ✅ Get a specific tea by ID (GET request)
app.get("/teas/:id", (req, res) => {
  const teaId = parseInt(req.params.id); // Convert ID from string to number
  const myTea = teaData.find(tea => tea.id === teaId); // Find the tea with matching ID

  // 🔹 If tea not found, return 404 error
  if (!myTea) {
    return res.status(404).json({ error: "Tea not found" });
  }

  res.json(myTea); // Send the found tea as a response
});

// ✅ Update a tea by ID (PUT request)
app.put("/teas/:id", (req, res) => {
  const teaId = parseInt(req.params.id); // Convert ID from string to number
  const myTea = teaData.find(tea => tea.id === teaId); // Find the tea with matching ID

  // 🔹 If tea not found, return 404 error
  if (!myTea) {
    return res.status(404).json({ error: "Tea not found" });
  }

  const { name, price } = req.body;

  // 🔹 Validate the updated data
  if (!name || price == null || isNaN(price)) {
    return res.status(400).json({ error: "Invalid name or price" });
  }

  // Update tea details
  myTea.name = name;
  myTea.price = parseFloat(price); // Convert price to a number

  res.json(myTea); // Respond with updated tea object
});

// ✅ Delete a tea by ID (DELETE request)
app.delete("/teas/:id", (req, res) => {
  logger.warn("A Delete Request was made!");
  const teaId = parseInt(req.params.id); // Convert ID from string to number
  const myTeaIndex = teaData.findIndex(tea => tea.id === teaId); // Find index of tea with matching ID

  // 🔹 If tea not found, return 404 error
  if (myTeaIndex === -1) {
    return res.status(404).json({ error: "Tea not found" });
  }

  teaData.splice(myTeaIndex, 1); // Remove the tea from the array
  res.status(200).json({ message: "Tea deleted successfully", teaData }); // Respond with success message
});

// ✅ Start the Express server
app.listen(port, () => {
  console.log(`App listening on port ${port}`); // Log message when the server starts
});

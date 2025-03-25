const fs = require("fs"); // Importing the file system module
const path = "./tasks.json"; // Defining the path for the JSON file

// Retrieving command-line arguments
const command = process.argv[2]; // First argument (command)
const argument = process.argv[3]; // Second argument (task item)

// Function to load tasks from the JSON file
const loadTask = () => {
  try {
    const dataBuffer = fs.readFileSync(path); // Reading the file
    const dataJSON = dataBuffer.toString(); // Converting buffer to string
    return JSON.parse(dataJSON); // Parsing JSON data
  } catch (error) {
    return []; // Return an empty array if file doesn't exist or error occurs
  }
};

// Function to save items back to the JSON file
const saveItems = function(items) {
  const dataJSON = JSON.stringify(items); // Converting the array to JSON format
  fs.writeFileSync(path, dataJSON); // Writing JSON data to the file
  console.log("Items updated");
};

// Function to add a new item to the list
const addItem = function(item) {
  const items = loadTask(); // Load existing tasks
  items.push({ item }); // Add new task to the array
  saveItems(items); // Save updated task list to file
};

// Function to display all items in the list
const readList = function() {
  const items = loadTask(); // Load tasks from the file
  items.forEach((item, index) => {
    console.log("At Index " + (index + 1) + ":" + item.item); // Print each task
  });
};

// Function to remove an item from the list
const removeFromList = function(item) {
  const items = loadTask(); // Load existing tasks
  const newItems = items.filter(i => i.item !== item); // Filter out the specified task
  console.log("Item removed");
  saveItems(newItems); // Save updated task list
};

// Handling different command-line inputs
if (command === "add") {
  addItem(argument); // Add a new task
} else if (command === "lists") {
  readList(); // Display all tasks
} else if (command === "remove") {
  removeFromList(argument); // Remove a specific task
} else {
  console.log("Wrong command"); // Handle invalid commands
}

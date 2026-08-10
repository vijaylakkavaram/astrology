const express = require("express");
const path = require("path");
const cors = require("cors");

const kundaliRoute = require("./routes/kundali");

const app = express();

app.use(cors());
app.use(express.json());

// Serve HTML, CSS, JS
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/kundali", kundaliRoute);

try {
  
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
} catch (error) {
  console.error("Error starting the server:", error);
}

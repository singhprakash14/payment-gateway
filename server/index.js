// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const paymentRoutes = require("./Routes/payment");
// const app = express();

// dotenv.config();

// app.use(express.json());
// app.use(cors());

// app.use("/api/payment/", paymentRoutes);

// const port = process.env.PORT || 8082;
// app.listen(port, () => console.log(`Listening on port ${port}...`));




// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import the DB connection function
const paymentRoutes = require("./routes/payment");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB(); // Call the function to connect to the database

// Payment Routes
app.use("/api/payment", paymentRoutes);

// Start the server
const PORT = process.env.PORT || 8082;
connectDB().then(() => {
    app.listen(PORT, () => {
      console.log("Connected to Database");
      console.log("Server is running");
    });
  });
  
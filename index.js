const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const loginRoutes = require("./routes/loginRoutes");
const productRoutes = require("./routes/productRoutes");
const rateRoutes = require("./routes/rateRoutes");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Use account routes
app.use("/", categoryRoutes);
app.use("/subcategories", subCategoryRoutes);
app.use("/vendors", vendorRoutes);
app.use("/api", loginRoutes); // Using login routes
// Use Product Routes
app.use("/products", productRoutes);

app.use("/api", rateRoutes);
// app.use("/api/vendors", vendorRoutes);

// Serve Static Images
app.use("/uploads/images", express.static("uploads/images"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

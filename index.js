const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const loginRoutes = require("./routes/loginRoutes");
const productRoutes = require("./routes/productRoutes");
const rateRoutes = require("./routes/rateRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vendorIdRoute = require("./routes/vendorIdRoutes");
const editProductRoute = require("./routes/editProductRoute");
const statusRoute = require("./routes/statusRoute");
const agentRoutes = require("./routes/agentRoutes");

const addProductRoute = require("./routes/addProductRoute");

const addproducttRoutes = require("./routes/addProductRoute");
const salesRoutes = require("./routes/SaleRoutes");
const invoiceRoutes = require("./routes/invoiceRoute");
const customerRoutes = require("./routes/customerRoute");
const OlditemsRoutes = require("./routes/OlditemsRoutes");

const app = express();
const PORT = 5000;

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

app.use("/orders", orderRoutes);

app.use("/", vendorIdRoute);
app.use("/", editProductRoute);
app.use("/", statusRoute);
app.use("/", agentRoutes);
app.use("/api", addProductRoute);

// app.use("/api/vendors", vendorRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api", salesRoutes);

app.use("/api/invoices", invoiceRoutes);
app.use("/api", OlditemsRoutes);
// Serve Static Images
app.use("/uploads/images", express.static("uploads/images"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

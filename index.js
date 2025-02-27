const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Use account routes
app.use("/", categoryRoutes);
app.use('/subcategories', subCategoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

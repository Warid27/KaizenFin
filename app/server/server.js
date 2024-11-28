const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to the database
const databasePath = path.join(__dirname, "../database/data.json");

// Helper function to read and write the JSON database
function readDatabase() {
  if (!fs.existsSync(databasePath)) {
    return { pemasukan: [], pengeluaran: [], total: [] };
  }
  const rawData = fs.readFileSync(databasePath, "utf-8");
  return JSON.parse(rawData);
}

function writeDatabase(data) {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2), "utf-8");
}

// POST route to save data
app.post("/save-data", (req, res) => {
  const { id, dataName, nama, metode, jumlah } = req.body;

  if (!dataName || !nama || !metode || !jumlah) {
    return res.status(400).send("All fields are required!");
  }

  const newData = {
    id,
    nama,
    metode,
    jumlah: parseFloat(jumlah),
    tanggal: new Date().toLocaleDateString(),
  };

  const database = readDatabase();

  if (dataName === "pemasukan") {
    // Add to "pemasukan" array
    if (!database.pemasukan) database.pemasukan = [];
    database.pemasukan.push(newData);

    // Update "total" with the given ID
    const totalEntry = database.total.find(
      (entry) => entry.id === "data_total"
    );
    if (totalEntry) {
      totalEntry.jumlah += newData.jumlah;
    } else {
      database.total.push({
        id: "data_total",
        nama: "wa",
        jumlah: newData.jumlah,
      });
    }
  } else if (dataName === "pengeluaran") {
    // Add to "pengeluaran" array
    if (!database.pengeluaran) database.pengeluaran = [];
    database.pengeluaran.push(newData);

    // Update "total" with the given ID
    const totalEntry = database.total.find(
      (entry) => entry.id === "data_total"
    );
    if (totalEntry) {
      totalEntry.jumlah -= newData.jumlah;
    } else {
      return res.status(400).send("No total data to deduct from!");
    }
  } else {
    return res.status(400).send("Invalid data name!");
  }

  writeDatabase(database);
  res.send(`Data successfully saved to ${dataName} and updated total.`);
});

// GET route to retrieve data
app.get("/get-data/:dataName", (req, res) => {
  const { dataName } = req.params;
  const database = readDatabase();

  console.log("Requested data type:", dataName); // Log the requested type
  console.log("Database content:", database); // Log the database content

  if (!database[dataName]) {
    return res.status(404).send(`Data with name "${dataName}" not found!`);
  }

  res.json(database[dataName]);
});

// GET route to retrieve only the total amount (jumlah)
app.get("/get-data/total", (req, res) => {
  const database = readDatabase();

  // Find the total entry in the total array
  const totalEntry = database.total.find((entry) => entry.id === "data_total");

  if (totalEntry) {
    console.log("Total Entry found:", totalEntry); // Debugging log
    res.json({ jumlah: totalEntry.jumlah });
  } else {
    console.log("Total entry not found"); // Debugging log
    res.status(404).send("Total data not found!");
  }
});

// PUT route to edit data by ID
app.put("/edit-data/:id", (req, res) => {
  const { id } = req.params;
  const { dataType, nama, metode, jumlah } = req.body;

  if (!dataType || !nama || !metode || !jumlah) {
    return res.status(400).send("All fields are required!");
  }

  const database = readDatabase();
  const dataArray = database[dataType];

  if (!dataArray) {
    return res.status(404).send(`Data with name "${dataType}" not found!`);
  }

  const entryIndex = dataArray.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return res.status(404).send("Data entry not found!");
  }

  // Update the data entry
  dataArray[entryIndex] = {
    ...dataArray[entryIndex],
    nama,
    metode,
    jumlah: parseFloat(jumlah),
    tanggal: new Date().toLocaleDateString(),
  };

  // Update the total if necessary
  const totalEntry = database.total.find((entry) => entry.id === "data_total");
  if (totalEntry) {
    totalEntry.jumlah =
      database.pemasukan.reduce((sum, item) => sum + item.jumlah, 0) -
      database.pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);
  }

  writeDatabase(database);
  res.send(`Data with ID ${id} has been updated successfully.`);
});

// DELETE route to delete data by ID
app.delete("/delete-data/:id", (req, res) => {
  const { id } = req.params;
  const { dataName } = req.query; // Pass dataName as a query parameter (e.g., ?dataName=pemasukan)

  if (!dataName) {
    return res
      .status(400)
      .send("Data name (pemasukan/pengeluaran) is required.");
  }

  const database = readDatabase();
  const dataArray = database[dataName];

  if (!dataArray) {
    return res.status(404).send(`Data with name "${dataName}" not found!`);
  }

  const entryIndex = dataArray.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return res.status(404).send("Data entry not found!");
  }

  // Remove the entry
  const [deletedEntry] = dataArray.splice(entryIndex, 1);

  // Update the total
  const totalEntry = database.total.find((entry) => entry.id === "data_total");
  if (totalEntry) {
    totalEntry.jumlah =
      database.pemasukan.reduce((sum, item) => sum + item.jumlah, 0) -
      database.pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);
  }

  writeDatabase(database);
  res.send(
    `Data with ID ${id} has been deleted successfully. Removed: ${JSON.stringify(
      deletedEntry
    )}`
  );
});

// Static files and home route
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/app", express.static(path.join(__dirname, "../../app")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

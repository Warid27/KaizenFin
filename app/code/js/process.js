// import database from "/app/database/database.js";

// function generateId() {
//     return Math.random().toString(36).substr(2, 9);
// }

// function addData(type, data) {
//     if (type === "pemasukan" || type === "pengeluaran") {
//         const record = { id: generateId(), ...data, tanggal: new Date().toISOString() };
//         database[type].push(record);
//         return record;
//     }
//     throw new Error("Invalid data type");
// }

// function getAllData(type) {
//     if (type === "pemasukan" || type === "pengeluaran") {
//         return database[type];
//     }
//     throw new Error("Invalid data type");
// }

// function deleteData(type, id) {
//     if (type === "pemasukan" || type === "pengeluaran") {
//         const index = database[type].findIndex(item => item.id === id);
//         if (index === -1) throw new Error("Data not found");
//         database[type].splice(index, 1);
//         return true;
//     }
//     throw new Error("Invalid data type");
// }

// export { addData, getAllData, deleteData };

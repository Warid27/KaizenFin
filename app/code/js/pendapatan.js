// import { addData, getAllData, deleteData } from "./process.js";

// function renderTable(type) {
//     const data = getAllData(type);
//     const tableBody = document.querySelector(`.${type} tbody`);
//     tableBody.innerHTML = data.map((item, index) => `
//         <tr>
//             <td>${index + 1}</td>
//             <td>${item.metode}</td>
//             <td>${item.jumlah}</td>
//             <td>${new Date(item.tanggal).toLocaleString()}</td>
//             <td><button onclick="deleteRecord('${type}', '${item.id}')">Hapus</button></td>
//         </tr>
//     `).join('');
// }

// document.getElementById("pemasukan_form").addEventListener("submit", (event) => {
//     event.preventDefault();
//     const metode = document.getElementById("metode_pemasukan").value;
//     const jumlah = parseFloat(document.getElementById("jumlah_pemasukan").value);
//     addData("pemasukan", { metode, jumlah });
//     renderTable("pemasukan");
// });

// window.deleteRecord = function (type, id) {
//     deleteData(type, id);
//     renderTable(type);
// };

// renderTable("pemasukan");
// renderTable("pengeluaran");

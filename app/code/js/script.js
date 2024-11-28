// Function to save data
document.querySelectorAll("form").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = Math.random().toString(36).substr(2, 9); // Create unique ID
    const formId = form.id; // Get form ID
    let dataName = "";
    let nama = "";
    let metode = "";
    let jumlah = 0;

    // Determine which form is submitted and set corresponding dataName
    if (formId === "pemasukan_form") {
      dataName = "pemasukan";
      nama = document.getElementById("nama_pemasukan").value;
      metode = document.getElementById("metode_pemasukan").value;
      jumlah = parseInt(document.getElementById("jumlah_pemasukan").value);
    } else if (formId === "pengeluaran_form") {
      dataName = "pengeluaran";
      nama = document.getElementById("nama_pengeluaran").value;
      metode = document.getElementById("metode_pengeluaran").value;
      jumlah = parseInt(document.getElementById("jumlah_pengeluaran").value);
    }

    // Validate input
    if (!nama || !metode || !jumlah) {
      alert("Semua field wajib diisi!");
      return;
    }

    // Logic for calculating deductions based on metode
    let potongan = 0;
    switch (metode) {
      case "Bank":
        potongan = 500;
        break;
      case "Dana":
        potongan = 200;
        break;
      case "Koperasi":
        potongan = 150;
        break;
      case "PayPal":
        potongan = 400;
        break;
      default:
        potongan = 0;
    }

    // Subtract deduction from the amount
    jumlah -= potongan;

    // Send data to the server
    fetch("http://localhost:3000/save-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, dataName, nama, metode, jumlah }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        form.reset();
        getData(); // Refresh data after saving
      })
      .catch((error) => console.error("Error:", error));
  });
});

function getData(dataType) {
  const tableID = `data-${dataType}`; // Dynamically create the table ID
  const tableBody = document.querySelector(`#${tableID} tbody`); // Get the tbody of the table with that ID

  fetch(`http://localhost:3000/get-data/${dataType}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // Directly use the data array instead of response.data
      tableBody.innerHTML = ""; // Clear any existing rows

      if (data && Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.metode}</td>
            <td>${item.tanggal}</td>
            <td>${item.jumlah.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}</td>
            <td>
              <button onclick="editData('${
                item.id
              }', '${dataType}')">Edit</button>
              <button onclick="deleteData('${
                item.id
              }', '${dataType}')">Hapus</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="6" style="text-align: center;">Tidak ada data.</td>`;
        tableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Gagal mengambil data: ${error.message}`);
    });
}

// Function to calculate total balance
// Function to calculate total balance
function getTotal() {
  fetch("http://localhost:3000/get-data/total")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((response) => {
      // Access the first item in the array and retrieve 'jumlah'
      const total = response[0]?.jumlah;

      // Check if total is a valid number
      if (typeof total === "number" && !isNaN(total)) {
        document.getElementById(
          "totalDisplay"
        ).textContent = `Total: ${total.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })}`;
      } else {
        console.error("Invalid total value:", total);
        alert("Data total tidak valid.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Gagal mengambil data total: ${error.message}`);
    });
}

// Function to edit data
function editData(id, dataType) {
  let nama = prompt("Masukkan nama baru:");
  let metode = prompt("Masukkan metode baru (Dana/Bank/Koperasi/PayPal):");
  let jumlah = parseInt(prompt("Masukkan jumlah baru:"), 10);

  if (!dataType || !nama || !metode || isNaN(jumlah)) {
    alert("Data tidak valid. Semua field wajib diisi!");
    return;
  }

  // Logic for calculating deductions based on metode
  let potongan = 0;
  switch (metode) {
    case "Bank":
      potongan = 500;
      break;
    case "Dana":
      potongan = 200;
      break;
    case "Koperasi":
      potongan = 150;
      break;
    case "PayPal":
      potongan = 400;
      break;
    default:
      potongan = 0;
  }

  switch (dataType) {
    case "pemasukan":
      jumlah -= potongan;
      break;
    case "pengeluaran":
      jumlah += potongan;
      break;

    default:
      break;
  }
  // Subtract deduction from the amount

  fetch(`http://localhost:3000/edit-data/${id}?dataName=${dataType}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dataType, nama, metode, jumlah }),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
      getData(dataType); // Refresh data after update
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Gagal mengupdate data: ${error.message}`);
    });
}

// Function to delete data
function deleteData(id, dataType) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    fetch(`http://localhost:3000/delete-data/${id}?dataName=${dataType}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        getData(dataType); // Refresh data for the correct type
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Gagal menghapus data: ${error.message}`);
      });
  }
}

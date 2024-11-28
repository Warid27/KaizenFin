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

// Function to retrieve data
function getData(dataName) {
  // Pastikan dataName valid
  if (!dataName) {
    console.error("Data name is required.");
    alert("Nama data harus diberikan.");
    return;
  }

  fetch(`http://localhost:3000/get-data/${dataName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const tableBody = document.querySelector("#dataTable tbody");

      // Pastikan elemen tbody ada
      if (!tableBody) {
        console.error("Element #dataTable tbody not found.");
        alert("Tabel tidak ditemukan di halaman.");
        return;
      }

      tableBody.innerHTML = ""; // Clear any existing rows

      if (!Array.isArray(data) || data.length === 0) {
        // Tampilkan pesan jika data kosong
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="6" style="text-align: center;">Tidak ada data.</td>`;
        tableBody.appendChild(row);
        return;
      }

      // Loop data dan buat baris untuk setiap item
      data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.nama || "Tidak diketahui"}</td>
          <td>${item.metode || "Tidak diketahui"}</td>
          <td>${item.tanggal || "Tidak tersedia"}</td>
          <td>${(item.jumlah || 0).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}</td>
          <td>
            <button onclick="editData('${item.id}')">Edit</button>
            <button onclick="deleteData('${item.id}')">Hapus</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Gagal mengambil data: ${error.message}`);
    });
}

// Function to calculate total balance
function getTotal() {
  fetch("http://localhost:3000/get-data/total")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const total = data.reduce((sum, entry) => sum + entry.jumlah, 0);
      document.getElementById("totalDisplay").textContent = `Total: ${total}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Gagal mengambil data total: ${error.message}`);
    });
}

// Function to delete data
function deleteData(id) {
  const dataType = document.getElementById("getDataName").value; // Get data type (pemasukan/pengeluaran)
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    fetch(`http://localhost:3000/delete-data/${id}?dataName=${dataType}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        getData(); // Refresh data after deletion
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Gagal menghapus data: ${error.message}`);
      });
  }
}

// Function to edit data
function editData(id) {
  const dataType = document.getElementById("getDataName").value; // Get data type (pemasukan/pengeluaran)
  const nama = prompt("Masukkan nama baru:");
  const metode = prompt("Masukkan metode baru (Dana/Bank/Koperasi/PayPal):");
  const jumlah = parseInt(prompt("Masukkan jumlah baru:"), 10);

  if (!nama || !metode || isNaN(jumlah)) {
    alert("Data tidak valid. Semua field wajib diisi!");
    return;
  }

  fetch(`http://localhost:3000/edit-data/${id}?dataName=${dataType}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({dataType, nama, metode, jumlah }),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
      getData(); // Refresh data after update
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Gagal mengupdate data: ${error.message}`);
    });
}

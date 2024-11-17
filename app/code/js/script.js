// Mengirimkan data untuk disimpan berdasarkan form yang dikirim
document.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Mencegah pengiriman form secara default
  
      const formName = form.id;  // Mendapatkan ID form untuk mengidentifikasi form mana yang dikirim
      let dataName = '';
      let nama = '';
      let metode = '';
      let jumlah = '';
  
      // Menentukan elemen yang sesuai berdasarkan ID form yang dikirim
      if (formName === 'pemasukan_form') {
        dataName = 'pemasukan';
        nama = document.getElementById('nama_pemasukan').value;
        metode = document.getElementById('metode_pemasukan').value;
        jumlah = document.getElementById('jumlah_pemasukan').value;
      } else if (formName === 'pengeluaran_form') {
        dataName = 'pengeluaran';
        nama = document.getElementById('nama_pengeluaran').value;
        metode = document.getElementById('metode_pengeluaran').value;
        jumlah = document.getElementById('jumlah_pengeluaran').value;
      }
  
      // Validasi form
      if (!nama || !metode || !jumlah) {
        alert('Semua field wajib diisi!');
        return;
      }
  
      // Kirim data ke server
      fetch('http://localhost:3000/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dataName, nama, metode, jumlah })
      })
        .then((response) => response.text())
        .then((data) => {
          alert(data);
          form.reset();  // Reset form setelah berhasil mengirim data
        })
        .catch((error) => console.error('Error:', error));
    });
  });
  
  // Menampilkan data yang tersimpan berdasarkan nama array
  function getData() {
    const dataName = document.getElementById('getDataName').value;
  
    if (!dataName) {
      alert('Silakan masukkan nama data yang ingin dilihat!');
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
        document.getElementById('dataDisplay').textContent = JSON.stringify(data, null, 2);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`Gagal mengambil data: ${error.message}`);
      });
  }
  
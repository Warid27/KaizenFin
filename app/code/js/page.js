// Konfigurasi JSON untuk route dan file yang akan dimuat
const routes = {
  home: "./app/code/html/home.html",
  profil: "./app/code/html/profil.html",
  pengeluaran: "./app/code/html/pengeluaran.html",
  data_total: "./app/code/html/data_total.html",
  pemasukan: "./app/code/html/pemasukan.html",
};

// Fungsi untuk memuat konten dari file HTML ke dalam div#main-content
async function loadPage(page) {
  const filePath = routes[page] || routes["home"]; // Default ke 'home'
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("File not found");
    const html = await response.text();
    document.getElementById("main-content").innerHTML = html;
  } catch (error) {
    document.getElementById(
      "main-content"
    ).innerHTML = `<p>Error loading page: ${error.message}</p>`;
  }
}

// Fungsi untuk memuat NavBar
async function loadNavBar() {
  try {
    const response = await fetch("app/code/html/navbar.html");
    if (!response.ok) throw new Error("NavBar not found");
    const html = await response.text();
    document.getElementById("navbar").innerHTML = html;

    // Setelah navbar dimuat, atur kelas aktif
    highlightActiveLink();
  } catch (error) {
    document.getElementById(
      "navbar"
    ).innerHTML = `<p>Error loading NavBar: ${error.message}</p>`;
  }
}

// Fungsi untuk menambahkan kelas aktif ke menu navigasi
function highlightActiveLink() {
  const navLinks = document.querySelectorAll("#navbar a"); // Mengambil semua link di navbar
  navLinks.forEach((link) => {
    const hrefPage = new URLSearchParams(link.href.split("?")[1]).get("page");
    if (hrefPage === page) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Mendapatkan parameter `page` dari URL
const params = new URLSearchParams(window.location.search);
const page = params.get("page") || "home";

// Memuat konten sesuai dengan parameter
loadPage(page);
loadNavBar();

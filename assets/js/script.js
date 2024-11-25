function showToast(message, type = 'success') {
    console.log("Toast Message:", message, "Type:", type); // Debug log
    const toastElement = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    if (!toastElement || !toastMessage) {
        console.error("Elemen toast tidak ditemukan!");
        return;
    }

    // Set pesan dan tipe warna berdasarkan jenis notifikasi
    toastMessage.textContent = message;

    if (type === 'success') {
        toastElement.classList.remove('bg-danger');
        toastElement.classList.add('bg-success');
    } else if (type === 'error') {
        toastElement.classList.remove('bg-success');
        toastElement.classList.add('bg-danger');
    }

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Fungsi untuk menyimpan data pengguna saat registrasi
function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Cek apakah email sudah terdaftar
    const isEmailExists = users.some(user => user.email === email);
    if (isEmailExists) {
        showToast("Email sudah terdaftar. Silakan gunakan email lain.", "error");
        return false;
    }

    const registrationDate = new Date().toLocaleDateString("id-ID");
    const user = { name, email, password, registrationDate };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    showToast("Registrasi berhasil! Silakan login.", "success");
    return true;
}

// Event listener untuk halaman register
if (window.location.pathname.includes("register.html")) {
    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let errorMessage = "";
        if (!name) {
            errorMessage = "Harap isi kolom nama.";
            showToast(errorMessage, "error");
            return;
        } else if (!email) {
            errorMessage = "Harap isi kolom email.";
            showToast(errorMessage, "error");
            return;
        } else if (!password) {
            errorMessage = "Harap isi kolom password.";
            showToast(errorMessage, "error");
            return;
        }

        if (registerUser(name, email, password)) {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    });
}

// Fungsi untuk validasi login pengguna
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", email);
        return true;
    }
    return false;
}

// Event listener untuk login
if (window.location.pathname.includes("login.html")) {
    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let errorMessage = "";
        if (!email) {
            errorMessage = "Harap isi kolom email.";
            showToast(errorMessage, "error");
            return;
        } else if (!password) {
            errorMessage = "Harap isi kolom password.";
            showToast(errorMessage, "error");
            return;
        }

        if (loginUser(email, password)) {
            showToast("Login berhasil!", "success");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const isEmailRegistered = users.some(user => user.email === email);
            if (!isEmailRegistered) {
                showToast("Email belum terdaftar.", "error");
            } else {
                showToast("Password salah.", "error");
            }
        }
    });
}

// Cek apakah pengguna sudah login
window.addEventListener("DOMContentLoaded", function () {
    const loggedInEmail = localStorage.getItem("loggedInUser");

    if (!loggedInEmail) {
        alert("Anda harus login terlebih dahulu.");
        window.location.href = "login.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === loggedInEmail);

    if (user) {
        document.getElementById("userNameDisplay").textContent = user.name;
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userRegDate").textContent = user.registrationDate;
    } else {
        alert("Data pengguna tidak ditemukan.");
    }
});

// Event listener untuk tombol top-up
document.querySelectorAll('.btn-primary[data-bs-toggle="modal"]').forEach(button => {
    button.addEventListener('click', function () {
        const game = this.getAttribute('data-game');
        document.getElementById('gameTitle').textContent = game;

        const topUpAmountSelect = document.getElementById('topUpAmount');
        const topUpAmountLabel = document.querySelector('label[for="topUpAmount"]');

        const gameOptions = {
            "Mobile Legends": ["10 Diamonds", "20 Diamonds", "50 Diamonds", "100 Diamonds"],
            "PUBG Mobile": ["20 UC", "50 UC", "100 UC", "200 UC"],
            "Free Fire": ["10 Diamonds", "20 Diamonds", "50 Diamonds", "100 Diamonds"],
            "Valorant": ["300 Points", "600 Points", "900 Points", "1200 Points"],
            "Genshin Impact": ["160 Primogems", "320 Primogems", "640 Primogems", "1280 Primogems"],
            "Call of Duty": ["160 CP", "320 CP", "640 CP", "1280 CP"]
        };

        const defaultGame = "10";

        if (gameOptions[game]) {
            topUpAmountLabel.textContent = `Pilih jumlah top-up yang Anda inginkan (${gameOptions[game][0].split(' ')[1]}):`;
            topUpAmountSelect.innerHTML = gameOptions[game]
                .map(option => `<option value="${option.split(' ')[0]}">${option}</option>`)
                .join('');
        } else {
            topUpAmountLabel.textContent = "Pilih jumlah top-up yang Anda inginkan:";
        }
    });
});

// Event listener untuk konfirmasi top-up
document.getElementById('confirmTopUp').addEventListener('click', function () {
    const game = document.getElementById('gameTitle').textContent;
    const amount = document.getElementById('topUpAmount').value;

    alert(`Top-Up untuk ${game} sebanyak ${amount} telah berhasil!`);

    const modal = bootstrap.Modal.getInstance(document.getElementById('topUpModal'));
    modal.hide();
});

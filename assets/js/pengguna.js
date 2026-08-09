```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   USER MANAGEMENT ENGINE V3 FINAL
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("USER MANAGEMENT ENGINE V3 FINAL");
    console.log("====================================");

    loadUsers();
    setupSearch();
    setupMobileMenu();
    setupLogout();
    loadAdminProfile();

});


/* =====================================================
   LOAD DATABASE USERS
===================================================== */

async function loadUsers() {

    var tableBody = document.getElementById("userTableBody");

    if (!tableBody) {
        console.error("Element userTableBody tidak ditemukan.");
        return;
    }

    console.log("Membaca database pengguna...");

    try {

        var response = await fetch("data/users.json", {
            cache: "no-store"
        });

        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " - " +
                response.statusText
            );

        }

        var text = await response.text();

        if (!text.trim()) {
            throw new Error("users.json kosong.");
        }

        var users;

        try {

            users = JSON.parse(text);

        } catch (jsonError) {

            console.error("Isi users.json tidak valid.");
            console.error(text);

            throw new Error(
                "users.json bukan JSON yang valid."
            );

        }

        if (!Array.isArray(users)) {

            throw new Error(
                "Format users.json harus berupa array."
            );

        }

        console.log(
            "Berhasil membaca " +
            users.length +
            " pengguna."
        );

        window.plazaUsers = users;

        updateUserStatistics(users);

        renderUsers(users);

    }

    catch (error) {

        console.error(
            "Gagal membaca database pengguna:",
            error
        );

        tableBody.innerHTML =
            '<tr>' +
                '<td colspan="7" class="text-center py-4 text-danger">' +
                    '<i class="fa-solid fa-triangle-exclamation"></i> ' +
                    'Gagal membaca database pengguna.' +
                '</td>' +
            '</tr>';

    }

}


/* =====================================================
   UPDATE STATISTIK
===================================================== */

function updateUserStatistics(users) {

    var totalUsers =
        users.length;

    var totalAdmin =
        users.filter(function (user) {

            return user.role === "Administrator";

        }).length;

    var totalUmkm =
        users.filter(function (user) {

            return (
                user.role === "Pelaku UMKM" ||
                user.role === "UMKM"
            );

        }).length;

    var totalDesa =
        users.filter(function (user) {

            return (
                user.role === "Admin Desa" ||
                user.role === "Desa"
            );

        }).length;


    setValue(
        "totalUsers",
        totalUsers
    );

    setValue(
        "totalAdmin",
        totalAdmin
    );

    setValue(
        "totalUmkm",
        totalUmkm
    );

    setValue(
        "totalDesa",
        totalDesa
    );


    console.log("Statistik pengguna diperbarui.");

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderUsers(users) {

    var tableBody =
        document.getElementById(
            "userTableBody"
        );

    if (!tableBody) {
        return;
    }


    if (!users.length) {

        tableBody.innerHTML =
            '<tr>' +
                '<td colspan="7" class="text-center py-4">' +
                    '<i class="fa-solid fa-users-slash"></i> ' +
                    'Belum ada pengguna.' +
                '</td>' +
            '</tr>';

        return;
    }


    var html = "";


    users.forEach(function (user, index) {

        var status =
            user.status || "Aktif";


        var statusClass =
            "text-success";


        if (
            status.toLowerCase() !== "aktif"
        ) {

            statusClass =
                "text-danger";

        }


        html +=
            '<tr>' +

                '<td>' +
                    (index + 1) +
                '</td>' +

                '<td>' +
                    '<strong>' +
                        escapeHtml(user.nama) +
                    '</strong>' +
                '</td>' +

                '<td>' +
                    escapeHtml(user.username) +
                '</td>' +

                '<td>' +
                    '<span class="user-role">' +
                        escapeHtml(user.role) +
                    '</span>' +
                '</td>' +

                '<td>' +
                    escapeHtml(
                        user.unit || "-"
                    ) +
                '</td>' +

                '<td>' +

                    '<span class="' +
                        statusClass +
                    '">' +

                        '<i class="fa-solid fa-circle"></i> ' +

                        escapeHtml(status) +

                    '</span>' +

                '</td>' +

                '<td>' +

                    '<button ' +
                        'type="button" ' +
                        'class="btn btn-sm btn-outline-primary me-1" ' +
                        'onclick="editUser(' +
                            user.id +
                        ')" ' +
                        'title="Edit Pengguna">' +

                        '<i class="fa-solid fa-pen"></i>' +

                    '</button>' +

                    '<button ' +
                        'type="button" ' +
                        'class="btn btn-sm btn-outline-danger" ' +
                        'onclick="deleteUser(' +
                            user.id +
                        ')" ' +
                        'title="Hapus Pengguna">' +

                        '<i class="fa-solid fa-trash"></i>' +

                    '</button>' +

                '</td>' +

            '</tr>';

    });


    tableBody.innerHTML =
        html;


    console.log(
        "Tabel pengguna berhasil ditampilkan."
    );

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    var searchInput =
        document.getElementById(
            "searchUser"
        );

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            var keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();


            var users =
                window.plazaUsers || [];


            var filteredUsers =
                users.filter(function (user) {

                    var text =
                        (user.nama || "") +
                        " " +
                        (user.username || "") +
                        " " +
                        (user.role || "") +
                        " " +
                        (user.unit || "") +
                        " " +
                        (user.status || "");


                    return text
                        .toLowerCase()
                        .includes(keyword);

                });


            renderUsers(
                filteredUsers
            );

        }
    );

}


/* =====================================================
   HELPER SET VALUE
===================================================== */

function setValue(id, value) {

    var element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   EDIT USER
===================================================== */

function editUser(id) {

    var users =
        window.plazaUsers || [];


    var user =
        users.find(function (item) {

            return item.id === id;

        });


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;
    }


    alert(
        "EDIT PENGGUNA\n\n" +
        "Nama: " +
        user.nama +
        "\nUsername: " +
        user.username +
        "\nRole: " +
        user.role +
        "\nUnit: " +
        (user.unit || "-") +
        "\nStatus: " +
        (user.status || "Aktif")
    );

}


/* =====================================================
   DELETE USER
===================================================== */

function deleteUser(id) {

    var users =
        window.plazaUsers || [];


    var user =
        users.find(function (item) {

            return item.id === id;

        });


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;
    }


    alert(
        'Pengguna "' +
        user.nama +
        '" siap untuk dihapus.\n\n' +
        "Fitur penghapusan permanen akan " +
        "diaktifkan setelah sistem CRUD selesai."
    );

}


/* =====================================================
   LOAD ADMIN PROFILE
===================================================== */

function loadAdminProfile() {

    var adminName =
        sessionStorage.getItem(
            "plazaAdminName"
        );


    if (!adminName) {
        return;
    }


    var profileName =
        document.querySelector(
            ".profile-info strong"
        );


    if (profileName) {

        profileName.textContent =
            adminName;

    }

}


/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {

    var button =
        document.getElementById(
            "mobileMenuBtn"
        );


    var sidebar =
        document.getElementById(
            "sidebar"
        );


    var overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (
        !button ||
        !sidebar ||
        !overlay
    ) {

        return;
    }


    button.addEventListener(
        "click",
        function () {

            sidebar.classList.add(
                "show"
            );

            overlay.classList.add(
                "show"
            );

        }
    );


    overlay.addEventListener(
        "click",
        function () {

            sidebar.classList.remove(
                "show"
            );

            overlay.classList.remove(
                "show"
            );

        }
    );


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.addEventListener(
                "click",
                function () {

                    sidebar.classList.remove(
                        "show"
                    );

                    overlay.classList.remove(
                        "show"
                    );

                }
            );

        });

}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    var logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            sessionStorage.removeItem(
                "plazaAdminLogin"
            );


            sessionStorage.removeItem(
                "plazaAdminName"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
```

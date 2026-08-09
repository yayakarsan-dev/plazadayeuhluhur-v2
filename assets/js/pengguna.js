```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   USER MANAGEMENT ENGINE V3
   FINAL - STABIL
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("User Management Engine V3 aktif");
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

    var tableBody =
        document.getElementById("userTableBody");

    if (!tableBody) {

        console.error(
            "Element userTableBody tidak ditemukan."
        );

        return;
    }

    try {

        console.log(
            "Membaca database pengguna..."
        );


        var response = await fetch(
            "data/users.json",
            {
                cache: "no-store"
            }
        );


        /* =============================================
           CEK RESPONSE SERVER
        ============================================= */

        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " - " +
                response.statusText
            );

        }


        console.log(
            "users.json berhasil ditemukan."
        );


        /* =============================================
           BACA TEXT
        ============================================= */

        var text =
            await response.text();


        if (!text.trim()) {

            throw new Error(
                "users.json kosong."
            );

        }


        /* =============================================
           PARSE JSON
        ============================================= */

        var users;

        try {

            users =
                JSON.parse(text);

        }

        catch (jsonError) {

            console.error(
                "Isi users.json tidak valid:"
            );

            console.error(
                text.substring(0, 500)
            );

            throw new Error(
                "users.json bukan JSON yang valid."
            );

        }


        /* =============================================
           PASTIKAN ARRAY
        ============================================= */

        if (!Array.isArray(users)) {

            throw new Error(
                "Format users.json harus berupa array."
            );

        }


        console.log(
            "Jumlah pengguna: " +
            users.length
        );


        /* =============================================
           SIMPAN GLOBAL
        ============================================= */

        window.plazaUsers = users;


        /* =============================================
           UPDATE STATISTIK
        ============================================= */

        updateUserStatistics(users);


        /* =============================================
           TAMPILKAN DATA
        ============================================= */

        renderUsers(users);


        console.log(
            "✓ Database pengguna berhasil ditampilkan."
        );

    }

    catch (error) {

        console.error(
            "✗ GAGAL MEMBACA DATABASE PENGGUNA"
        );

        console.error(error);


        tableBody.innerHTML =

            '<tr>' +

                '<td colspan="7" ' +
                    'class="text-center py-4 text-danger">' +

                    '<i class="fa-solid fa-triangle-exclamation"></i>' +

                    '<br><br>' +

                    '<strong>Gagal membaca database pengguna.</strong>' +

                    '<br>' +

                    escapeHtml(error.message) +

                '</td>' +

            '</tr>';

    }

}


/* =====================================================
   UPDATE STATISTIK PENGGUNA
===================================================== */

function updateUserStatistics(users) {


    /* =============================================
       TOTAL PENGGUNA
    ============================================= */

    setValue(
        "totalUsers",
        users.length
    );


    /* =============================================
       ADMINISTRATOR
    ============================================= */

    var totalAdmin =
        users.filter(function (user) {

            return user.role === "Administrator";

        }).length;


    setValue(
        "totalAdmin",
        totalAdmin
    );


    /* =============================================
       UMKM
    ============================================= */

    var totalUmkm =
        users.filter(function (user) {

            return (
                user.role === "Pelaku UMKM" ||
                user.role === "UMKM"
            );

        }).length;


    setValue(
        "totalUmkm",
        totalUmkm
    );


    /* =============================================
       ADMIN DESA
    ============================================= */

    var totalDesa =
        users.filter(function (user) {

            return (
                user.role === "Admin Desa" ||
                user.role === "Desa"
            );

        }).length;


    setValue(
        "totalDesa",
        totalDesa
    );

}


/* =====================================================
   RENDER USER TABLE
===================================================== */

function renderUsers(users) {

    var tableBody =
        document.getElementById(
            "userTableBody"
        );


    if (!tableBody) {

        return;

    }


    /* =============================================
       JIKA TIDAK ADA DATA
    ============================================= */

    if (!users.length) {

        tableBody.innerHTML =

            '<tr>' +

                '<td colspan="7" ' +
                    'class="text-center py-4">' +

                    '<i class="fa-solid fa-users-slash"></i>' +

                    '<br><br>' +

                    'Belum ada pengguna.'

                + '</td>' +

            '</tr>';

        return;

    }


    /* =============================================
       BUAT BARIS TABEL
    ============================================= */

    var html = "";


    users.forEach(function (user, index) {


        var status =
            user.status || "Aktif";


        var statusClass =
            status.toLowerCase() === "aktif"
                ? "text-success"
                : "text-danger";


        html +=

            '<tr>' +


                /* NO */

                '<td>' +
                    (index + 1) +
                '</td>' +


                /* NAMA */

                '<td>' +

                    '<strong>' +

                        escapeHtml(
                            user.nama || "-"
                        ) +

                    '</strong>' +

                '</td>' +


                /* USERNAME */

                '<td>' +

                    escapeHtml(
                        user.username || "-"
                    ) +

                '</td>' +


                /* ROLE */

                '<td>' +

                    '<span class="user-role">' +

                        escapeHtml(
                            user.role || "-"
                        ) +

                    '</span>' +

                '</td>' +


                /* UNIT */

                '<td>' +

                    escapeHtml(
                        user.unit || "-"
                    ) +

                '</td>' +


                /* STATUS */

                '<td>' +

                    '<span class="' +
                        statusClass +
                    '">' +

                        '<i class="fa-solid fa-circle"></i> ' +

                        escapeHtml(
                            status
                        ) +

                    '</span>' +

                '</td>' +


                /* AKSI */

                '<td>' +

                    '<button ' +
                        'type="button" ' +
                        'class="btn btn-sm btn-outline-primary me-1" ' +
                        'onclick="editUser(' +
                            Number(user.id) +
                        ')" ' +
                        'title="Edit Pengguna">' +

                        '<i class="fa-solid fa-pen"></i>' +

                    '</button>' +


                    '<button ' +
                        'type="button" ' +
                        'class="btn btn-sm btn-outline-danger" ' +
                        'onclick="deleteUser(' +
                            Number(user.id) +
                        ')" ' +
                        'title="Hapus Pengguna">' +

                        '<i class="fa-solid fa-trash"></i>' +

                    '</button>' +

                '</td>' +


            '</tr>';

    });


    tableBody.innerHTML =
        html;

}


/* =====================================================
   SEARCH USER
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

            return Number(item.id) === Number(id);

        });


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    alert(

        "Edit Pengguna\n\n" +

        "Nama: " +
        (user.nama || "-") +

        "\nUsername: " +
        (user.username || "-") +

        "\nRole: " +
        (user.role || "-") +

        "\nUnit: " +
        (user.unit || "-") +

        "\nStatus: " +
        (user.status || "-")

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

            return Number(item.id) === Number(id);

        });


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    alert(

        "Pengguna \"" +
        (user.nama || "-") +
        "\" siap untuk dihapus.\n\n" +

        "Fitur hapus permanen akan kita aktifkan " +
        "setelah sistem CRUD database selesai."

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
   MOBILE SIDEBAR
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

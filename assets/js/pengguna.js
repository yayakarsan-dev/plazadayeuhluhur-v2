/* =====================================================
   PLAZA DAYEUHLUHUR
   USER MANAGEMENT ENGINE V4
   CRUD + LOCAL STORAGE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("USER MANAGEMENT ENGINE V4");
    console.log("====================================");

    loadUsers();
    setupSearch();
    setupAddUser();
    setupUserForm();
    setupMobileMenu();
    setupLogout();
    loadAdminProfile();

});


/* =====================================================
   KONFIGURASI
===================================================== */

var USER_STORAGE_KEY = "plazaUsers";


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


    console.log(
        "Memeriksa database pengguna..."
    );


    /*
       PRIORITAS 1
       Baca data dari localStorage
    */

    var savedUsers =
        localStorage.getItem(
            USER_STORAGE_KEY
        );


    if (savedUsers) {

        try {

            var localUsers =
                JSON.parse(savedUsers);


            if (Array.isArray(localUsers)) {

                console.log(
                    "Database lokal ditemukan: " +
                    localUsers.length +
                    " pengguna."
                );


                window.plazaUsers =
                    localUsers;


                updateUserStatistics(
                    localUsers
                );


                renderUsers(
                    localUsers
                );


                return;

            }

        }

        catch (error) {

            console.warn(
                "Data localStorage tidak valid."
            );

        }

    }


    /*
       PRIORITAS 2
       Jika belum ada localStorage,
       baca users.json
    */

    console.log(
        "Membaca data/users.json..."
    );


    try {

        var response =
            await fetch(
                "data/users.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " - " +
                response.statusText
            );

        }


        var text =
            await response.text();


        if (!text.trim()) {

            throw new Error(
                "users.json kosong."
            );

        }


        var users;


        try {

            users =
                JSON.parse(text);

        }

        catch (jsonError) {

            console.error(
                "Isi users.json tidak valid:"
            );

            console.error(text);

            throw new Error(
                "users.json bukan JSON valid."
            );

        }


        if (!Array.isArray(users)) {

            throw new Error(
                "Format users.json harus berupa array."
            );

        }


        /*
           Simpan database awal
           ke localStorage
        */

        localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(users)
        );


        window.plazaUsers =
            users;


        console.log(
            "Berhasil membaca " +
            users.length +
            " pengguna."
        );


        updateUserStatistics(
            users
        );


        renderUsers(
            users
        );

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


    console.log(
        "Statistik pengguna diperbarui."
    );

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
            status.toLowerCase() === "aktif"
                ? "text-success"
                : "text-danger";


        html +=
            '<tr>' +

                '<td>' +
                    (index + 1) +
                '</td>' +


                '<td>' +

                    '<strong>' +
                        escapeHtml(
                            user.nama
                        ) +
                    '</strong>' +

                '</td>' +


                '<td>' +
                    escapeHtml(
                        user.username
                    ) +
                '</td>' +


                '<td>' +

                    '<span class="user-role">' +

                        escapeHtml(
                            user.role
                        ) +

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

                        escapeHtml(
                            status
                        ) +

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
   TAMBAH PENGGUNA
===================================================== */

function setupAddUser() {

    var button =
        document.getElementById(
            "addUserButton"
        );


    if (!button) {

        console.warn(
            "Tombol Tambah Pengguna tidak ditemukan."
        );

        return;

    }


    button.addEventListener(
        "click",
        function () {

            openAddUserModal();

        }
    );

}


/* =====================================================
   BUKA MODAL TAMBAH
===================================================== */

function openAddUserModal() {

    var form =
        document.getElementById(
            "userForm"
        );


    if (form) {

        form.reset();

    }


    setValue(
        "userId",
        ""
    );


    var userId =
        document.getElementById(
            "userId"
        );


    if (userId) {

        userId.value = "";

    }


    var title =
        document.getElementById(
            "userModalTitle"
        );


    if (title) {

        title.textContent =
            "Tambah Pengguna";

    }


    var modalElement =
        document.getElementById(
            "userModal"
        );


    if (!modalElement) {

        alert(
            "Modal pengguna tidak ditemukan."
        );

        return;

    }


    var modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* =====================================================
   FORM TAMBAH / EDIT
===================================================== */

function setupUserForm() {

    var form =
        document.getElementById(
            "userForm"
        );


    if (!form) {

        console.warn(
            "Form userForm tidak ditemukan."
        );

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            saveUser();

        }
    );

}


/* =====================================================
   SIMPAN PENGGUNA
===================================================== */

function saveUser() {

    var users =
        window.plazaUsers || [];


    var idElement =
        document.getElementById(
            "userId"
        );


    var namaElement =
        document.getElementById(
            "userNama"
        );


    var usernameElement =
        document.getElementById(
            "userUsername"
        );


    var roleElement =
        document.getElementById(
            "userRole"
        );


    var unitElement =
        document.getElementById(
            "userUnit"
        );


    var statusElement =
        document.getElementById(
            "userStatus"
        );


    if (
        !namaElement ||
        !usernameElement ||
        !roleElement ||
        !unitElement ||
        !statusElement
    ) {

        alert(
            "Form pengguna tidak lengkap."
        );

        return;

    }


    var id =
        idElement
            ? idElement.value
            : "";


    var nama =
        namaElement.value.trim();


    var username =
        usernameElement.value
            .trim()
            .toLowerCase();


    var role =
        roleElement.value;


    var unit =
        unitElement.value.trim();


    var status =
        statusElement.value;


    /*
       VALIDASI
    */

    if (!nama) {

        alert(
            "Nama lengkap wajib diisi."
        );

        namaElement.focus();

        return;

    }


    if (!username) {

        alert(
            "Username wajib diisi."
        );

        usernameElement.focus();

        return;

    }


    if (!role) {

        alert(
            "Silakan pilih role pengguna."
        );

        roleElement.focus();

        return;

    }


    /*
       CEK USERNAME DUPLIKAT
    */

    var duplicate =
        users.some(function (user) {

            return (
                user.username &&
                user.username.toLowerCase() === username &&
                String(user.id) !== String(id)
            );

        });


    if (duplicate) {

        alert(
            "Username \"" +
            username +
            "\" sudah digunakan.\n\n" +
            "Silakan gunakan username lain."
        );

        usernameElement.focus();

        return;

    }


    /*
       EDIT DATA
    */

    if (id) {

        var userIndex =
            users.findIndex(
                function (user) {

                    return String(user.id) ===
                        String(id);

                }
            );


        if (userIndex === -1) {

            alert(
                "Data pengguna tidak ditemukan."
            );

            return;

        }


        users[userIndex].nama =
            nama;

        users[userIndex].username =
            username;

        users[userIndex].role =
            role;

        users[userIndex].unit =
            unit;

        users[userIndex].status =
            status;


        alert(
            "Data pengguna berhasil diperbarui."
        );

    }


    /*
       TAMBAH DATA BARU
    */

    else {

        var newId =
            generateUserId(
                users
            );


        var newUser = {

            id: newId,

            nama: nama,

            username: username,

            role: role,

            unit: unit,

            status: status

        };


        users.push(
            newUser
        );


        alert(
            "Pengguna baru berhasil ditambahkan."
        );

    }


    /*
       SIMPAN
    */

    window.plazaUsers =
        users;


    localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(users)
    );


    /*
       REFRESH TAMPILAN
    */

    updateUserStatistics(
        users
    );


    renderUsers(
        users
    );


    /*
       TUTUP MODAL
    */

    closeUserModal();

}


/* =====================================================
   GENERATE ID
===================================================== */

function generateUserId(users) {

    if (!users.length) {

        return 1;

    }


    var maxId = 0;


    users.forEach(function (user) {

        var id =
            parseInt(
                user.id,
                10
            );


        if (
            !isNaN(id) &&
            id > maxId
        ) {

            maxId = id;

        }

    });


    return maxId + 1;

}


/* =====================================================
   EDIT USER
===================================================== */

function editUser(id) {

    var users =
        window.plazaUsers || [];


    var user =
        users.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    var idElement =
        document.getElementById(
            "userId"
        );


    var namaElement =
        document.getElementById(
            "userNama"
        );


    var usernameElement =
        document.getElementById(
            "userUsername"
        );


    var roleElement =
        document.getElementById(
            "userRole"
        );


    var unitElement =
        document.getElementById(
            "userUnit"
        );


    var statusElement =
        document.getElementById(
            "userStatus"
        );


    if (idElement) {

        idElement.value =
            user.id;

    }


    if (namaElement) {

        namaElement.value =
            user.nama || "";

    }


    if (usernameElement) {

        usernameElement.value =
            user.username || "";

    }


    if (roleElement) {

        roleElement.value =
            user.role || "";

    }


    if (unitElement) {

        unitElement.value =
            user.unit || "";

    }


    if (statusElement) {

        statusElement.value =
            user.status || "Aktif";

    }


    var title =
        document.getElementById(
            "userModalTitle"
        );


    if (title) {

        title.textContent =
            "Edit Pengguna";

    }


    var modalElement =
        document.getElementById(
            "userModal"
        );


    if (!modalElement) {

        return;

    }


    var modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* =====================================================
   TUTUP MODAL
===================================================== */

function closeUserModal() {

    var modalElement =
        document.getElementById(
            "userModal"
        );


    if (!modalElement) {

        return;

    }


    var modal =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (modal) {

        modal.hide();

    }

}


/* =====================================================
   DELETE USER
===================================================== */

function deleteUser(id) {

    var users =
        window.plazaUsers || [];


    var user =
        users.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    /*
       KONFIRMASI
    */

    var confirmed =
        confirm(
            'Apakah Anda yakin ingin menghapus pengguna "' +
            user.nama +
            '"?\n\n' +
            "Data yang dihapus tidak dapat dikembalikan."
        );


    if (!confirmed) {

        return;

    }


    /*
       HAPUS
    */

    var newUsers =
        users.filter(
            function (item) {

                return String(item.id) !==
                    String(id);

            }
        );


    window.plazaUsers =
        newUsers;


    localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(newUsers)
    );


    /*
       UPDATE TAMPILAN
    */

    updateUserStatistics(
        newUsers
    );


    renderUsers(
        newUsers
    );


    alert(
        "Pengguna berhasil dihapus."
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
                users.filter(
                    function (user) {

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
                            .includes(
                                keyword
                            );

                    }
                );


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
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

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
        .forEach(
            function (item) {

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

            }
        );

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

    return String(
        value == null
            ? ""
            : value
    )

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
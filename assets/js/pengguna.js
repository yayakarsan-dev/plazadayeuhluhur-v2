```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   USER MANAGEMENT ENGINE V3
   CRUD LOCAL STORAGE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("User Management Engine V3 aktif");
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

const USER_STORAGE_KEY =
    "plazaDayeuhluhurUsers";


/* =====================================================
   LOAD USERS
===================================================== */

async function loadUsers() {

    const tableBody =
        document.getElementById("userTableBody");

    if (!tableBody) {

        console.error(
            "Element userTableBody tidak ditemukan."
        );

        return;
    }

    try {

        /*
           CEK LOCAL STORAGE TERLEBIH DAHULU
        */

        const savedUsers =
            localStorage.getItem(
                USER_STORAGE_KEY
            );


        if (savedUsers) {

            const users =
                JSON.parse(savedUsers);

            window.plazaUsers = users;

            console.log(
                "✓ Data pengguna dimuat dari localStorage:",
                users
            );

            updateUserStatistics(users);

            renderUsers(users);

            return;
        }


        /*
           JIKA BELUM ADA LOCAL STORAGE
           BACA users.json
        */

        console.log(
            "Membaca database awal users.json..."
        );


        const response =
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


        const text =
            await response.text();


        if (!text.trim()) {

            throw new Error(
                "users.json kosong."
            );

        }


        let users;


        try {

            users =
                JSON.parse(text);

        }

        catch (error) {

            console.error(
                "Isi users.json:",
                text.substring(0, 300)
            );

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
           SIMPAN KE GLOBAL
        */

        window.plazaUsers = users;


        /*
           SIMPAN SALINAN KE LOCAL STORAGE
        */

        localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(users)
        );


        console.log(
            "✓ Database awal berhasil dimuat:",
            users.length,
            "pengguna"
        );


        updateUserStatistics(users);

        renderUsers(users);

    }


    catch (error) {

        console.error(
            "✗ Gagal membaca database pengguna:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td colspan="7"
                    class="text-center py-4 text-danger">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    Gagal membaca database pengguna.

                </td>

            </tr>

        `;

    }

}


/* =====================================================
   STATISTIK
===================================================== */

function updateUserStatistics(users) {

    setValue(
        "totalUsers",
        users.length
    );


    const totalAdmin =
        users.filter(function (user) {

            return user.role === "Administrator";

        }).length;


    setValue(
        "totalAdmin",
        totalAdmin
    );


    const totalUmkm =
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


    const totalDesa =
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
   RENDER USERS
===================================================== */

function renderUsers(users) {

    const tableBody =
        document.getElementById(
            "userTableBody"
        );


    if (!tableBody) return;


    if (!users.length) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7"
                    class="text-center py-4">

                    <i class="fa-solid fa-users-slash"></i>

                    Belum ada pengguna.

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML =
        users.map(function (user, index) {

            const status =
                user.status || "Aktif";


            const statusClass =
                status.toLowerCase() === "aktif"
                    ? "text-success"
                    : "text-danger";


            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <strong>
                            ${escapeHtml(user.nama)}
                        </strong>

                    </td>


                    <td>
                        ${escapeHtml(user.username)}
                    </td>


                    <td>

                        <span class="user-role">

                            ${escapeHtml(user.role)}

                        </span>

                    </td>


                    <td>
                        ${escapeHtml(user.unit || "-")}
                    </td>


                    <td>

                        <span class="${statusClass}">

                            <i class="fa-solid fa-circle"></i>

                            ${escapeHtml(status)}

                        </span>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            onclick="editUser(${user.id})"
                            title="Edit Pengguna">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="btn btn-sm btn-outline-warning"
                            onclick="toggleUserStatus(${user.id})"
                            title="Ubah Status">

                            <i class="fa-solid fa-power-off"></i>

                        </button>


                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            onclick="deleteUser(${user.id})"
                            title="Hapus Pengguna">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


/* =====================================================
   TAMBAH PENGGUNA
===================================================== */

function setupAddUser() {

    const button =
        document.getElementById(
            "addUserButton"
        );


    if (!button) {

        console.warn(
            "Tombol addUserButton tidak ditemukan."
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

    const form =
        document.getElementById(
            "userForm"
        );


    if (!form) return;


    form.reset();


    document.getElementById(
        "userId"
    ).value = "";


    document.getElementById(
        "userModalTitle"
    ).textContent =
        "Tambah Pengguna";


    const status =
        document.getElementById(
            "userStatus"
        );


    if (status) {

        status.value = "Aktif";

    }


    const modalElement =
        document.getElementById(
            "userModal"
        );


    if (!modalElement) {

        alert(
            "Modal pengguna belum tersedia."
        );

        return;

    }


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* =====================================================
   FORM TAMBAH / EDIT
===================================================== */

function setupUserForm() {

    const form =
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

    const id =
        document.getElementById(
            "userId"
        ).value;


    const nama =
        document.getElementById(
            "userNama"
        ).value.trim();


    const username =
        document.getElementById(
            "userUsername"
        ).value.trim();


    const role =
        document.getElementById(
            "userRole"
        ).value;


    const unit =
        document.getElementById(
            "userUnit"
        ).value.trim();


    const status =
        document.getElementById(
            "userStatus"
        ).value;


    if (!nama || !username || !role) {

        alert(
            "Nama, username dan role wajib diisi."
        );

        return;

    }


    const users =
        window.plazaUsers || [];


    /*
       CEK USERNAME DUPLIKAT
    */

    const duplicate =
        users.find(function (user) {

            return (
                user.username.toLowerCase() ===
                username.toLowerCase() &&
                String(user.id) !== String(id)
            );

        });


    if (duplicate) {

        alert(
            "Username tersebut sudah digunakan."
        );

        return;

    }


    /*
       EDIT
    */

    if (id) {

        const index =
            users.findIndex(function (user) {

                return String(user.id) ===
                    String(id);

            });


        if (index === -1) {

            alert(
                "Data pengguna tidak ditemukan."
            );

            return;

        }


        users[index].nama =
            nama;

        users[index].username =
            username;

        users[index].role =
            role;

        users[index].unit =
            unit;

        users[index].status =
            status;


        alert(
            "Data pengguna berhasil diperbarui."
        );

    }


    /*
       TAMBAH
    */

    else {

        const newId =
            getNextUserId(users);


        const newUser = {

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

    saveUsersToStorage(
        users
    );


    /*
       UPDATE TAMPILAN
    */

    window.plazaUsers =
        users;


    updateUserStatistics(
        users
    );


    renderUsers(
        users
    );


    /*
       TUTUP MODAL
    */

    const modalElement =
        document.getElementById(
            "userModal"
        );


    if (modalElement) {

        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {

            modal.hide();

        }

    }

}


/* =====================================================
   EDIT USER
===================================================== */

function editUser(id) {

    const users =
        window.plazaUsers || [];


    const user =
        users.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    document.getElementById(
        "userId"
    ).value =
        user.id;


    document.getElementById(
        "userNama"
    ).value =
        user.nama || "";


    document.getElementById(
        "userUsername"
    ).value =
        user.username || "";


    document.getElementById(
        "userRole"
    ).value =
        user.role || "";


    document.getElementById(
        "userUnit"
    ).value =
        user.unit || "";


    document.getElementById(
        "userStatus"
    ).value =
        user.status || "Aktif";


    document.getElementById(
        "userModalTitle"
    ).textContent =
        "Edit Pengguna";


    const modalElement =
        document.getElementById(
            "userModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* =====================================================
   UBAH STATUS
===================================================== */

function toggleUserStatus(id) {

    const users =
        window.plazaUsers || [];


    const user =
        users.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    if (user.status === "Aktif") {

        user.status =
            "Nonaktif";

    }

    else {

        user.status =
            "Aktif";

    }


    saveUsersToStorage(
        users
    );


    updateUserStatistics(
        users
    );


    renderUsers(
        users
    );


    console.log(
        "Status pengguna diperbarui:",
        user
    );

}


/* =====================================================
   DELETE USER
===================================================== */

function deleteUser(id) {

    const users =
        window.plazaUsers || [];


    const user =
        users.find(function (item) {

            return String(item.id) ===
                String(id);

        });


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    /*
       PENGAMAN ADMINISTRATOR
    */

    if (
        user.role === "Administrator" &&
        users.filter(function (item) {

            return item.role ===
                "Administrator";

        }).length <= 1
    ) {

        alert(
            "Administrator terakhir tidak boleh dihapus."
        );

        return;

    }


    const confirmed =
        confirm(
            'Hapus pengguna "' +
            user.nama +
            '"?'
        );


    if (!confirmed) return;


    const filteredUsers =
        users.filter(function (item) {

            return String(item.id) !==
                String(id);

        });


    saveUsersToStorage(
        filteredUsers
    );


    window.plazaUsers =
        filteredUsers;


    updateUserStatistics(
        filteredUsers
    );


    renderUsers(
        filteredUsers
    );


    alert(
        "Pengguna berhasil dihapus."
    );

}


/* =====================================================
   NEXT ID
===================================================== */

function getNextUserId(users) {

    if (!users.length) {

        return 1;

    }


    const ids =
        users.map(function (user) {

            return Number(user.id) || 0;

        });


    return Math.max.apply(
        null,
        ids
    ) + 1;

}


/* =====================================================
   SAVE LOCAL STORAGE
===================================================== */

function saveUsersToStorage(users) {

    localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(users)
    );

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchUser"
        );


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const users =
                window.plazaUsers || [];


            const filteredUsers =
                users.filter(function (user) {

                    const text =
                        (
                            (user.nama || "") +
                            " " +
                            (user.username || "") +
                            " " +
                            (user.role || "") +
                            " " +
                            (user.unit || "") +
                            " " +
                            (user.status || "")
                        ).toLowerCase();


                    return text.includes(
                        keyword
                    );

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

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   LOAD ADMIN PROFILE
===================================================== */

function loadAdminProfile() {

    const adminName =
        sessionStorage.getItem(
            "plazaAdminName"
        );


    if (!adminName) return;


    const profileName =
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

    const button =
        document.getElementById(
            "mobileMenuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
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

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) return;


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

    return String(value ?? "")

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

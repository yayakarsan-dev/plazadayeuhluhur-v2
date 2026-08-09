```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   USER MANAGEMENT ENGINE V2
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("User Management Engine V2 aktif");
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

    const tableBody =
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

        const response = await fetch(
            "data/users.json",
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} - ${response.statusText}`
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

        catch (jsonError) {

            console.error(
                "Isi users.json:",
                text.substring(0, 300)
            );

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
            `✓ ${users.length} pengguna berhasil dibaca.`
        );


        /*
           SIMPAN DATA KE GLOBAL
           untuk pencarian dan statistik
        */

        window.plazaUsers = users;


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

                <td
                    colspan="7"
                    class="text-center py-4 text-danger">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    Gagal membaca database pengguna.

                </td>

            </tr>

        `;

    }

}


/* =====================================================
   UPDATE STATISTIK PENGGUNA
===================================================== */

function updateUserStatistics(users) {

    /*
       TOTAL USER
    */

    setValue(
        "totalUsers",
        users.length
    );


    /*
       ADMINISTRATOR
    */

    const totalAdmin =
        users.filter(user =>
            user.role === "Administrator"
        ).length;


    setValue(
        "totalAdmin",
        totalAdmin
    );


    /*
       UMKM

       Mendukung:
       Pelaku UMKM
       UMKM
    */

    const totalUmkm =
        users.filter(user =>
            user.role === "Pelaku UMKM" ||
            user.role === "UMKM"
        ).length;


    setValue(
        "totalUmkm",
        totalUmkm
    );


    /*
       ADMIN DESA

       Mendukung:
       Admin Desa
       Desa
    */

    const totalDesa =
        users.filter(user =>
            user.role === "Admin Desa" ||
            user.role === "Desa"
        ).length;


    setValue(
        "totalDesa",
        totalDesa
    );

}


/* =====================================================
   RENDER TABLE
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

                <td
                    colspan="7"
                    class="text-center py-4">

                    <i class="fa-solid fa-users-slash"></i>

                    Belum ada pengguna.

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML =
        users.map((user, index) => {

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
                            ${escapeHtml(
                                user.nama
                            )}
                        </strong>

                    </td>


                    <td>
                        ${escapeHtml(
                            user.username
                        )}
                    </td>


                    <td>

                        <span class="user-role">

                            ${escapeHtml(
                                user.role
                            )}

                        </span>

                    </td>


                    <td>
                        ${escapeHtml(
                            user.unit || "-"
                        )}
                    </td>


                    <td>

                        <span class="${statusClass}">

                            <i class="fa-solid fa-circle"></i>

                            ${escapeHtml(
                                status
                            )}

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
   SEARCH USER
===================================================== */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchUser"
        );


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const users =
                window.plazaUsers || [];


            const filteredUsers =
                users.filter(user => {

                    const text = `

                        ${user.nama || ""}

                        ${user.username || ""}

                        ${user.role || ""}

                        ${user.unit || ""}

                        ${user.status || ""}

                    `.toLowerCase();


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
   EDIT USER
===================================================== */

function editUser(id) {

    const users =
        window.plazaUsers || [];


    const user =
        users.find(
            item => item.id === id
        );


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    alert(
        `Edit pengguna:\n\n` +
        `Nama: ${user.nama}\n` +
        `Username: ${user.username}\n` +
        `Role: ${user.role}\n` +
        `Unit: ${user.unit || "-"}`
    );

}


/* =====================================================
   DELETE USER
===================================================== */

function deleteUser(id) {

    const users =
        window.plazaUsers || [];


    const user =
        users.find(
            item => item.id === id
        );


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    /*
       UNTUK SEMENTARA
       belum menghapus users.json.

       Kita akan membuat sistem CRUD
       pada tahap berikutnya.
    */

    alert(
        `Pengguna "${user.nama}" siap untuk dihapus.\n\n` +
        `Fitur penghapusan permanen akan kita aktifkan ` +
        `setelah sistem penyimpanan CRUD selesai.`
    );

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
   MOBILE SIDEBAR
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
        () => {

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
        () => {

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
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

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
        event => {

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

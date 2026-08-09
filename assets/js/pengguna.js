/* =====================================================
   PLAZA DAYEUHLUHUR
   USER MANAGEMENT DATA ENGINE V1
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("User Management V1 aktif");
    console.log("====================================");

    loadAdminProfile();
    loadUsers();
    setupSearch();
    setupMobileMenu();
    setupLogout();

});


/* =====================================================
   DATABASE PENGGUNA
===================================================== */

let usersData = [];


/* =====================================================
   LOAD DATA PENGGUNA
===================================================== */

async function loadUsers() {

    const url = "data/pengguna.json";

    try {

        console.log("Membaca database pengguna...");

        const response = await fetch(
            url,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} - ${response.statusText}`
            );

        }

        const text = await response.text();

        if (!text.trim()) {

            throw new Error(
                "File pengguna.json kosong"
            );

        }

        let json;

        try {

            json = JSON.parse(text);

        } catch (error) {

            console.error(
                "Isi pengguna.json:",
                text.substring(0, 300)
            );

            throw new Error(
                "Format pengguna.json tidak valid"
            );

        }


        /* =============================================
           NORMALISASI DATA
        ============================================= */

        if (Array.isArray(json)) {

            usersData = json;

        }

        else if (
            json &&
            Array.isArray(json.data)
        ) {

            usersData = json.data;

        }

        else if (
            json &&
            Array.isArray(json.items)
        ) {

            usersData = json.items;

        }

        else {

            throw new Error(
                "Format data pengguna tidak dikenali"
            );

        }


        console.log(
            `✓ Berhasil membaca ${usersData.length} pengguna`
        );


        updateUserStatistics(usersData);

        renderUsers(usersData);

    }

    catch (error) {

        console.error(
            "✗ Gagal memuat pengguna:",
            error
        );

        showUserError();

    }

}


/* =====================================================
   STATISTIK PENGGUNA
===================================================== */

function updateUserStatistics(users) {

    const total =
        users.length;


    const admin =
        users.filter(
            user =>
                String(user.role || "")
                    .toLowerCase() === "admin"
        ).length;


    const umkm =
        users.filter(
            user =>
                String(user.role || "")
                    .toLowerCase() === "umkm"
        ).length;


    const desa =
        users.filter(
            user =>
                String(user.role || "")
                    .toLowerCase() === "desa"
        ).length;


    setValue(
        "totalUsers",
        total
    );


    setValue(
        "totalAdmin",
        admin
    );


    setValue(
        "totalUmkm",
        umkm
    );


    setValue(
        "totalDesa",
        desa
    );

}


/* =====================================================
   RENDER TABEL PENGGUNA
===================================================== */

function renderUsers(users) {

    const tbody =
        document.getElementById(
            "userTableBody"
        );


    if (!tbody) {

        console.error(
            "Element userTableBody tidak ditemukan."
        );

        return;

    }


    if (!users.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center py-4">

                    <i class="fa-solid fa-users-slash"></i>

                    <div class="mt-2">
                        Belum ada data pengguna.
                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        users.map(
            (user, index) => {

                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>

                            <strong>
                                ${escapeHtml(
                                    user.nama ||
                                    "Tanpa Nama"
                                )}
                            </strong>

                        </td>


                        <td>

                            ${escapeHtml(
                                user.username ||
                                "-"
                            )}

                        </td>


                        <td>

                            ${getRoleBadge(
                                user.role
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                user.entitas ||
                                "-"
                            )}

                        </td>


                        <td>

                            ${getStatusBadge(
                                user.status
                            )}

                        </td>


                        <td>

                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                onclick="editUser(${user.id})"
                                title="Edit pengguna">

                                <i class="fa-solid fa-pen"></i>

                            </button>


                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                onclick="deleteUser(${user.id})"
                                title="Hapus pengguna">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =====================================================
   ROLE BADGE
===================================================== */

function getRoleBadge(role) {

    const value =
        String(
            role || "-"
        ).toLowerCase();


    const labels = {

        admin: "Administrator",

        desa: "Desa",

        bumdes: "BUMDes",

        umkm: "UMKM",

        bisnis: "Bisnis",

        editor: "Editor"

    };


    const label =
        labels[value] ||
        role ||
        "-";


    return `

        <span class="badge bg-primary">

            ${escapeHtml(label)}

        </span>

    `;

}


/* =====================================================
   STATUS BADGE
===================================================== */

function getStatusBadge(status) {

    const value =
        String(
            status || ""
        ).toLowerCase();


    if (value === "aktif") {

        return `

            <span class="badge bg-success">

                <i class="fa-solid fa-circle-check"></i>

                Aktif

            </span>

        `;

    }


    return `

        <span class="badge bg-secondary">

            <i class="fa-solid fa-circle-xmark"></i>

            ${escapeHtml(
                status || "Nonaktif"
            )}

        </span>

    `;

}


/* =====================================================
   SEARCH PENGGUNA
===================================================== */

function setupSearch() {

    const search =
        document.getElementById(
            "searchUser"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        () => {

            const keyword =
                search.value
                    .toLowerCase()
                    .trim();


            if (!keyword) {

                renderUsers(
                    usersData
                );

                return;

            }


            const filtered =
                usersData.filter(
                    user => {

                        const nama =
                            String(
                                user.nama || ""
                            ).toLowerCase();


                        const username =
                            String(
                                user.username || ""
                            ).toLowerCase();


                        const role =
                            String(
                                user.role || ""
                            ).toLowerCase();


                        const entitas =
                            String(
                                user.entitas || ""
                            ).toLowerCase();


                        return (

                            nama.includes(
                                keyword
                            ) ||

                            username.includes(
                                keyword
                            ) ||

                            role.includes(
                                keyword
                            ) ||

                            entitas.includes(
                                keyword
                            )

                        );

                    }
                );


            renderUsers(
                filtered
            );

        }
    );

}


/* =====================================================
   TOMBOL TAMBAH PENGGUNA
===================================================== */

function setupAddUserButton() {

    const button =
        document.getElementById(
            "addUserButton"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            alert(
                "Form Tambah Pengguna akan kita buat pada tahap berikutnya."
            );

        }
    );

}


/* =====================================================
   EDIT PENGGUNA
===================================================== */

function editUser(id) {

    const user =
        usersData.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    alert(
        `Edit pengguna:\n\n${user.nama}\nUsername: ${user.username}\nRole: ${user.role}`
    );

}


/* =====================================================
   HAPUS PENGGUNA
===================================================== */

function deleteUser(id) {

    const user =
        usersData.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    const confirmDelete =
        confirm(
            `Apakah Anda yakin ingin menghapus pengguna "${user.nama}"?`
        );


    if (!confirmDelete) return;


    alert(
        "Pada tahap prototype JSON, penghapusan belum disimpan ke database."
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
   ERROR DATA
===================================================== */

function showUserError() {

    const tbody =
        document.getElementById(
            "userTableBody"
        );


    if (!tbody) return;


    tbody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="text-center py-4 text-danger">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div class="mt-2">
                    Data pengguna gagal dimuat.
                </div>

                <small>
                    Periksa file data/pengguna.json
                </small>

            </td>

        </tr>

    `;


    setValue(
        "totalUsers",
        0
    );

    setValue(
        "totalAdmin",
        0
    );

    setValue(
        "totalUmkm",
        0
    );

    setValue(
        "totalDesa",
        0
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
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            item => {

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

            }
        );

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

    return String(
        value ?? ""
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


/* =====================================================
   START ADD USER
===================================================== */

setupAddUserButton();
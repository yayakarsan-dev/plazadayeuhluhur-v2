/* =====================================================
   PLAZA DAYEUHLUHUR
   USER MANAGEMENT ENGINE V3
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

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
   DATABASE USER
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
           SIMPAN DATABASE KE GLOBAL
        */

        window.plazaUsers =
            users;


        console.log(
            "✓ " +
            users.length +
            " pengguna berhasil dibaca."
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
   STATISTIK
===================================================== */

function updateUserStatistics(users) {

    setValue(
        "totalUsers",
        users.length
    );


    const totalAdmin =
        users.filter(
            user =>
                user.role === "Administrator"
        ).length;


    setValue(
        "totalAdmin",
        totalAdmin
    );


    const totalUmkm =
        users.filter(
            user =>
                user.role === "Pelaku UMKM" ||
                user.role === "UMKM"
        ).length;


    setValue(
        "totalUmkm",
        totalUmkm
    );


    const totalDesa =
        users.filter(
            user =>
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
        users.map(
            (user, index) => {

                const status =
                    user.status ||
                    "Aktif";


                const statusClass =
                    status.toLowerCase() ===
                    "aktif"
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

                            <span
                                class="${statusClass}">

                                <i
                                    class="fa-solid fa-circle">
                                </i>

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

            }
        ).join("");

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
        () => {

            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const users =
                window.plazaUsers ||
                [];


            const filtered =
                users.filter(
                    user => {

                        const text =

                            (
                                user.nama ||
                                ""
                            ) +

                            " " +

                            (
                                user.username ||
                                ""
                            ) +

                            " " +

                            (
                                user.role ||
                                ""
                            ) +

                            " " +

                            (
                                user.unit ||
                                ""
                            ) +

                            " " +

                            (
                                user.status ||
                                ""
                            );


                        return text
                            .toLowerCase()
                            .includes(
                                keyword
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
   TAMBAH PENGGUNA
===================================================== */

function setupAddUser() {

    const button =
        document.getElementById(
            "addUserButton"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            resetUserForm();


            document.getElementById(
                "userModalTitle"
            ).textContent =
                "Tambah Pengguna";


            const modal =
                new bootstrap.Modal(
                    document.getElementById(
                        "userModal"
                    )
                );


            modal.show();

        }
    );

}


/* =====================================================
   FORM USER
===================================================== */

function setupUserForm() {

    const form =
        document.getElementById(
            "userForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


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


            if (
                !nama ||
                !username ||
                !role
            ) {

                alert(
                    "Nama, username dan role wajib diisi."
                );

                return;

            }


            /*
               CEK USERNAME DUPLIKAT
            */

            const existing =
                window.plazaUsers.find(
                    user =>
                        user.username
                            .toLowerCase() ===
                        username.toLowerCase()
                );


            if (existing) {

                alert(
                    "Username tersebut sudah digunakan."
                );

                return;

            }


            /*
               ID BARU
            */

            const users =
                window.plazaUsers || [];


            const newId =
                users.length
                    ? Math.max(
                        ...users.map(
                            user =>
                                Number(
                                    user.id
                                ) || 0
                        )
                    ) + 1
                    : 1;


            const newUser = {

                id: newId,

                nama: nama,

                username: username,

                role: role,

                unit:
                    unit || "-",

                status:
                    status

            };


            /*
               TAMBAHKAN KE MEMORY
            */

            users.push(
                newUser
            );


            window.plazaUsers =
                users;


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

            const modalElement =
                document.getElementById(
                    "userModal"
                );


            const modal =
                bootstrap.Modal
                    .getInstance(
                        modalElement
                    );


            if (modal) {

                modal.hide();

            }


            alert(
                "Pengguna berhasil ditambahkan ke sesi ini."
            );


            console.log(
                "User baru:",
                newUser
            );

        }
    );

}


/* =====================================================
   RESET FORM
===================================================== */

function resetUserForm() {

    const form =
        document.getElementById(
            "userForm"
        );


    if (form) {

        form.reset();

    }


    const id =
        document.getElementById(
            "userId"
        );


    if (id) {

        id.value = "";

    }


    const status =
        document.getElementById(
            "userStatus"
        );


    if (status) {

        status.value =
            "Aktif";

    }

}


/* =====================================================
   EDIT USER
===================================================== */

function editUser(id) {

    const users =
        window.plazaUsers ||
        [];


    const user =
        users.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


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


    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "userModal"
            )
        );


    modal.show();

}


/* =====================================================
   DELETE USER
===================================================== */

function deleteUser(id) {

    const users =
        window.plazaUsers ||
        [];


    const user =
        users.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!user) {

        alert(
            "Data pengguna tidak ditemukan."
        );

        return;

    }


    const confirmDelete =
        confirm(
            `Hapus pengguna "${user.nama}"?`
        );


    if (!confirmDelete) return;


    const filtered =
        users.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    window.plazaUsers =
        filtered;


    updateUserStatistics(
        filtered
    );


    renderUsers(
        filtered
    );


    alert(
        "Pengguna dihapus dari sesi ini."
    );

}


/* =====================================================
   HELPER SET VALUE
===================================================== */

function setValue(
    id,
    value
) {

    const element =
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

function escapeHtml(
    value
) {

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
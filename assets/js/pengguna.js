/* =====================================================
PLAZA DAYEUHLUHUR
USER MANAGEMENT V1
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

```
console.log("====================================");
console.log("PLAZA DAYEUHLUHUR");
console.log("User Management V1 aktif");
console.log("====================================");

loadUsers();

setupMobileMenu();

setupLogout();

setupSearch();
```

});

/* =====================================================
LOAD USERS
===================================================== */

async function loadUsers() {

```
const tableBody =
    document.getElementById("userTableBody");

if (!tableBody) return;


try {

    const response = await fetch(
        "data/users.json",
        {
            cache: "no-store"
        }
    );


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );

    }


    const text =
        await response.text();


    if (!text.trim()) {

        throw new Error(
            "users.json kosong"
        );

    }


    const users =
        JSON.parse(text);


    if (!Array.isArray(users)) {

        throw new Error(
            "Format users.json harus berupa array"
        );

    }


    console.log(
        `✓ Users: ${users.length} data`
    );


    updateUserStatistics(users);

    renderUsers(users);


    window.plazaUsers = users;


}

catch (error) {

    console.error(
        "✗ Gagal membaca users.json:",
        error
    );


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="text-center text-danger py-4">

                <i class="fa-solid fa-triangle-exclamation"></i>

                Gagal membaca data pengguna.

            </td>

        </tr>

    `;

}
```

}

/* =====================================================
STATISTIK
===================================================== */

function updateUserStatistics(users) {

```
setValue(
    "totalUsers",
    users.length
);


setValue(
    "totalAdmin",
    users.filter(
        user =>
            user.role === "Administrator"
    ).length
);


setValue(
    "totalUmkm",
    users.filter(
        user =>
            user.role === "Pelaku UMKM"
    ).length
);


setValue(
    "totalDesa",
    users.filter(
        user =>
            user.role === "Admin Desa"
    ).length
);
```

}

/* =====================================================
RENDER USERS
===================================================== */

function renderUsers(users) {

```
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

                Belum ada pengguna.

            </td>

        </tr>

    `;

    return;

}


tableBody.innerHTML =
    users.map(
        (user, index) => `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>

                    <div class="user-name">

                        <div class="user-avatar">

                            <i class="fa-solid fa-user"></i>

                        </div>

                        <strong>
                            ${escapeHtml(user.nama)}
                        </strong>

                    </div>

                </td>

                <td>
                    ${escapeHtml(user.username)}
                </td>

                <td>

                    <span class="role-badge">

                        ${escapeHtml(user.role)}

                    </span>

                </td>

                <td>
                    ${escapeHtml(user.unit)}
                </td>

                <td>

                    <span class="status-badge">

                        <span class="status-dot online"></span>

                        ${escapeHtml(user.status)}

                    </span>

                </td>

                <td>

                    <div class="user-actions">

                        <button
                            class="btn btn-sm btn-outline-primary"
                            onclick="editUser(${user.id})"
                            title="Edit">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="btn btn-sm btn-outline-danger"
                            onclick="deleteUser(${user.id})"
                            title="Hapus">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `
    ).join("");
```

}

/* =====================================================
SEARCH
===================================================== */

function setupSearch() {

```
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


        const users =
            window.plazaUsers || [];


        const filtered =
            users.filter(user =>

                String(
                    user.nama || ""
                )
                .toLowerCase()
                .includes(keyword)

                ||

                String(
                    user.username || ""
                )
                .toLowerCase()
                .includes(keyword)

                ||

                String(
                    user.role || ""
                )
                .toLowerCase()
                .includes(keyword)

                ||

                String(
                    user.unit || ""
                )
                .toLowerCase()
                .includes(keyword)

            );


        renderUsers(filtered);

    }
);
```

}

/* =====================================================
EDIT USER
===================================================== */

function editUser(id) {

```
const users =
    window.plazaUsers || [];


const user =
    users.find(
        item => item.id === id
    );


if (!user) return;


alert(
    `Edit pengguna:\n\n${user.nama}\n${user.username}\n${user.role}\n\nFitur edit akan kita bangun pada tahap berikutnya.`
);
```

}

/* =====================================================
DELETE USER
===================================================== */

function deleteUser(id) {

```
const users =
    window.plazaUsers || [];


const user =
    users.find(
        item => item.id === id
    );


if (!user) return;


alert(
    `Pengguna "${user.nama}" siap dihapus.\n\nFitur hapus akan kita aktifkan setelah sistem penyimpanan database dibuat.`
);
```

}

/* =====================================================
HELPER
===================================================== */

function setValue(id, value) {

```
const element =
    document.getElementById(id);


if (element) {

    element.textContent = value;

}
```

}

/* =====================================================
ESCAPE HTML
===================================================== */

function escapeHtml(value) {

```
return String(value ?? "")

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
```

}

/* =====================================================
MOBILE SIDEBAR
===================================================== */

function setupMobileMenu() {

```
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

        sidebar.classList.add("show");

        overlay.classList.add("show");

    }
);


overlay.addEventListener(
    "click",
    () => {

        sidebar.classList.remove("show");

        overlay.classList.remove("show");

    }
);


document
    .querySelectorAll(".menu-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                sidebar.classList.remove("show");

                overlay.classList.remove("show");

            }
        );

    });
```

}

/* =====================================================
LOGOUT
===================================================== */

function setupLogout() {

```
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
```

}

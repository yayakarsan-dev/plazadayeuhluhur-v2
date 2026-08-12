/* =====================================================
   PLAZA DAYEUHLUHUR
   BURSA ADMIN ENGINE V1
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


    console.log(
        "PLAZA DAYEUHLUHUR - BURSA ADMIN"
    );


    /* =================================================
       STORAGE
    ================================================= */

    const STORAGE_KEY =
        "plaza_dayeuhluhur_bursa";


    /* =================================================
       ELEMENT
    ================================================= */

    const tableBody =
        document.getElementById(
            "bursaTableBody"
        );

    const emptyBursa =
        document.getElementById(
            "emptyBursa"
        );

    const form =
        document.getElementById(
            "formBursa"
        );

    const modalElement =
        document.getElementById(
            "modalBursa"
        );

    const modal =
        new bootstrap.Modal(
            modalElement
        );


    const search =
        document.getElementById(
            "searchBursa"
        );

    const filterJenis =
        document.getElementById(
            "filterJenis"
        );

    const filterDesa =
        document.getElementById(
            "filterDesa"
        );


    let dataBursa = [];


    /* =================================================
       LOAD DATA
    ================================================= */

    function loadData() {

        const local =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (local) {

            try {

                dataBursa =
                    JSON.parse(local);

            } catch (error) {

                console.error(
                    "Data localStorage rusak:",
                    error
                );

                loadJSON();

                return;

            }

            render();

        } else {

            loadJSON();

        }

    }


    /* =================================================
       LOAD JSON
    ================================================= */

    async function loadJSON() {

        try {

            const response =
                await fetch("bursa.json");


            if (!response.ok) {

                throw new Error(
                    "bursa.json tidak ditemukan."
                );

            }


            const data =
                await response.json();


            dataBursa =
                Array.isArray(data)
                    ? data
                    : [];


            save();


            render();

        } catch (error) {

            console.warn(
                "bursa.json belum tersedia.",
                error
            );

            dataBursa = [];

            render();

        }

    }


    /* =================================================
       SAVE
    ================================================= */

    function save() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(dataBursa)
        );

    }


    /* =================================================
       RENDER
    ================================================= */

    function render() {

        const keyword =
            search.value
                .toLowerCase()
                .trim();


        const jenis =
            filterJenis.value;


        const desa =
            filterDesa.value;


        const hasil =
            dataBursa.filter(
                item => {


                    const cocokKeyword =
                        (
                            item.judul ||
                            ""
                        )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
                        ||
                        (
                            item.penjual ||
                            ""
                        )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
                        ||
                        (
                            item.kategori ||
                            ""
                        )
                        .toLowerCase()
                        .includes(
                            keyword
                        );


                    const cocokJenis =
                        !jenis ||
                        item.jenis === jenis;


                    const cocokDesa =
                        !desa ||
                        item.desa === desa;


                    return (
                        cocokKeyword &&
                        cocokJenis &&
                        cocokDesa
                    );

                }
            );


        tableBody.innerHTML = "";


        if (
            hasil.length === 0
        ) {

            emptyBursa.style.display =
                "block";

        } else {

            emptyBursa.style.display =
                "none";


            hasil.forEach(
                (item, index) => {


                const row =
                    document.createElement(
                        "tr"
                    );


                const statusClass =
                    item.status === "Aktif"
                        ? ""
                        : "nonaktif";


                row.innerHTML = `

                    <td>
                        ${
                            index + 1
                        }
                    </td>


                    <td>

                        <div class="bursa-title">

                            ${
                                escapeHTML(
                                    item.judul ||
                                    "-"
                                )
                            }

                        </div>


                        <div class="bursa-seller">

                            <i class="fa-solid fa-user me-1"></i>

                            ${
                                escapeHTML(
                                    item.penjual ||
                                    "-"
                                )
                            }

                        </div>

                    </td>


                    <td>

                        <span class="bursa-type">

                            ${
                                escapeHTML(
                                    item.jenis ||
                                    "-"
                                )
                            }

                        </span>

                    </td>


                    <td>

                        <i class="fa-solid fa-location-dot me-1"></i>

                        ${
                            escapeHTML(
                                item.desa ||
                                "-"
                            )
                        }

                    </td>


                    <td>

                        <span class="bursa-price">

                            ${
                                escapeHTML(
                                    item.harga ||
                                    "Nego"
                                )
                            }

                        </span>

                    </td>


                    <td>

                        <span
                            class="bursa-status ${statusClass}"
                        >

                            <span></span>

                            ${
                                escapeHTML(
                                    item.status ||
                                    "Aktif"
                                )
                            }

                        </span>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="bursa-action edit"
                            onclick="editBursa(${item.id})"
                            title="Edit"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="bursa-action delete"
                            onclick="deleteBursa(${item.id})"
                            title="Hapus"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );


            });

        }


        updateStatistics();

        updateDesaFilter();

    }


    /* =================================================
       STATISTICS
    ================================================= */

    function updateStatistics() {

        document.getElementById(
            "totalBursa"
        ).textContent =
            dataBursa.length;


        document.getElementById(
            "totalAktif"
        ).textContent =
            dataBursa.filter(
                item =>
                    item.status === "Aktif"
            ).length;


        document.getElementById(
            "totalDijual"
        ).textContent =
            dataBursa.filter(
                item =>
                    item.jenis === "Dijual"
            ).length;


        document.getElementById(
            "totalDicari"
        ).textContent =
            dataBursa.filter(
                item =>
                    item.jenis === "Dicari"
            ).length;

    }


    /* =================================================
       FILTER DESA
    ================================================= */

    function updateDesaFilter() {

        const current =
            filterDesa.value;


        const daftarDesa =
            [
                ...new Set(
                    dataBursa
                        .map(
                            item =>
                                item.desa
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        filterDesa.innerHTML = `

            <option value="">
                Semua Desa
            </option>

        `;


        daftarDesa.forEach(
            desa => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    desa;


                option.textContent =
                    desa;


                filterDesa.appendChild(
                    option
                );

            }
        );


        if (
            daftarDesa.includes(
                current
            )
        ) {

            filterDesa.value =
                current;

        }

    }


    /* =================================================
       TAMBAH
    ================================================= */

    function tambahBursa() {

        form.reset();


        document.getElementById(
            "bursaId"
        ).value = "";


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Tambah Listing Bursa";


        document.getElementById(
            "statusBursa"
        ).value =
            "Aktif";


        modal.show();

    }


    /* =================================================
       EDIT
    ================================================= */

    window.editBursa =
        function(id) {


        const item =
            dataBursa.find(
                data =>
                    Number(data.id) ===
                    Number(id)
            );


        if (!item) {

            alert(
                "Data Bursa tidak ditemukan."
            );

            return;

        }


        document.getElementById(
            "bursaId"
        ).value =
            item.id;


        document.getElementById(
            "judulBursa"
        ).value =
            item.judul || "";


        document.getElementById(
            "jenisBursa"
        ).value =
            item.jenis || "";


        document.getElementById(
            "kategoriBursa"
        ).value =
            item.kategori || "";


        document.getElementById(
            "desaBursa"
        ).value =
            item.desa || "";


        document.getElementById(
            "hargaBursa"
        ).value =
            item.harga || "";


        document.getElementById(
            "penjualBursa"
        ).value =
            item.penjual || "";


        document.getElementById(
            "whatsappBursa"
        ).value =
            item.whatsapp || "";


        document.getElementById(
            "fotoBursa"
        ).value =
            item.foto || "";


        document.getElementById(
            "deskripsiBursa"
        ).value =
            item.deskripsi || "";


        document.getElementById(
            "statusBursa"
        ).value =
            item.status || "Aktif";


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Edit Listing Bursa";


        modal.show();

    };


    /* =================================================
       DELETE
    ================================================= */

    window.deleteBursa =
        function(id) {


        const item =
            dataBursa.find(
                data =>
                    Number(data.id) ===
                    Number(id)
            );


        if (!item) {

            return;

        }


        const yakin =
            confirm(
                "Hapus listing \"" +
                item.judul +
                "\"?"
            );


        if (!yakin) {

            return;

        }


        dataBursa =
            dataBursa.filter(
                data =>
                    Number(data.id) !==
                    Number(id)
            );


        save();

        render();


        alert(
            "Listing Bursa berhasil dihapus."
        );

    };


    /* =================================================
       SUBMIT FORM
    ================================================= */

    form.addEventListener(
        "submit",
        function(event) {


        event.preventDefault();


        const id =
            document.getElementById(
                "bursaId"
            ).value;


        const judul =
            document.getElementById(
                "judulBursa"
            ).value.trim();


        const jenis =
            document.getElementById(
                "jenisBursa"
            ).value;


        const kategori =
            document.getElementById(
                "kategoriBursa"
            ).value;


        const desa =
            document.getElementById(
                "desaBursa"
            ).value.trim();


        const harga =
            document.getElementById(
                "hargaBursa"
            ).value.trim();


        const penjual =
            document.getElementById(
                "penjualBursa"
            ).value.trim();


        const whatsapp =
            document.getElementById(
                "whatsappBursa"
            ).value.trim();


        const foto =
            document.getElementById(
                "fotoBursa"
            ).value.trim();


        const deskripsi =
            document.getElementById(
                "deskripsiBursa"
            ).value.trim();


        const status =
            document.getElementById(
                "statusBursa"
            ).value;


        /* ---------------------------------------------
           VALIDASI
        --------------------------------------------- */

        if (
            !judul ||
            !jenis ||
            !kategori ||
            !desa ||
            !penjual ||
            !deskripsi
        ) {

            alert(
                "Mohon lengkapi semua data wajib."
            );

            return;

        }


        /* ---------------------------------------------
           OBJECT
        --------------------------------------------- */

        const dataBaru = {

            id:
                id
                    ? Number(id)
                    : getNextId(),

            judul:
                judul,

            jenis:
                jenis,

            kategori:
                kategori,

            desa:
                desa,

            harga:
                harga,

            penjual:
                penjual,

            whatsapp:
                whatsapp,

            foto:
                foto,

            deskripsi:
                deskripsi,

            status:
                status,

            tanggal:
                new Date()
                    .toISOString()
                    .split("T")[0]

        };


        /* ---------------------------------------------
           EDIT / TAMBAH
        --------------------------------------------- */

        if (id) {

            const index =
                dataBursa.findIndex(
                    item =>
                        Number(item.id) ===
                        Number(id)
                );


            if (index !== -1) {

                dataBursa[index] =
                    {
                        ...dataBursa[index],
                        ...dataBaru
                    };

            }

        } else {

            dataBursa.push(
                dataBaru
            );

        }


        /* ---------------------------------------------
           SAVE
        --------------------------------------------- */

        save();


        /* ---------------------------------------------
           REFRESH
        --------------------------------------------- */

        render();


        /* ---------------------------------------------
           CLOSE
        --------------------------------------------- */

        modal.hide();


        alert(
            id
                ? "Listing Bursa berhasil diperbarui."
                : "Listing Bursa berhasil ditambahkan."
        );


    });


    /* =================================================
       NEXT ID
    ================================================= */

    function getNextId() {

        if (
            dataBursa.length === 0
        ) {

            return 1;

        }


        return (
            Math.max(
                ...dataBursa.map(
                    item =>
                        Number(item.id) || 0
                )
            ) + 1
        );

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {

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


    /* =================================================
       EVENTS
    ================================================= */

    document.getElementById(
        "btnTambahBursa"
    ).addEventListener(
        "click",
        tambahBursa
    );


    document.getElementById(
        "btnTambahBursaEmpty"
    ).addEventListener(
        "click",
        tambahBursa
    );


    search.addEventListener(
        "input",
        render
    );


    filterJenis.addEventListener(
        "change",
        render
    );


    filterDesa.addEventListener(
        "change",
        render
    );


    document.getElementById(
        "btnReset"
    ).addEventListener(
        "click",
        () => {

            search.value = "";

            filterJenis.value = "";

            filterDesa.value = "";

            render();

        }
    );


    /* =================================================
       LOGOUT
    ================================================= */

    const logout =
        document.getElementById(
            "logoutButton"
        );


    logout.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            sessionStorage.removeItem(
                "plazaAdminLogin"
            );

            window.location.href =
                "login.html";

        }
    );


    /* =================================================
       MOBILE SIDEBAR
    ================================================= */

    const mobileMenu =
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


    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "show"
                );

                overlay.classList.toggle(
                    "show"
                );

            }
        );

    }


    if (overlay) {

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

    }


    /* =================================================
       START
    ================================================= */

    loadData();


});
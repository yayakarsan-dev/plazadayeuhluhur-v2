/* =========================================================
   PLAZA DAYEUHLUHUR
   ADMIN DESTINASI WISATA
   WISATA-ADMIN.JS V1
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("ADMIN DESTINASI WISATA V1");
    console.log("====================================");

    initWisataPage();

});


/* =========================================================
   INIT
========================================================= */

async function initWisataPage() {

    bindSearch();
    bindFilter();
    bindTambahButton();

    await loadWisataData();

}


/* =========================================================
   LOAD DATA WISATA
========================================================= */

async function loadWisataData() {

    console.log("Memuat data wisata...");

    let jsonData = [];

    try {

        const response = await fetch(
            "data/wisata.json",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "Gagal membaca data/wisata.json"
            );

        }

        const data = await response.json();

        if (Array.isArray(data)) {

            jsonData = data;

        }

    }

    catch (error) {

        console.error(
            "Error membaca wisata.json:",
            error
        );

    }


    /*
     * Simpan data JSON ke memory
     */

    window.plazaWisataJson = jsonData;


    /*
     * Ambil data tambahan dari localStorage
     */

    const localData = getStoredWisata();


    /*
     * Gabungkan data
     */

    window.plazaWisataData = [
        ...jsonData,
        ...localData
    ];


    console.log(
        "Data wisata:",
        window.plazaWisataData
    );


    /*
     * Render
     */

    updateWisataStatistics();

    populateFilters();

    renderWisata();


}


/* =========================================================
   GET LOCAL STORAGE
========================================================= */

function getStoredWisata() {

    try {

        const stored =
            localStorage.getItem(
                "plazaWisata"
            );

        if (!stored) {

            return [];

        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "LocalStorage wisata rusak:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE LOCAL STORAGE
========================================================= */

function saveStoredWisata(data) {

    try {

        localStorage.setItem(
            "plazaWisata",
            JSON.stringify(data)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Gagal menyimpan wisata:",
            error
        );

        return false;

    }

}


/* =========================================================
   STATISTIK
========================================================= */

function updateWisataStatistics() {

    const data =
        window.plazaWisataData || [];


    /*
     * TOTAL
     */

    setText(
        [
            "statWisataTotal",
            "totalWisata",
            "statTotal"
        ],
        data.length
    );


    /*
     * DESTINASI UNGGULAN
     */

    const unggulan =
        data.filter(function (item) {

            return String(
                item.status || ""
            ).toLowerCase()
            .includes("unggulan");

        });


    setText(
        [
            "statWisataUnggulan",
            "totalUnggulan"
        ],
        unggulan.length
    );


    /*
     * POTENSI WISATA
     */

    const potensi =
        data.filter(function (item) {

            return String(
                item.status || ""
            ).toLowerCase()
            .includes("potensi");

        });


    setText(
        [
            "statWisataPotensi",
            "totalPotensi"
        ],
        potensi.length
    );


    /*
     * JUMLAH DESA UNIK
     */

    const desa =
        new Set(
            data
                .map(function (item) {
                    return item.desa;
                })
                .filter(Boolean)
        );


    setText(
        [
            "statWisataDesa",
            "totalDesaWisata"
        ],
        desa.size
    );

}


/* =========================================================
   FILTER
========================================================= */

function bindSearch() {

    const search =
        findElement([
            "wisataSearch",
            "searchWisata",
            "searchInput"
        ]);


    if (!search) {

        console.warn(
            "Input pencarian wisata tidak ditemukan."
        );

        return;

    }


    search.addEventListener(
        "input",
        renderWisata
    );

}


/* =========================================================
   FILTER SELECT
========================================================= */

function bindFilter() {

    const selectors = [

        "wisataKategoriFilter",
        "wisataDesaFilter",
        "wisataStatusFilter"

    ];


    selectors.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "change",
                renderWisata
            );

        }

    });

}


/* =========================================================
   POPULATE FILTER
========================================================= */

function populateFilters() {

    const data =
        window.plazaWisataData || [];


    /*
     * KATEGORI
     */

    populateSelect(
        [
            "wisataKategoriFilter",
            "filterKategori"
        ],
        data.map(function (item) {
            return item.kategori;
        })
    );


    /*
     * DESA
     */

    populateSelect(
        [
            "wisataDesaFilter",
            "filterDesa"
        ],
        data.map(function (item) {
            return item.desa;
        })
    );


    /*
     * STATUS
     */

    populateSelect(
        [
            "wisataStatusFilter",
            "filterStatus"
        ],
        data.map(function (item) {
            return item.status;
        })
    );

}


/* =========================================================
   POPULATE SELECT
========================================================= */

function populateSelect(ids, values) {

    const element =
        findElement(ids);

    if (!element) {
        return;
    }


    const unique =
        [...new Set(
            values.filter(Boolean)
        )].sort();


    const current =
        element.value;


    const firstOption =
        element.options[0]
            ? element.options[0].textContent
            : "Semua";


    element.innerHTML = "";


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        firstOption.includes("Semua")
            ? firstOption
            : "Semua";


    element.appendChild(
        defaultOption
    );


    unique.forEach(function (value) {

        const option =
            document.createElement("option");

        option.value = value;

        option.textContent = value;

        element.appendChild(
            option
        );

    });


    if (
        unique.includes(current)
    ) {

        element.value =
            current;

    }

}


/* =========================================================
   RENDER WISATA
========================================================= */

function renderWisata() {

    const container =
        findElement([
            "wisataList",
            "wisataGrid",
            "destinasiList",
            "wisataContainer"
        ]);


    if (!container) {

        console.warn(
            "Container daftar wisata tidak ditemukan."
        );

        return;

    }


    const data =
        window.plazaWisataData || [];


    /*
     * Ambil filter
     */

    const search =
        getElementValue([
            "wisataSearch",
            "searchWisata",
            "searchInput"
        ]).toLowerCase();


    const kategori =
        getElementValue([
            "wisataKategoriFilter",
            "filterKategori"
        ]);


    const desa =
        getElementValue([
            "wisataDesaFilter",
            "filterDesa"
        ]);


    const status =
        getElementValue([
            "wisataStatusFilter",
            "filterStatus"
        ]);


    /*
     * FILTER DATA
     */

    const filtered =
        data.filter(function (item) {

            const text = [

                item.nama,
                item.desa,
                item.kategori,
                item.jenis,
                item.status,
                item.deskripsi

            ]
            .join(" ")
            .toLowerCase();


            const matchSearch =
                !search ||
                text.includes(search);


            const matchKategori =
                !kategori ||
                item.kategori === kategori;


            const matchDesa =
                !desa ||
                item.desa === desa;


            const matchStatus =
                !status ||
                item.status === status;


            return (
                matchSearch &&
                matchKategori &&
                matchDesa &&
                matchStatus
            );

        });


    /*
     * Tidak ada data
     */

    if (filtered.length === 0) {

        container.innerHTML = `

            <div class="wisata-empty">

                <i class="fa-solid fa-mountain-sun"></i>

                <h4>
                    Data wisata tidak ditemukan
                </h4>

                <p>
                    Belum ada destinasi yang sesuai
                    dengan pencarian atau filter.
                </p>

            </div>

        `;

        return;

    }


    /*
     * RENDER CARD
     */

    container.innerHTML =
        filtered
            .map(createWisataCard)
            .join("");


    /*
     * Bind tombol
     */

    bindCardActions();

}


/* =========================================================
   CREATE CARD
========================================================= */

function createWisataCard(item) {

    const statusClass =
        String(item.status || "")
            .toLowerCase()
            .includes("unggulan")
                ? "unggulan"
                : "potensi";


    return `

        <div class="wisata-card">

            <div class="wisata-card-image">

                <img
                    src="${escapeHTML(
                        item.gambar ||
                        "assets/images/default.jpg"
                    )}"
                    alt="${escapeHTML(
                        item.nama
                    )}"
                    onerror="
                        this.src='assets/images/default.jpg'
                    "
                >

                <span class="wisata-icon-badge">

                    ${escapeHTML(
                        item.ikon || "🏞️"
                    )}

                </span>


                <span
                    class="wisata-status ${statusClass}"
                >

                    ${escapeHTML(
                        item.status ||
                        "Potensi Wisata"
                    )}

                </span>

            </div>


            <div class="wisata-card-body">

                <div class="wisata-category">

                    ${escapeHTML(
                        item.kategori ||
                        "Wisata"
                    )}

                </div>


                <h3>
                    ${escapeHTML(
                        item.nama
                    )}
                </h3>


                <div class="wisata-location">

                    <i class="fa-solid fa-location-dot"></i>

                    ${escapeHTML(
                        item.desa || "-"
                    )}

                </div>


                <p>

                    ${escapeHTML(
                        item.deskripsi ||
                        "Belum ada deskripsi."
                    )}

                </p>


                <div class="wisata-card-footer">

                    <a
                        href="${escapeHTML(
                            item.maps || "#"
                        )}"
                        target="_blank"
                        rel="noopener"
                        class="btn-wisata-map"
                    >

                        <i class="fa-solid fa-map-location-dot"></i>

                        Maps

                    </a>


                    <button
                        type="button"
                        class="btn-wisata-edit"
                        data-id="${item.id}"
                    >

                        <i class="fa-solid fa-pen"></i>

                        Edit

                    </button>


                    <button
                        type="button"
                        class="btn-wisata-delete"
                        data-id="${item.id}"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   CARD ACTION
========================================================= */

function bindCardActions() {

    document
        .querySelectorAll(".btn-wisata-edit")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );

                    editWisata(id);

                }
            );

        });


    document
        .querySelectorAll(".btn-wisata-delete")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );

                    deleteWisata(id);

                }
            );

        });

}


/* =========================================================
   TOMBOL TAMBAH
========================================================= */

function bindTambahButton() {

    let button =
        findElement([
            "btnTambahWisata",
            "addWisataBtn",
            "tambahWisataBtn"
        ]);


    /*
     * Jika ID tidak ditemukan,
     * cari tombol berdasarkan teks.
     */

    if (!button) {

        const elements =
            document.querySelectorAll(
                "button, a"
            );


        elements.forEach(function (element) {

            const text =
                element.textContent
                    .trim()
                    .toLowerCase();


            if (
                !button &&
                text.includes("tambah wisata")
            ) {

                button = element;

            }

        });

    }


    if (!button) {

        console.warn(
            "Tombol Tambah Wisata tidak ditemukan."
        );

        return;

    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openWisataModal();

        }
    );

}


/* =========================================================
   MODAL WISATA
========================================================= */

function createWisataModal() {

    if (
        document.getElementById(
            "wisataModal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement("div");


    modal.id =
        "wisataModal";

    modal.className =
        "wisata-modal-overlay";


    modal.innerHTML = `

        <div class="wisata-modal">

            <div class="wisata-modal-header">

                <div>

                    <span>
                        EKOSISTEM DIGITAL
                    </span>

                    <h3 id="wisataModalTitle">
                        <i class="fa-solid fa-mountain-sun"></i>
                        Tambah Destinasi Wisata
                    </h3>

                    <p>
                        Kelola informasi destinasi wisata
                        Dayeuhluhur.
                    </p>

                </div>


                <button
                    type="button"
                    class="wisata-modal-close"
                    id="closeWisataModal"
                >

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>


            <form
                id="formWisata"
                class="wisata-modal-body"
            >

                <input
                    type="hidden"
                    id="wisataId"
                >


                <div class="row g-3">

                    <div class="col-md-8">

                        <label>
                            Nama Destinasi *
                        </label>

                        <input
                            type="text"
                            id="wisataNama"
                            class="form-control"
                            placeholder="Contoh: Curug Cimandaway"
                            required
                        >

                    </div>


                    <div class="col-md-4">

                        <label>
                            Ikon
                        </label>

                        <input
                            type="text"
                            id="wisataIkon"
                            class="form-control"
                            placeholder="💦"
                            value="🏞️"
                        >

                    </div>


                    <div class="col-md-4">

                        <label>
                            Kategori *
                        </label>

                        <select
                            id="wisataKategori"
                            class="form-select"
                            required
                        >

                            <option value="">
                                Pilih kategori
                            </option>

                            <option value="Curug">
                                Curug
                            </option>

                            <option value="Bukit">
                                Bukit
                            </option>

                            <option value="Alam">
                                Alam
                            </option>

                            <option value="Sungai">
                                Sungai
                            </option>

                            <option value="Camping">
                                Camping
                            </option>

                            <option value="Wisata Desa">
                                Wisata Desa
                            </option>

                        </select>

                    </div>


                    <div class="col-md-4">

                        <label>
                            Desa *
                        </label>

                        <select
                            id="wisataDesa"
                            class="form-select"
                            required
                        >

                            <option value="">
                                Pilih desa
                            </option>

                            <option>Panulisan</option>
                            <option>Hanum</option>
                            <option>Bolang</option>
                            <option>Datar</option>
                            <option>Dayeuhluhur</option>
                            <option>Matenggeng</option>
                            <option>Cijeruk</option>
                            <option>Cikalong</option>
                            <option>Ciwalen</option>
                            <option>Panulisan Barat</option>
                            <option>Sadabumi</option>
                            <option>Sumpinghayu</option>
                            <option>Kutaagung</option>
                            <option>Bingkeng</option>

                        </select>

                    </div>


                    <div class="col-md-4">

                        <label>
                            Jenis Wisata
                        </label>

                        <select
                            id="wisataJenis"
                            class="form-select"
                        >

                            <option value="Wisata Alam">
                                Wisata Alam
                            </option>

                            <option value="Wisata Desa">
                                Wisata Desa
                            </option>

                            <option value="Wisata Buatan">
                                Wisata Buatan
                            </option>

                            <option value="Wisata Edukasi">
                                Wisata Edukasi
                            </option>

                        </select>

                    </div>


                    <div class="col-md-6">

                        <label>
                            Status
                        </label>

                        <select
                            id="wisataStatus"
                            class="form-select"
                        >

                            <option value="Destinasi Unggulan">
                                Destinasi Unggulan
                            </option>

                            <option value="Potensi Wisata">
                                Potensi Wisata
                            </option>

                        </select>

                    </div>


                    <div class="col-md-6">

                        <label>
                            URL Google Maps
                        </label>

                        <input
                            type="url"
                            id="wisataMaps"
                            class="form-control"
                            placeholder="https://www.google.com/maps/..."
                        >

                    </div>


                    <div class="col-12">

                        <label>
                            Gambar
                        </label>

                        <input
                            type="text"
                            id="wisataGambar"
                            class="form-control"
                            placeholder="assets/images/wisata/nama.jpg"
                        >

                    </div>


                    <div class="col-12">

                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            id="wisataDeskripsi"
                            class="form-control"
                            rows="4"
                            placeholder="Deskripsi destinasi wisata..."
                        ></textarea>

                    </div>

                </div>


                <div class="wisata-modal-footer">

                    <button
                        type="button"
                        class="btn-modal-cancel"
                        id="cancelWisataModal"
                    >

                        Batal

                    </button>


                    <button
                        type="submit"
                        class="btn-modal-save"
                    >

                        <i class="fa-solid fa-floppy-disk"></i>

                        Simpan Wisata

                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    bindModalEvents();

}


/* =========================================================
   MODAL EVENTS
========================================================= */

function bindModalEvents() {

    const modal =
        document.getElementById(
            "wisataModal"
        );


    if (!modal) {
        return;
    }


    document
        .getElementById(
            "closeWisataModal"
        )
        ?.addEventListener(
            "click",
            closeWisataModal
        );


    document
        .getElementById(
            "cancelWisataModal"
        )
        ?.addEventListener(
            "click",
            closeWisataModal
        );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeWisataModal();

            }

        }
    );


    document
        .getElementById(
            "formWisata"
        )
        ?.addEventListener(
            "submit",
            saveWisata
        );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeWisataModal();

            }

        }
    );

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openWisataModal(data = null) {

    createWisataModal();


    const modal =
        document.getElementById(
            "wisataModal"
        );


    const title =
        document.getElementById(
            "wisataModalTitle"
        );


    const form =
        document.getElementById(
            "formWisata"
        );


    if (!modal || !form) {
        return;
    }


    form.reset();


    if (data) {

        title.innerHTML = `

            <i class="fa-solid fa-pen"></i>

            Edit Destinasi Wisata

        `;


        setValue(
            "wisataId",
            data.id
        );

        setValue(
            "wisataNama",
            data.nama
        );

        setValue(
            "wisataIkon",
            data.ikon || "🏞️"
        );

        setValue(
            "wisataKategori",
            data.kategori
        );

        setValue(
            "wisataDesa",
            data.desa
        );

        setValue(
            "wisataJenis",
            data.jenis || "Wisata Alam"
        );

        setValue(
            "wisataStatus",
            data.status || "Potensi Wisata"
        );

        setValue(
            "wisataMaps",
            data.maps || ""
        );

        setValue(
            "wisataGambar",
            data.gambar || ""
        );

        setValue(
            "wisataDeskripsi",
            data.deskripsi || ""
        );

    }

    else {

        title.innerHTML = `

            <i class="fa-solid fa-mountain-sun"></i>

            Tambah Destinasi Wisata

        `;


        setValue(
            "wisataId",
            ""
        );

        setValue(
            "wisataIkon",
            "🏞️"
        );

        setValue(
            "wisataJenis",
            "Wisata Alam"
        );

        setValue(
            "wisataStatus",
            "Potensi Wisata"
        );

    }


    modal.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open-custom"
    );


    setTimeout(function () {

        document
            .getElementById(
                "wisataNama"
            )
            ?.focus();

    }, 150);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeWisataModal() {

    const modal =
        document.getElementById(
            "wisataModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open-custom"
    );

}


/* =========================================================
   SAVE WISATA
========================================================= */

function saveWisata(event) {

    event.preventDefault();


    const nama =
        getValue("wisataNama");

    const kategori =
        getValue("wisataKategori");

    const desa =
        getValue("wisataDesa");


    if (
        !nama ||
        !kategori ||
        !desa
    ) {

        showWisataAlert(
            "warning",
            "Mohon lengkapi nama, kategori dan desa."
        );

        return;

    }


    const data =
        window.plazaWisataData || [];


    const idValue =
        getValue("wisataId");


    /*
     * EDIT
     */

    if (idValue) {

        const id =
            Number(idValue);


        const index =
            data.findIndex(
                function (item) {

                    return Number(
                        item.id
                    ) === id;

                }
            );


        if (index !== -1) {

            data[index] = {

                ...data[index],

                nama: nama,

                slug:
                    createSlug(nama),

                ikon:
                    getValue("wisataIkon") ||
                    "🏞️",

                kategori:
                    kategori,

                desa:
                    desa,

                jenis:
                    getValue("wisataJenis") ||
                    "Wisata Alam",

                status:
                    getValue("wisataStatus") ||
                    "Potensi Wisata",

                maps:
                    getValue("wisataMaps"),

                gambar:
                    getValue("wisataGambar"),

                deskripsi:
                    getValue("wisataDeskripsi")

            };


            saveUpdatedLocalData(
                data
            );


            window.plazaWisataData =
                data;


            updateWisataStatistics();

            populateFilters();

            renderWisata();

            closeWisataModal();


            showWisataAlert(
                "success",
                "Destinasi <strong>" +
                escapeHTML(nama) +
                "</strong> berhasil diperbarui."
            );


            return;

        }

    }


    /*
     * TAMBAH DATA BARU
     */

    const newId =
        getNextWisataId(
            data
        );


    const newWisata = {

        id: newId,

        nama: nama,

        slug:
            createSlug(nama),

        kategori:
            kategori,

        ikon:
            getValue("wisataIkon") ||
            "🏞️",

        desa:
            desa,

        jenis:
            getValue("wisataJenis") ||
            "Wisata Alam",

        status:
            getValue("wisataStatus") ||
            "Potensi Wisata",

        deskripsi:
            getValue("wisataDeskripsi"),

        gambar:
            getValue("wisataGambar") ||
            "assets/images/wisata/default.jpg",

        maps:
            getValue("wisataMaps"),

        tanggal:
            new Date()
                .toISOString()
                .split("T")[0]

    };


    const localData =
        getStoredWisata();


    localData.push(
        newWisata
    );


    if (
        !saveStoredWisata(
            localData
        )
    ) {

        showWisataAlert(
            "danger",
            "Data wisata gagal disimpan."
        );

        return;

    }


    window.plazaWisataData = [

        ...(window.plazaWisataJson || []),

        ...localData

    ];


    updateWisataStatistics();

    populateFilters();

    renderWisata();

    closeWisataModal();


    showWisataAlert(
        "success",
        "Destinasi <strong>" +
        escapeHTML(nama) +
        "</strong> berhasil ditambahkan."
    );


    console.log(
        "Wisata baru:",
        newWisata
    );

}


/* =========================================================
   UPDATE LOCAL DATA
========================================================= */

function saveUpdatedLocalData(data) {

    const jsonIds =
        (window.plazaWisataJson || [])
            .map(function (item) {
                return Number(item.id);
            });


    const localData =
        data.filter(function (item) {

            return !jsonIds.includes(
                Number(item.id)
            );

        });


    saveStoredWisata(
        localData
    );

}


/* =========================================================
   DELETE
========================================================= */

function deleteWisata(id) {

    const data =
        window.plazaWisataData || [];


    const item =
        data.find(function (wisata) {

            return Number(
                wisata.id
            ) === Number(id);

        });


    if (!item) {
        return;
    }


    const yakin =
        confirm(
            "Hapus destinasi wisata \"" +
            item.nama +
            "\"?"
        );


    if (!yakin) {
        return;
    }


    const jsonIds =
        (window.plazaWisataJson || [])
            .map(function (wisata) {

                return Number(
                    wisata.id
                );

            });


    /*
     * Jika data berasal dari JSON,
     * kita tidak menghapus JSON.
     * Kita membuat daftar ID yang dihapus.
     */

    if (
        jsonIds.includes(
            Number(id)
        )
    ) {

        let deleted =
            getDeletedWisata();


        if (
            !deleted.includes(
                Number(id)
            )
        ) {

            deleted.push(
                Number(id)
            );

        }


        localStorage.setItem(
            "plazaWisataDeleted",
            JSON.stringify(
                deleted
            )
        );

    }

    else {

        /*
         * Data lokal
         */

        const localData =
            getStoredWisata()
                .filter(function (wisata) {

                    return Number(
                        wisata.id
                    ) !== Number(id);

                });


        saveStoredWisata(
            localData
        );

    }


    /*
     * Update tampilan
     */

    window.plazaWisataData =
        getVisibleWisataData();


    updateWisataStatistics();

    populateFilters();

    renderWisata();


    showWisataAlert(
        "success",
        "Destinasi <strong>" +
        escapeHTML(item.nama) +
        "</strong> berhasil dihapus."
    );

}


/* =========================================================
   DATA YANG DITAMPILKAN
========================================================= */

function getVisibleWisataData() {

    const jsonData =
        (window.plazaWisataJson || [])
            .filter(function (item) {

                return !getDeletedWisata()
                    .includes(
                        Number(item.id)
                    );

            });


    const localData =
        getStoredWisata();


    return [
        ...jsonData,
        ...localData
    ];

}


/* =========================================================
   DELETED DATA
========================================================= */

function getDeletedWisata() {

    try {

        const stored =
            localStorage.getItem(
                "plazaWisataDeleted"
            );


        if (!stored) {
            return [];
        }


        const parsed =
            JSON.parse(stored);


        return Array.isArray(parsed)
            ? parsed.map(Number)
            : [];

    }

    catch (error) {

        return [];

    }

}


/* =========================================================
   EDIT
========================================================= */

function editWisata(id) {

    const data =
        window.plazaWisataData || [];


    const item =
        data.find(function (wisata) {

            return Number(
                wisata.id
            ) === Number(id);

        });


    if (!item) {

        showWisataAlert(
            "danger",
            "Data wisata tidak ditemukan."
        );

        return;

    }


    openWisataModal(
        item
    );

}


/* =========================================================
   NEXT ID
========================================================= */

function getNextWisataId(data) {

    if (
        !data ||
        data.length === 0
    ) {

        return 1;

    }


    const ids =
        data.map(function (item) {

            return Number(
                item.id
            ) || 0;

        });


    return Math.max(
        ...ids
    ) + 1;

}


/* =========================================================
   RESET FILTER
========================================================= */

function resetWisataFilter() {

    [
        "wisataSearch",
        "searchWisata",
        "searchInput"
    ]
    .forEach(function (id) {

        setValue(
            id,
            ""
        );

    });


    [
        "wisataKategoriFilter",
        "filterKategori",
        "wisataDesaFilter",
        "filterDesa",
        "wisataStatusFilter",
        "filterStatus"
    ]
    .forEach(function (id) {

        setValue(
            id,
            ""
        );

    });


    renderWisata();

}


/* =========================================================
   ALERT
========================================================= */

function showWisataAlert(
    type,
    message
) {

    const old =
        document.querySelector(
            ".wisata-toast"
        );


    if (old) {
        old.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "wisata-toast " +
        type;


    let icon =
        "fa-circle-info";


    if (type === "success") {

        icon =
            "fa-circle-check";

    }

    else if (type === "warning") {

        icon =
            "fa-triangle-exclamation";

    }

    else if (type === "danger") {

        icon =
            "fa-circle-xmark";

    }


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="fa-solid ${icon}"></i>

        </div>

        <div class="toast-content">

            ${message}

        </div>

        <button
            type="button"
            class="toast-close"
        >

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(function () {

        toast.classList.add(
            "show"
        );

    });


    toast
        .querySelector(
            ".toast-close"
        )
        ?.addEventListener(
            "click",
            function () {

                toast.remove();

            }
        );


    setTimeout(function () {

        if (
            document.body.contains(
                toast
            )
        ) {

            toast.classList.remove(
                "show"
            );


            setTimeout(function () {

                toast.remove();

            }, 300);

        }

    }, 4000);

}


/* =========================================================
   HELPERS
========================================================= */

function findElement(ids) {

    for (
        let i = 0;
        i < ids.length;
        i++
    ) {

        const element =
            document.getElementById(
                ids[i]
            );


        if (element) {

            return element;

        }

    }


    return null;

}


function getElementValue(ids) {

    const element =
        findElement(ids);


    if (!element) {
        return "";
    }


    return String(
        element.value || ""
    ).trim();

}


function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return String(
        element.value || ""
    ).trim();

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value ?? "";

    }

}


function setText(
    ids,
    value
) {

    if (
        typeof ids === "string"
    ) {

        ids = [ids];

    }


    ids.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value;

        }

    });

}


/* =========================================================
   SLUG
========================================================= */

function createSlug(text) {

    return String(text)

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )

        .replace(
            /\s+/g,
            "-"
        )

        .replace(
            /-+/g,
            "-"
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

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
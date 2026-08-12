/* =====================================================
   PLAZA DAYEUHLUHUR
   BUMDes DIRECTORY
   FINAL VERSION
===================================================== */

let bumdesData = [];
let currentFilter = "semua";


/* =====================================================
   DOCUMENT READY
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadBumdes();

    setupFilter();

});


/* =====================================================
   LOAD DATA BUMDES
===================================================== */

async function loadBumdes() {

    const container =
        document.getElementById("bumdesContainer");

    const emptyBox =
        document.getElementById("bumdesEmpty");


    try {

        const response =
            await fetch(
                "data/bumdes.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const data =
            await response.json();


        /* CEK FORMAT DATA */

        if (!Array.isArray(data)) {

            throw new Error(
                "Format data bukan array"
            );

        }


        /* SIMPAN DATA GLOBAL */

        bumdesData = data;

        window.bumdesData = data;


        console.log(
            "BUMDes berhasil dimuat:",
            data
        );


        /* UPDATE STATISTIK */

        updateStatistics(data);


        /* TAMPILKAN DATA */

        renderBumdes(data);


        /* SEARCH */

        setupSearch();


    }

    catch (error) {

        console.error(
            "Gagal memuat bumdes.json:",
            error
        );


        if (container) {

            container.innerHTML = "";

        }


        if (emptyBox) {

            emptyBox.style.display = "block";

            emptyBox.innerHTML = `

                <div class="bumdes-empty-icon">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                </div>

                <h3>
                    Data BUMDes gagal dimuat
                </h3>

                <p>
                    Periksa file
                    <strong>data/bumdes.json</strong>
                    dan koneksi website.
                </p>

            `;

        }

    }

}


/* =====================================================
   UPDATE STATISTICS
===================================================== */

function updateStatistics(data) {


    /* TOTAL BUMDES */

    const totalBumdes =
        document.getElementById(
            "totalBumdes"
        );


    if (totalBumdes) {

        totalBumdes.textContent =
            data.length;

    }


    /* =================================================
       DESA UNIK
    ================================================= */

    const desaBumdes =
        document.getElementById(
            "desaBumdes"
        );


    const desaSet =
        new Set();


    data.forEach(function (item) {

        const desa =
            getField(
                item,
                [
                    "desa",
                    "nama_desa",
                    "desaNama",
                    "wilayah"
                ],
                ""
            );


        if (
            desa &&
            desa !== "-"
        ) {

            desaSet.add(
                String(desa).trim()
            );

        }

    });


    if (desaBumdes) {

        desaBumdes.textContent =
            desaSet.size;

    }


    /* =================================================
       TOTAL UNIT / BIDANG USAHA
    ================================================= */

    const totalUsaha =
        document.getElementById(
            "totalUsaha"
        );


    let unitCount = 0;


    data.forEach(function (item) {

        const unit =
            getField(
                item,
                [
                    "unit_usaha",
                    "unitUsaha",
                    "unit",
                    "usaha",
                    "jumlah_unit"
                ],
                ""
            );


        /* ARRAY */

        if (Array.isArray(unit)) {

            unitCount +=
                unit.length;

        }


        /* NUMBER */

        else if (
            typeof unit === "number"
        ) {

            unitCount +=
                unit;

        }


        /* ANGKA STRING */

        else if (
            unit &&
            !isNaN(unit)
        ) {

            unitCount +=
                Number(unit);

        }


        /* TEXT */

        else if (unit) {

            unitCount += 1;

        }

    });


    if (totalUsaha) {

        totalUsaha.textContent =
            unitCount;

    }


    /* =================================================
       BUMDES AKTIF
    ================================================= */

    const bumdesAktif =
        document.getElementById(
            "bumdesAktif"
        );


    let aktif = 0;


    data.forEach(function (item) {

        const status =
            getField(
                item,
                [
                    "status",
                    "keadaan"
                ],
                ""
            );


        const statusText =
            String(status)
                .toLowerCase()
                .trim();


        if (
            statusText.includes("aktif") ||
            statusText.includes("active")
        ) {

            aktif++;

        }

    });


    if (bumdesAktif) {

        bumdesAktif.textContent =
            aktif;

    }

}


/* =====================================================
   RENDER BUMDES
===================================================== */

function renderBumdes(data) {


    const container =
        document.getElementById(
            "bumdesContainer"
        );


    const emptyBox =
        document.getElementById(
            "bumdesEmpty"
        );


    const jumlahBumdes =
        document.getElementById(
            "jumlahBumdes"
        );


    if (!container) {

        console.error(
            "Element #bumdesContainer tidak ditemukan."
        );

        return;

    }


    /* UPDATE JUMLAH */

    if (jumlahBumdes) {

        jumlahBumdes.textContent =
            data.length;

    }


    /* DATA KOSONG */

    if (!data.length) {

        container.innerHTML = "";


        if (emptyBox) {

            emptyBox.style.display =
                "block";

        }

        return;

    }


    /* SEMBUNYIKAN EMPTY STATE */

    if (emptyBox) {

        emptyBox.style.display =
            "none";

    }


    let html = "";


    data.forEach(function (item) {


        /* =================================================
           IDENTITAS
        ================================================= */

        const id =
            item.id ?? "";


        const nama =
            getField(
                item,
                [
                    "nama",
                    "nama_bumdes",
                    "bumdes"
                ],
                "BUMDes"
            );


        const desa =
            getField(
                item,
                [
                    "desa",
                    "nama_desa",
                    "desaNama",
                    "wilayah"
                ],
                "-"
            );


        const status =
            getField(
                item,
                [
                    "status",
                    "keadaan"
                ],
                "Segera Hadir"
            );


        const deskripsi =
            getField(
                item,
                [
                    "deskripsi",
                    "deskripsi_singkat",
                    "keterangan",
                    "profil"
                ],
                "Informasi BUMDes sedang dilengkapi."
            );


        const gambar =
            getField(
                item,
                [
                    "gambar",
                    "image",
                    "foto",
                    "logo"
                ],
                ""
            );


        const unit =
            getField(
                item,
                [
                    "unit_usaha",
                    "unitUsaha",
                    "unit",
                    "usaha"
                ],
                ""
            );


        const verified =
            item.verified === true ||
            item.verifikasi === true;


        /* =================================================
           STATUS
        ================================================= */

        const statusText =
            String(status)
                .toLowerCase()
                .trim();


        const active =
            statusText.includes("aktif") ||
            statusText.includes("active");


        const statusClass =
            active
                ? "active"
                : "pending";


        /* =================================================
           IMAGE
        ================================================= */

        let imageHTML = "";


        if (gambar) {

            imageHTML = `

                <img
                    src="${escapeHTML(gambar)}"
                    alt="${escapeHTML(nama)}"
                    onerror="
                        this.style.display='none';
                        if(this.nextElementSibling){
                            this.nextElementSibling.style.display='flex';
                        }
                    "
                >

                <div
                    class="image-placeholder"
                    style="display:none;">

                    <i class="fa-solid fa-building"></i>

                </div>

            `;

        }

        else {

            imageHTML = `

                <div class="image-placeholder">

                    <i class="fa-solid fa-building"></i>

                </div>

            `;

        }


        /* =================================================
           CARD
        ================================================= */

        html += `

            <div class="col-xl-4 col-lg-6">

                <article class="bumdes-card">


                    <!-- IMAGE -->

                    <div class="bumdes-image">

                        ${imageHTML}


                        <!-- STATUS -->

                        <span
                            class="status-badge ${statusClass}">

                            ${escapeHTML(status)}

                        </span>


                        <!-- VERIFIED -->

                        ${
                            verified
                            ?
                            `

                            <span
                                class="verified-badge"
                                title="BUMDes Terverifikasi">

                                <i
                                    class="fa-solid fa-circle-check">
                                </i>

                            </span>

                            `
                            :
                            ""
                        }

                    </div>


                    <!-- BODY -->

                    <div class="bumdes-body">


                        <!-- CATEGORY -->

                        <div class="bumdes-category">

                            <i
                                class="fa-solid fa-building">
                            </i>

                            BADAN USAHA MILIK DESA

                        </div>


                        <!-- NAME -->

                        <h3 class="bumdes-name">

                            ${escapeHTML(nama)}

                        </h3>


                        <!-- DESCRIPTION -->

                        <p class="bumdes-description">

                            ${escapeHTML(deskripsi)}

                        </p>


                        <!-- META -->

                        <div class="bumdes-meta">


                            <!-- DESA -->

                            <div
                                class="bumdes-meta-item">

                                <i
                                    class="fa-solid fa-location-dot">
                                </i>

                                <span>

                                    ${escapeHTML(desa)}

                                </span>

                            </div>


                            <!-- UNIT USAHA -->

                            ${
                                unit
                                ?
                                `

                                <div
                                    class="bumdes-meta-item">

                                    <i
                                        class="fa-solid fa-store">
                                    </i>

                                    <span>

                                        ${formatUnit(unit)}

                                    </span>

                                </div>

                                `
                                :
                                ""
                            }


                        </div>


                        <!-- BUTTON -->

                        <button
                            type="button"
                            class="bumdes-button"
                            onclick="showBumdesDetail('${escapeHTML(String(id))}')">

                            <i
                                class="fa-solid fa-eye">
                            </i>

                            Lihat BUMDes

                        </button>


                    </div>

                </article>

            </div>

        `;

    });


    container.innerHTML =
        html;

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {


    const search =
        document.getElementById(
            "searchBumdes"
        );


    if (!search) {

        return;

    }


    /* CEGAH EVENT DOBEL */

    if (
        search.dataset.initialized === "true"
    ) {

        return;

    }


    search.dataset.initialized =
        "true";


    search.addEventListener(
        "input",
        function () {


            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            /* FILTER DATA */

            let hasil =
                bumdesData.filter(
                    function (item) {


                        if (!keyword) {

                            return true;

                        }


                        return JSON.stringify(
                            item
                        )
                        .toLowerCase()
                        .includes(keyword);

                    }
                );


            /* TERAPKAN FILTER STATUS */

            hasil =
                applyStatusFilter(
                    hasil
                );


            renderBumdes(
                hasil
            );

        }
    );

}


/* =====================================================
   FILTER STATUS
===================================================== */

function setupFilter() {


    const buttons =
        document.querySelectorAll(
            ".bumdes-filter"
        );


    buttons.forEach(function (button) {


        button.addEventListener(
            "click",
            function () {


                /* HAPUS ACTIVE */

                buttons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                /* AKTIFKAN BUTTON */

                this.classList.add(
                    "active"
                );


                /* SIMPAN FILTER */

                currentFilter =
                    this.dataset.filter ||
                    "semua";


                /* AMBIL KEYWORD */

                const search =
                    document.getElementById(
                        "searchBumdes"
                    );


                const keyword =
                    search
                    ?
                    search.value
                        .toLowerCase()
                        .trim()
                    :
                    "";


                /* FILTER DATA */

                let hasil =
                    bumdesData.filter(
                        function (item) {


                            /* SEARCH */

                            if (
                                keyword &&
                                !JSON.stringify(item)
                                    .toLowerCase()
                                    .includes(keyword)
                            ) {

                                return false;

                            }


                            return true;

                        }
                    );


                /* STATUS */

                hasil =
                    applyStatusFilter(
                        hasil
                    );


                renderBumdes(
                    hasil
                );

            }
        );

    });

}


/* =====================================================
   APPLY STATUS FILTER
===================================================== */

function applyStatusFilter(data) {


    if (
        currentFilter === "semua"
    ) {

        return data;

    }


    return data.filter(
        function (item) {


            const status =
                getField(
                    item,
                    [
                        "status",
                        "keadaan"
                    ],
                    ""
                );


            const statusText =
                String(status)
                    .toLowerCase()
                    .trim();


            if (
                currentFilter === "Aktif"
            ) {

                return (
                    statusText.includes(
                        "aktif"
                    ) ||
                    statusText.includes(
                        "active"
                    )
                );

            }


            if (
                currentFilter === "Segera Hadir"
            ) {

                return (
                    statusText.includes(
                        "segera"
                    ) ||
                    statusText.includes(
                        "hadir"
                    ) ||
                    statusText === ""
                );

            }


            return true;

        }
    );

}


/* =====================================================
   DETAIL BUMDES
===================================================== */

function showBumdesDetail(id) {


    const data =
        window.bumdesData || [];


    const item =
        data.find(
            function (row) {

                return String(row.id)
                    === String(id);

            }
        );


    if (!item) {

        console.warn(
            "Data BUMDes tidak ditemukan:",
            id
        );

        return;

    }


    /* =================================================
       FIELD
    ================================================= */

    const nama =
        getField(
            item,
            [
                "nama",
                "nama_bumdes",
                "bumdes"
            ],
            "BUMDes"
        );


    const desa =
        getField(
            item,
            [
                "desa",
                "nama_desa",
                "desaNama",
                "wilayah"
            ],
            "-"
        );


    const status =
        getField(
            item,
            [
                "status",
                "keadaan"
            ],
            "-"
        );


    const deskripsi =
        getField(
            item,
            [
                "deskripsi",
                "deskripsi_singkat",
                "keterangan",
                "profil"
            ],
            "-"
        );


    const unit =
        getField(
            item,
            [
                "unit_usaha",
                "unitUsaha",
                "unit",
                "usaha"
            ],
            "-"
        );


    const produk =
        getField(
            item,
            [
                "produk",
                "produk_unggulan",
                "potensi"
            ],
            "-"
        );


    /* =================================================
       MODAL
    ================================================= */

    const modalTitle =
        document.getElementById(
            "modalBumdesNama"
        );


    const modalContent =
        document.getElementById(
            "modalBumdesContent"
        );


    /* =================================================
       CEK MODAL
    ================================================= */

    if (
        !modalTitle ||
        !modalContent
    ) {

        console.warn(
            "Elemen modal BUMDes belum tersedia di HTML."
        );

        /*
         * Jika modal belum dibuat,
         * tampilkan informasi melalui alert
         */

        alert(
            nama +
            "\n\n" +
            "Desa: " +
            desa +
            "\n" +
            "Status: " +
            status
        );

        return;

    }


    modalTitle.textContent =
        nama;


    modalContent.innerHTML = `

        <div class="modal-detail-icon">

            <i class="fa-solid fa-building"></i>

        </div>


        <h3 class="fw-bold mb-3">

            ${escapeHTML(nama)}

        </h3>


        <div class="modal-detail-item">

            <strong>

                <i
                    class="fa-solid fa-location-dot text-success">
                </i>

                Desa

            </strong>

            <span>

                ${escapeHTML(desa)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i
                    class="fa-solid fa-circle-check text-success">
                </i>

                Status

            </strong>

            <span>

                ${escapeHTML(status)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i
                    class="fa-solid fa-store text-success">
                </i>

                Unit Usaha

            </strong>

            <span>

                ${formatUnit(unit)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i
                    class="fa-solid fa-box-open text-success">
                </i>

                Produk / Potensi

            </strong>

            <span>

                ${escapeHTML(produk)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i
                    class="fa-solid fa-circle-info text-success">
                </i>

                Tentang BUMDes

            </strong>

            <span>

                ${escapeHTML(deskripsi)}

            </span>

        </div>

    `;


    /* =================================================
       BOOTSTRAP MODAL
    ================================================= */

    const modalElement =
        document.getElementById(
            "bumdesModal"
        );


    if (!modalElement) {

        return;

    }


    if (
        typeof bootstrap === "undefined"
    ) {

        console.warn(
            "Bootstrap JS belum tersedia."
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
   HELPER FIELD
===================================================== */

function getField(
    object,
    fields,
    fallback = "-"
) {


    for (
        let i = 0;
        i < fields.length;
        i++
    ) {


        const field =
            fields[i];


        if (
            object[field] !== undefined &&
            object[field] !== null &&
            object[field] !== ""
        ) {

            return object[field];

        }

    }


    return fallback;

}


/* =====================================================
   FORMAT UNIT USAHA
===================================================== */

function formatUnit(value) {


    if (
        Array.isArray(value)
    ) {

        return escapeHTML(
            value.join(", ")
        );

    }


    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "-";

    }


    return escapeHTML(
        String(value)
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

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
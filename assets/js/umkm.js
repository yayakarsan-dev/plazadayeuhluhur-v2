/* =========================================================
   PLAZA DAYEUHLUHUR
   DIREKTORI UMKM
   UMKM.JS — FINAL FIX
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("DIREKTORI UMKM");
    console.log("UMKM.JS FINAL");
    console.log("====================================");

    loadUMKM();

});


/* =========================================================
   LOAD DATABASE UMKM
========================================================= */

async function loadUMKM() {

    const container = document.getElementById("umkmContainer");

    if (!container) {
        console.error("umkmContainer tidak ditemukan.");
        return;
    }

    try {

        const response = await fetch("data/umkm.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                "Gagal membaca umkm.json. HTTP " +
                response.status
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "Format umkm.json harus berupa array."
            );
        }

        window.plazaUmkm = data;

        console.log(
            "UMKM berhasil dimuat:",
            data.length
        );

        renderUMKM(data);

        updateStatistics(data);

        setupSearch(data);

        setupFilter(data);

    }

    catch (error) {

        console.error(
            "ERROR UMKM:",
            error
        );

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Gagal memuat data UMKM.
                </div>
            </div>
        `;

    }

}


/* =========================================================
   RENDER UMKM
========================================================= */

function renderUMKM(data) {

    const container =
        document.getElementById("umkmContainer");

    if (!container) return;


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="col-12 text-center py-5">

                <i
                    class="fa-solid fa-store-slash"
                    style="font-size:50px;">
                </i>

                <h4 class="mt-3">
                    Belum ada data UMKM
                </h4>

            </div>
        `;

        updateResultCount(0);

        return;

    }


    let html = "";


    data.forEach(function (item) {

        const status =
            item.status || "Buka";


        const statusLower =
            String(status).toLowerCase();


        const isOpen =
            statusLower === "buka";


        const statusClass =
            isOpen
                ? "open"
                : "closed";


        /*
         * LINK DETAIL UMKM
         *
         * Karena umkm.html berada di ROOT,
         * maka tujuan:
         *
         * pages/umkm/detail.html?id=ID
         */

        const detailLink =
            "pages/umkm/detail.html?id=" +
            encodeURIComponent(item.id);


        html += `

            <div class="col-lg-4 col-md-6 mb-4">

                <div class="umkm-card h-100">


                    <!-- =========================
                         GAMBAR
                    ========================== -->

                    <div class="umkm-card-image">

                        <img
                            src="${escapeHTML(
                                item.gambar ||
                                "assets/images/umkm/default.jpg"
                            )}"
                            alt="${escapeHTML(
                                item.nama || "UMKM"
                            )}"
                            onerror="
                                this.onerror=null;
                                this.src='assets/images/umkm/default.jpg';
                            "
                        >


                        <!-- KATEGORI -->

                        <span class="umkm-kategori">

                            ${escapeHTML(
                                item.kategori || "Lainnya"
                            )}

                        </span>


                        <!-- STATUS -->

                        <span class="
                            umkm-status
                            ${statusClass}
                        ">

                            <span class="status-dot"></span>

                            ${escapeHTML(status)}

                        </span>

                    </div>


                    <!-- =========================
                         BODY
                    ========================== -->

                    <div class="umkm-card-body">


                        <h3>

                            ${escapeHTML(
                                item.nama || "-"
                            )}

                        </h3>


                        <div class="umkm-produk">

                            <i class="fa-solid fa-briefcase"></i>

                            ${escapeHTML(
                                item.produk || "-"
                            )}

                        </div>


                        <div class="umkm-info">

                            <i class="fa-solid fa-location-dot"></i>

                            ${escapeHTML(
                                item.desa || "-"
                            )}

                        </div>


                        <div class="umkm-rating">

                            <i class="fa-solid fa-star"></i>

                            ${escapeHTML(
                                item.rating || "0"
                            )}

                        </div>


                        <div class="umkm-divider"></div>


                        <!-- =========================
                             TOMBOL DETAIL
                        ========================== -->

                        <a
                            href="${detailLink}"
                            class="btn-lihat-umkm"
                        >

                            <i class="fa-solid fa-eye"></i>

                            Lihat UMKM

                        </a>


                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML = html;


    updateResultCount(data.length);


    console.log(
        "Kartu UMKM berhasil ditampilkan:",
        data.length
    );

}


/* =========================================================
   STATISTIK
========================================================= */

function updateStatistics(data) {

    const total =
        data.length;


    const buka =
        data.filter(function (item) {

            return String(
                item.status || ""
            ).toLowerCase() === "buka";

        }).length;


    const kuliner =
        data.filter(function (item) {

            return String(
                item.kategori || ""
            ).toLowerCase() === "kuliner";

        }).length;


    const desa =
        new Set(
            data.map(function (item) {

                return item.desa;

            })
        ).size;


    setText("totalUmkm", total);

    setText("totalUmkmBuka", buka);

    setText("totalKuliner", kuliner);

    setText("totalUmkmDesa", desa);

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch(data) {

    const searchInput =
        document.getElementById("searchUmkm");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            applyFilter(data);

        }
    );

}


/* =========================================================
   FILTER KATEGORI
========================================================= */

function setupFilter(data) {

    const filter =
        document.getElementById("filterKategori");


    if (!filter) {
        return;
    }


    filter.addEventListener(
        "change",
        function () {

            applyFilter(data);

        }
    );

}


/* =========================================================
   APPLY SEARCH + FILTER
========================================================= */

function applyFilter(data) {

    const searchInput =
        document.getElementById("searchUmkm");


    const filter =
        document.getElementById("filterKategori");


    const keyword =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const kategori =
        filter
            ? filter.value
            : "";


    const hasil =
        data.filter(function (item) {


            const text = (

                (item.nama || "") +
                " " +
                (item.kategori || "") +
                " " +
                (item.desa || "") +
                " " +
                (item.produk || "")

            ).toLowerCase();


            const cocokKeyword =
                text.includes(keyword);


            const cocokKategori =
                kategori === "" ||
                item.kategori === kategori;


            return (
                cocokKeyword &&
                cocokKategori
            );

        });


    renderUMKM(hasil);

}


/* =========================================================
   RESULT COUNT
========================================================= */

function updateResultCount(total) {

    const element =
        document.getElementById(
            "umkmResultCount"
        );


    if (!element) {
        return;
    }


    element.textContent =
        "Menampilkan " +
        total +
        " UMKM";

}


/* =========================================================
   HELPER TEXT
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

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
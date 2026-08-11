/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM DIRECTORY ENGINE V2
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("UMKM DIRECTORY ENGINE V2");
    console.log("====================================");

    loadUMKM();

    setupSearch();
    setupFilter();

});


/* =====================================================
   LOAD DATABASE UMKM
===================================================== */

async function loadUMKM() {

    const container =
        document.getElementById("umkmContainer");

    if (!container) {

        console.error(
            "umkmContainer tidak ditemukan."
        );

        return;

    }


    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-success"
                 role="status"></div>

            <p class="mt-3 text-muted">
                Memuat data UMKM...
            </p>
        </div>
    `;


    try {

        const response =
            await fetch(
                "data/umkm.json",
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


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Format data/umkm.json harus berupa array."
            );

        }


        console.log(
            "Data UMKM berhasil dibaca:",
            data.length
        );


        window.plazaUMKM =
            data;


        updateStatistics(
            data
        );


        renderUMKM(
            data
        );


    }

    catch (error) {

        console.error(
            "Gagal membaca database UMKM:",
            error
        );


        container.innerHTML = `
            <div class="col-12">

                <div class="alert alert-danger text-center">

                    <i class="fa-solid fa-triangle-exclamation me-2"></i>

                    Gagal memuat data UMKM.

                    <br>

                    <small>
                        Periksa data/umkm.json
                    </small>

                </div>

            </div>
        `;

    }

}


/* =====================================================
   STATISTIK
===================================================== */

function updateStatistics(
    data
) {

    const total =
        data.length;


    const aktif =
        data.filter(function (item) {

            return String(
                item.status || "Buka"
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


    setValue(
        "totalUmkm",
        total
    );


    setValue(
        "totalUmkmBuka",
        aktif
    );


    setValue(
        "totalKuliner",
        kuliner
    );


    setValue(
        "totalUmkmDesa",
        desa
    );

}


/* =====================================================
   RENDER UMKM
===================================================== */

function renderUMKM(
    data
) {

    const container =
        document.getElementById(
            "umkmContainer"
        );


    if (!container) {

        return;

    }


    if (!data.length) {

        container.innerHTML = `

            <div class="col-12 text-center py-5">

                <i class="fa-solid fa-store-slash fa-3x text-muted mb-3"></i>

                <h5>
                    UMKM belum ditemukan
                </h5>

                <p class="text-muted">
                    Silakan gunakan kata kunci atau kategori lain.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    data.forEach(function (
        umkm
    ) {

        const gambar =
            umkm.gambar ||
            "assets/images/umkm/default.jpg";


        const status =
            umkm.status ||
            "Buka";


        const rating =
            umkm.rating ||
            "0";


        html += `

            <div class="col-xl-3 col-lg-4 col-md-6 mb-4">

                <div class="card umkm-card h-100 shadow-sm">

                    <!-- FOTO -->

                    <div class="umkm-image-wrapper">

                        <img
                            src="${escapeHTML(gambar)}"
                            class="card-img-top umkm-image"
                            alt="${escapeHTML(umkm.nama || "UMKM")}"

                            onerror="
                                this.onerror=null;
                                this.src='assets/images/umkm/default.jpg';
                            "
                        >

                        <!-- KATEGORI -->

                        <span class="umkm-category">

                            ${escapeHTML(
                                umkm.kategori ||
                                "Lainnya"
                            )}

                        </span>

                    </div>


                    <!-- BODY -->

                    <div class="card-body d-flex flex-column">


                        <!-- NAMA -->

                        <h5 class="fw-bold mb-2">

                            ${escapeHTML(
                                umkm.nama ||
                                "-"
                            )}

                        </h5>


                        <!-- DESA -->

                        <div class="umkm-info mb-2">

                            <i class="fa-solid fa-location-dot text-success me-2"></i>

                            ${escapeHTML(
                                umkm.desa ||
                                "-"
                            )}

                        </div>


                        <!-- PRODUK -->

                        <div class="umkm-info mb-2">

                            <i class="fa-solid fa-basket-shopping text-success me-2"></i>

                            ${escapeHTML(
                                umkm.produk ||
                                "-"
                            )}

                        </div>


                        <!-- RATING -->

                        <div class="mb-3">

                            <span class="text-warning">

                                <i class="fa-solid fa-star"></i>

                            </span>

                            <strong>

                                ${escapeHTML(
                                    rating
                                )}

                            </strong>

                        </div>


                        <!-- STATUS -->

                        <div class="mb-3">

                            <span class="badge ${
                                String(status)
                                .toLowerCase() === "buka"
                                ? "bg-success"
                                : "bg-secondary"
                            }">

                                <i class="fa-solid fa-circle me-1"></i>

                                ${escapeHTML(
                                    status
                                )}

                            </span>

                        </div>


                        <!-- TOMBOL -->

                        <div class="mt-auto">

                            <a
                                href="pages/umkm/detail.html?id=${encodeURIComponent(
                                    umkm.id
                                )}"

                                class="btn btn-success w-100"

                            >

                                <i class="fa-solid fa-store me-2"></i>

                                Lihat UMKM

                            </a>

                        </div>


                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML =
        html;


    console.log(
        "UMKM berhasil ditampilkan:",
        data.length
    );

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    const search =
        document.getElementById(
            "searchUmkm"
        );


    if (!search) {

        return;

    }


    search.addEventListener(
        "input",
        function () {

            filterUMKM();

        }
    );

}


/* =====================================================
   FILTER
===================================================== */

function setupFilter() {

    const filter =
        document.getElementById(
            "filterKategori"
        );


    if (!filter) {

        return;

    }


    filter.addEventListener(
        "change",
        function () {

            filterUMKM();

        }
    );

}


/* =====================================================
   FILTER ENGINE
===================================================== */

function filterUMKM() {

    const search =
        document.getElementById(
            "searchUmkm"
        );


    const filter =
        document.getElementById(
            "filterKategori"
        );


    const keyword =
        search
        ? search.value
            .toLowerCase()
            .trim()
        : "";


    const kategori =
        filter
        ? filter.value
        : "";


    const data =
        window.plazaUMKM ||
        [];


    const hasil =
        data.filter(function (
            umkm
        ) {

            const teks = (

                (umkm.nama || "") +
                " " +
                (umkm.kategori || "") +
                " " +
                (umkm.desa || "") +
                " " +
                (umkm.produk || "")

            ).toLowerCase();


            const cocokKeyword =
                teks.includes(
                    keyword
                );


            const cocokKategori =
                kategori === "" ||
                umkm.kategori === kategori;


            return (
                cocokKeyword &&
                cocokKategori
            );

        });


    renderUMKM(
        hasil
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
   ESCAPE HTML
===================================================== */

function escapeHTML(
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


/* =====================================================
   SELESAI
===================================================== */

console.log(
    "UMKM Directory Engine V2 siap digunakan."
);
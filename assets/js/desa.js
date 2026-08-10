```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA DIRECTORY ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("DESA DIRECTORY ENGINE");
    console.log("====================================");

    loadDesa();
    setupSearchDesa();

});


/* =====================================================
   LOAD DATA DESA
===================================================== */

async function loadDesa() {

    const container =
        document.getElementById("desaContainer");

    if (!container) {

        console.error(
            "ERROR: desaContainer tidak ditemukan."
        );

        return;
    }


    console.log(
        "Mencoba membaca: data/desa.json"
    );


    try {

        const response =
            await fetch("data/desa.json", {
                cache: "no-store"
            });


        console.log(
            "Status desa.json:",
            response.status
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


        console.log(
            "Isi data desa:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "desa.json harus berupa ARRAY."
            );

        }


        console.log(
            "Jumlah desa:",
            data.length
        );


        window.plazaDesa =
            data;


        renderDesa(data);

        updateStatistikDesa(data);

    }


    catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "GAGAL MEMBACA DATA DESA"
        );

        console.error(
            error
        );

        console.error(
            "===================================="
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center">

                    <i class="fa-solid fa-triangle-exclamation fa-2x mb-3"></i>

                    <h5>
                        Data Desa Tidak Dapat Dimuat
                    </h5>

                    <p class="mb-0">
                        Silakan periksa file
                        <strong>data/desa.json</strong>
                    </p>

                </div>

            </div>

        `;

    }

}


/* =====================================================
   RENDER DESA
===================================================== */

function renderDesa(data) {

    const container =
        document.getElementById(
            "desaContainer"
        );


    if (!container) {
        return;
    }


    let html = "";


    data.forEach(function (item, index) {

        const gambar =
            item.gambar ||
            "assets/images/desa/default.jpg";


        const nama =
            item.nama ||
            "Desa";


        const status =
            item.status ||
            "Aktif";


        const verified =
            item.verified
                ? `
                    <i
                        class="fa-solid fa-circle-check text-primary ms-1"
                        title="Verified by PLAZA DAYEUHLUHUR">
                    </i>
                  `
                : "";


        html += `

            <div
                class="col-lg-4 col-md-6 mb-4 desa-item">

                <div
                    class="card desa-card shadow h-100 overflow-hidden">


                    <!-- GAMBAR -->

                    <img
                        src="${escapeHTML(gambar)}"
                        class="card-img-top"
                        alt="${escapeHTML(nama)}"
                        loading="lazy"
                        onerror="this.src='assets/images/desa/default.jpg'">


                    <div class="card-body d-flex flex-column">


                        <!-- STATUS -->

                        <span
                            class="badge bg-success mb-2 align-self-start">

                            ${escapeHTML(status)}

                        </span>


                        <!-- NAMA DESA -->

                        <h4 class="fw-bold">

                            ${escapeHTML(nama)}

                            ${verified}

                        </h4>


                        <!-- POTENSI -->

                        <p class="text-success fw-semibold">

                            ${escapeHTML(
                                item.potensi || "-"
                            )}

                        </p>


                        <!-- PRODUK -->

                        <p class="small text-muted">

                            🎁 Produk Unggulan :

                            <b>
                                ${escapeHTML(
                                    item.produk || "-"
                                )}
                            </b>

                        </p>


                        <!-- STATISTIK -->

                        <div class="row mt-3">


                            <div class="col-6">

                                <div class="stat-box">

                                    👥

                                    <b>
                                        ${escapeHTML(
                                            item.penduduk || "0"
                                        )}
                                    </b>

                                    <small class="d-block">
                                        Penduduk
                                    </small>

                                </div>

                            </div>


                            <div class="col-6">

                                <div class="stat-box">

                                    🛍️

                                    <b>
                                        ${escapeHTML(
                                            item.umkm || "0"
                                        )}
                                    </b>

                                    <small class="d-block">
                                        UMKM
                                    </small>

                                </div>

                            </div>


                            <div class="col-6 mt-2">

                                <div class="stat-box">

                                    🏢

                                    <b>
                                        ${escapeHTML(
                                            item.bumdes || "0"
                                        )}
                                    </b>

                                    <small class="d-block">
                                        BUMDes
                                    </small>

                                </div>

                            </div>


                            <div class="col-6 mt-2">

                                <div class="stat-box">

                                    🌄

                                    <b>
                                        ${escapeHTML(
                                            item.wisata || "0"
                                        )}
                                    </b>

                                    <small class="d-block">
                                        Wisata
                                    </small>

                                </div>

                            </div>


                        </div>


                        <!-- TOMBOL -->

                        <a
                            href="${escapeHTML(
                                item.link || "#"
                            )}"
                            class="btn btn-success w-100 mt-auto mt-4">

                            <i
                                class="fa-solid fa-compass me-1">
                            </i>

                            Jelajahi Desa

                        </a>


                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML =
        html;


    console.log(
        "Berhasil menampilkan " +
        data.length +
        " kartu desa."
    );

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearchDesa() {

    const search =
        document.getElementById(
            "searchDesa"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            const items =
                document.querySelectorAll(
                    ".desa-item"
                );


            let jumlah =
                0;


            items.forEach(
                function (item) {

                    const text =
                        item.innerText
                            .toLowerCase();


                    if (
                        text.includes(
                            keyword
                        )
                    ) {

                        item.style.display =
                            "";

                        jumlah++;

                    }

                    else {

                        item.style.display =
                            "none";

                    }

                }
            );


            console.log(
                "Hasil pencarian:",
                jumlah
            );

        }
    );

}


/* =====================================================
   STATISTIK
===================================================== */

function updateStatistikDesa(data) {

    setValue(
        "totalDesa",
        data.length
    );


    let penduduk = 0;
    let umkm = 0;
    let bumdes = 0;


    data.forEach(
        function (item) {

            penduduk +=
                parseNumber(
                    item.penduduk
                );


            umkm +=
                parseNumber(
                    item.umkm
                );


            bumdes +=
                parseNumber(
                    item.bumdes
                );

        }
    );


    setValue(
        "totalPenduduk",
        penduduk
    );


    setValue(
        "totalUMKM",
        umkm
    );


    setValue(
        "totalBUMDes",
        bumdes
    );

}


/* =====================================================
   HELPER
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   PARSE NUMBER
===================================================== */

function parseNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return 0;

    }


    const angka =
        String(value)
            .replace(
                /\./g,
                ""
            )
            .replace(
                /,/g,
                ""
            )
            .replace(
                /[^0-9]/g,
                ""
            );


    return (
        parseInt(
            angka,
            10
        ) || 0
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(
        value || ""
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
```

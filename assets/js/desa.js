```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA DIRECTORY ENGINE V2
   Direktori 14 Desa Kecamatan Dayeuhluhur
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("DESA DIRECTORY ENGINE V2");
    console.log("====================================");

    loadDesa();
    setupSearchDesa();

});


/* =====================================================
   DATABASE DESA
===================================================== */

async function loadDesa() {

    const container =
        document.getElementById("desaContainer");


    if (!container) {

        console.error(
            "desaContainer tidak ditemukan."
        );

        return;

    }


    try {

        console.log(
            "Membaca database desa..."
        );


        const response =
            await fetch(
                "data/desa.json",
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
                "Format desa.json harus berupa array."
            );

        }


        window.plazaDesa =
            data;


        console.log(
            "Berhasil membaca " +
            data.length +
            " data desa."
        );


        renderDesa(data);

        updateStatistikDesa(data);

    }

    catch (error) {

        console.error(
            "Gagal membaca database desa:",
            error
        );


        container.innerHTML =

            '<div class="col-12">' +

                '<div class="alert alert-danger text-center">' +

                    '<i class="fa-solid fa-triangle-exclamation me-2"></i>' +

                    'Gagal membaca data desa.' +

                '</div>' +

            '</div>';

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


    if (!data.length) {

        container.innerHTML =

            '<div class="col-12">' +

                '<div class="text-center py-5 text-muted">' +

                    '<i class="fa-solid fa-house-circle-xmark fa-3x mb-3"></i>' +

                    '<h4>Data desa belum tersedia</h4>' +

                    '<p>Belum ada data desa yang dapat ditampilkan.</p>' +

                '</div>' +

            '</div>';

        return;

    }


    let html = "";


    data.forEach(function (item) {

        const gambar =
            escapeHTML(
                item.gambar ||
                "assets/images/desa/default.jpg"
            );


        const nama =
            escapeHTML(
                item.nama ||
                "Nama Desa"
            );


        const status =
            escapeHTML(
                item.status ||
                "Aktif"
            );


        const potensi =
            escapeHTML(
                item.potensi ||
                "Potensi Desa"
            );


        const produk =
            escapeHTML(
                item.produk ||
                "-"
            );


        const penduduk =
            escapeHTML(
                item.penduduk ||
                "0"
            );


        const umkm =
            escapeHTML(
                item.umkm ||
                "0"
            );


        const bumdes =
            escapeHTML(
                item.bumdes ||
                "0"
            );


        const wisata =
            escapeHTML(
                item.wisata ||
                "0"
            );


        const link =
            escapeHTML(
                item.link ||
                "#"
            );


        const verified =
            item.verified
                ?

                '<i class="fa-solid fa-circle-check text-primary ms-1" ' +
                'title="Verified by PLAZA DAYEUHLUHUR"></i>'

                :

                "";


        html +=

            '<div class="col-lg-4 col-md-6 mb-4 desa-item">' +

                '<div class="card desa-card shadow h-100 overflow-hidden">' +


                    '<img ' +

                        'src="' +
                        gambar +
                        '" ' +

                        'class="card-img-top" ' +

                        'alt="' +
                        nama +
                        '" ' +

                        'loading="lazy" ' +

                        'onerror="' +
                        "this.src='assets/images/desa/default.jpg'" +
                        '"' +

                    '>' +


                    '<div class="card-body d-flex flex-column">' +


                        '<span class="badge bg-success badge-status mb-2 align-self-start">' +

                            status +

                        '</span>' +


                        '<h4 class="fw-bold">' +

                            nama +

                            verified +

                        '</h4>' +


                        '<p class="text-success fw-semibold mb-2">' +

                            potensi +

                        '</p>' +


                        '<p class="small text-muted">' +

                            '🎁 Produk Unggulan : ' +

                            '<b>' +
                            produk +
                            '</b>' +

                        '</p>' +


                        '<div class="row mt-3">' +


                            '<div class="col-6">' +

                                '<div class="stat-box">' +

                                    '👥 ' +

                                    '<b>' +
                                    penduduk +
                                    '</b>' +

                                    '<small class="d-block">' +
                                    'Penduduk' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +


                            '<div class="col-6">' +

                                '<div class="stat-box">' +

                                    '🛍️ ' +

                                    '<b>' +
                                    umkm +
                                    '</b>' +

                                    '<small class="d-block">' +
                                    'UMKM' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +


                            '<div class="col-6 mt-2">' +

                                '<div class="stat-box">' +

                                    '🏢 ' +

                                    '<b>' +
                                    bumdes +
                                    '</b>' +

                                    '<small class="d-block">' +
                                    'BUMDes' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +


                            '<div class="col-6 mt-2">' +

                                '<div class="stat-box">' +

                                    '🌄 ' +

                                    '<b>' +
                                    wisata +
                                    '</b>' +

                                    '<small class="d-block">' +
                                    'Wisata' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +

                        '</div>' +


                        '<a ' +

                            'href="' +
                            link +
                            '" ' +

                            'class="btn btn-success w-100 mt-auto pt-2 mt-4">' +

                            '<i class="fa-solid fa-compass me-1"></i>' +

                            'Jelajahi Desa' +

                        '</a>' +


                    '</div>' +

                '</div>' +

            '</div>';

    });


    container.innerHTML =
        html;


    console.log(
        "Kartu desa berhasil ditampilkan."
    );

}


/* =====================================================
   SEARCH DESA
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

            filterDesa(
                this.value
            );

        }
    );

}


/* =====================================================
   FILTER DESA
===================================================== */

function filterDesa(keyword) {

    const container =
        document.getElementById(
            "desaContainer"
        );


    if (!container) {
        return;
    }


    const items =
        container.querySelectorAll(
            ".desa-item"
        );


    const kataKunci =
        String(
            keyword || ""
        )
        .toLowerCase()
        .trim();


    let jumlahTampil =
        0;


    items.forEach(
        function (item) {

            const text =
                item.textContent
                    .toLowerCase();


            if (
                text.includes(
                    kataKunci
                )
            ) {

                item.style.display =
                    "";

                jumlahTampil++;

            }

            else {

                item.style.display =
                    "none";

            }

        }
    );


    tampilkanPesanPencarian(
        jumlahTampil,
        kataKunci
    );

}


/* =====================================================
   PESAN HASIL PENCARIAN
===================================================== */

function tampilkanPesanPencarian(
    jumlah,
    keyword
) {

    const container =
        document.getElementById(
            "desaContainer"
        );


    if (!container) {
        return;
    }


    let pesan =
        document.getElementById(
            "desaSearchEmpty"
        );


    if (
        jumlah === 0 &&
        keyword !== ""
    ) {

        if (!pesan) {

            pesan =
                document.createElement(
                    "div"
                );

            pesan.id =
                "desaSearchEmpty";

            pesan.className =
                "col-12 text-center py-5";

            pesan.innerHTML =

                '<i class="fa-solid fa-magnifying-glass fa-3x text-muted mb-3"></i>' +

                '<h4>Desa tidak ditemukan</h4>' +

                '<p class="text-muted">' +

                    'Tidak ada desa yang sesuai dengan pencarian "' +

                    escapeHTML(keyword) +

                    '".' +

                '</p>';

            container.appendChild(
                pesan
            );

        }

    }

    else {

        if (pesan) {

            pesan.remove();

        }

    }

}


/* =====================================================
   STATISTIK DESA
===================================================== */

function updateStatistikDesa(data) {

    console.log(
        "Statistik desa:",
        data.length
    );


    /*
       Jika nanti desa.html mempunyai
       elemen statistik dengan ID berikut,
       otomatis akan terisi.
    */


    setValue(
        "totalDesa",
        data.length
    );


    const totalPenduduk =
        data.reduce(
            function (total, item) {

                return (
                    total +
                    parseNumber(
                        item.penduduk
                    )
                );

            },
            0
        );


    const totalUMKM =
        data.reduce(
            function (total, item) {

                return (
                    total +
                    parseNumber(
                        item.umkm
                    )
                );

            },
            0
        );


    const totalBUMDes =
        data.reduce(
            function (total, item) {

                return (
                    total +
                    parseNumber(
                        item.bumdes
                    )
                );

            },
            0
        );


    const totalWisata =
        data.reduce(
            function (total, item) {

                return (
                    total +
                    parseNumber(
                        item.wisata
                    )
                );

            },
            0
        );


    setValue(
        "totalPenduduk",
        totalPenduduk
    );


    setValue(
        "totalUMKM",
        totalUMKM
    );


    setValue(
        "totalBUMDes",
        totalBUMDes
    );


    setValue(
        "totalWisata",
        totalWisata
    );

}


/* =====================================================
   SET VALUE
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
   PARSE NUMBER
===================================================== */

function parseNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return 0;

    }


    /*
       Mengubah:

       "1.250"
       "1,250"
       "1250"

       menjadi angka.
    */

    const clean =
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
            clean,
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

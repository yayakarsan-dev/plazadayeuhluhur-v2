/* =====================================================
PLAZA DAYEUHLUHUR
UMKM DETAIL ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("UMKM DETAIL ENGINE");

    loadUmkmDetail();

});


/* =====================================================
LOAD DATA
===================================================== */

async function loadUmkmDetail() {

    const container =
        document.getElementById("umkmDetail");

    if (!container) {
        return;
    }


    /* Ambil ID dari URL */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");


    if (!id) {

        showNotFound(container);

        return;

    }


    try {

        const response =
            await fetch(
                "../../data/umkm.json",
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


        const umkm =
            data.find(function (item) {

                return String(item.id) === String(id);

            });


        if (!umkm) {

            showNotFound(container);

            return;

        }


        renderUmkmDetail(
            container,
            umkm
        );


    } catch (error) {

        console.error(
            "Gagal membaca data UMKM:",
            error
        );


        container.innerHTML = `

            <div class="not-found">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h2>
                    Data UMKM gagal dimuat
                </h2>

                <p>
                    Silakan coba beberapa saat lagi.
                </p>

                <a
                    href="../../umkm.html"
                    class="btn btn-success">

                    Kembali ke Direktori UMKM

                </a>

            </div>

        `;

    }

}


/* =====================================================
RENDER DETAIL
===================================================== */

function renderUmkmDetail(
    container,
    umkm
) {

    const gambar =
        umkm.gambar ||
        "../../assets/images/umkm/default.jpg";


    const nama =
        umkm.nama ||
        "Nama UMKM";


    const kategori =
        umkm.kategori ||
        "Lainnya";


    const produk =
        umkm.produk ||
        "Produk Lokal";


    const desa =
        umkm.desa ||
        "-";


    const rating =
        umkm.rating ||
        "0";


    const status =
        umkm.status ||
        "Buka";


    const deskripsi =
        umkm.deskripsi ||
        "UMKM lokal Kecamatan Dayeuhluhur.";


    const nomor =
        umkm.whatsapp ||
        "";


    let whatsappButton = "";


    if (nomor) {

        whatsappButton = `

            <a
                href="https://wa.me/${nomor}"
                target="_blank"
                class="btn-umkm btn-whatsapp">

                <i class="fa-brands fa-whatsapp"></i>

                Hubungi WhatsApp

            </a>

        `;

    }


    container.innerHTML = `

        <div class="umkm-profile">

            <div class="row g-0">


                <!-- FOTO -->

                <div class="col-lg-5">

                    <div class="umkm-photo-wrapper">

                        <img
                            src="${escapeHtml(gambar)}"
                            class="umkm-photo"
                            alt="${escapeHtml(nama)}"
                            onerror="this.src='../../assets/images/umkm/default.jpg'">

                    </div>

                </div>


                <!-- INFORMASI -->

                <div class="col-lg-7">

                    <div class="umkm-content">


                        <span class="umkm-badge">

                            ${escapeHtml(kategori)}

                        </span>


                        <h1 class="umkm-title">

                            ${escapeHtml(nama)}

                        </h1>


                        <div class="umkm-product">

                            <i class="fa-solid fa-basket-shopping"></i>

                            ${escapeHtml(produk)}

                        </div>


                        <div class="umkm-rating">

                            ⭐ ${escapeHtml(rating)}

                        </div>


                        <!-- INFO GRID -->

                        <div class="row g-3 umkm-info-grid">


                            <div class="col-md-6">

                                <div class="info-box">

                                    <i class="fa-solid fa-location-dot"></i>

                                    <span class="info-label">
                                        Lokasi
                                    </span>

                                    <div class="info-value">

                                        ${escapeHtml(desa)}

                                    </div>

                                </div>

                            </div>


                            <div class="col-md-6">

                                <div class="info-box">

                                    <i class="fa-solid fa-store"></i>

                                    <span class="info-label">
                                        Status Usaha
                                    </span>

                                    <div class="info-value">

                                        ${escapeHtml(status)}

                                    </div>

                                </div>

                            </div>


                        </div>


                        <!-- DESCRIPTION -->

                        <div class="umkm-description">

                            <h4>
                                Tentang UMKM
                            </h4>

                            <p>

                                ${escapeHtml(deskripsi)}

                            </p>

                        </div>


                        <!-- ACTION -->

                        <div class="umkm-actions">


                            ${whatsappButton}


                            <a
                                href="../../umkm.html"
                                class="btn-umkm btn-back">

                                <i class="fa-solid fa-arrow-left"></i>

                                Kembali ke Direktori

                            </a>


                        </div>


                    </div>

                </div>


            </div>

        </div>

    `;


    document.title =
        nama +
        " | PLAZA DAYEUHLUHUR";

}


/* =====================================================
NOT FOUND
===================================================== */

function showNotFound(container) {

    container.innerHTML = `

        <div class="not-found">

            <i class="fa-solid fa-store-slash"></i>

            <h2>
                UMKM Tidak Ditemukan
            </h2>

            <p>
                Data UMKM yang Anda cari belum tersedia.
            </p>

            <a
                href="../../umkm.html"
                class="btn btn-success">

                Kembali ke Direktori UMKM

            </a>

        </div>

    `;

}


/* =====================================================
ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
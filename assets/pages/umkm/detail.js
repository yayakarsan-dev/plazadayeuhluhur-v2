/* =====================================================
   PLAZA DAYEUHLUHUR
   DETAIL UMKM
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadUmkmDetail();

});


async function loadUmkmDetail() {

    const container =
        document.getElementById("umkmDetail");


    if (!container) {
        return;
    }


    /* ================================================
       AMBIL ID DARI URL
    ================================================ */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (!id) {

        showError(
            "ID UMKM tidak ditemukan."
        );

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

            showError(
                "Data UMKM tidak ditemukan."
            );

            return;

        }


        renderDetail(umkm);

    }

    catch (error) {

        console.error(
            "Gagal membaca detail UMKM:",
            error
        );


        showError(
            "Gagal memuat data UMKM."
        );

    }

}


/* =====================================================
   RENDER DETAIL
===================================================== */

function renderDetail(umkm) {

    const container =
        document.getElementById(
            "umkmDetail"
        );


    const status =
        umkm.status || "Buka";


    const statusClass =
        String(status)
            .toLowerCase() === "buka"
            ? "open"
            : "closed";


    const gambar =
        umkm.gambar ||
        "../../assets/images/umkm/default.jpg";


    document.title =
        umkm.nama +
        " | PLAZA DAYEUHLUHUR";


    container.innerHTML = `

        <div class="row g-5 align-items-center">


            <!-- FOTO -->

            <div class="col-lg-5">

                <div class="detail-image-wrapper">

                    <img
                        src="${escapeHTML(gambar)}"
                        alt="${escapeHTML(umkm.nama)}"
                        class="detail-image"
                        onerror="
                            this.onerror=null;
                            this.src='../../assets/images/umkm/default.jpg';
                        "
                    >

                </div>

            </div>


            <!-- INFORMASI -->

            <div class="col-lg-7">


                <span class="detail-category">

                    ${escapeHTML(
                        umkm.kategori || "UMKM"
                    )}

                </span>


                <h1 class="detail-title">

                    ${escapeHTML(
                        umkm.nama || "-"
                    )}

                </h1>


                <div class="detail-status ${statusClass}">

                    <span></span>

                    ${escapeHTML(status)}

                </div>


                <div class="detail-rating">

                    <i class="fa-solid fa-star"></i>

                    <strong>
                        ${escapeHTML(
                            umkm.rating || "0"
                        )}
                    </strong>

                </div>


                <div class="detail-info-list">


                    <div>

                        <i class="fa-solid fa-location-dot"></i>

                        <span>

                            <small>Lokasi</small>

                            ${escapeHTML(
                                umkm.desa || "-"
                            )}

                        </span>

                    </div>


                    <div>

                        <i class="fa-solid fa-briefcase"></i>

                        <span>

                            <small>Produk / Jasa</small>

                            ${escapeHTML(
                                umkm.produk || "-"
                            )}

                        </span>

                    </div>


                </div>


                <div class="detail-actions">

                    <a
                        href="../../umkm.html"
                        class="btn btn-outline-success">

                        <i class="fa-solid fa-arrow-left"></i>

                        Kembali

                    </a>


                    <a
                        href="#"
                        class="btn btn-success">

                        <i class="fa-solid fa-phone"></i>

                        Hubungi UMKM

                    </a>

                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   ERROR
===================================================== */

function showError(message) {

    const container =
        document.getElementById(
            "umkmDetail"
        );


    container.innerHTML = `

        <div class="text-center py-5">

            <i
                class="fa-solid fa-store-slash"
                style="font-size:60px;">
            </i>

            <h3 class="mt-3">
                ${message}
            </h3>


            <a
                href="../../umkm.html"
                class="btn btn-success mt-3">

                Kembali ke Direktori UMKM

            </a>

        </div>

    `;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM HOME PAGE
   Menampilkan UMKM pada halaman depan
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadUmkmHome();

});


/* =====================================================
   LOAD DATA UMKM
===================================================== */

async function loadUmkmHome() {

    const container =
        document.getElementById("umkmContainer");

    if (!container) {
        console.log("umkmContainer tidak ditemukan.");
        return;
    }

    try {

        const response = await fetch("data/umkm.json", {
            cache: "no-store"
        });

        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " - " +
                response.statusText
            );

        }

        const data = await response.json();

        console.log("Data UMKM halaman depan:", data);

        renderUmkmHome(data);

    } catch (error) {

        console.error(
            "Gagal memuat UMKM:",
            error
        );

        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-warning">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Data UMKM belum dapat dimuat.
                </div>
            </div>
        `;

    }

}


/* =====================================================
   RENDER UMKM
===================================================== */

function renderUmkmHome(data) {

    const container =
        document.getElementById("umkmContainer");

    if (!container) {
        return;
    }

    if (!Array.isArray(data) || data.length === 0) {

        container.innerHTML = `
            <div class="col-12 text-center py-4">
                <p class="text-muted">
                    Belum ada data UMKM.
                </p>
            </div>
        `;

        return;
    }


    /*
       Untuk sementara tampilkan 4 UMKM pertama.
       Nanti setelah sistem unggulan selesai,
       kita bisa menggunakan field "unggulan".
    */

    const umkmUnggulan = data.slice(0, 4);


    let html = "";


    umkmUnggulan.forEach(function (item) {

        const gambar =
            item.gambar ||
            "assets/images/umkm/default.jpg";

        const nama =
            item.nama || "UMKM Dayeuhluhur";

        const kategori =
            item.kategori || "UMKM";

        const desa =
            item.desa || "Dayeuhluhur";

        const produk =
            item.produk || "Produk Lokal";

        const rating =
            item.rating || "0";

        const status =
            item.status || "Buka";

        const link =
            item.link || "#";


        html += `

        <div class="col-lg-3 col-md-6 mb-4">

            <div class="card h-100 border-0 shadow-sm umkm-card">

                <img
                    src="${escapeUmkmHome(gambar)}"
                    class="card-img-top"
                    alt="${escapeUmkmHome(nama)}"
                    style="height:220px; object-fit:cover;"
                    onerror="this.src='assets/images/umkm/default.jpg'"
                >

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center mb-2">

                        <span class="badge bg-primary">
                            ${escapeUmkmHome(kategori)}
                        </span>

                        <span class="text-warning">
                            <i class="fa-solid fa-star"></i>
                            ${escapeUmkmHome(rating)}
                        </span>

                    </div>


                    <h5 class="fw-bold">
                        ${escapeUmkmHome(nama)}
                    </h5>


                    <p class="text-muted mb-2">

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeUmkmHome(desa)}

                    </p>


                    <p class="mb-3">

                        <i class="fa-solid fa-box-open text-primary"></i>

                        ${escapeUmkmHome(produk)}

                    </p>


                    <div class="d-flex justify-content-between align-items-center">

                        <span class="badge ${
                            String(status).toLowerCase() === "buka"
                                ? "bg-success"
                                : "bg-secondary"
                        }">

                            <i class="fa-solid fa-circle"></i>

                            ${escapeUmkmHome(status)}

                        </span>


                        <a
                            href="${escapeUmkmHome(link)}"
                            class="btn btn-outline-primary btn-sm"
                            target="_blank"
                        >

                            Lihat Detail

                        </a>

                    </div>

                </div>

            </div>

        </div>

        `;

    });


    container.innerHTML = html;


    console.log(
        "4 UMKM berhasil ditampilkan di halaman depan."
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeUmkmHome(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
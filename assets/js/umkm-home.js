/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM HOME / ETALASE PRODUK
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("umkmContainer");

    if (!container) {
        console.warn("UMKM HOME: #umkmContainer tidak ditemukan.");
        return;
    }

    loadProdukUMKM();

});


async function loadProdukUMKM() {

    const container = document.getElementById("umkmContainer");

    try {

        const response = await fetch("data/produk.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `produk.json gagal dimuat. Status: ${response.status}`
            );
        }

        const produk = await response.json();

        console.log(
            "Etalase Produk UMKM berhasil dimuat:",
            produk
        );

        if (!Array.isArray(produk) || produk.length === 0) {

            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        Belum ada produk UMKM yang tersedia.
                    </div>
                </div>
            `;

            return;
        }

        /*
         * Homepage hanya menampilkan maksimal 4 produk.
         * Produk lainnya dapat ditampilkan pada halaman UMKM
         * di tahap pengembangan berikutnya.
         */
        const tampil = produk.slice(0, 4);

        container.innerHTML = tampil
            .map((item) => createProdukCard(item))
            .join("");

        console.log(
            `${tampil.length} produk UMKM berhasil ditampilkan di halaman depan.`
        );

    } catch (error) {

        console.error(
            "UMKM HOME: Gagal memuat produk.",
            error
        );

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Data produk UMKM belum dapat dimuat.
                </div>
            </div>
        `;
    }
}


/* =====================================================
   MEMBUAT KARTU PRODUK
   ===================================================== */

function createProdukCard(item) {

    const produk = item.produk || "Produk UMKM";
    const deskripsi = item.deskripsi || "Produk lokal Dayeuhluhur.";
    const gambar = item.gambar || "assets/images/umkm/default.jpg";
    const umkm = item.umkm || "UMKM Lokal";
    const desa = item.desa || "Dayeuhluhur";
    const harga = item.harga || "Hubungi Penjual";
    const kategori = item.kategori || "UMKM";
    const whatsapp = normalizeWhatsApp(item.whatsapp);

    const pesan = `
Halo, saya tertarik membeli produk:

Produk: ${produk}
UMKM: ${umkm}
Desa: ${desa}
Harga: ${harga}

Mohon informasi selanjutnya. Terima kasih.
`.trim();

    const waLink = whatsapp
        ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(pesan)}`
        : "#";

    return `
        <div class="col-md-6 col-lg-3 mb-4">

            <div class="card h-100 border-0 shadow-sm umkm-product-card">

                <div class="umkm-product-image">

                    <img
                        src="${gambar}"
                        class="card-img-top"
                        alt="${escapeHTML(produk)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='assets/images/umkm/default.jpg';"
                    >

                    <span class="umkm-product-category">
                        ${escapeHTML(kategori)}
                    </span>

                </div>

                <div class="card-body d-flex flex-column">

                    <h5 class="card-title fw-bold">
                        ${escapeHTML(produk)}
                    </h5>

                    <p class="card-text text-muted small mb-3">
                        ${escapeHTML(deskripsi)}
                    </p>

                    <div class="small mb-2">

                        <div class="mb-1">
                            <i class="fa-solid fa-store text-primary me-2"></i>
                            <strong>UMKM:</strong>
                            ${escapeHTML(umkm)}
                        </div>

                        <div>
                            <i class="fa-solid fa-location-dot text-danger me-2"></i>
                            <strong>Desa:</strong>
                            ${escapeHTML(desa)}
                        </div>

                    </div>

                    <div class="mt-auto">

                        <div class="umkm-product-price">
                            ${escapeHTML(harga)}
                        </div>

                        ${
                            whatsapp
                            ? `
                                <a
                                    href="${waLink}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-success w-100 mt-3"
                                >
                                    <i class="fa-brands fa-whatsapp me-2"></i>
                                    BELI BY WA
                                </a>
                            `
                            : `
                                <button
                                    type="button"
                                    class="btn btn-secondary w-100 mt-3"
                                    disabled
                                >
                                    <i class="fa-solid fa-phone me-2"></i>
                                    WA Belum Tersedia
                                </button>
                            `
                        }

                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =====================================================
   NORMALISASI NOMOR WHATSAPP
   ===================================================== */

function normalizeWhatsApp(number) {

    if (!number) {
        return "";
    }

    let wa = String(number)
        .replace(/\s+/g, "")
        .replace(/-/g, "")
        .replace(/[^\d+]/g, "");

    if (wa.startsWith("0")) {
        wa = "62" + wa.substring(1);
    }

    if (wa.startsWith("+62")) {
        wa = wa.substring(1);
    }

    return wa;
}


/* =====================================================
   KEAMANAN HTML
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
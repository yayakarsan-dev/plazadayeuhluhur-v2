/* =====================================================
   PLAZA DAYEUHLUHUR
   BURSA LOKAL
   FRONT PAGE ENGINE
   V3 - TEMPLATE WHATSAPP PENJUAL
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("BURSA LOKAL ENGINE V3");
    console.log("====================================");


    /* =================================================
       CONTAINER BURSA
    ================================================= */

    const container =
        document.getElementById("bursaContainer");


    if (!container) {

        console.warn(
            "Container #bursaContainer tidak ditemukan."
        );

        return;

    }


    /* =================================================
       STORAGE KEY
    ================================================= */

    const STORAGE_KEY =
        "plaza_dayeuhluhur_bursa";


    let dataBursa = [];


    /* =================================================
       LOAD DATA BURSA
    ================================================= */

    async function loadBursa() {

        /* ---------------------------------------------
           PRIORITAS 1
           LOCAL STORAGE
        --------------------------------------------- */

        const localData =
            localStorage.getItem(STORAGE_KEY);


        if (localData) {

            try {

                const parsed =
                    JSON.parse(localData);


                if (
                    Array.isArray(parsed)
                    &&
                    parsed.length > 0
                ) {

                    dataBursa = parsed;

                    console.log(
                        "Bursa dari localStorage:",
                        dataBursa.length
                    );

                    renderBursa();

                    return;

                }

            } catch (error) {

                console.warn(
                    "Data localStorage Bursa tidak valid.",
                    error
                );

            }

        }


        /* ---------------------------------------------
           PRIORITAS 2
           DATA/BURSA.JSON
        --------------------------------------------- */

        try {

            const response =
                await fetch("data/bursa.json");


            if (response.ok) {

                const data =
                    await response.json();


                if (Array.isArray(data)) {

                    dataBursa = data;


                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(dataBursa)
                    );


                    console.log(
                        "Bursa dari data/bursa.json:",
                        dataBursa.length
                    );


                    renderBursa();

                    return;

                }

            }

        } catch (error) {

            console.warn(
                "data/bursa.json tidak ditemukan."
            );

        }


        /* ---------------------------------------------
           PRIORITAS 3
           BURSA.JSON
        --------------------------------------------- */

        try {

            const response =
                await fetch("bursa.json");


            if (response.ok) {

                const data =
                    await response.json();


                if (Array.isArray(data)) {

                    dataBursa = data;


                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(dataBursa)
                    );


                    console.log(
                        "Bursa dari bursa.json:",
                        dataBursa.length
                    );


                    renderBursa();

                    return;

                }

            }

        } catch (error) {

            console.warn(
                "bursa.json tidak ditemukan."
            );

        }


        /* ---------------------------------------------
           JIKA TIDAK ADA DATA
        --------------------------------------------- */

        dataBursa = [];

        renderBursa();

    }


    /* =================================================
       RENDER BURSA
    ================================================= */

    function renderBursa() {

        /* ---------------------------------------------
           FILTER HANYA STATUS AKTIF
        --------------------------------------------- */

        const aktif =
            dataBursa.filter(function (item) {

                const status =
                    String(
                        item.status || "Aktif"
                    ).toLowerCase();


                return status === "aktif";

            });


        /* ---------------------------------------------
           TAMPILKAN MAKSIMAL 4
        --------------------------------------------- */

        const tampil =
            aktif.slice(0, 8);


        /* ---------------------------------------------
           BERSIHKAN CONTAINER
        --------------------------------------------- */

        container.innerHTML = "";


        /* ---------------------------------------------
           JIKA BELUM ADA DATA
        --------------------------------------------- */

        if (tampil.length === 0) {

            container.innerHTML = `

                <div class="col-12">

                    <div
                        class="text-center py-5"
                    >

                        <div
                            style="
                                width:72px;
                                height:72px;
                                margin:0 auto 18px;
                                border-radius:50%;
                                background:#eef4ff;
                                color:#1769ff;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-size:28px;
                            "
                        >

                            <i
                                class="fa-solid fa-tags"
                            ></i>

                        </div>


                        <h5
                            class="fw-bold"
                        >
                            Belum Ada Bursa Aktif
                        </h5>


                        <p
                            class="text-muted"
                        >
                            Belum ada listing Bursa
                            yang sedang aktif.
                        </p>

                    </div>

                </div>

            `;

            return;

        }


        /* =================================================
           BUAT CARD SATU PER SATU
        ================================================= */

        tampil.forEach(function (item) {


            /* ---------------------------------------------
               DATA
            --------------------------------------------- */

            const foto =
                item.foto ||
                item.gambar ||
                "assets/images/default.jpg";


            const judul =
                item.judul ||
                "Listing Bursa";


            const jenis =
                item.jenis ||
                "Dijual";


            const kategori =
                item.kategori ||
                "Lainnya";


            const desa =
                item.desa ||
                "Dayeuhluhur";


            const harga =
                item.harga ||
                "Nego";


            const penjual =
                item.penjual ||
                "Masyarakat Dayeuhluhur";


            const whatsapp =
                item.whatsapp ||
                item.noWa ||
                item.nomorWA ||
                item.nomorWa ||
                "";


            const deskripsi =
                item.deskripsi ||
                "Informasi listing belum tersedia.";


            /* ---------------------------------------------
               ID
            --------------------------------------------- */

            const id =
                item.id || "";


            /* ---------------------------------------------
               CARD
            --------------------------------------------- */

            const col =
                document.createElement("div");


            col.className =
                "col-xl-3 col-lg-4 col-md-6 mb-4";


            col.innerHTML = `

                <div
                    class="card h-100 border-0 shadow-sm"
                    style="
                        border-radius:18px;
                        overflow:hidden;
                        transition:all .25s ease;
                    "
                >


                    <!-- =================================
                         FOTO
                    ================================== -->

                    <div
                        style="
                            height:190px;
                            background:#eef3f8;
                            position:relative;
                            overflow:hidden;
                        "
                    >

                        <img
                            src="${escapeHTML(foto)}"
                            alt="${escapeHTML(judul)}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                            "
                            onerror="
                                this.src='assets/images/default.jpg'
                            "
                        >


                        <!-- JENIS -->

                        <span
                            style="
                                position:absolute;
                                top:14px;
                                left:14px;
                                background:#1769ff;
                                color:#fff;
                                padding:6px 13px;
                                border-radius:30px;
                                font-size:12px;
                                font-weight:700;
                            "
                        >

                            ${escapeHTML(jenis)}

                        </span>


                        <!-- STATUS -->

                        <span
                            style="
                                position:absolute;
                                top:14px;
                                right:14px;
                                background:#198754;
                                color:#fff;
                                padding:5px 10px;
                                border-radius:20px;
                                font-size:10px;
                                font-weight:700;
                            "
                        >

                            AKTIF

                        </span>

                    </div>


                    <!-- =================================
                         BODY
                    ================================== -->

                    <div
                        class="card-body"
                        style="
                            padding:20px;
                        "
                    >


                        <!-- KATEGORI -->

                        <div
                            style="
                                color:#1769ff;
                                font-size:11px;
                                font-weight:800;
                                text-transform:uppercase;
                                letter-spacing:.6px;
                                margin-bottom:7px;
                            "
                        >

                            ${escapeHTML(kategori)}

                        </div>


                        <!-- JUDUL -->

                        <h5
                            class="fw-bold"
                            style="
                                font-size:18px;
                                line-height:1.35;
                                margin-bottom:10px;
                                color:#172033;
                            "
                        >

                            ${escapeHTML(judul)}

                        </h5>


                        <!-- DESA -->

                        <div
                            style="
                                font-size:13px;
                                color:#687386;
                                margin-bottom:6px;
                            "
                        >

                            <i
                                class="fa-solid fa-location-dot me-1"
                            ></i>

                            ${escapeHTML(desa)}

                        </div>


                        <!-- PENJUAL -->

                        <div
                            style="
                                font-size:13px;
                                color:#687386;
                                margin-bottom:12px;
                            "
                        >

                            <i
                                class="fa-solid fa-user me-1"
                            ></i>

                            ${escapeHTML(penjual)}

                        </div>


                        <!-- HARGA -->

                        <div
                            style="
                                font-size:19px;
                                font-weight:800;
                                color:#172033;
                                margin-bottom:12px;
                            "
                        >

                            ${escapeHTML(harga)}

                        </div>


                        <!-- DESKRIPSI -->

                        <p
                            style="
                                font-size:13px;
                                color:#687386;
                                line-height:1.6;
                                margin-bottom:18px;
                            "
                        >

                            ${escapeHTML(
                                potongDeskripsi(
                                    deskripsi,
                                    85
                                )
                            )}

                        </p>


                        <!-- =================================
                             FOOTER
                        ================================== -->

                        <div
                            class="d-flex align-items-center justify-content-between gap-2"
                        >


                            <!-- STATUS -->

                            <span
                                style="
                                    color:#168b57;
                                    font-size:12px;
                                    font-weight:700;
                                    white-space:nowrap;
                                "
                            >

                                <i
                                    class="fa-solid fa-circle"
                                    style="
                                        font-size:7px;
                                        vertical-align:middle;
                                    "
                                ></i>

                                Aktif

                            </span>


                            <!-- WHATSAPP -->

                            ${
                                whatsapp
                                ?
                                `
                                <a
                                    href="${buatLinkWhatsApp(
                                        whatsapp,
                                        penjual,
                                        judul
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-success btn-sm rounded-pill px-3"
                                >

                                    <i
                                        class="fa-brands fa-whatsapp me-1"
                                    ></i>

                                    Hubungi By WA

                                </a>
                                `
                                :
                                `
                                <span
                                    class="text-muted"
                                    style="
                                        font-size:11px;
                                        text-align:right;
                                    "
                                >

                                    <i
                                        class="fa-solid fa-phone-slash me-1"
                                    ></i>

                                    Kontak belum tersedia

                                </span>
                                `
                            }

                        </div>

                    </div>

                </div>

            `;


            /* ---------------------------------------------
               MASUKKAN CARD KE HALAMAN
            --------------------------------------------- */

            container.appendChild(col);

        });

    }


    /* =================================================
       FUNGSI WHATSAPP
    ================================================= */

    function buatLinkWhatsApp(
        nomor,
        penjual,
        judul
    ) {


        /* ---------------------------------------------
           JIKA NOMOR KOSONG
        --------------------------------------------- */

        if (!nomor) {

            return "#";

        }


        /* ---------------------------------------------
           BERSIHKAN NOMOR
        --------------------------------------------- */

        let wa =
            String(nomor)
                .replace(/\D/g, "");


        /* ---------------------------------------------
           0812xxxx
           MENJADI
           62812xxxx
        --------------------------------------------- */

        if (
            wa.startsWith("0")
        ) {

            wa =
                "62" +
                wa.substring(1);

        }


        /* ---------------------------------------------
           812xxxx
           MENJADI
           62812xxxx
        --------------------------------------------- */

        if (
            wa.startsWith("8")
        ) {

            wa =
                "62" +
                wa;

        }


        /* ---------------------------------------------
           NAMA PENJUAL
        --------------------------------------------- */

        const nama =
            penjual ||
            "Bapak/Ibu";


        /* ---------------------------------------------
           JUDUL IKLAN
        --------------------------------------------- */

        const produk =
            judul ||
            "iklan yang Anda tawarkan";


        /* ---------------------------------------------
           PESAN OTOMATIS
        --------------------------------------------- */

        const pesan =
            `Halo Pak ${nama}, saya tertarik dengan iklan "${produk}". Silakan hubungi saya segera. Terima kasih.`;


        /* ---------------------------------------------
           LINK WHATSAPP
        --------------------------------------------- */

        return (
            "https://wa.me/" +
            wa +
            "?text=" +
            encodeURIComponent(pesan)
        );

    }


    /* =================================================
       POTONG DESKRIPSI
    ================================================= */

    function potongDeskripsi(
        text,
        panjang
    ) {

        const value =
            String(text || "");


        if (
            value.length <= panjang
        ) {

            return value;

        }


        return (
            value.substring(
                0,
                panjang
            )
            + "..."
        );

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

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


    /* =================================================
       MULAI ENGINE
    ================================================= */

    loadBursa();

});
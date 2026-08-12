/* =====================================================
   PLAZA DAYEUHLUHUR
   BURSA LOKAL
   FRONT PAGE ENGINE V2
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "===================================="
        );

        console.log(
            "PLAZA DAYEUHLUHUR"
        );

        console.log(
            "BURSA LOKAL ENGINE V2"
        );

        console.log(
            "===================================="
        );


        /* =================================================
           CONTAINER
        ================================================= */

        const container =
            document.getElementById(
                "bursaContainer"
            );


        if (!container) {

            console.warn(
                "bursaContainer tidak ditemukan."
            );

            return;

        }


        /* =================================================
           STORAGE
        ================================================= */

        const STORAGE_KEY =
            "plaza_dayeuhluhur_bursa";


        let dataBursa = [];


        /* =================================================
           LOAD DATA
        ================================================= */

        async function loadBursa() {


            /* ---------------------------------------------
               1. PRIORITAS LOCAL STORAGE
            --------------------------------------------- */

            const localData =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (localData) {

                try {

                    const parsed =
                        JSON.parse(
                            localData
                        );


                    if (
                        Array.isArray(
                            parsed
                        )
                        &&
                        parsed.length > 0
                    ) {

                        dataBursa =
                            parsed;


                        console.log(
                            "Bursa dari localStorage:",
                            dataBursa.length
                        );


                        renderBursa();

                        return;

                    }

                } catch (error) {

                    console.warn(
                        "localStorage Bursa tidak valid.",
                        error
                    );

                }

            }


            /* ---------------------------------------------
               2. COBA data/bursa.json
            --------------------------------------------- */

            try {

                const response =
                    await fetch(
                        "data/bursa.json"
                    );


                if (
                    response.ok
                ) {

                    const data =
                        await response.json();


                    if (
                        Array.isArray(
                            data
                        )
                    ) {

                        dataBursa =
                            data;


                        console.log(
                            "Bursa dari data/bursa.json:",
                            dataBursa.length
                        );


                        localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify(
                                dataBursa
                            )
                        );


                        renderBursa();

                        return;

                    }

                }

            } catch (error) {

                console.warn(
                    "data/bursa.json tidak tersedia."
                );

            }


            /* ---------------------------------------------
               3. COBA bursa.json
            --------------------------------------------- */

            try {

                const response =
                    await fetch(
                        "bursa.json"
                    );


                if (
                    response.ok
                ) {

                    const data =
                        await response.json();


                    if (
                        Array.isArray(
                            data
                        )
                    ) {

                        dataBursa =
                            data;


                        console.log(
                            "Bursa dari bursa.json:",
                            dataBursa.length
                        );


                        localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify(
                                dataBursa
                            )
                        );


                        renderBursa();

                        return;

                    }

                }

            } catch (error) {

                console.warn(
                    "bursa.json tidak tersedia."
                );

            }


            /* ---------------------------------------------
               TIDAK ADA DATA
            --------------------------------------------- */

            dataBursa = [];

            renderBursa();

        }


        /* =================================================
           RENDER BURSA
        ================================================= */

        function renderBursa() {


            /* ---------------------------------------------
               FILTER STATUS AKTIF
            --------------------------------------------- */

            const aktif =
                dataBursa.filter(
                    item =>
                        (
                            item.status ||
                            "Aktif"
                        )
                        .toLowerCase()
                        ===
                        "aktif"
                );


            /* ---------------------------------------------
               AMBIL MAKSIMAL 4
            --------------------------------------------- */

            const tampil =
                aktif.slice(
                    0,
                    4
                );


            /* ---------------------------------------------
               KOSONGKAN
            --------------------------------------------- */

            container.innerHTML = "";


            /* ---------------------------------------------
               JIKA KOSONG
            --------------------------------------------- */

            if (
                tampil.length === 0
            ) {

                container.innerHTML = `

                    <div class="col-12">

                        <div
                            class="text-center py-5"
                        >

                            <div
                                style="
                                    width:70px;
                                    height:70px;
                                    border-radius:50%;
                                    background:#eef4ff;
                                    color:#1769ff;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    margin:0 auto 18px;
                                    font-size:28px;
                                "
                            >

                                <i
                                    class="fa-solid fa-tags">
                                </i>

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


            /* ---------------------------------------------
               RENDER CARD
            --------------------------------------------- */

            tampil.forEach(
                function (item) {


                    const foto =
                        item.foto ||
                        item.gambar ||
                        "assets/images/default.jpg";


                    const judul =
                        item.judul ||
                        "Listing Bursa";


                    const jenis =
                        item.jenis ||
                        "Ditawarkan";


                    const desa =
                        item.desa ||
                        "Dayeuhluhur";


                    const harga =
                        item.harga ||
                        "Nego";


                    const penjual =
                        item.penjual ||
                        "Masyarakat Dayeuhluhur";


                    const kategori =
                        item.kategori ||
                        "Lainnya";


                    const deskripsi =
                        item.deskripsi ||
                        "Informasi listing belum tersedia.";


                    const id =
                        item.id ||
                        "";


                    /* -------------------------------------
                       CARD
                    ------------------------------------- */

                    const col =
                        document.createElement(
                            "div"
                        );


                    col.className =
                        "col-xl-3 col-lg-4 col-md-6 mb-4";


                    col.innerHTML = `

                        <div
                            class="card h-100 border-0 shadow-sm"
                            style="
                                border-radius:18px;
                                overflow:hidden;
                                transition:.25s;
                            "
                        >


                            <!-- FOTO -->

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
                                        color:white;
                                        padding:6px 12px;
                                        border-radius:30px;
                                        font-size:12px;
                                        font-weight:700;
                                    "
                                >

                                    ${escapeHTML(jenis)}

                                </span>

                            </div>


                            <!-- BODY -->

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
                                        margin-bottom:6px;
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
                                        margin-bottom:14px;
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
                                            90
                                        )
                                    )}

                                </p>


                                <!-- FOOTER -->

                                <div
                                    class="d-flex align-items-center justify-content-between"
                                >


                                    <span
                                        style="
                                            color:#168b57;
                                            font-size:12px;
                                            font-weight:700;
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


                                    <a
                                        href="detail-bursa.html?id=${encodeURIComponent(id)}"
                                        class="btn btn-outline-primary btn-sm rounded-pill px-3"
                                    >

                                        Lihat Detail

                                        <i
                                            class="fa-solid fa-arrow-right ms-1"
                                        ></i>

                                    </a>


                                </div>


                            </div>

                        </div>

                    `;


                    container.appendChild(
                        col
                    );


                }
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
                String(
                    text || ""
                );


            if (
                value.length <=
                panjang
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
           START
        ================================================= */

        loadBursa();

    }
);
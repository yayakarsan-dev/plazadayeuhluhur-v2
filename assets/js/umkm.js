/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM MANAGEMENT ENGINE V3
   Form Tambah & Simpan UMKM
   + Tombol Detail UMKM
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("UMKM MANAGEMENT ENGINE V3");
    console.log("====================================");


    /* =================================================
       ELEMENT
    ================================================= */

    const daftarUMKM =
        document.getElementById("daftarUMKM");

    const emptyUMKM =
        document.getElementById("emptyUMKM");

    const modalUMKM =
        document.getElementById("modalUMKM");

    const formUMKM =
        document.getElementById("formUMKM");

    const btnTambahUMKM =
        document.getElementById("btnTambahUMKM");

    const btnTutupModal =
        document.getElementById("btnTutupModal");

    const btnBatal =
        document.getElementById("btnBatal");

    const searchUMKM =
        document.getElementById("searchUMKM");

    const filterKategori =
        document.getElementById("filterKategori");

    const filterDesa =
        document.getElementById("filterDesa");

    const totalUMKM =
        document.getElementById("totalUMKM");

    const totalJasa =
        document.getElementById("totalJasa");

    const totalKuliner =
        document.getElementById("totalKuliner");

    const totalPerdagangan =
        document.getElementById("totalPerdagangan");


    /* =================================================
       STORAGE KEY
    ================================================= */

    const STORAGE_KEY =
        "plaza_dayeuhluhur_umkm";


    /* =================================================
       DATA
    ================================================= */

    let dataUMKM = [];


    /* =================================================
       LOAD DATA
    ================================================= */

    function loadData() {

        const dataLocal =
            localStorage.getItem(STORAGE_KEY);

        if (dataLocal) {

            try {

                dataUMKM =
                    JSON.parse(dataLocal);

                console.log(
                    "Data UMKM dari localStorage:",
                    dataUMKM.length
                );

                renderUMKM();

            } catch (error) {

                console.error(
                    "localStorage rusak:",
                    error
                );

                loadJSON();

            }

        } else {

            loadJSON();

        }

    }


    /* =================================================
       LOAD DATA DARI JSON
    ================================================= */

    async function loadJSON() {

        try {

            const response =
                await fetch("umkm.json");

            if (!response.ok) {

                throw new Error(
                    "Gagal mengambil umkm.json"
                );

            }

            const data =
                await response.json();

            dataUMKM =
                Array.isArray(data)
                    ? data
                    : [];

            console.log(
                "Data UMKM dari umkm.json:",
                dataUMKM.length
            );

            saveLocalStorage();

            renderUMKM();

        } catch (error) {

            console.error(
                "Error load umkm.json:",
                error
            );

            dataUMKM = [];

            renderUMKM();

        }

    }


    /* =================================================
       SAVE LOCAL STORAGE
    ================================================= */

    function saveLocalStorage() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(dataUMKM)
        );

    }


    /* =================================================
       RENDER UMKM
    ================================================= */

    function renderUMKM() {

        const keyword =
            searchUMKM.value
                .toLowerCase()
                .trim();

        const kategori =
            filterKategori.value;

        const desa =
            filterDesa.value;


        /* ---------------------------------------------
           FILTER DATA
        --------------------------------------------- */

        const hasil =
            dataUMKM.filter((umkm) => {

                const cocokNama =
                    (umkm.nama || "")
                        .toLowerCase()
                        .includes(keyword);

                const cocokKategori =
                    !kategori ||
                    umkm.kategori === kategori;

                const cocokDesa =
                    !desa ||
                    umkm.desa === desa;

                return (
                    cocokNama &&
                    cocokKategori &&
                    cocokDesa
                );

            });


        /* ---------------------------------------------
           KOSONGKAN CONTAINER
        --------------------------------------------- */

        daftarUMKM.innerHTML = "";


        /* ---------------------------------------------
           TIDAK ADA DATA
        --------------------------------------------- */

        if (hasil.length === 0) {

            emptyUMKM.style.display =
                "block";

        } else {

            emptyUMKM.style.display =
                "none";


            /* -----------------------------------------
               LOOP DATA UMKM
            ----------------------------------------- */

            hasil.forEach((umkm) => {

                const card =
                    document.createElement("div");


                card.className =
                    "umkm-card";


                /* -------------------------------------
                   FOTO
                ------------------------------------- */

                const foto =
                    umkm.foto ||
                    umkm.image ||
                    umkm.gambar ||
                    "assets/images/default.jpg";


                /* -------------------------------------
                   STATUS
                ------------------------------------- */

                const status =
                    umkm.status ||
                    "Buka";


                /* -------------------------------------
                   HTML CARD
                ------------------------------------- */

                card.innerHTML = `

                    <div class="umkm-card-image">

                        <img
                            src="${escapeHTML(foto)}"
                            alt="${escapeHTML(
                                umkm.nama || "UMKM"
                            )}"
                            onerror="
                                this.src='assets/images/default.jpg'
                            "
                        >

                    </div>


                    <div class="umkm-card-body">

                        <div class="umkm-card-top">

                            <span class="umkm-kategori">

                                ${escapeHTML(
                                    umkm.kategori ||
                                    "Lainnya"
                                )}

                            </span>


                            <span class="umkm-rating">

                                <i class="fa-solid fa-star"></i>

                                ${escapeHTML(
                                    umkm.rating || "0"
                                )}

                            </span>

                        </div>


                        <h3>

                            ${escapeHTML(
                                umkm.nama || "-"
                            )}

                        </h3>


                        <div class="umkm-info">

                            <i class="fa-solid fa-location-dot"></i>

                            ${escapeHTML(
                                umkm.desa || "-"
                            )}

                        </div>


                        <div class="umkm-info">

                            <i class="fa-solid fa-box-open"></i>

                            ${escapeHTML(
                                umkm.produk || "-"
                            )}

                        </div>


                        <div class="umkm-card-footer">


                            <span class="umkm-status">

                                <span></span>

                                ${escapeHTML(status)}

                            </span>


                            <a
                                href="detail-umkm.html?id=${encodeURIComponent(
                                    umkm.id
                                )}"
                                class="btn-detail"
                            >

                                Lihat Detail

                                <i
                                    class="fa-solid fa-arrow-right">
                                </i>

                            </a>


                        </div>

                    </div>

                `;


                /* -------------------------------------
                   TAMBAHKAN KE CONTAINER
                ------------------------------------- */

                daftarUMKM.appendChild(card);

            });

        }


        /* ---------------------------------------------
           UPDATE
        --------------------------------------------- */

        updateStatistik();

        updateFilterDesa();

    }


    /* =================================================
       UPDATE STATISTIK
    ================================================= */

    function updateStatistik() {

        totalUMKM.textContent =
            dataUMKM.length;


        totalJasa.textContent =
            dataUMKM.filter(
                item =>
                    item.kategori === "Jasa"
            ).length;


        totalKuliner.textContent =
            dataUMKM.filter(
                item =>
                    item.kategori === "Kuliner"
            ).length;


        totalPerdagangan.textContent =
            dataUMKM.filter(
                item =>
                    item.kategori === "Perdagangan"
            ).length;

    }


    /* =================================================
       UPDATE FILTER DESA
    ================================================= */

    function updateFilterDesa() {

        const desaSaatIni =
            filterDesa.value;


        const daftarDesa =
            [
                ...new Set(
                    dataUMKM
                        .map(
                            item =>
                                item.desa
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        filterDesa.innerHTML =
            `<option value="">
                Semua Desa
            </option>`;


        daftarDesa.forEach((desa) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                desa;


            option.textContent =
                desa;


            filterDesa.appendChild(
                option
            );

        });


        if (
            daftarDesa.includes(
                desaSaatIni
            )
        ) {

            filterDesa.value =
                desaSaatIni;

        }

    }


    /* =================================================
       BUKA MODAL
    ================================================= */

    function bukaModal() {

        modalUMKM.classList.add(
            "active"
        );


        document
            .getElementById("namaUMKM")
            .focus();

    }


    /* =================================================
       TUTUP MODAL
    ================================================= */

    function tutupModal() {

        modalUMKM.classList.remove(
            "active"
        );


        formUMKM.reset();


        document.getElementById(
            "ratingUMKM"
        ).value = "5";

    }


    /* =================================================
       SIMPAN UMKM
    ================================================= */

    function simpanUMKM(event) {

        event.preventDefault();


        const nama =
            document
                .getElementById("namaUMKM")
                .value
                .trim();


        const kategori =
            document
                .getElementById("kategoriUMKM")
                .value;


        const desa =
            document
                .getElementById("desaUMKM")
                .value
                .trim();


        const produk =
            document
                .getElementById("produkUMKM")
                .value
                .trim();


        const rating =
            document
                .getElementById("ratingUMKM")
                .value;


        const whatsapp =
            document
                .getElementById("whatsappUMKM")
                .value
                .trim();


        const deskripsi =
            document
                .getElementById("deskripsiUMKM")
                .value
                .trim();


        /* ---------------------------------------------
           VALIDASI
        --------------------------------------------- */

        if (
            !nama ||
            !kategori ||
            !desa ||
            !produk
        ) {

            alert(
                "Mohon lengkapi data wajib UMKM."
            );

            return;

        }


        /* ---------------------------------------------
           ID OTOMATIS
        --------------------------------------------- */

        const idBaru =
            dataUMKM.length > 0

                ? Math.max(
                    ...dataUMKM.map(
                        item =>
                            Number(item.id) || 0
                    )
                ) + 1

                : 1;


        /* ---------------------------------------------
           OBJECT UMKM
        --------------------------------------------- */

        const umkmBaru = {

            id: idBaru,

            nama: nama,

            kategori: kategori,

            desa: desa,

            produk: produk,

            rating:
                rating || "5",

            whatsapp:
                whatsapp,

            deskripsi:
                deskripsi,

            foto:
                "assets/images/default.jpg",

            pemilik:
                "",

            alamat:
                "",

            jamOperasional:
                "",

            maps:
                "",

            status:
                "Buka"

        };


        /* ---------------------------------------------
           TAMBAHKAN DATA
        --------------------------------------------- */

        dataUMKM.push(
            umkmBaru
        );


        /* ---------------------------------------------
           SIMPAN
        --------------------------------------------- */

        saveLocalStorage();


        /* ---------------------------------------------
           REFRESH
        --------------------------------------------- */

        renderUMKM();


        /* ---------------------------------------------
           TUTUP FORM
        --------------------------------------------- */

        tutupModal();


        alert(
            "Data UMKM berhasil disimpan."
        );


        console.log(
            "UMKM baru:",
            umkmBaru
        );

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

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


    /* =================================================
       EVENT
    ================================================= */

    btnTambahUMKM.addEventListener(
        "click",
        bukaModal
    );


    btnTutupModal.addEventListener(
        "click",
        tutupModal
    );


    btnBatal.addEventListener(
        "click",
        tutupModal
    );


    formUMKM.addEventListener(
        "submit",
        simpanUMKM
    );


    searchUMKM.addEventListener(
        "input",
        renderUMKM
    );


    filterKategori.addEventListener(
        "change",
        renderUMKM
    );


    filterDesa.addEventListener(
        "change",
        renderUMKM
    );


    /* =================================================
       TUTUP MODAL KLIK LUAR
    ================================================= */

    modalUMKM.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modalUMKM
            ) {

                tutupModal();

            }

        }
    );


    /* =================================================
       START ENGINE
    ================================================= */

    loadData();

});
/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM DETAIL ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("UMKM DETAIL ENGINE");
    console.log("====================================");

    loadDetailUMKM();

});


/* =====================================================
   LOAD DETAIL UMKM
===================================================== */

async function loadDetailUMKM() {

    const loading =
        document.getElementById("loadingUMKM");

    const detail =
        document.getElementById("detailUMKM");

    const error =
        document.getElementById("errorUMKM");


    try {

        /* ---------------------------------------------
           AMBIL ID DARI URL
        --------------------------------------------- */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const id =
            params.get("id");


        console.log(
            "ID UMKM:",
            id
        );


        if (!id) {

            throw new Error(
                "ID UMKM tidak ditemukan pada URL."
            );

        }


        /* ---------------------------------------------
           BACA DATABASE
        --------------------------------------------- */

        const response =
            await fetch(
                "../../data/umkm.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Gagal membaca umkm.json. HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Format umkm.json tidak valid."
            );

        }


        /* ---------------------------------------------
           CARI UMKM
        --------------------------------------------- */

        const umkm =
            data.find(function (item) {

                return String(item.id) ===
                       String(id);

            });


        if (!umkm) {

            throw new Error(
                "UMKM dengan ID " +
                id +
                " tidak ditemukan."
            );

        }


        console.log(
            "UMKM ditemukan:",
            umkm
        );


        /* ---------------------------------------------
           TAMPILKAN DATA
        --------------------------------------------- */

        renderDetailUMKM(
            umkm
        );


        /* ---------------------------------------------
           TAMPILKAN DETAIL
        --------------------------------------------- */

        if (loading) {

            loading.style.display =
                "none";

        }


        if (detail) {

            detail.style.display =
                "block";

        }


    }

    catch (err) {

        console.error(
            "Gagal memuat detail UMKM:",
            err
        );


        if (loading) {

            loading.style.display =
                "none";

        }


        if (error) {

            error.style.display =
                "block";

        }

    }

}


/* =====================================================
   RENDER DETAIL
===================================================== */

function renderDetailUMKM(
    umkm
) {

    /* ---------------------------------------------
       NAMA
    --------------------------------------------- */

    setText(
        "heroNama",
        umkm.nama || "UMKM Dayeuhluhur"
    );


    setText(
        "namaUMKM",
        umkm.nama || "-"
    );


    /* ---------------------------------------------
       KATEGORI
    --------------------------------------------- */

    setText(
        "kategoriUMKM",
        umkm.kategori || "UMKM"
    );


    /* ---------------------------------------------
       DESA
    --------------------------------------------- */

    setText(
        "desaUMKM",
        umkm.desa || "-"
    );


    /* ---------------------------------------------
       PRODUK
    --------------------------------------------- */

    setText(
        "produkUMKM",
        umkm.produk || "-"
    );


    /* ---------------------------------------------
       RATING
    --------------------------------------------- */

    setText(
        "ratingUMKM",
        umkm.rating || "0"
    );


    /* ---------------------------------------------
       STATUS
    --------------------------------------------- */

    setText(
        "statusUMKM",
        umkm.status || "Buka"
    );


    /* ---------------------------------------------
       DESKRIPSI
    --------------------------------------------- */

    setText(
        "deskripsiUMKM",
        umkm.deskripsi ||
        "Informasi mengenai usaha ini belum tersedia."
    );


    /* ---------------------------------------------
       GAMBAR
    --------------------------------------------- */

    const gambar =
        document.getElementById(
            "gambarUMKM"
        );


    if (gambar) {

        gambar.src =
            umkm.gambar ||
            "../../assets/images/umkm/default.jpg";


        gambar.alt =
            umkm.nama ||
            "UMKM Dayeuhluhur";


        gambar.onerror =
            function () {

                this.src =
                    "../../assets/images/umkm/default.jpg";

            };

    }


    /* ---------------------------------------------
       WHATSAPP
    --------------------------------------------- */

    const whatsapp =
        document.getElementById(
            "whatsappUMKM"
        );


    if (whatsapp) {

        const nomor =
            umkm.whatsapp ||
            umkm.telepon ||
            "";


        if (nomor) {

            let nomorBersih =
                String(nomor)
                    .replace(/\D/g, "");


            /* 08xxxx → 628xxxx */

            if (
                nomorBersih.startsWith("0")
            ) {

                nomorBersih =
                    "62" +
                    nomorBersih.substring(1);

            }


            whatsapp.href =
                "https://wa.me/" +
                nomorBersih;


            whatsapp.target =
                "_blank";


        } else {

            whatsapp.style.display =
                "none";

        }

    }

}


/* =====================================================
   HELPER TEXT
===================================================== */

function setText(
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
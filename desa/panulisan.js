/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA PANULISAN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("================================");
    console.log("PANULISAN DETAIL PAGE");
    console.log("================================");

    loadPanulisan();

});


/* =====================================================
   LOAD DATA DESA
===================================================== */

async function loadPanulisan() {

    try {

        console.log("Membaca data/desa.json...");


        const response =
            await fetch("../data/desa.json", {
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                "Gagal membaca desa.json. HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Jumlah data desa:",
            data.length
        );


        const desa =
            data.find(function (item) {

                return item.slug === "panulisan";

            });


        if (!desa) {

            throw new Error(
                "Data Panulisan tidak ditemukan."
            );

        }


        console.log(
            "Data Panulisan:",
            desa
        );


        renderPanulisan(desa);

    }

    catch (error) {

        console.error(
            "ERROR PANULISAN:",
            error
        );

        showError(
            error.message
        );

    }

}


/* =====================================================
   RENDER
===================================================== */

function renderPanulisan(desa) {

    setText(
        "namaDesa",
        desa.nama
    );


    setText(
        "statusDesa",
        desa.status
    );


    setText(
        "deskripsiDesa",
        desa.deskripsi
    );


    setText(
        "jumlahPenduduk",
        desa.penduduk
    );


    setText(
        "jumlahUMKM",
        desa.umkm
    );


    setText(
        "namaBUMDes",
        desa.bumdes
    );


    setText(
        "jumlahWisata",
        desa.wisata
    );


    const gambar =
        document.getElementById(
            "gambarDesa"
        );


    if (gambar && desa.gambar) {

        gambar.src =
            "../" + desa.gambar;

        gambar.alt =
            "Desa " +
            desa.nama;

        gambar.onerror =
            function () {

                this.src =
                    "../assets/images/desa/default.jpg";

            };

    }


    document.title =
        "Desa " +
        desa.nama +
        " | PLAZA DAYEUHLUHUR";


    console.log(
        "Panulisan berhasil ditampilkan."
    );

}


/* =====================================================
   SET TEXT
===================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            "Element #" +
            id +
            " tidak ditemukan."
        );

        return;

    }


    element.textContent =
        value || "-";

}


/* =====================================================
   ERROR
===================================================== */

function showError(message) {

    const container =
        document.getElementById(
            "desaDetailContainer"
        );


    if (container) {

        container.innerHTML = `

            <div class="alert alert-danger text-center">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <strong>
                    Data desa gagal dimuat.
                </strong>

                <br>

                <small>
                    ${message}
                </small>

            </div>

        `;

    }

}
document.addEventListener("DOMContentLoaded", function () {

    console.log("DESA.JS BERHASIL AKTIF");

    var container = document.getElementById("desaContainer");

    if (!container) {

        console.error("desaContainer tidak ditemukan.");

        return;
    }

    fetch("./data/desa.json")

        .then(function (response) {

            console.log("Status desa.json:", response.status);

            if (!response.ok) {

                throw new Error(
                    "desa.json gagal dimuat. HTTP " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            console.log(
                "DATA DESA BERHASIL DIBACA:",
                data
            );

            console.log(
                "JUMLAH DESA:",
                data.length
            );


            var html = "";


            data.forEach(function (item) {

                html +=
                    '<div class="col-lg-4 col-md-6 mb-4">' +

                        '<div class="card shadow h-100">' +

                            '<img ' +
                                'src="' +
                                (item.gambar ||
                                "assets/images/desa/default.jpg") +
                                '" ' +
                                'class="card-img-top" ' +
                                'alt="' +
                                (item.nama || "Desa") +
                                '">' +

                            '<div class="card-body">' +

                                '<span class="badge bg-success mb-2">' +
                                    (item.status || "Desa") +
                                '</span>' +

                                '<h4 class="fw-bold">' +
                                    (item.nama || "-") +
                                '</h4>' +

                                '<p class="text-success">' +
                                    (item.deskripsi || "-") +
                                '</p>' +

                                '<p>' +
                                    '👥 Penduduk: ' +
                                    '<strong>' +
                                        (item.penduduk || "-") +
                                    '</strong>' +
                                '</p>' +

                                '<p>' +
                                    '🛍️ UMKM: ' +
                                    '<strong>' +
                                        (item.umkm || "-") +
                                    '</strong>' +
                                '</p>' +

                                '<p>' +
                                    '🏢 BUMDes: ' +
                                    '<strong>' +
                                        (item.bumdes || "-") +
                                    '</strong>' +
                                '</p>' +

                                '<p>' +
                                    '🌄 Wisata: ' +
                                    '<strong>' +
                                        (item.wisata || "-") +
                                    '</strong>' +
                                '</p>' +

                                '<a ' +
                                    'href="' +
                                    (item.link || "#") +
                                    '" ' +
                                    'class="btn btn-success w-100">' +

                                    'Jelajahi Desa →' +

                                '</a>' +

                            '</div>' +

                        '</div>' +

                    '</div>';

            });


            container.innerHTML = html;


            console.log(
                "14 DESA SELESAI DITAMPILKAN."
            );

        })

        .catch(function (error) {

            console.error(
                "GAGAL MEMUAT DESA:",
                error
            );


            container.innerHTML =
                '<div class="col-12">' +

                    '<div class="alert alert-danger text-center">' +

                        '<strong>' +
                            'Data desa gagal dimuat.' +
                        '</strong>' +

                        '<br>' +

                        error.message +

                    '</div>' +

                '</div>';

        });

});
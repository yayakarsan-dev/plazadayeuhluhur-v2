fetch('data/desa.json')
.then(response => response.json())
.then(data => {

    let html = "";

    data.forEach(desa => {

        html += `
        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card desa-card h-100">

                <img src="${desa.gambar}" class="card-img-top" alt="${desa.nama}">

                <div class="card-body">

                    <h4>${desa.nama}</h4>

                    <div class="mb-3">
                        <span class="badge bg-success">
                            ${desa.potensi}
                        </span>
                    </div>

                    <ul class="list-unstyled">

                        <li>
                            <i class="fa-solid fa-users text-primary"></i>
                            Penduduk : ${desa.penduduk}
                        </li>

                        <li>
                            <i class="fa-solid fa-store text-warning"></i>
                            UMKM : ${desa.umkm}
                        </li>

                        <li>
                            <i class="fa-solid fa-building text-success"></i>
                            BUMDes : ${desa.bumdes}
                        </li>

                    </ul>

                    <a href="${desa.link}" class="btn btn-primary w-100">
                        Lihat Profil
                    </a>

                </div>

            </div>

        </div>
        `;

    });

    document.getElementById("desaContainer").innerHTML = html;

})
.catch(error => {
    console.error("Gagal membaca data desa:", error);
});
fetch('../../data/desa.json')
.then(response => response.json())
.then(data => {

    let html = "";

    data.forEach(item => {

        html += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card h-100 desa-card">

                <img src="${item.gambar}"
                     class="card-img-top"
                     alt="${item.nama}">

                <div class="card-body">

                    <span class="badge bg-success mb-2">
                        ${item.status}
                    </span>

                    <h4 class="fw-bold">
                        ${item.nama}
                    </h4>

                    <p class="text-muted">
                        ${item.deskripsi}
                    </p>

                    <hr>

                    <div class="row text-center">

                        <div class="col-6 mb-3">
                            👥<br>
                            <b>${item.penduduk}</b><br>
                            Penduduk
                        </div>

                        <div class="col-6 mb-3">
                            🛍<br>
                            <b>${item.umkm}</b><br>
                            UMKM
                        </div>

                        <div class="col-6">
                            🏢<br>
                            <b>${item.bumdes}</b><br>
                            BUMDes
                        </div>

                        <div class="col-6">
                            🌄<br>
                            <b>${item.wisata}</b><br>
                            Wisata
                        </div>

                    </div>

                    <div class="d-grid mt-4">

                        <a href="${item.link}"
                           class="btn btn-success">

                           Lihat Profil Desa

                        </a>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("desaContainer").innerHTML = html;

})
.catch(error => console.log(error));
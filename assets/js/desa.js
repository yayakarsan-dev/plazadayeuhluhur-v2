fetch('data/desa.json')
.then(response => response.json())
.then(data => {

    let html = "";

    data.forEach(item => {

        html += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card desa-card shadow h-100">

                <img src="${item.gambar}" class="card-img-top">

                <div class="card-body">

                    <span class="badge bg-success badge-status">

                        ${item.status}

                    </span>

                    <h4 class="mt-3">

                        ${item.nama}

                    </h4>

                    <p class="text-muted">

                        ${item.deskripsi}

                    </p>

                    <div class="row">

                        <div class="col-6">

                            <div class="stat-box">

                                👥

                                <b>${item.penduduk}</b>

                                Penduduk

                            </div>

                        </div>

                        <div class="col-6">

                            <div class="stat-box">

                                🛍

                                <b>${item.umkm}</b>

                                UMKM

                            </div>

                        </div>

                        <div class="col-6">

                            <div class="stat-box">

                                🏢

                                <b>${item.bumdes}</b>

                                BUMDes

                            </div>

                        </div>

                        <div class="col-6">

                            <div class="stat-box">

                                🌄

                                <b>${item.wisata}</b>

                                Wisata

                            </div>

                        </div>

                    </div>

                    <a href="${item.link}"

                       class="btn btn-success w-100 mt-4">

                        Lihat Profil

                    </a>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("desaContainer").innerHTML = html;

})
.catch(error => console.log(error));
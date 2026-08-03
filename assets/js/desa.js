fetch('data/desa.json')
.then(response => response.json())
.then(data => {

    let html = "";

    data.forEach(item => {

        html += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card desa-card shadow h-100">

                <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">

                <div class="card-body">

                    <span class="badge bg-success badge-status mb-2">

                        ${item.status}

                    </span>

                    <h4 class="fw-bold">

                        ${item.nama}

                        ${
                            item.verified
                            ?
                            `<i class="fa-solid fa-circle-check text-primary"
                            title="Verified by PLAZA DAYEUHLUHUR"></i>`
                            :
                            ""
                        }

                    </h4>

                    <p class="text-success fw-semibold">

                        ${item.potensi}

                    </p>

                    <p class="small text-muted">

                        🎁 Produk Unggulan :
                        <b>${item.produk}</b>

                    </p>

                    <div class="row mt-3">

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

                        <div class="col-6 mt-2">

                            <div class="stat-box">

                                🏢

                                <b>${item.bumdes}</b>

                                BUMDes

                            </div>

                        </div>

                        <div class="col-6 mt-2">

                            <div class="stat-box">

                                🌄

                                <b>${item.wisata}</b>

                                Wisata

                            </div>

                        </div>

                    </div>

                    <a href="${item.link}"

                       class="btn btn-success w-100 mt-4">

                       Jelajahi Desa →

                    </a>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("desaContainer").innerHTML = html;

    // ===========================
    // LIVE SEARCH
    // ===========================

    const search = document.getElementById("searchDesa");

    search.addEventListener("keyup", function(){

        let keyword = this.value.toLowerCase();

        let cards = document.querySelectorAll(".desa-card");

        cards.forEach(card=>{

            let text = card.innerText.toLowerCase();

            if(text.includes(keyword)){

                card.parentElement.style.display="block";

            }else{

                card.parentElement.style.display="none";

            }

        });

    });

})
.catch(error => console.error(error));
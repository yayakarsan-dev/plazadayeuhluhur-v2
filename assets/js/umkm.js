fetch('../data/umkm.json')

.then(response => response.json())

.then(data => {

let html="";

data.forEach(item=>{

html+=`

<div class="col-lg-3 col-md-6 mb-4">

<div class="card h-100 shadow umkm-card">

<img src="../${item.gambar}" class="card-img-top" alt="${item.nama}">

<div class="card-body">

<span class="badge bg-success">

${item.status}

</span>

<h5 class="mt-3 fw-bold">

${item.nama}

</h5>

<p class="text-muted mb-2">

<i class="fa-solid fa-layer-group"></i>

${item.kategori}

</p>

<p>

<i class="fa-solid fa-location-dot text-danger"></i>

${item.desa}

</p>

<div class="d-flex justify-content-between">

<span>

⭐ ${item.rating}

</span>

<span>

${item.produk}

</span>

</div>

<a href="${item.link}"

class="btn btn-success w-100 mt-3">

Lihat Toko

</a>

</div>

</div>

</div>

`;

});

document.getElementById("umkmContainer").innerHTML=html;

})

.catch(error=>console.log(error));
fetch('data/umkm.json')
.then(res => res.json())
.then(data=>{

let html="";

data.forEach(item=>{

html+=`

<div class="col-lg-4 col-md-6 mb-4">

<div class="card umkm-card h-100">

<img src="${item.gambar}" class="card-img-top">

<div class="card-body">

<span class="badge bg-warning text-dark mb-2">

${item.kategori}

</span>

<h5>${item.nama}</h5>

<p class="text-success fw-bold">

${item.harga}

</p>

<p>

<i class="fa-solid fa-location-dot"></i>

${item.desa}

</p>

<a href="#"

class="btn btn-primary w-100">

Lihat Detail

</a>

</div>

</div>

</div>

`;

});

document.getElementById("umkmContainer").innerHTML=html;

});
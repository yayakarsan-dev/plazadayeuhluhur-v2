fetch('data/bisnis.json')

.then(res=>res.json())

.then(data=>{

let html="";

data.forEach(item=>{

html+=`

<div class="col-lg-4 col-md-6">

<div class="card bisnis-card shadow-sm h-100">

<img src="${item.gambar}" class="card-img-top">

<div class="card-body">

<span class="badge bg-primary mb-2">

${item.kategori}

</span>

<h5>${item.nama}</h5>

<p class="text-muted">

<i class="fa-solid fa-location-dot"></i>

${item.desa}

</p>

<p>

${item.deskripsi}

</p>

<a href="${item.link}"

class="btn btn-primary w-100">

Lihat Profil

</a>

</div>

</div>

</div>

`;

});

document.getElementById("bisnisContainer").innerHTML=html;

});
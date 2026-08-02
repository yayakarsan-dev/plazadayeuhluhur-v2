fetch('data/bumdes.json')
.then(res => res.json())
.then(data=>{

let html="";

data.forEach(item=>{

html+=`

<div class="col-lg-4 mb-4">

<div class="card h-100 bumdes-card">

<img src="${item.gambar}" class="card-img-top">

<div class="card-body">

<h5>${item.nama}</h5>

<p><i class="fa-solid fa-location-dot text-success"></i> ${item.desa}</p>

<p>${item.usaha}</p>

<a href="#" class="btn btn-success w-100">

Lihat Profil

</a>

</div>

</div>

</div>

`;

});

document.getElementById("bumdesContainer").innerHTML=html;

});
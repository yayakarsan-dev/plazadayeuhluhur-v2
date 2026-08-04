fetch('data/bursa.json')
.then(res=>res.json())
.then(data=>{

let html="";

data.forEach(item=>{

html+=`

<div class="col-lg-4 col-md-6 mb-4">

<div class="card bisnis-card h-100">

<img src="${item.gambar}" class="card-img-top">

<div class="card-body">

<span class="badge bg-warning text-dark">

${item.kategori}

</span>

<h5 class="mt-2">

${item.judul}

</h5>

<h4 class="text-success">

${item.harga}

</h4>

<p>

<i class="fa-solid fa-location-dot text-danger"></i>

${item.desa}

</p>

<p>

<i class="fa-solid fa-user"></i>

${item.penjual}

</p>

<a

href="https://wa.me/${item.wa}"

target="_blank"

class="btn btn-success w-100">

<i class="fa-brands fa-whatsapp"></i>

${item.cta}

</a>

</div>

</div>

</div>

`;

});

document.getElementById("bursaContainer").innerHTML=html;

});
const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");

let gelirler = 0;
let harcamaListesi = [];

const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");
const kalanTh = document.getElementById("kalanTh");

const harcamaFormu = document.getElementById("harcama-formu");
const harcamaAlaniInput = document.getElementById("harcama-alani");
const tarihInput = document.getElementById("tarih");
const miktarInput = document.getElementById("miktar");

const harcamaBody = document.getElementById("harcama-body");
const temizleBtn = document.getElementById("temizle-btn");

ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault();
  gelirler = gelirler + Number(gelirInput.value);
  localStorage.setItem("gelirler", gelirler);
  gelirinizTd.innerText = gelirler;
  ekleFormu.reset();
  hesaplaVeGuncelle();
});

window.addEventListener("load", () => {
  gelirler = Number(localStorage.getItem("gelirler")) || 0;
  gelirinizTd.innerText = gelirler;
  tarihInput.valueAsDate = new Date();
  harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || [];

  harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama));
  hesaplaVeGuncelle();
});

harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault();

  const yeniHarcama = {
    id: new Date().getTime(),
    tarih: new Date(tarihInput.value).toLocaleDateString(),
    alan: harcamaAlaniInput.value,
    miktar: miktarInput.value,
  };

  harcamaFormu.reset();
  tarihInput.valueAsDate = new Date();

  harcamaListesi.push(yeniHarcama);
  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  harcamayiDomaYaz(yeniHarcama);
  hesaplaVeGuncelle();
});

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
  const tr = document.createElement("tr");
  const appendTd = (content) => {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
  };

  const createLastTd = () => {
    const td = document.createElement("td");
    const iElement = document.createElement("i");
    iElement.id = id;
    iElement.className = "fa-solid fa-trash-can text-danger";
    iElement.type = "button";
    td.appendChild(iElement);
    return td;
  };

  tr.append(appendTd(tarih), appendTd(alan), appendTd(miktar), createLastTd());

  harcamaBody.append(tr);
};

const hesaplaVeGuncelle = () => {
  gelirinizTd.innerText = new Intl.NumberFormat().format(gelirler);

  const giderler = harcamaListesi.reduce(
    (toplam, harcama) => toplam + Number(harcama.miktar),
    0
  );
  giderinizTd.innerText = new Intl.NumberFormat().format(giderler);
  kalanTd.innerText = new Intl.NumberFormat().format(gelirler - giderler);

  const borclu = gelirler - giderler < 0;

  kalanTd.classList.toggle("text-danger", borclu);
  kalanTh.classList.toggle("text-danger", borclu);
};

harcamaBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove();
  }
  const id = e.target.id;
  harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != id);
  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));

  hesaplaVeGuncelle();
});

temizleBtn.addEventListener("click", () => {
  if (confirm("Silmek istediğinize emin misiniz?")) {
    harcamaListesi = [];
    gelirler = 0;
    localStorage.removeItem("gelirler");
    localStorage.removeItem("harcamalar");
    harcamaBody.innerHTML = "";
    hesaplaVeGuncelle();
  }
});

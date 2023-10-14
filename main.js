//htmlden gelenler
const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const basketBtn = document.querySelector("#basket-btn");
const closeBtn = document.querySelector("#close-btn");
const basketList = document.querySelector("#list");
const totalInfo = document.querySelector("#total");

//!olay izleyiciler

//html in yüklenme anını izler
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

/* kateogri bilgilerini alma 
1-api'ye istek at
2- gelen veriyi işle
3- verileri ekrana basacak fonksiyonu çalıştır
4- hata oluşursa kullanıcıyı bilgilendir.
*/
const baseUrl = "https://fakestoreapi.com";

function fetchCategories() {
  fetch(`${baseUrl}/products/categories`)
    .then((response) => response.json())
    .then(renderCategories)
    .catch((error) => alert("Kategorileri alırken bir hata oluştu"));
}
//her bir kategori için ekrana kart oluşturur
function renderCategories(categories) {
  categories.forEach((category) => {
    //1-div oluşturma
    const categoryDiv = document.createElement("div");
    //2-dive class ekleme
    categoryDiv.classList.add("category");
    //3-içeriğini belirleme
    const randomNum = Math.round(Math.random() * 1000);
    categoryDiv.innerHTML = `
      <img src="https://picsum.photos/640/640?r=${randomNum}" />
      <h2>${category}</h2>
      `;
    //4- htmle gönderme
    categoryList.appendChild(categoryDiv);
  });
}
//data değişkenini global scope ta tanımladık
//bu sayde bütün fonksiyonlar bu değere erişebilecek
let data;

//ürünler verisini çeken fonksiyon
async function fetchProducts() {
  try {
    //api'a istek at
    const response = await fetch(`${baseUrl}/products`);
    //gelen cevabı işle
    data = await response.json();

    //ekrana bas
    renderProducts(data);
  } catch (error) {
    alert("Ürünleri alırken bir hata oluştu.");
  }
}
// ürünleri ekrana bas
function renderProducts(products) {
  // her bir ürün için bir ürün kartı oluşturma
  const cardsHTML = products
    .map(
      (product) => `
  <div class="card">
  <div class="img-wrapper">
  <img src="${product.image}">
  </div>
 
  <h4>${product.title}</h4>
  <h4>${product.category}</h4>
  <div class="info">
      <span>${product.price}</span>
      <button onclick="addToBasket(${product.id})">Sepete Ekle</button>
  </div>
</div>
  
  `
    )
    .join(" ");
  //hazırladığımız hmtl i ekrana bas
  productList.innerHTML = cardsHTML;
}
//!sepet işlemleri
let basket = [];
let total = 0;
//modalı açar
basketBtn.addEventListener("click", () => {
  modal.classList.add("active");
  renderBasket();
  calculateTotal();
});
// dışarıya veya çarpıya tıklanırsa modalı kapat
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal-wrapper") ||
    e.target.id === "close-btn"
  ) {
    modal.classList.remove("active");
  }
});

function addToBasket(id) {
  //id sini yola çıkarak objenin değerlerini bulma
  const product = data.find((i) => i.id === id);
  //spete daha önce ürün eklendiyse bulma
  const found = basket.find((i) => i.id == id);
  if (found) {
    //miktarını arttırır
    found.amount++;
  } else {
    //sepete ürünü ekler
    basket.push({ ...product, amount: 1 });
  }
//bildirim veer
  Toastify({
    text: "Ürün Sepete Eklendi.",
    close: true,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

}

//sepete elemanları listeleme
function renderBasket() {
  basketList.innerHTML = basket
    .map(
      (item) => `
          
          <div class="item">
            <img src="${item.image}">
            <h3 class="title">${item.title.slice(0, 20) + "..."}</h3>
            <h4 class="price">$${item.price}</h4>
            <p>Miktar:${item.amount}</p>
            <img onclick="handleDelete(${item.id})" id="delete-img" src="image/trash.png">
          </div>
          `
    )
    .join("");
}
//toplam ürün ve fiyatını hesaplama
function calculateTotal() {
  //reduce diziyi döner ve elemanları belirlediğimiz değerleri toplar

  const total = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

//toplam miktar hesaplama 
const amount =basket.reduce((sum,i) => sum + i.amount,0);
//hesapladığımız ürünleri ekrana basmak
  totalInfo.innerHTML = ` 
  <span id="count">${amount} ürün</span>
  toplam:
  <span id="price">${total.toFixed(2)}</span>$ `;
}

//elemanı siler
function handleDelete(deleteId) {
  //kaldırılacak ürünü diziden çıkarma
 basket = basket.filter((i) => i.id !== deleteId);
  //listeyi günceller
  renderBasket();
  //toplamı güncelle
  calculateTotal();
}
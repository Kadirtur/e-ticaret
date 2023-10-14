const url = 'https://jsonplaceholder.typicode.com/users';
//fetch: api lere istek atmamızı sağlar
fetch(url)
// olumlu cevap gelirse çalışır
.then((response) => {
    //gelen json verisinin js de kullanılabilir hale getirir
return response.json();
})
//veri işlendikten sonra çalışır
.then(renderUser)

// olumsuz cevap gelirse çalışır.
.catch((error) => {
    console.log('Veri çekerken hata oluştu' + error);
});

function renderUser(data) {
    data.forEach((user) => document.write(user.name +  '</br>'));
}

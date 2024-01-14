//! UTILITIES
const just = (selector) => document.querySelector(selector);

//! GLOBAL FUNCTIONS
const urlBase = `http://gateway.marvel.com/v1/public/`;
let ts = `ts=1`;
const publicKey = "&apikey=d3abb539098557030e53849b9dc73d81";
const privateKey = "338e6aeedb37d02e56329d2837e6679586d0c53f";
const hash = "&hash=56d3e07a1a8a5d3e0602e841365c58f5";

//!global functions for pagination
const itemsPerPage = 20
let offsetCounter = 0;
let limitCounter = 20;
let pageCounter = 1
let totalItems 

//!DATA FROM API
const getMarvelComics = async (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) => {

    let buildingURL = `http://gateway.marvel.com/v1/public/`

    if(typeSelected === "characters"){
        buildingURL += `${typeSelected}?${ts}${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
    }
    if(nameSearched || typeSelected || orderSelected){
        buildingURL += `${typeSelected}?`
    if(typeSelected === "comics"){
        buildingURL += `formatType=${typeSelected}&${ts}${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
    }
    if(nameSearched && (typeSelected === "comics")){
        buildingURL += `titleStartsWith=${nameSearched}&offset=${offset}&limit=${limit}&`
    }
    if((nameSearched && (typeSelected === "characters"))){
        buildingURL += `nameStartsWith=${nameSearched}&offset=${offset}&limit=${limit}&`
    }
    if(orderSelected === "a-z" && (typeSelected === "comics")){
        buildingURL += `orderBy=title&offset=${offset}&limit=${limit}&`
    }
    if(orderSelected === "a-z" && (typeSelected === "characters")){
        buildingURL += `orderBy=name&offset=${offset}&limit=${limit}&`
    }
    if(orderSelected === "z-a" && (typeSelected === "comics")){
        buildingURL += `orderBy=-title&offset=${offset}&limit=${limit}&`
    }
    if(orderSelected === "z-a" && (typeSelected === "characters")){
        buildingURL += `orderBy=-name&offset=${offset}&limit=${limit}&`
    }
    if(orderSelected === "newest"){
        buildingURL += `orderBy=-focDate&offset=${offset}&limit=${limit}&`
    }
    if (orderSelected === "oldest"){
        buildingURL += `orderBy=focDate&offset=${offset}&limit=${limit}&`
    }
    }
    const response = await fetch(buildingURL);
    const data = await response.json();
    totalItems = data.data.total
    return data;
};

//!RENDER COMICS
const printComic = async (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) => {
  const comics = await getMarvelComics(typeSelected, nameSearched, orderSelected, offset, limit, pageNum);
  just(".results-cards-comics").innerHTML = ``;
  just(".total-of-comics").innerText = `${comics.data.total} RESULTADOS`;
  just(".current-page-num").innerText = `page ${pageNum}`

  for (let comic of comics.data.results) {
    let pathImg = comic.thumbnail.path + "/portrait_incredible.jpg";

    just(".results-cards-comics").innerHTML += `
        <div class="div-cards p-4 ">
            <div class="div-img-cover-magazine ">
                <img src="${pathImg}">
            </div>
            <p class="font-semibold mt-6">${comic.title}</p>
        </div>
        `;
  }
};
printComic("comics", null, "a-z", offsetCounter, limitCounter, pageCounter);



//!FUNCTIONALITY FOR FILTERS
//?BY INPUT
just(".search-input").addEventListener("input", () => {
    printComic(
        just(".type-filter").value,
        just(".search-input").value,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//? BY TYPE (CATEGORY - CHARACTER)
just(".type-filter").addEventListener("change", () => {
    printComic(
        just(".type-filter").value,
        just(".search-input").value,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//?BY ORDER (ABC - NEWEST - OLDEST)
just(".order-filter").addEventListener("change", () => {
    printComic(
        just(".type-filter").value,
        just(".search-input").value,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//!FUNCTIONALITY FOR PAGINATION
//?FIRST PAGE
just(".btns-first-page").addEventListener("click", ()=> {
    offsetCounter = 0
    limitCounter = 20
    pageCounter = 1
    printComic(
        just(".type-filter").value,
        just(".search-input").value,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//?PREVIOUS PAGE
just(".btns-prev-pag").addEventListener("click", () => {
    if (offsetCounter >= itemsPerPage) {
        offsetCounter -= itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter -= 1;
    }
    printComic(
        just(".type-filter").value,
        just(".search-input").value,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
    });

//?NEXT PAGE
just(".btns-next-page").addEventListener("click", () => {
    if (offsetCounter + itemsPerPage < totalItems) {
        offsetCounter += itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter +=1
    }
    printComic(
        just(".type-filter").value,
        just(".search-input").value,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//?LAST PAGE
just(".btns-last-page").addEventListener("click", () => {
    pageCounter = Math.ceil(totalItems / itemsPerPage);
    const startOffset = Math.max(0, (pageCounter - 1) * itemsPerPage);
    const endOffset = totalItems;
    offsetCounter = startOffset;
    limitCounter = endOffset - startOffset;
    printComic(
        just(".type-filter").value,
        just(".search-input").value,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
});




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const filtersUrl = (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) =>{
//     console.log("me ejecuto");
//     let buildingURL = `http://gateway.marvel.com/v1/public/`
//     if(typeSelected === "characters"){
//         buildingURL += `${typeSelected}?${ts}${publicKey}&${hash}&` // http://gateway.marvel.com/v1/public/characters?ts=1&apikey=d3abb539098557030e53849b9dc73d81&hash=56d3e07a1a8a5d3e0602e841365c58f5
//     }
//     if(nameSearched || typeSelected || orderSelected){
//         buildingURL += "?"
//     if(typeSelected === "comics"){
//         buildingURL += `formatType=${typeSelected}&${ts}${publicKey}&${hash}&` // http://gateway.marvel.com/v1/public/comics?ts=1&apikey=d3abb539098557030e53849b9dc73d81&hash=56d3e07a1a8a5d3e0602e841365c58f5
//     }
//     if(nameSearched && (typeSelected === "comics")){
//         buildingURL += `titleStartsWith=${nameSearched}&`
// // http://gateway.marvel.com/v1/public/characters?titleStartsWith=&
//     }
//     if((nameSearched && (typeSelected === "characters"))){
//         buildingURL += `nameStartsWith=${nameSearched}&`
//     // http://gateway.marvel.com/v1/public/characters?titleStartsWith=&
//     }
//     if(orderSelected === "a-z" && (typeSelected === "comics")){
//         buildingURL += `orderBy=title&`
//     }
//     if(orderSelected === "a-z" && (typeSelected === "characters")){
//         buildingURL += `orderBy=name&`
// // http://gateway.marvel.com/v1/public/characters?titleStartsWith=&orderBy=name&
//     }
//     if(orderSelected === "z-a" && (typeSelected === "comics")){
//         buildingURL += `orderBy=-title&`
//     }
//     if(orderSelected === "z-a" && (typeSelected === "characters")){
//         buildingURL += `orderBy=-name&`
// // http://gateway.marvel.com/v1/public/characters?titleStartsWith=&orderBy=name&
//     }
//     if(orderSelected === "newest"){
//         buildingURL += `orderBy=-focDate&`
//     }
//     if (orderSelected === "oldest"){
//         buildingURL += `orderBy=focDate&`
//     }
//     }
//     return `${buildingURL}&offset=${offset}&limit=${limit}&`
// }

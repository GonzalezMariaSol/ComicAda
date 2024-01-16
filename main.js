//SECTION
//ASK
//TRASHfasd;flakdjsf
//FIX fdsafkjasdf
//CHECK dfasdfa





//ASK porque no puedo ver con la info de la api en mi celu -tema con el deploy- 
//ASK linea de la api rompe todo el tiempo y la necesito, no se como hacer para que el scope sea global




//SECTION UTILITIES
const just = (selector) => document.querySelector(selector);

//SECTION GLOBAL FUNCTIONS
let ts = `ts=1`;
const publicKey = "&apikey=d3abb539098557030e53849b9dc73d81";
const privateKey = "338e6aeedb37d02e56329d2837e6679586d0c53f";
const hash = "hash=56d3e07a1a8a5d3e0602e841365c58f5";
let lowerCaseSearchValue = ""


//SECTION global functions for pagination
const itemsPerPage = 20
let offsetCounter = 0;
let limitCounter = 20;
let pageCounter = 1
let totalItems


//SECTION  DATA FROM API
const getMarvelComics = async (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) => {

    let buildingURL = `http://gateway.marvel.com/v1/public/`

    if (typeSelected === "comics") {
        if (nameSearched || typeSelected || orderSelected) {
            buildingURL += `${typeSelected}?${ts}${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
            if (typeSelected === "comics") {
                buildingURL += `formatType=${typeSelected}&`
            }
            if (nameSearched) {
                buildingURL += `titleStartsWith=${nameSearched}&`
            }
            if (orderSelected === "a-z") {
                buildingURL += `orderBy=title&`
            }
            if (orderSelected === "z-a") {
                buildingURL += `orderBy=-title&`
            }
            if (orderSelected === "newest") {
                buildingURL += `orderBy=-focDate&`
            }
            if (orderSelected === "oldest") {
                buildingURL += `orderBy=focDate&`
            }
        }
    } else if (typeSelected === "characters") {
        if (nameSearched || typeSelected || orderSelected) {
            buildingURL += `${typeSelected}?${ts}${publicKey}&${hash}&offset=${offset}&limit=${limit}&`
            if (nameSearched) {
                buildingURL += `nameStartsWith=${nameSearched}&`
            }
            if (orderSelected === "a-z") {
                buildingURL += `orderBy=name&`
            }
            if (orderSelected === "z-a") {
                buildingURL += `orderBy=-name&`
            }
            if (orderSelected === "newest") {
                buildingURL += `orderBy=-focDate&`
            }
            if (orderSelected === "oldest") {
                buildingURL += `orderBy=focDate&`
            }
        }
    }
    console.log(buildingURL);
    const response = await fetch(buildingURL);
    const data = await response.json();
    totalItems = data.data.total
    return data;
};


//SECTION RENDER COMICS
const printComic = async (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) => {
    const comics = await getMarvelComics(typeSelected, nameSearched, orderSelected, offset, limit, pageNum);
    console.log(comics.data.results);
    just(".results-cards-comics").innerHTML = ``;
    just(".total-of-comics").innerText = `${comics.data.total} RESULTADOS`;
    just(".current-page-num").innerText = `page ${pageNum}`
    console.log(typeSelected);
    for (let comic of comics.data.results) {
        let pathImgComic = comic.thumbnail.path + "/portrait_incredible.jpg";
        if (typeSelected === "comics") {
            just(".results-cards-comics").innerHTML += `
            <div class="div-cards">
                <div class="div-img-cover-magazine ">
                    <img src="${pathImgComic}">
                </div>
                <p class="text-black font-semibold mt-6">${comic.title}</p>
            </div>
            `;
        }
        else if(typeSelected === "characters"){
            just(".results-cards-comics").innerHTML += `
            <div class="div-cards characters bg-black text-center m-4">
                <div class="div-img-cover-magazine ">
                    <img src="${pathImgComic}">
                </div>
                <p class="text-white font-semibold mt-6">${comic.name}</p>
            </div>
            `
        }
    }
};
printComic("comics", null, "a-z", offsetCounter, limitCounter, pageCounter);




//SECTION FUNCTIONALITY FOR FILTERS
//*BY INPUT
just(".search-input").addEventListener("input", () => {

    lowerCaseSearchValue = just(".search-input").value.toLowerCase();
    printComic(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
});


//* BY TYPE (COMIC - CHARACTER)
just(".type-filter").addEventListener("change", () => {
    printComic(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//*BY ORDER (ABC - NEWEST - OLDEST)
just(".order-filter").addEventListener("change", () => {
    printComic(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//SECTION FUNCTIONALITY FOR PAGINATION
//*FIRST PAGE
just(".btns-first-page").addEventListener("click", () => {
    offsetCounter = 0
    limitCounter = 20
    pageCounter = 1
    printComic(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//*PREVIOUS PAGE
just(".btns-prev-pag").addEventListener("click", () => {
    if (offsetCounter >= itemsPerPage) {
        offsetCounter -= itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter -= 1;
    }
    printComic(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
});

//*NEXT PAGE
just(".btns-next-page").addEventListener("click", () => {
    if (offsetCounter + itemsPerPage < totalItems) {
        offsetCounter += itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter += 1
    }
    printComic(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//*LAST PAGE
just(".btns-last-page").addEventListener("click", () => {
    pageCounter = Math.ceil(totalItems / itemsPerPage);
    const startOffset = Math.max(0, (pageCounter - 1) * itemsPerPage);
    const endOffset = totalItems;
    offsetCounter = startOffset;
    limitCounter = endOffset - startOffset;
    printComic(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
});




//TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH

























// const filtersUrl = (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) =>{
// //     console.log("me ejecuto");
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

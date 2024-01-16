//SECTION
//ASK
//TRASHfasd;flakdjsf
//FIX fdsafkjasdf
//CHECK dfasdfa





//ASK porque no puedo ver con la info de la api en mi celu -tema con el deploy- 
//ASK linea de la api rompe todo el tiempo y la necesito, no se como hacer para que el scope sea global




//SECTION UTILITIES
const just = (selector) => document.querySelector(selector);
const all = (selector) => document.querySelectorAll(selector);

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

    const response = await fetch(buildingURL);
    const data = await response.json();
    totalItems = data.data.total
    return data;
};




//SECTION RENDER COMICS
const printAllComicsCharacters = async (typeSelected, nameSearched, orderSelected, offset, limit, pageNum) => {
    const comics = await getMarvelComics(typeSelected, nameSearched, orderSelected, offset, limit, pageNum);
    just(".results-cards-comics-characters").innerHTML = ``;
    just(".total-of-comics").innerText = `${comics.data.total} RESULTS`;
    just(".current-page-num").innerText = `page ${pageNum}`
    for (let comic of comics.data.results) {
        let pathImgComic = comic.thumbnail.path + "/portrait_incredible.jpg";
        if (typeSelected === "comics") {
            just(".results-cards-comics-characters").innerHTML += `
            <div class="div-cards card-comics" id="${comic.id}">
            <div class="div-img-cover-magazine overflow-hidden">
            <img src="${pathImgComic}" class="w-full h-full object-contain">
            </div>
            <p class="text-black font-semibold mt-6">${comic.title}</p>
            </div>
            `;
            clickOnChoosenComic(comics);
        }
        else if (typeSelected === "characters") {
            console.log(comic.id);
            just(".results-cards-comics-characters").innerHTML += `
            <div class="div-cards card-characters bg-black text-center m-4 overflow-hidden" id="${comic.id}">
            <div class="div-img-character border-b-4 border-red-600 overflow-hidden">
            <img src="${pathImgComic}" class="w-full h-full object-contain">
            </div>
            <div class="bg-black flex items-center justify-center h-[18vh]">
            <p class="text-white font-semibold mt-6">${comic.name}</p>
            </div>
            </div>
            `
            clickOnChoosenCharacter(comics)
        }
    }
};





const clickOnChoosenComic = (allComics) => {
    all(".card-comics").forEach((card) => {
        card.addEventListener("click", (e) => {
            const clickedCardId = e.target.closest('.card-comics').id;
            printComic(allComics, clickedCardId)
        })
    })
}


const printComic = async (allComics, clickedId) => {
    for (const comic of allComics.data.results) {
        if (comic.id === Number(clickedId)) {
            //CAPTURAR INFO DE GUIONISTA //necesito hacer el fetch del url de creators pero me pide un issue filter q nideh lo q es eso o como obtenerlo o como ponerlo en el url
            just(".results-cards-comics-characters").classList.add("hidden")
            just(".total-of-comics").classList.add("hidden")
            just(".section-choosen-card").classList.remove("hidden")

            const date = new Date(comic.dates[0].date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);
            const dateShape = `${day}/${month}/${year}`;

            let pathImgComic = comic.thumbnail.path + "/portrait_incredible.jpg";

            const screenwriter = ""

            just(".choosen-card-img").innerHTML = `
            <img class="chosen-magazine-img w-full h-full object-contain" src="${pathImgComic}" alt="magazine cover">
            `

            just(".name").innerText = `${comic.title}`

            just(".visual-comic").innerHTML = `
            <p class="text-2xl font-semibold mb-2">Published</p>
            <p class="mb-8">${dateShape}</p>
            <p class="text-2xl font-semibold mb-2">Screenwriter</p>
            <p class="mb-8">${screenwriter}</p>
            `
            just(".description-text").innerText = `${comic.description}`


            if (comic.characters.items.length > 0) { //esto devuelve 6 
                for (const character of comic.characters.items) {
                    const urlForCharacters = `${character.resourceURI}?${ts}${publicKey}&${hash}`

                    const response = await fetch(urlForCharacters);
                    const data = await response.json();

                    const characterImg = data.data.results[0].thumbnail.path + "/portrait_incredible.jpg"

                    just(".character-comic-results").innerText = `${comic.characters.items.length} Results`
                    just(".characters-in-comic-grid").innerHTML += `
                        <div class="character-card">
                            <div class="img-character-card border-b-4 border-red-600 overflow-hidden">
                                <img src="${characterImg}" class="w-full h-full object-contain">
                            </div>
                            <div class="bg-black flex items-center justify-center h-[18vh]">
                                <p class="character-name text-white text-center	">${character.name}</p>
                            </div>
                        </div>
                    `
                }
            } else if (comic.characters.items.length === 0) {
                just(".character-comic-results").innerText = `0 Results`
                just(".characters-in-comic-grid").innerHTML = `
                <p class="text-3xl font-semibold w-max">No se han encontrado resultados</p>
                `
            }
        }
    }
}


const clickOnChoosenCharacter = (allCharacters) => {
    all(".card-characters").forEach((card) => {
        card.addEventListener("click", (e) => {
            const clickedCardId = e.currentTarget.id
            printCharacters(allCharacters, clickedCardId)
        })
    })
}

const printCharacters = async(allCharacters, clickedId) => {
    for(const character of allCharacters.data.results){
        if(character.id === Number(clickedId)){
            console.log("HOLIS");
            just(".results-cards-comics-characters").classList.add("hidden")
            just(".total-of-comics").classList.add("hidden")
            just(".section-choosen-card").classList.remove("hidden")

            let pathImgCharacter = character.thumbnail.path + "/portrait_incredible.jpg";

            just(".choosen-card-img").innerHTML = `
            <img class="chosen-magazine-img w-full h-full object-contain" src="${pathImgCharacter}" alt="magazine cover">
            `

            just(".name").innerText = `${character.name}`

            if(character.description === ""){
                just(".description").classList.add("hidden")
            }else{
            just(".description-text").innerText = `${character.description}`
            }

            if(character.comics.items.length > 0){
                for (const comic of character.comics.items){
                    console.log(comic);
                    const urlForComics = `${comic.resourceURI}?${ts}${publicKey}&${hash}`
                    const response = await fetch(urlForComics);
                    const data = await response.json();

                    const comicsImg = data.data.results[0].thumbnail.path + "/portrait_incredible.jpg"

                    just(".character-comic-results").innerText = `${character.comics.items.length} Results`
                    just(".characters-in-comic-grid").innerHTML += `
                        <div class="character-card">
                            <div class="img-character-card border-b-4 border-red-600 overflow-hidden">
                                <img src="${comicsImg}" class="w-full h-full object-contain">
                            </div>
                            <div class="bg-black flex items-center justify-center h-[18vh]">
                                <p class="character-name text-white text-center">${comic.name}</p>
                            </div>
                        </div>
                    `
                } 
            }else if (comic.characters.items.length === 0) {
                just(".character-comic-results").innerText = `0 Results`
                just(".characters-in-comic-grid").innerHTML = `
                <p class="text-3xl font-semibold w-max">No se han encontrado resultados</p>
                `
            }   
        }
    }
}










//SECTION FUNCTIONALITY FOR FILTERS
//*BY INPUT
just(".search-input").addEventListener("input", () => {

    lowerCaseSearchValue = just(".search-input").value.toLowerCase();
    printAllComicsCharacters(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
});


//* BY TYPE (COMIC - CHARACTER)
just(".type-filter").addEventListener("change", () => {
    printAllComicsCharacters(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
})

//*BY ORDER (ABC - NEWEST - OLDEST)
just(".order-filter").addEventListener("change", () => {
    printAllComicsCharacters(
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
    printAllComicsCharacters(
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
    printAllComicsCharacters(
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
    printAllComicsCharacters(
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
    printAllComicsCharacters(
        just(".type-filter").value,
        lowerCaseSearchValue,
        just(".order-filter").value,
        offsetCounter,
        limitCounter,
        pageCounter)
});


const inicializeApp = () => {
    just(".tittle").addEventListener("click", () => window.location.reload())
    printAllComicsCharacters("comics", null, "a-z", offsetCounter, limitCounter, pageCounter);
}
window.addEventListener("load", inicializeApp);


//TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH






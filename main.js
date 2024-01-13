// render functions
const just = (selector) => document.querySelector(selector);


// universal functions for general code
const urlBase = `http://gateway.marvel.com/v1/public/`;
let ts = `ts=1`;
const publicKey = "&apikey=d3abb539098557030e53849b9dc73d81";
const hash = "&hash=56d3e07a1a8a5d3e0602e841365c58f5";


// universal functions for pagination
let offsetCounter = 0;
let limitCounter = 20;
let pageCounter = 1
const itemsPerPage = 20
let totalItems 






//                             desde , hasta
const getMarvelComics = async (offset, limit, pageNum) => {
    // let existTitle = title? `&titleStartsWith=${title}` : ""
    const url = `${urlBase}comics?${ts}&offset=${offset}&limit=${limit}${publicKey}${hash}`; //${existTitle}`
    const response = await fetch(url);
    const data = await response.json();
    totalItems = data.data.total
    console.log(totalItems)
    return data;
};



const printComic = async (offset, limit, pageNum) => {
  const comics = await getMarvelComics(offset, limit, pageNum);
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
printComic(offsetCounter, limitCounter, pageCounter);


//PAGINACION
just(".btns-first-page").addEventListener("click", ()=> {
    offsetCounter = 0
    limitCounter = 20
    pageCounter = 1
    printComic(offsetCounter, limitCounter, pageCounter); 
})

just(".btns-next-page").addEventListener("click", () => {
    if (offsetCounter + itemsPerPage < totalItems) {
        offsetCounter += itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter +=1
    }
        printComic(offsetCounter, limitCounter, pageCounter); 
});



just(".btns-prev-pag").addEventListener("click", () => {
    if (offsetCounter >= itemsPerPage) {
        offsetCounter -= itemsPerPage;
        limitCounter = Math.min(itemsPerPage, totalItems - offsetCounter);
        pageCounter -= 1;
        printComic(offsetCounter, limitCounter, pageCounter);
    }
});


just(".btns-last-page").addEventListener("click", () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startOffset = Math.max(0, (totalPages - 1) * itemsPerPage);
    const endOffset = totalItems;
    offsetCounter = startOffset;
    limitCounter = endOffset - startOffset;

    printComic(offsetCounter, limitCounter, totalPages);
});





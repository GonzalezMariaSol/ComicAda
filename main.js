const just = (selector) => document.querySelector(selector);

const urlBase = `http://gateway.marvel.com/v1/public/`;
let ts = `ts=1`;
const publicKey = "&apikey=d3abb539098557030e53849b9dc73d81";
const hash = "&hash=56d3e07a1a8a5d3e0602e841365c58f5";

const getMarvelComics = async () => {
  // let existTitle = title? `&titleStartsWith=${title}` :""
  const url = `${urlBase}comics?${ts}${publicKey}${hash}`; //${existTitle}`
  console.log(url);
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.data.results);
  return data.data.results;
};

const printComic = async () => {
  const comics = await getMarvelComics();
  just(".results-cards-comics").innerHTML = ``;

  for (let comic of comics) {
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
printComic();

// const tryingToGetThePic = async() => {
//     const comics = await getMarvelComics() //ARRA
//     for(const comic of comics){
//         let pathImg = comic.thumbnail.path + "/portrait_medium.jpg"
//         // pathImg += "/portrait_medium.jpg"
//         console.log(pathImg);
//     }
// }
// tryingToGetThePic()

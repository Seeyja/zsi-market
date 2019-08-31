function showOffers(offersOnClientSide, counter, direction ){
  console.log(offersOnClientSide);

    let seenableOffers = [];
    let currentPhotos = [];
    let currentOffer,currentChildnodes;
    //alert ("ilosc ofert: "+offersOnClientSide.length);

    if (counter == 0 )
      document.getElementById('prevButton').style.display = "none"
    else
      document.getElementById('prevButton').style.display = "inline-block"


    if ( (counter+1)*5 >= offersOnClientSide.length || offersOnClientSide.length == 10)
      document.getElementById('nextButton').style.display = "none"
    else
      document.getElementById('nextButton').style.display = "inline-block"

    switch (direction) {
      case "first": break;
      case "next": for (let j = 0; j < 5; j++)
                    document.getElementById(`n${ j+(counter-1)*5 }`).setAttribute("id", `n${ j+counter*5 }`);break;
      case "prev": for (let j = 0; j < 5; j++)
                    document.getElementById(`n${j+(counter+1)*5}`).setAttribute("id", `n${ j+counter*5 }`);break;
      default: console.log("sth wrong in switch"); res.render('index');

    }
    for (let j = 0; j < 5; j++) document.getElementById(`n${j+(counter)*5}`).setAttribute("id", `n${ j+counter*5 }`)

    let end;


    for (i = 0 + (counter)*5; i < 5+(counter)*5 && i < offersOnClientSide.length ; i++) {

      currentOffer = document.getElementById(`n${i}`);

      if (currentOffer.style.visibility == "hidden")
        currentOffer.style.visibility = "visible"

      currentChildnodes = currentOffer.childNodes;
      currentPhotos = offersOnClientSide[i].links
      console.log(currentPhotos);


      //Childnote explanation in browser console
       //Add more photos!


        for( let k = 0; k < currentPhotos.length; k++){


          if (k == 0){
            currentChildnodes[3].childNodes[0].childNodes[0].setAttribute( 'src', `uploads/${currentPhotos[k]}`);
            currentChildnodes[3].setAttribute( 'href', `uploads/${currentPhotos[k]}`);
          }
          else{

            let lightboxEl = document.createElement('a');
            lightboxEl.href = `uploads/${currentPhotos[k]}`;
            lightboxEl.setAttribute( 'data-lightbox', `n${i}l`);
            let figure = document.createElement('figure');

            let fotos = document.createElement('img');
            fotos.src = `uploads/${currentPhotos[k]}`;

            figure.append(fotos);
            lightboxEl.append(figure);
            currentOffer.append( lightboxEl ) //Add more photos!
          }
        }



        currentChildnodes[7].innerHTML = `<p>${offersOnClientSide[i].description}</p>`;
        currentChildnodes[9].innerHTML = `<p>Użytkownik: ${offersOnClientSide[i].username}</p> <p> Telefon: ${offersOnClientSide[i].num}</p>  <p>Email: ${offersOnClientSide[i].email}`;

        currentChildnodes[11].innerHTML = "";
      for (title of offersOnClientSide[i].titles) {
        currentChildnodes[11].innerHTML += `<span>${title}</span></br>`;
      }

      currentChildnodes[1].childNodes[1].value = offersOnClientSide[i].id;
      end = i
    }

    if (typeof end == "undefined") {
      end = -1;
    }
    for (let i = end+1; i < (counter+1)*5; i++) {
      //alert(i);
      currentOffer = document.getElementById(`n${i}`);
      currentChildnodes = currentOffer.childNodes;

//      if (currentChildnodes[4].innerText.includes("Lorem ipsum dolor sit amet consectetur")) {
        currentOffer.style.visibility = "hidden";


    }





 const articles = document.querySelectorAll("article");


// for(let i=0;i < offersOnClientSide.length;i++){

// console.log(offersOnClientSide);

// for(let i=0;i < offersOnClientSide[i].links.length;i++){
// 	 currentPhotos = offersOnClientSide[i].links;

// const article = document.querySelector("article");

// 	  const id = article.getAttribute("id");
// 	  // console.log(id);
// 	  console.log("siema")

// 	  const lightboxImgs = document.createElement('a');
//             lightboxImgs.href = `uploads/${currentPhotos}`;
//       const figure = document.createElement('figure');
//       const fotos = document.createElement('img');
//             fotos.src = `uploads/${currentPhotos}`;

//             article.appendChild(lightboxImgs);
//             lightboxImgs.appendChild(figure);
//             figure.appendChild(fotos);
//             // figure.append(fotos);
//             // lightboxEl.append(figure);
//             // currentOffer.append( lightboxEl )


// }

// }


articles.forEach(function (article) {

    const id = article.getAttribute("id");
    const lightboxImages = article.querySelectorAll("a");

    lightboxImages.forEach(function (lightboxImg){
          lightboxImg.setAttribute( 'data-lightbox', `${id}l`);
    })

    console.log(id);
    article.classList.add("test");

})

}

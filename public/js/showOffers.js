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


    if ( (counter+1)*5 > offersOnClientSide.length || offersOnClientSide.length == 5)
      document.getElementById('nextButton').style.display = "none"
    else
      document.getElementById('nextButton').style.display = "inline-block"

    switch (direction) {
      case "first": break;
      case "next": for (let j = 0; j < 5; j++)
                    document.getElementById(`n${j}`).setAttribute("id", `n${ j+counter*5 }`);break;
      case "prev": for (let j = 0; j < 5; j++)
                    document.getElementById(`n${j+(counter+1)*5}`).setAttribute("id", `n${ j }`);break;
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
      console.log(currentChildnodes);


      //Childnote explanation in browser console
      if (!typeof currentPhotos[0].length < 1)
        currentChildnodes[3].childNodes[0].childNodes[0].src=`uploads/${currentPhotos[0]}` //Add more photos!

        currentChildnodes[7].innerHTML = `<p>${offersOnClientSide[i].description}</p>`;
        currentChildnodes[9].innerHTML = `<p>Użytkownik: ${offersOnClientSide[i].username}</p> <p> Telefon: ${offersOnClientSide[i].num}</p>  <p>Email: ${offersOnClientSide[i].email}`;

        currentChildnodes[11].innerHTML = "";
      for (title of offersOnClientSide[i].titles) {
        currentChildnodes[11].innerHTML += `<p>${title}</p>`;
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

}

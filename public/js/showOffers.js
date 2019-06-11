function showOffers(offersOnClientSide){

    let seenableOffers = [];
    let currentPhotos = [];
    let currentOffer,currentChildnodes;
    for (let i = 0; i < 5 && i < offersOnClientSide.length ; i++) {

      currentOffer = document.getElementById(`n${i+1}`);
      currentChildnodes = currentOffer.childNodes;
      currentPhotos = offersOnClientSide[i].links
      console.log(currentChildnodes);

      //Childnote explanation in browser console
      if (!typeof currentPhotos[0].length < 1)
        currentChildnodes[0].src=`uploads/${currentPhotos[0]}` //Add more photos!

      currentChildnodes[4].innerHTML = offersOnClientSide[i].description;
      currentChildnodes[6].innerHTML = `Użytkownik:<br /> ${offersOnClientSide[i].username} <br /> Telefon:<br /> ${offersOnClientSide[i].num} <br /> Email:<br /> ${offersOnClientSide[i].email}`;
      currentChildnodes[4].innerHTML = offersOnClientSide[i].description;

      currentChildnodes[8].innerHTML = "";
      for (subject of offersOnClientSide[i].subjects) {
        currentChildnodes[8].innerHTML += subject+"<br />";
      }

    }

    for (let i = 0; i < 5; i++) {
      currentOffer = document.getElementById(`n${i+1}`);
      currentChildnodes = currentOffer.childNodes;
      if (currentChildnodes[4].innerText.includes("Lorem ipsum dolor sit amet consectetur")) {
          currentOffer.style.visibility = "hidden";
      }
    }

}

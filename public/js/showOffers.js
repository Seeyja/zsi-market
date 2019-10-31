function showOffers(offersOnClientSide, counter, direction) {
  console.log(offersOnClientSide);

  if (clientSideResults.length) {

    document.getElementById('nextButton').onclick = function () {
      $('html, body').stop();
      $('html, body').animate({
        scrollTop: $(".offers button").offset().top
      }, 500);
    }
    document.getElementById('prevButton').onclick = function () {
      $('html, body').stop();
      $('html, body').animate({
        scrollTop: $(".offers button").offset().top
      }, 500);
    }

  }

  if ((clientSideResults.length && window.location.href.indexOf("books?") > -1) || clientSideResults.length && window.location.href.indexOf("login") > -1) {

    document.getElementById('nextButton').onclick = function () {
      $('html, body').stop();
      $('html, body').animate({
        scrollTop: $(".offers button").offset().top
      }, 500);
    }
    document.getElementById('prevButton').onclick = function () {
      $('html, body').stop();
      $('html, body').animate({
        scrollTop: $(".offers button").offset().top
      }, 500);
    }

    document.querySelector("main .books h2#offersFound").style.display = "block";
    document.querySelector("main .books h2#offersFound2").style.display = "none";
  }

  if ((clientSideResults.length && window.location.href.indexOf("books?") > -1) || clientSideResults.length && window.location.href.indexOf("login") > -1) {

    // $(document).ready(function () {
    //   document.querySelector(".my_offers button").click();
    // });
    $(document).ready(function () {
      $('html, body').stop();
      $('html, body').animate({
        scrollTop: $(".offers button").offset().top
      }, 500);
    });




    document.querySelector("main .books h2#offersFound").style.display = "block";
    document.querySelector("main .books h2#offersFound2").style.display = "none";
    // document.querySelector("main .books h2#offersFound2").style.display = "none";

    // document.querySelector(".my_offers button").addEventListener("click", () => {
    //   $('html, body').animate({
    //     scrollTop: $("footer").offset().top
    //   }, 1000);
    // })

  }

  if (clientSideResults.length) {
    document.querySelector("main .books h2#offersFound2").style.display = "block";
  }

  if (window.location.href.indexOf("login") > -1) {
    document.querySelector("main .books h2#offersFound2").style.display = "none";
  }

  if (window.location.href.indexOf("books?searchList") > -1) {
    document.querySelector("main .books h2#offersFound2").style.display = "none";
  }

  if (clientSideResults.length && window.location.href.indexOf("login") > -1) {
    document.querySelector("main .books span").style.display = "block";
  }

  if (clientSideResults.length && window.location.href.indexOf("books?searchList") > -1 || clientSideResults.length && window.location.href.indexOf("login") > -1) {

    document.querySelector("main .books h2#offersFound2").style.display = "none";
  }

  if (window.location.href.indexOf("searchList") > -1) {
    $(document).ready(function () {
      $('html, body').stop();
      $('html, body').animate({
        scrollTop: $(".offers button").offset().top
      }, 500);
    });
  }

  let seenableOffers = [];
  let currentPhotos = [];
  let currentOffer, currentChildnodes;
  //alert ("ilosc ofert: "+offersOnClientSide.length);

  if (counter == 0)
    document.getElementById('prevButton').style.display = "none"
  else
    document.getElementById('prevButton').style.display = "inline-block"


  if ((counter + 1) * 5 >= offersOnClientSide.length)
    document.getElementById('nextButton').style.display = "none"
  else
    document.getElementById('nextButton').style.display = "inline-block"

  switch (direction) {

    case "first": break;
    case "next": for (let j = 0; j < 5; j++)
      document.getElementById(`n${j + (counter - 1) * 5}`).setAttribute("id", `n${j + counter * 5}`); break;
    case "prev": for (let j = 0; j < 5; j++)
      document.getElementById(`n${j + (counter + 1) * 5}`).setAttribute("id", `n${j + counter * 5}`); break;

    default: console.log("sth wrong in switch"); res.render('index');

  }

  for (let j = 0; j < 5; j++) document.getElementById(`n${j + (counter) * 5}`).setAttribute("id", `n${j + counter * 5}`)

  let end;

  for (i = 0 + (counter) * 5; i < 5 + (counter) * 5 && i < offersOnClientSide.length; i++) {

    currentOffer = document.getElementById(`n${i}`);

    if (currentOffer.style.display == "none")
      currentOffer.style.display = "block";

    currentChildnodes = currentOffer.childNodes;
    currentPhotos = offersOnClientSide[i].links
    console.log(currentPhotos);


    //Childnote explanation in browser console
    //Add more photos!


    for (let k = 0; k < currentPhotos.length; k++) {


      if (k == 0) {
        currentChildnodes[3].childNodes[0].childNodes[0].setAttribute('src', `uploads/${currentPhotos[k]}`);
        currentChildnodes[3].setAttribute('href', `uploads/${currentPhotos[k]}`);
      }
      else {

        let lightboxEl = document.createElement('a');
        lightboxEl.href = `uploads/${currentPhotos[k]}`;
        lightboxEl.setAttribute('data-lightbox', `n${i}l`);
        let figure = document.createElement('figure');

        let fotos = document.createElement('img');
        fotos.src = `uploads/${currentPhotos[k]}`;

        figure.append(fotos);
        lightboxEl.append(figure);
        currentOffer.append(lightboxEl) //Add more photos!
      }
    }



    currentChildnodes[7].innerHTML = `<p>${offersOnClientSide[i].description}</p><p style="color: red">Do klasy ${offersOnClientSide[i].class}</p><p>${offersOnClientSide[i].priceFrom} - ${offersOnClientSide[i].priceTo} zł</p><p>${offersOnClientSide[i].addDate}</p>`;
    currentChildnodes[9].innerHTML = `<p><span class="user-detail">Użytkownik:</span> ${offersOnClientSide[i].username}</p>`;


    const emailP = document.createElement('p');
    const spanEmail = document.createElement('span');
    spanEmail.append('Email: ');
    emailP.append(spanEmail);
    emailP.append(`${offersOnClientSide[i].email}`);

    const phoneP = document.createElement('p');
    const spanPhone = document.createElement('span');
    spanPhone.append('Telefon: ');
    phoneP.append(spanPhone);
    phoneP.append(`${offersOnClientSide[i].num}`);


    if (offersOnClientSide[i].num.length > 0)
      currentChildnodes[9].append(phoneP);

    if (offersOnClientSide[i].email.length > 0)
      currentChildnodes[9].append(emailP);

    currentChildnodes[11].innerHTML = "";
    for (title of offersOnClientSide[i].titles) {
      currentChildnodes[11].innerHTML += `<span>${title}</span>`;
    }

    currentChildnodes[1].childNodes[1].value = offersOnClientSide[i].id;
    end = i
  }

  if (typeof end == "undefined") {
    end = -1;
  }
  for (let i = end + 1; i < (counter + 1) * 5; i++) {
    //alert(i);
    currentOffer = document.getElementById(`n${i}`);
    currentChildnodes = currentOffer.childNodes;

    //      if (currentChildnodes[4].innerText.includes("Lorem ipsum dolor sit amet consectetur")) {
    currentOffer.style.display = "none";


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

    lightboxImages.forEach(function (lightboxImg) {
      lightboxImg.setAttribute('data-lightbox', `${id}l`);
    })

    //console.log(id);
    article.classList.add("test");

  })

}

function cleanPhotos() {

  const articles = document.querySelectorAll("article");

  articles.forEach((article) => {
    const links = article.querySelectorAll("a:nth-of-type(1)~a");
    links.forEach((link) => { link.remove(); })

    console.log("ema");
    console.log(links);
  })
}

function hideForm(type) {



  if (type == "byLogin" || type == "wrongCode") {
    document.getElementsByName("modify").forEach((form) => { form.style.display = "inline-block"; })
  }

}

function alertValue() {
  alert(`document.querySelector('input[name="price_from"]').value`)
}

function showExpireDate(date){
    //console.log(date);

    // Set the date we're counting down to
  var countDownDate = new Date(date).getTime();
   console.log(countDownDate);
  //countDownDate += 150000
  // Update the count down every 1 second
  var x = setInterval(function() {
  
    // Get today's date and time
    var now = new Date().getTime();
      
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
      
    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = "Koniec sesji za: "+ minutes + "m " + seconds + "s ";
      
    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("demo").innerHTML = "EXPIRED";
      showValuationWindow3('Sesja wygasła', 'Zaloguj się ponownie!');
    }
  }, 1000);

}
    

  
  
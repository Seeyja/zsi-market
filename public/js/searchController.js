function hasClass( target, className ) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

function findSubjects() {
  let inputString = "";
  let foundSubjects = document.getElementsByClassName( 'category' );
  for ( subject of foundSubjects ) {

    if ( hasClass( subject.firstChild, "active" ) )
      inputString += subject.firstChild.alt+" ";
      //document.getElementById('process').value += subject.firstChild.alt+" ";
  }//for end
  inputString = inputString.slice(0, -1);
  document.getElementById('process').value = inputString;
}//findSubjects end


function findSelectedSubjects() {
  let inputString = "";
  let foundSubjects = document.getElementsByClassName( 'items_checkbox' );

  for ( subject of foundSubjects ) {

    if (subject.checked == true)
      inputString += subject.name+" ";
      //document.getElementById('process').value += subject.firstChild.alt+" ";
  }//for end

  inputString = inputString.slice(0, -1);
  document.getElementsByName('searchList').forEach( single => {single.value = inputString;} );
}//findSubjects end

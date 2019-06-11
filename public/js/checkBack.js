<%
if ( typeof keepBookTypes !== "undefined"){
  for ( subject in keepBookTypes ){

    if( typeof keepBookTypes[subject] !== 'undefined' ){
      console.log(subject);
    %>
      document.getElementsByName('<%=subject%>')[0].checked = true;
    <%
    }//end if undefined
  }//end for in
}//end
%>

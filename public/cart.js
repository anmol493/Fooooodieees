console.log(<%= result.length %>);
let $object=[];
          for(let i=0;i<num;i++)
          {
            let temp=String(<%=result[i]._id%>);
            $object.push(document.getElementById(temp));
          }
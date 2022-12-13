

$("#updateUser").submit((e)=>{
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhu")
    
    e.preventDefault()
    $.ajax({
      url:'/editUserProfile',
      method:'post',
      data:$('#updateUser').serialize(),
      success:(response)=>{
        
        if(response.status){
            swal("Sucess", "User Profile updated", "success");
        }
      }
    })
  })
  

  

// $("#adduserAddress").submit((e)=>{
  
//   e.preventDefault()
//   $.ajax({
//     url:'/adduserAddress',
//     method:'post',
//     data:$('#adduserAddress').serialize(),
//     success:(response)=>{
      
//       if(response.status){
//           swal("Sucess", "User Profile updated", "success");
//           location.reload();
         
//       }
//     }
//   })
// });



$(document).ready(function () {
  $('#userTable').DataTable();
});
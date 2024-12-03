function deleteAddress(addressID) {
    let link = '/delete-address-ajax/';
    let data = {
      id: addressID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(addressID);
      }
    });
  }
  
  function deleteRow(addressID){
      let table = document.getElementById("addresses-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == addressID) {
              table.deleteRow(i);
              deleteDropDownMenu(addressID);
              break;
         }
      }
  }

  function deleteDropDownMenu(addressID){
    let selectMenu = document.getElementById("selectAddress");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(addressID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }
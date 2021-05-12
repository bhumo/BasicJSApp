//const { filter } = require("lodash");

var ds = null;
var nameDS = {};
async function show() {
    //let ds = null;
    const res = await fetch('http://localhost:3000/users')
    const resJson = await res.json();
    ds = resJson;
    console.log(resJson);
    return resJson;
}


function addUser(data) {
    console.log(JSON.stringify(data));
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.log(error);
        });
}



function editUser(data) {

    console.log(JSON.stringify(data));
    fetch('http://localhost:3000/users/' + data["id"], {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.log(error);
        });
}

function deleteUser(id) {
    fetch('http://localhost:3000/users/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },

    })
        .then(response => response.json()).then(data => console.log(data + "deleted"))
        .catch((error) => {
            console.log(error);
        })
}


function createTable(dsa) {
    var tableBody = document.getElementById("userTableBody");
    var coulmnHeader = ["Name", "Email", "Role", "Status", "Edit", "Delete", "Details"];
    var injectHeader = headerTemplate(coulmnHeader);
    var injectRow = rowTemplate(dsa);
    //    var row1 = cellTemplate(ds[0]);
    //  console.log(row1);
    var resultant = `${injectHeader}  
    ${injectRow}`
    tableBody.insertAdjacentHTML("afterbegin", resultant);
}

function headerTemplate(headerColumns) {
    var injectionString = "<div class='tableHeader'>";
    headerColumns.forEach(columnName => {
        injectionString = injectionString + `<div class="tableCell"> ${columnName}</div> `;
    });
    return injectionString + "</div>";
}

function rowTemplate(database) {
    var injectionString = "";
    database.forEach((user, i) => {
        injectionString = injectionString + `<div class="tableRow">${cellTemplate(user, i)}</div>`;
    });
  
    return injectionString;

}

function cellTemplate(user, i) {
    var injectionString = '<div class="tableCell">';
    if (user["avatar"]) {
        injectionString += `<img class="avatar" src='${user["avatar"]}' alt='avatar'>`;
    } else {
        injectionString += `<img class="avatar" src="./images/user.png" alt='avatar'>`;
    }

    injectionString = injectionString + `<div>${user["name"]}</div>
        </div><div class="tableCell">${user["email"]}</div>
        <div class="tableCell">${user["role"]}</div>`;
    if (user["is_active"]) {
        injectionString = injectionString + `<div class="tableCell"><div class="activeUser"></div></div>`;
    } else {
        injectionString = injectionString + `<div class="tableCell"><div class="inactiveUser"></div></div>`;
    }
    injectionString = injectionString + `<div class="tableCell"> 
    <div class="btn btn-light" onclick="editUserHandler(${i})">Edit</div>
    </div>`;
    injectionString = injectionString + `<div class="tableCell">
    <div class="btn btn-light" onclick="deleteUserHandler(${i})">Delete</div>
    </div>
    <div class="tableCell">
    <button class="btn btn-light" onclick="detailsHandler(${i})">Details</button>
    </div>`
    return injectionString;
}


function searchUser(user) {
    user = user.toLowerCase();
    let tableBody = document.getElementById("userTableBody");
    var rowNodesArray = Array.from(tableBody.children);
    //console.log(tableBody.childElementCount);
    _.filter(rowNodesArray,function(node){
        
      if(node.children[0].children[1]!=undefined){
       // console.log(node.children[0].children[1].innerHTML.toLowerCase().includes(user));
       if(node.children[0].children[1].innerHTML.toLowerCase().includes(user)){
           node.style.display="";
       }else{
           node.style.display="none";
       }
      }
      let emailNode = node.children[1];
       if(emailNode!=undefined && (emailNode.innerHTML=="Email" || emailNode.innerHTML.toLowerCase().includes(user))){
           node.style.display="";
       } 

    });


    //console.log(rowNodes);
   /* for (var i = 1; i < tableBody.childElementCount; i++) {
        var rowElement = rowNodes[i];
        var name = rowElement.childNodes[0].innerHTML.toLowerCase();
        //console.log(name.indexOf(user)+ " " + name);
        if (name.includes(user)) {
            console.log(name + " " + user);
            rowElement.style.display = "";
        } else {
            rowElement.style.display = "none";
        }

    }*/
}

function sortBy(attribute, arrangement) {
    _.orderBy(ds, attribute, arrangement);
    document.querySelector("#userTableBody").innerHTML = ''
    createTable(ds);
}

function generalFilter(rowNodesArray, filter, childNodeIndex, coulmnHeader) {
    _.filter(rowNodesArray, function (node) {

        if (node != undefined && node.children[childNodeIndex] != undefined && node.children[childNodeIndex].innerHTML.toLowerCase() != filter) {
            //console.log(node.children[childNodeIndex]);
            node.style.display = "none";
        } else if (node != undefined && node.children[childNodeIndex] != undefined) {
            node.style.display = "";
        }

        if (node != undefined && node.children[childNodeIndex] != undefined && (node.children[childNodeIndex].innerHTML == coulmnHeader || filter == "any")) {
            node.style.display = "";
        }
    });
}


function statusFilter(filter) {
   // console.log(filter);
    var tableBody = document.getElementById("userTableBody");
    var rowNodes = tableBody.children;
    var rowNodesArray = _.filter(Array.from(rowNodes), function (node) {
        if (node.nodeName == "DIV") return true;
    });
     console.log(tableBody.childNodes);
    var childNodeIndex = 3;
    var coulmnHeader = "Status";
    _.filter(rowNodesArray, function (node) {


        //    console.log(node.children[childNodeIndex].children[0].classList);
        if (node != undefined && node.children[childNodeIndex] != undefined && node.children[childNodeIndex].children[0] != undefined && node.children[childNodeIndex].children[0].classList.contains(filter) == false) {
            //console.log(node.children[childNodeIndex]);
            node.style.display = "none";
        } else if (node != undefined && node.children[childNodeIndex] != undefined) {
            node.style.display = "";
        }

        if (node != undefined && node.children[childNodeIndex] != undefined && (node.children[childNodeIndex].innerHTML == coulmnHeader || filter == "any")) {
            node.style.display = "";
        }
    });
}

function roleFilter(filter) {
    //alert(filter);
    var tableBody = document.getElementById("userTableBody");
    var rowNodes = tableBody.children;
    var rowNodesArray = Array.from(rowNodes);
    generalFilter(rowNodesArray, filter, 2, "Role");
    console.log(filter);
    var childNodeIndex = 2;
    var coulmnHeader = "Role";

}


function addUserForm(form) {

    var object = {};
    object["id"] = form["id"].value;
    object["name"] = form["name"].value;
    object["email"] = form["email"].value;
    object["role"] = form["role"].value;

    if (form["is_active"].checked) {
        object["is_active"] = true;
    } else {
        object["is_active"] = false;
    }
    object["phone"] = form["phone"].value;
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    object["updated_at"] = datetime;
    console.log(JSON.stringify(object));
    addUser(object);
    location.reload();


}

function editUserHandler(index) {
    //alert(index);
    var modal = document.getElementById("myEditModal");
    var form = document.getElementById("editUserForm");
    data = ds[index];
    form["id"].value = data["id"];
    form["name"].value = data["name"];
    form["email"].value = data["email"];
    form["role"].value = data["role"].toUpperCase();
    form["phone"].value = data["phone"];
    form["is_active"].checked = data["is_active"];

    modal.style.display = "block";
}

function detailsHandler(index){
    var modal  = document.getElementById("myDetailModal");
    modal.style.display="block";
    alert(modal);
    alert("HERE");
    var modalBody = document.getElementById("userDetailModalBody");
    data = ds[index];
    let imgSrc;
    if (data["avatar"]) {
        imgSrc = data["avatar"];
    } else {
        imgSrc="./images/user.png";
    }
    modalBody.querySelector('#avatar').src = imgSrc;
    modalBody.querySelector('#name').innerHTML = data["name"];
    modalBody.querySelector('#email').innerHTML = data["email"];
    modalBody.querySelector('#id').innerHTML = data["id"];
    modalBody.querySelector('#role').innerHTML = data["role"];
    if(data["is_active"]==true){
        modalBody.querySelector('#status').innerHTML =`<div class="activeUser"></div>`;
    }else{
        modalBody.querySelector('#status').innerHTML =`<div class="inactiveUser"></div>`;
    }
   if(data["address"]!=undefined) modalBody.querySelector('#address').innerHTML = data["address"];
   else modalBody.querySelector('#address').innerHTML = "Not Found";
    modalBody.querySelector('#phone').innerHTML = data["phone"];
}
function editUserSubmit(form) {
    //alert("HERE");
    //alert(form["name"].value);
    console.log(form["name"]);
    var object = {};
    object["id"] = form["id"].value;
    object["name"] = form["name"].value;
    object["email"] = form["email"].value;
    object["role"] = form["role"].value;
    console.log(form["is_active"].checked + "HEE");
    if (form["is_active"].checked) {
        object["is_active"] = true;
    } else {
        object["is_active"] = false;
    }
    object["phone"] = form["phone"].value;
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    object["updated_at"] = datetime;
    console.log(JSON.stringify(object));
    editUser(object);

    location.reload();
}

function deleteUserHandler(index) {
    //   alert(index);
    var modal = document.getElementById("myDeleteModal");
    var deleteUserName = document.getElementById("deleteUserName");
    var deleteUserId = document.getElementById("deleteUserId");
    let data = ds[index];
    deleteUserName.innerHTML = data["name"];
    deleteUserId.innerHTML = data["id"];
    modal.style.display = "block";
}


function deleteUserSubmit() {

    deleteUser(document.getElementById("deleteUserId").innerHTML);
    location.reload();
}

function closeModal(value) {
    if (value == "edit") {
        document.getElementById("myEditModal").style.display = "none";
    } else if (value == "delete") {
        document.getElementById("myDeleteModal").style.display = "none";
    }else if (value== 'detail'){
        document.getElementById("myDetailModal").style.display = "none";
    }
}



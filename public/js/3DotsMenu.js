let threeDotsList = document.querySelectorAll(".threeDots");

for (let i = 0;i<threeDotsList.length;i++){
    threeDotsList[i].addEventListener("click",displayMenu);
}

document.addEventListener("click",hideMenu);

function displayMenu(event){
    let parentDiv = event.target.parentElement;
    let menu = parentDiv.querySelector(".content");
    let stauts = menu.classList.contains("content-display");
    let openedMenu = document.querySelectorAll('.content-display');
    for(let i = 0;i<openedMenu.length;i++)
        openedMenu[i].classList.remove('content-display');
    if(!stauts)
        menu.classList.add("content-display");
}


function hideMenu(event){
    if(!event.target.classList.contains("threeDots")){
        let openedMenu = document.querySelectorAll('.content-display');
        for(let i = 0;i<openedMenu.length;i++)
            openedMenu[i].classList.remove('content-display');
    }
}

//select overlay pages 
let editOverlay = document.querySelector('.edit-overlay');
let deleteOverlay = document.querySelector('.delete-overlay')

//select cancel buttons in edit and delete overlay
var cancelDeletion = document.querySelector('.cancel-deletion')
var cancelEdit = document.querySelector('.cancel-edit')

//make overlays dissapears when cancel buttons are been clicked
cancelDeletion.addEventListener('click',function(){
    deleteOverlay.style.display = 'none'
})
cancelEdit.addEventListener('click',function(){
    editOverlay.style.display = 'none'
})

// select all delete and edit buttons in all 3Dots menus
let editButtons  = document.querySelectorAll('.edit')
let deleteButtons = document.querySelectorAll('.delete')

// make them open edit or delete overlay pages when be clicked
editButtons.forEach((editButton)=>{
    editButton.addEventListener('click',function(event){
        editOverlay.style.display = 'flex'
        var id = event.target.parentElement.parentElement.parentElement.querySelector(".id").textContent
        document.querySelector(".editHiddenID").value = id
    })
})

deleteButtons.forEach((deleteButton)=>{
    deleteButton.addEventListener('click',function(event){
        deleteOverlay.style.display = 'flex'
        var id = event.target.parentElement.parentElement.parentElement.querySelector(".id").textContent
        document.querySelector(".DeletionHiddenID").value = id
    })
})

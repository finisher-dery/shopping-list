const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const clearButton = document.querySelector(".clear");

document.addEventListener("DOMContentLoaded",function (){
    loadItems();
    shoppingForm.addEventListener("submit", handleFormSubmit);

    displayAlert();

    for(let button of filterButtons){
        button.addEventListener("click",handleFilterSelection);
    }

    clearButton.addEventListener("click",clearAll);
});

function clearAll(){
    shoppingList.innerHTML="";
    localStorage.clear('shoppingİtems');

    displayAlert();
}

function displayAlert(){
   const empty= shoppingList.querySelectorAll("li").length==0;

   const alert=document.querySelector(".alert");

   alert.classList.toggle("d-none",!empty);

}
function saveAlls(){
    const listItems = shoppingList.querySelectorAll("li");

    const liste=[];

    for (let li of listItems){
        const id = li.getAttribute("item-id");
        const name = li.querySelector(".item-name").textContent;
        const completed = li.hasAttribute("item-completed");

       liste.push({id:id,name:name,completed:completed});
    }
    localStorage.setItem("shoppingİtems",JSON.stringify(liste));}

loadItems();
shoppingForm.addEventListener("submit", handleFormSubmit);

function loadItems() {
    const items = JSON.parse(localStorage.getItem("shoppingİtems")) || [];

    shoppingList.innerHTML = "";

    for(let item of items) {
        const li = createListItem(item);
        shoppingList.appendChild(li);
    }
}

function addItem(input) {
    const id = generateId();
    console.log(id);
    const newItem = createListItem({
        id: id,
        name: input.value,
        completed: false
    });

    shoppingList.prepend(newItem);

    input.value = "";
    saveAlls();
    displayAlert();
}

function generateId() {
    return Date.now().toString();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const input = document.getElementById("item_name");

    if(input.value.trim().length == 0) {
        alert("yeni değer giriniz");
        return;
    }

    addItem(input);
}

function tooggleCompleted(e) {
    const li = e.target.parentElement;
    li.toggleAttribute("item-completed");

    saveAlls();
}

function createListItem(item) {
    // checkbox
    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("form-check-input");
    input.checked = item.completed;
    input.addEventListener("change", tooggleCompleted);

    // item
    const div = document.createElement("div");
    div.textContent = item.name;
    div.classList.add("item-name");
    div.addEventListener("click", openEditMode);
    div.addEventListener("blur", closeEditMode);
    div.addEventListener("keypress", enterKey);

    // delete icon
    const deleteIcon = document.createElement("span");
    deleteIcon.className = "fs-3 bi bi-x text-danger delete-icon";
    deleteIcon.addEventListener("click", romoveItem);

    // li
    const li = document.createElement("li");
    li.setAttribute("item-id", item.id);
    li.className = "border rounded p-3 mb-1";
    li.toggleAttribute("item-completed", item.completed);

    li.appendChild(input);
    li.appendChild(div);
    li.appendChild(deleteIcon);

    return li;
}

function romoveItem(e) {
    const li = e.target.parentElement;
    li.remove();

    saveAlls();
    displayAlert();
}

function openEditMode(e) {
    const li=e.target.parentElement;
    if(li.hasAttribute("item-completed")==false){
        e.target.contentEditable=true;
    }
    
}

function closeEditMode(e) {
    e.target.contentEditable=false;

    saveAlls();
}

function enterKey(e) {
    if(e.key=="Enter"){
        e.preventDefault();
        closeEditMode(e);
    }
}
    
function handleFilterSelection(e) {
    const selectedButton = e.target;

    for(let button of filterButtons){
        button.classList.add("btn-secondary");
        button.classList.remove("btn-primary");
    }

    selectedButton.classList.remove("btn-secondary");
    selectedButton.classList.add("btn-primary");

    selectedButton.getAttribute("item-filter");

   filterItems(selectedButton.getAttribute("item-filter"));
}

function filterItems(filterType) {
    const li_items = shoppingList.querySelectorAll("li");

    for(let li of li_items) {

        li.classList.remove("d-none");
        li.classList.remove("d-flex");

        const completed=li.hasAttribute("item-completed");

    if (filterType == "completed") {
       li.classList.toggle(completed ? 'd-flex':'d-none');
    }
    else if (filterType == "uncompleted") {
        li.classList.toggle(completed ? 'd-none':'d-flex');
            
        }
    else {
        li.classList.toggle('d-flex');

    }
    }
}


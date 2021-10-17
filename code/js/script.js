const tasks = [
  // { id: 1, title: "Go to the cinema", done: false },
  // { id: 2, title: "Go to the theatre", done: true },
  // { id: 3, title: "Learn Java Script", done: false },
  // { id: 4, title: "Finish HTML project", done: false },
];

var newTaskFormEl;
var taskRoot;
var searchFieldEl;
var filterEl;

var statsEl;
var totalTaskEl;
var tasksDoneEl;
var tasksRemainEl;

const statusMap ={
  "1": "all",
  "2": "done",
  "3": "remain"
}

function SetupReferences(){
  newTaskFormEl = document.getElementById("task-form");
  taskRoot = document.getElementById("tasks-box");
  searchFieldEl = document.getElementById("search-box");
  filterEl = document.getElementById("filter-tasks");

  statsEl = document.getElementById("tasks-info");
  totalTaskEl = document.getElementById("tasks-total");
  tasksDoneEl = document.getElementById("tasks-done");
  tasksRemainEl = document.getElementById("tasks-remain");
}

function SetupCallbacks()
{
  newTaskFormEl.addEventListener('submit', (event) =>
  {
    event.preventDefault();
    
    var formData = new FormData(newTaskFormEl);
    var title = formData.get('title');

    if(title.length < 5){
      alert("Title must have at least 5 characters!");
      return;
    }
    
    AddItem(title);
    newTaskFormEl.reset();
  });

  searchFieldEl.addEventListener('keyup', ()=>{
    OnChange();
  })

  filterEl.addEventListener('change', ()=>{
    OnChange();
  })
}

function Init(){
  taskRoot.innerHTML = ''
  
  AddItem("Go to the cinema")
  AddItem("Go to the theatre", true)
  AddItem("Learn Java Script")
  AddItem("Finish HTML project")

  OnChange();
}

SetupReferences();
SetupCallbacks();

Init();

function AddItem(title, done = false)
{
  let lastTaskId = 0;
  if(tasks.length > 0)
    lastTaskId = tasks[tasks.length - 1].id;

  let item = {
    id: lastTaskId + 1,
    title:title,
    done: done
  }

  tasks.push(item);

  //Generate DOM element
  let taskEl = document.createElement("li");
  taskEl.className = "list-group-item  d-flex";

  let titleSpan = document.createElement('span');
  titleSpan.innerHTML = item.title;
  
  let container = document.createElement('div');
  container.className = "icons-box ml-auto";

  let checkmark = document.createElement("i");
  checkmark.className = "fa fa-check mr-3";

  if(item.done){
    titleSpan.classList.add("done")
    checkmark.classList.add("red")
  }
    

  checkmark.addEventListener("click", () => MarkAsDone(item.id, taskEl));

  let trash = document.createElement("i");
  trash.className = "fa fa-trash";
  trash.addEventListener("click", () => DeleteElement(item.id, taskEl));

  container.appendChild(checkmark);
  container.appendChild(trash);

  taskEl.appendChild(titleSpan);
  taskEl.appendChild(container);

  taskRoot.appendChild(taskEl);

  OnChange();
}

function AddUIItem(id, title, OnDone, OnDelete){
  let taskEl = document.createElement("li");
  taskEl.className = "list-group-item  d-flex";

  let titleSpan = document.createElement('span');
  titleSpan.innerHTML = title;
  
  let container = document.createElement('div');
  container.className = "icons-box ml-auto";

  let checkmark = document.createElement("i");
  checkmark.className = "fa fa-check mr-3";
  checkmark.addEventListener("click", () => OnDone(id, taskEl));

  let trash = document.createElement("i");
  trash.className = "fa fa-trash";
  trash.addEventListener("click", () => OnDelete(id, taskEl));

  container.appendChild(checkmark);
  container.appendChild(trash);

  taskEl.appendChild(titleSpan);
  taskEl.appendChild(container);

  taskRoot.appendChild(taskEl);
}

function MarkAsDone(index, el){

  let taskIndex = tasks.findIndex(x => x.id == index);
  if(taskIndex == -1){
    console.error(`Unable to find list element with index ${index} at tasks`)
    return;
  }

  let task = tasks[taskIndex];

  let label = el.querySelector('span');
  let checkMark = el.querySelector('.fa-check');

  //I didn't use toggle() to prevent out of sync with data model in case of unhandeled exception
  if(task.done){
    label.classList.remove("done");
    checkMark.classList.remove("red");
  }
  else
  {
    label.classList.add("done");
    checkMark.classList.add("red")
  }

  task.done = !task.done;

  OnChange();
}

function DeleteElement(index, el)
{
  let taskIndex = tasks.findIndex(x => x.id == index);
  if(taskIndex == -1){
    console.error(`Unable to find list element with index ${index} at tasks`)
    return;
  }
  
  let confirmed = window.confirm(`Are you really want to delete task "${tasks[taskIndex].title}"?`)

  if(!confirmed)
    return;

  tasks.splice(taskIndex, 1);

  el.remove();

  OnChange();
}

function OnChange(){
  ApplyFilters();
  UpdateStats();
}

function UpdateStats()
{
  if(tasks.length == 0){
    statsEl.style.setProperty("display", "none")
    return;
  }
  else
  {
    statsEl.style.removeProperty("display")
  }

  let done = tasks.filter((x) => x.done == true).length;

  totalTaskEl.textContent = tasks.length;
  tasksDoneEl.textContent = done;
  tasksRemainEl.textContent = tasks.length - done;
}


function ApplyFilters()
{
  let listEl = taskRoot.getElementsByTagName('li');

  let filterValue = filterEl.value;
  // Ignore the case
  let searchValue = searchFieldEl.value.toLowerCase();

  for (i = 0; i < listEl.length; i++) {
    let listItemEl = listEl[i];

    let textEl = listItemEl.getElementsByTagName("span")[0];
    
    let title = textEl.textContent;
    let completed = listItemEl.querySelector(".done") == null ? false : true;


    //Apply text search filter
    let visible = title.toLowerCase().indexOf(searchValue) > -1;

    //Apply category filter
    if(visible)
    {
      if(statusMap[filterValue] == "done"){
        visible = completed;
      }
    }

    if(visible){
      if(statusMap[filterValue] == "remain"){
        visible = !completed;
      }
    }

    if (visible) {
      listItemEl.style.removeProperty("display", "block");
    } else {
      listItemEl.style.setProperty("display", "none", "important");
    }
  }
}
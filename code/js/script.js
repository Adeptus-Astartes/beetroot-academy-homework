const tasks = [
  { id: 1, title: "Go to the cinema", done: false },
  { id: 2, title: "Go to the theatre", done: true },
  { id: 3, title: "Learn Java Script", done: false },
  { id: 4, title: "Finish HTML project", done: false },
];

function handleTasks() {}

var newTaskFormEl;
var taskRoot;

function SetupReferences(){
  newTaskFormEl = document.getElementById("task-form");
  taskRoot = document.getElementById("tasks-box");
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
    
    AddNewItem(title);
    newTaskFormEl.reset();
    console.log(title.length)
  });
}

SetupReferences();
SetupCallbacks();

function AddNewItem(title)
{
  let taskEl = document.createElement("li");
  taskEl.className = "list-group-item  d-flex";

  let titleSpan = document.createElement('span');
  titleSpan.innerHTML = title;
  
  let container = document.createElement('div');
  container.className = "icons-box ml-auto";

  let checkmark = document.createElement("ï");
  checkmark.className = "fa fa-check mr-3";

  let trash = document.createElement("ï");
  trash.className = "fa fa-trash";

  container.appendChild(checkmark);
  container.appendChild(trash);

  taskEl.appendChild(titleSpan);
  taskEl.appendChild(container);

  taskRoot.appendChild(taskEl);
}
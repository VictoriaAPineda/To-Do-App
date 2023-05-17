// select elements
// After the creation of html and css, select what things you want to 
// work with to make it interactive, assigning it to a variable for
// easy reference
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo"); // gets what the user types
const todosListElement = document.getElementById("todos-list");// the list area
const notificationElement = document.querySelector(".notification");

// array to hold the todo list items
// parse will display todos(after refresh) or if its first time user
// then will set up a empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

let EditTodoId = -1;

// first render
renderTodos();

// Form Submit 
// "listens" for the form submit action
// Parameters: ( event listener type, run this function when fired)
form.addEventListener('submit',function(event){
    event.preventDefault(); // prevent form from refreshing the page

    saveTodo();
    renderTodos(); //after the todo objects are saved, want them to display on the list!
    // save to local storage
    localStorage.setItem('todos',JSON.stringify(todos));


});

// savetodo function
function saveTodo(){
    const todoValue = todoInput.value;

    // checks to see if a todo input is empty upon submission
    // will be true/false
    const isEmpty = todoValue === '';

    // need to check for duplicate submissions
    // this arrow function will looks through the array and compare
    // with user's input to see if there exists a duplicate
    // returns a true/false 
    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());
    // * uppercase coversion is simply to prevent issues with input with different cases
 
    if(isEmpty){

        showNotification("Input is empty");

    } else if(isDuplicate){

        showNotification("This already exists!");

    }else{
        // if not empty...
        // each todo will be save as an object in the array along with noted attributes
        if(EditTodoId >= 0){
            //update a new todos array with the change
            todos = todos.map((todo, index)=>({
                    ...todo,
                    // if the todo id matches index then change it to new input
                    // if not, their todo values are Not changed
                    value: index === EditTodoId ? todoValue : todo.value,
                }));
            // to esnure further edits
            EditTodoId = -1;
        }else{
            // now we need to 'push'/'insert' this todo objsect into an array to store
            todos.push({
                value: todoValue,
                checked: false, // assume the todo item has not been completed by default
                color:'#' + Math.floor(Math.random()*16777215).toString(16) 
                //generate a random color for every todo object);
            });
        }      
        // clear input area after it's been added 
        todoInput.value="";
    }
   //console.log(todos); //view the array 
}

// Render TODOS
function renderTodos(){

    if(todos.length === 0){
        todosListElement.innerHTML = '<center>Nothing</center>'
        return // code stops here
    }

    // clear element before a rerender
    todosListElement.innerHTML = "";
     
    // Render todos
    //  scans tha array "todos", organizes each element as a todo object and notes its index
    todos.forEach((todo, index)=>{
        // += is used to ensure the previous todos are not overwritten
        // and instead are appended
        // circle - text - edit - trashcan
        todosListElement.innerHTML += `
            <div class="todo" id= ${index}>
                <!-- reads as: if todo is checked, then(?)
                    use this one, else(:) this one instead-->

                <i class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
                    style="color: ${todo.color}"
                    data-action="check"
                ></i>
                <p class="${todo.checked ? "checked" : ""}" data-action="check" >${todo.value}</p>
                <i class="bi bi-pencil-square" data-action="edit"></i>
                <i class="bi bi-trash" data-action="delete"></i>
            </div>
        `;
    });
}

// event listener for all the todos(list items)

todosListElement.addEventListener('click',(event)=>{
    //target is used to know what exactly is being clicked on
    const target = event.target;
    const parentElement = target.parentNode;

    //only want to use if it has a class named todo
    //otherwise nothing happens
    if(parentElement.className !== 'todo' ) return;

    // todo id
    const todo = parentElement;
    const todoId = Number(todo.id);

    // target action
    // dataset is used to access the custom attributes/actions
    // data-attrbute_name_here="value of choice here"
    const action = target.dataset.action;
    // if the evaluation are both true, the && will run the function on the right 
    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);
    //console.log(todoId, action);

})


//  Check a todo
function checkTodo(todoId){
    // map creates a new array so as not to alter the original
    todos = todos.map((todo, index) => 
        // note that index is same a the ids
        // the () says its a object and not a function
            ({
                // using a Spread operator, since only checked is affected
                ...todo,
                checked: index === todoId ? !todo.checked : todo.checked 
                // toggles check /uncheck upon clicking
            }));
    renderTodos();// will have to rerender the todos to show the changes
    localStorage.setItem('todos',JSON.stringify(todos)); 
}

// Edit a todo
function editTodo(todoId){
    // changes the input displayed, to what 
    // element in the array is selected by its id
    todoInput.value = todos[todoId].value;
    EditTodoId = todoId;// set the id of the todo that is being edited

}

// delete a todo
function deleteTodo(todoId){
    // returns a new array
    // will returns all the todos EXCEPT the one at the index 
    // equal to the id
   todos = todos.filter((todo, index)=> index!== todoId);

   // prevents a issue where when editing a todo, then user decides to delete 
   // the todo (before submitting the changes), 
   // causes the edit upon submission to change the next todo element in the array.
   // In this event, will instead add it as a new element todo object in the array
   EditTodoId = -1;


   // re-render 
   renderTodos();
   localStorage.setItem('todos',JSON.stringify(todos));

}

// show a notification
function showNotification(msg){
    // change the msg of the notif
    notificationElement.innerHTML = msg;

    // notification enter
    notificationElement.classList.add('notif-enter');
    // notification goes away
    setTimeout(()=>{
        notificationElement.classList.remove('notif-enter');
    }, 2000);
}
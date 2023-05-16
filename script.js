// select elements
// After the creation of html and css, select what things you want to 
// work with to make it interactive, assigning it to a variable for
// easy reference
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo"); // gets what the user types
const todosListElement = document.getElementById("todos-list");// the list area

// array to hold the todo list items
let todos = [];

// Form Submit 
// "listens" for the form submit action
// Parameters: ( event listener type, run this function when fired)
form.addEventListener('submit',function(event){
    event.preventDefault(); // prevent form from refreshing the page

    saveTodo();

    renderTodos(); //after the todo objects are saved,
    // want them to display on the list!

})

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

        alert("Input is empty");

    } else if(isDuplicate){

        alert("This already exists!");

    }else{
        // if not empty...
        // each todo will be save as an object in the array along with
        // noted attributes
        // now we need to 'push'/'insert' this todo objsect into an array to store
        todos.push({
                    value: todoValue,
                    checked: false, // assume the todo item has not been completed by default
                    color:'#' + Math.floor(Math.random()*16777215).toString(16) 
                    //generate a random color for every todo object);
            });
               
        // clear input area after it's been added 
        todoInput.value="";
    }
   //console.log(todos); //view the array 
}


// Render TODOS
function renderTodos(){
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
            <p class="" data-action="check" >${todo.value}</p>
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
    //action === "edit" && editTodo(todoId);
    //action === "delete" && deleteTodo(todoId);
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
}
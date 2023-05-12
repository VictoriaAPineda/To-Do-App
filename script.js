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
    todos.forEach((todo, index)=>{
        // clear element before a rerender
        todosListElement.innerHTML = "";

        // Render todos
        // += is used to ensure the previous todos are not overwritten
        // and instead are appended
        todosListElement.innerHTML += `
        <div class="todo" id= ${index}>
            <!-- reads as: if todo is checked, then(?)
                use this one, else(:) this one instead-->
            <i class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
                style="color: ${todo.color}"
            ></i>

            <p class="">${todo.value}</p>
            <i class="bi bi-pencil-square"></i>
            <i class="bi bi-trash"></i>
        </div>
       `
    });
}
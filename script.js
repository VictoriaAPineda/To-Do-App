// Select html elements
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo"); // gets what the user types
const todosListElement = document.getElementById("todos-list");// the list area
const notificationElement = document.querySelector(".notification");

/* Array to hold the list of todo objects
 * Gets todos array from storage to display(after refresh)
 * or sets up an empty array if new user/nothing in storage
 */
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Global vairable used to track which todo is being edited
let EditTodoId = -1;

// First render (will display todos if in storage)
renderTodos();

/** 
 * Form Submit
 * Parameters: event listener type, run this function when fired
 */
form.addEventListener('submit',function(event){
    // prevent form from refreshing the page on submit
    event.preventDefault(); 

    saveTodo();
    // After the todo objects are saved, display onscreen
    renderTodos();
    // Save to local storage
    localStorage.setItem('todos',JSON.stringify(todos));
});

/**  
 * savetodo function
 * Description: Saves user's todo input into the todos array
*/
function saveTodo(){
    const todoValue = todoInput.value;

    /** Checks to see if a todo input area is empty upon submission 
     * return a true/false
     */ 
    const isEmpty = todoValue === '';

    /**  
     * Need to check for duplicate input submissions
     * Arrow function will looks through the array and compare
     * with user's input to see if there already exists a duplicate
     * returns a true/false. 
     * Uppercase coversion is to prevent issues of comparisions with users inputting with different cases
     */
    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());
  
    if(isEmpty){

        showNotification("Input is empty");

    } else if(isDuplicate){

        showNotification("This already exists!");

    }else{
        // Checks if user is editing a todo
        if(EditTodoId >= 0){
            // Creates a new todos array with the changes
            todos = todos.map((todo, index)=>({
                    ...todo,
                    /**  
                     * if the todo id matches index then change it to new input
                     * else, their todo values are Not changed
                     */
                    value: index === EditTodoId ? todoValue : todo.value,
                }));
            // Resets the id tracker 
            EditTodoId = -1;
        }else{
            // If not an edit, push/insert the new todo object into the todos array
            todos.push({
                value: todoValue, // user input 
                checked: false, // unchecked is the default
                color:'#' + Math.floor(Math.random()*16777215).toString(16)// Generates a random color 
            });
        }      
        // Clear input area after submission
        todoInput.value = "";
    }
}

/**  
 * renderTodos fuunction
 * Description: Displays the todo objects onscreen in a listed format
 *  as a result of adding or editing the todos array
 */
function renderTodos(){
    // Message is displayed if user has not added anything
    if(todos.length === 0){
        todosListElement.innerHTML = '<center>Nothing</center>'
        return // code stops here
    }

    /**
     * Clears the list area element before a rerender,
     * otherwise the displayed list stacks the renders
     * */ 
    todosListElement.innerHTML = "";
     
    /** 
     * Render todos array
     * Scans tha array "todos", organizes each element as a todo object and notes its index
     * HTML is used to format the display
    */
    todos.forEach((todo, index)=>{
        /**  
         * += ensures previous todos are not overwritten but appended
         * circle - text - edit - delete
        */
        todosListElement.innerHTML += `
            <div class="todo" id= ${index}>
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

/**  
 * Event listener for all the todos elements
 * Description: This eventlistener deals with the selection/interation
 *  by a user of a listed todo item onscreen
 */
todosListElement.addEventListener('click',(event)=>{
    //target is used to know what exactly is being clicked onscreen
    const target = event.target;
    const parentElement = target.parentNode;

    /** 
     * Only want to use if it has a class named todo, the focus of the target
     * otherwise nothing happens
    */
    if(parentElement.className !== 'todo' ) return;

    // todo id
    const todo = parentElement;
    const todoId = Number(todo.id);

    /**  
     * Target action
     * dataset is used to access the custom attributes/actions in the HTML classes
     * format: data-attrbute_name_here = "value of choice here"
    */
    const action = target.dataset.action;
    // If the evaluation are both true, the && will run the function on the right 
    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);

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
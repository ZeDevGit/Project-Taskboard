// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {

    if (nextId !== null) {
        nextId++;
    } else {
        nextId = 1;
    }

    localStorage.setItem('nextId', JSON.stringify(nextId))
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    

    // ? Return the card so it can be appended to the correct lane.
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const projectId = $(this).attr('data-project-id');
    const projects = readProjectsFromStorage();
  
    // ? Remove project from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the project.
    projects.forEach((task) => {
      if (task.id === projectId) {
        projects.splice(projects.indexOf(task), 1);
      }
    });
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
   
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    
    renderTaskList();

    // ? Make lanes droppable

    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
      });
    
      // ? Make lanes droppable
      $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });
 });
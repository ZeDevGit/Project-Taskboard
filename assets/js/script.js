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

// Created a function to make a task card that has a Title, Description and Due date
// It also has a button to delete the card.
function createTaskCard(task) {
  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);

  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // If the task is due today it'll make the card yellow, if it's overdue it'll turn to red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }

    // For the cards to be created correctly the cardDescription, cardDueDate, and cardDeleteBtn
    // are first appended to the main cardBody piece
    // Now that that's done it'll be added along with the cardHeader to the taskCard
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    // Returns card so it can be added to the correct category
    return taskCard;
  }
}

// Function that'll render the task list onto the page while also making the cards draggable
function renderTaskList() {
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  if (!taskList) {
    taskList = [];
  }

  // Loops through the tasklist to find each piece
  for (let task of taskList) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

  // Draggable uses JQuery UI to enable the movement
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // This function allows the cards to be dragged when it finds the cards using the 'ui-draggable' class
    helper: function (e) {
      
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


// Function to create a new tasks
function handleAddTask(event) {
  event.preventDefault();
  console.log("Handle Add Tasks");
  
  // Reads the inputs from user to create each card
  const task = {
    name: $("#taskTitle").val(),
    desc: $("#taskDescription").val(),
    dueDate: $("#taskDueDate").val(),
    status: 'to-do',
  };

  // Adds value to cards
  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  // Renders cards
  renderTaskList();

  // Clears the user form inputs for the next card
  $("#taskTitle").val('');
  $("#taskDescription").val('');
  $("#taskDueDate").val('');
}

// Filters through the tasklist and will delete the card when delete button is pressed
function handleDeleteTask(event) {
  event.preventDefault();
  const taskId = $(this).attr('data-task-id');

  taskList = taskList.filter(task => task.id !== taskId);

  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  const taskId = ui.draggable[0].dataset.taskId;

  // Finds the ID for the tasks target lane
  const newStatus = event.target.id;

  for (let task of taskList) {
    // Updates the task status after finding the card's ID
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // Updates the localstorage with the new tasks.
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// Adds event listeners and renders the task list
$(document).ready(function () {

  // Renders task list
  renderTaskList();

  $('#taskForm').on("submit", handleAddTask);
  // Makes the lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });

});

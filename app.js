// ----- Creating constants for the HTML elements -----
const input = document.getElementById('new-task');
const insertedTasks = document.getElementById('inserted-tasks');
const taskList = document.querySelectorAll('.task-list');
const discard = document.querySelector('.discard');
const completedTasksList = document.querySelector('.completed-tasks-list');
const showHideTasks = document.querySelector('.show-hide-tasks');

// ----- Initiating variables that will be used in the functions to follow -----
let taskInput;
let taskItem;
let tasksArray = [];
let elementBeingDragged;
let tasksTotal = [];
let currentTask = {};

// ----- Getting items from the localStorage -----
if (localStorage.getItem('tasksTotal') != null) {
	tasksTotal = JSON.parse(localStorage.getItem('tasksTotal'));
}

// ----- Creating elements based on the localStorage data -----
for (let i = 0; i < Object.keys(tasksTotal).length; i++) {

	if (tasksTotal[i].classification === 'unclassified') {
		createTask(tasksTotal[i].task)
		insertedTasks.appendChild(taskItem);;
	} else if (tasksTotal[i].classification === 'urgent' && tasksTotal[i].inCharge === 'inChargeOne') {
		createTask(tasksTotal[i].task)
		taskList[0].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'urgent' && tasksTotal[i].inCharge === 'inChargeTwo') {
		createTask(tasksTotal[i].task)
		taskList[1].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'urgent' && tasksTotal[i].inCharge === 'inChargeThree') {
		createTask(tasksTotal[i].task)
		taskList[2].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'urgent' && tasksTotal[i].inCharge === 'everybody') {
		createTask(tasksTotal[i].task)
		taskList[3].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'normal' && tasksTotal[i].inCharge === 'inChargeOne') {
		createTask(tasksTotal[i].task)
		taskList[4].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'normal' && tasksTotal[i].inCharge === 'inChargeTwo') {
		createTask(tasksTotal[i].task)
		taskList[5].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'normal' && tasksTotal[i].inCharge === 'inChargeThree') {
		createTask(tasksTotal[i].task)
		taskList[6].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'normal' && tasksTotal[i].inCharge === 'everybody') {
		createTask(tasksTotal[i].task)
		taskList[7].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'no-hurry' && tasksTotal[i].inCharge === 'inChargeOne') {
		createTask(tasksTotal[i].task)
		taskList[8].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'no-hurry' && tasksTotal[i].inCharge === 'inChargeTwo') {
		createTask(tasksTotal[i].task)
		taskList[9].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'no-hurry' && tasksTotal[i].inCharge === 'inChargeThree') {
		createTask(tasksTotal[i].task)
		taskList[10].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'no-hurry' && tasksTotal[i].inCharge === 'everybody') {
		createTask(tasksTotal[i].task)
		taskList[11].appendChild(taskItem);
	} else if (tasksTotal[i].classification === 'completed') {
		createTask(tasksTotal[i].task)
		completedTasksList.appendChild(taskItem);
	}
	
}

// --- Calling the function 'startDragging' for the elements recovered by the localStorage ---
tasksArray.forEach( (tarefa => {
	tarefa.addEventListener('dragstart', startDragging)
}))

// ----- Creates a <p> element for each task inserted -----
function createTask (text) {
	// --- Creating a <p> and inserting the task in it ---
	taskItem = document.createElement('p');
	taskItem.innerHTML = text;
	// --- Adding a class and the attibute 'draggable' to the element ---
	taskItem.classList.add('task-element');
	taskItem.draggable = true;
	// --- Adding the new task to the array ---
	tasksArray.push(taskItem);
}

// ----- By pressing the 'enter' key after typing the task in the input it will call the function 'addingTask' -----
input.addEventListener('keydown', addingTask);

// ----- Creates an element for the new task and displays it on the page -----
function addingTask (e) {

	if (e.key === 'Enter') {

		// --- To prevent accidentally pressing enter and create a task ---
		if (input.value === '' || input.value === ' ') {
			input.value = '';
			return
		}

		// --- Storing the task input ---
		taskInput = input.value;
		// --- Calling the function that will create the new task element ---
		createTask (taskInput);
		// --- Appeding the element to the task board ---
		insertedTasks.appendChild(taskItem);

		// --- Creating the object to the localStorage ---
		currentTask = {
			'task': `${taskInput}`,
			'classification': 'unclassified',
			'inCharge': 'n/a'
		}

		tasksTotal.push(currentTask);
		localStorage.setItem('tasksTotal', JSON.stringify(tasksTotal));

		// --- Reseting the input to insert a new task ---
		input.value = '';
	}

	// --- Every time a new task is inserted an event is added to the entire array calling the function 'startDragging' (to contemplate the new tasks inserted also) ---
	tasksArray.forEach( (tarefa => {
		tarefa.addEventListener('dragstart', startDragging)
	}))

}

// ----- Store the element being dragged -----
function startDragging (e) {
	elementBeingDragged = e.target;
}

// ----- Adding the event listeners for the elements that will receive the dragged elements to call the functions 'dragOver' and 'dragDrop' -----
taskList.forEach(inCharge => {
	inCharge.addEventListener('dragover', dragOver)
});

taskList.forEach(inCharge => {
	inCharge.addEventListener('drop', dragDrop)
})

completedTasksList.addEventListener('dragover', dragOver);
completedTasksList.addEventListener('drop', dragDrop);

// ----- Preventing the default of 'dragover' event handler to happen so the target container is able to receive drop events -----
function dragOver (e) {
	e.preventDefault()
}

// ----- Appending the dropped element to the container -----
function dragDrop (e) {
	let elementContainer = e.target;

	if (elementContainer.classList.contains('task-element')) {
		return
	}
	elementContainer.append(elementBeingDragged);

	// --- Finding in the array the item being dragged to remove it ---
	let objectInArray = tasksTotal.find(({ task }) => task === `${elementBeingDragged.innerHTML}`);
	let objectIndex = tasksTotal.indexOf(objectInArray);
	tasksTotal.splice(objectIndex, 1);

	if (e.target.parentElement.parentElement.classList.contains('urgent')) {
		if (e.target.parentElement.classList.contains('one')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'urgent',
				'inCharge': 'inChargeOne'
			}

			tasksTotal.push(currentTask);

		} else if (e.target.parentElement.classList.contains('two')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'urgent',
				'inCharge': 'inChargeTwo'
			}

			tasksTotal.push(currentTask);
			
		} else if (e.target.parentElement.classList.contains('three')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'urgent',
				'inCharge': 'inChargeThree'
			}

			tasksTotal.push(currentTask);
			
		} else if (e.target.parentElement.classList.contains('everybody')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'urgent',
				'inCharge': 'everybody'
			}

			tasksTotal.push(currentTask);
			
		}
	} else if (e.target.parentElement.parentElement.classList.contains('normal')) {

		if (e.target.parentElement.classList.contains('one')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'normal',
				'inCharge': 'inChargeOne'
			}

			tasksTotal.push(currentTask);

		} else if (e.target.parentElement.classList.contains('two')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'normal',
				'inCharge': 'inChargeTwo'
			}

			tasksTotal.push(currentTask);
			
		} else if (e.target.parentElement.classList.contains('three')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'normal',
				'inCharge': 'inChargeThree'
			}

			tasksTotal.push(currentTask);
			
		} else if (e.target.parentElement.classList.contains('everybody')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'normal',
				'inCharge': 'everybody'
			}

			tasksTotal.push(currentTask);
			
		}
	} else if (e.target.parentElement.parentElement.classList.contains('no-hurry')) {

		if (e.target.parentElement.classList.contains('one')) {

			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'no-hurry',
				'inCharge': 'inChargeOne'
			}

			tasksTotal.push(currentTask);

		} else if (e.target.parentElement.classList.contains('two')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'no-hurry',
				'inCharge': 'inChargeTwo'
			}

			tasksTotal.push(currentTask);
			
		} else if (e.target.parentElement.classList.contains('three')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'no-hurry',
				'inCharge': 'inChargeThree'
			}

			tasksTotal.push(currentTask);
			
		} else if (e.target.parentElement.classList.contains('everybody')) {
			
			currentTask = {
				'task': `${elementBeingDragged.innerHTML}`,
				'classification': 'no-hurry',
				'inCharge': 'everybody'
			}

			tasksTotal.push(currentTask);
			
		}
	} else if (e.target.parentElement.classList.contains('completed-tasks')) {
		currentTask = {
			'task': `${elementBeingDragged.innerHTML}`,
			'classification': 'completed',
			'inCharge': 'n/a'
		}

		tasksTotal.push(currentTask);
	}

	localStorage.setItem('tasksTotal', JSON.stringify(tasksTotal));

}

// ----- Adding the event listener to the 'discard' element to call the functions 'dragOver' and 'dragRemove' -----
discard.addEventListener('dragover', dragOver);
discard.addEventListener('drop', dragRemove);

// ----- Removing an element (task) dropped in the discard element -----
function dragRemove () {

	elementBeingDragged.remove()
	objectInArray = tasksTotal.find(({ task }) => task === `${elementBeingDragged.innerHTML}`);
	objectIndex = tasksTotal.indexOf(objectInArray);
	tasksTotal.splice(objectIndex, 1);
	localStorage.setItem('tasksTotal', JSON.stringify(tasksTotal));

}

// ----- Click event to call the function showHide -----
showHideTasks.onclick = showHide;

// ----- Show/hide the inserted tasks area -----
function showHide () {
	insertedTasks.classList.toggle('show-hide-toggle');
}

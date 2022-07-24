class Task {
  constructor(title, completed = false) {
    this.title = title;
    this.completed = completed;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  isCompleted() {
    return this.completed;
  }

  isIncompleted() {
    return !this.completed;
  }
}

let tasks = [];

const incompletedListView = document.getElementById('incompletedListView');
const completedListView = document.getElementById('completedListView');
const addFormView = document.getElementById('addForm');
const addInputView = document.getElementById('addInput');

function createListItem(task) {
  // Create a list item
  const itemElement = document.createElement('li');
  itemElement.classList.add('list-item');

  // Check
  const checkElement = document.createElement('button');
  checkElement.classList.add('list-item__check');
  checkElement.type = 'button';
  checkElement.addEventListener('click', () => {
    task.toggleComplete();
    updated();
  });
  itemElement.appendChild(checkElement);

  // Title
  const titleElement = document.createElement('span');
  titleElement.classList.add('list-item__title');
  titleElement.innerText = task.title;
  itemElement.appendChild(titleElement);

  // Remove
  const removeElement = document.createElement('button');
  removeElement.classList.add('list-item__remove');
  removeElement.innerText = '+';
  removeElement.addEventListener('click', () => {
    const index = tasks.findIndex(search => search === task);
    
    if (index === -1) {
      return;
    }

    tasks.splice(index, 1);
    updated();
  });
  itemElement.appendChild(removeElement);

  return itemElement;
}

function createPlaceholderItem() {
  const placeholderElement = document.createElement('li');

  placeholderElement.classList.add('list-item');
  placeholderElement.classList.add('list-item--placeholder');
  placeholderElement.innerText = 'There are no items in the list';

  return placeholderElement;
}

function removeAllChildElements(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function renderList(listView, listItems) {
  // Clear DOM
  removeAllChildElements(listView);

  // Render a placeholder
  if (!listItems.length) {
    listView.appendChild(createPlaceholderItem());

    return;
  }

  // Render the list
  listItems.forEach(task => {
    listView.appendChild(createListItem(task));
  });
}

function render() {
  renderList(
    incompletedListView,
    tasks.filter(task => task.isIncompleted())
  )

  renderList(
    completedListView,
    tasks.filter(task => task.isCompleted())
  )
}

function updated() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

function loadTasksFromLocalStorage() {
  const localStorageTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks = localStorageTasks.map(task => new Task(task.title, task.completed));
}

function initEventListeners() {
  addFormView.addEventListener('submit', e => {
    e.preventDefault();

    const title = addInputView.value;

    if (!title) {
      return;
    }

    tasks.push(new Task(title));

    addInputView.value = '';

    updated();
  })
}

function init() {
  loadTasksFromLocalStorage();
  initEventListeners();
}

init();
updated();
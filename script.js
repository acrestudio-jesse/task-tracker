window.addEventListener('load', function () {
  document.body.classList.remove('preload');
});

const form = document.querySelector('.input-form');
const addBtn = document.querySelector('.submit');
const removeBtn = document.querySelector('.remove');
const taskList = document.querySelector('.tasklist');
const noTaskMsg = document.querySelector('.no-tasks');
const tasks = document.getElementsByClassName('task');

const listName = document.querySelector('.list-name')

const savedTabs = document.getElementsByClassName('saved-card');
const savedZone = document.querySelector('.saved');
const saveBtn = document.querySelector('.save-btn');
const saveForm = document.querySelector('.save-form');
const saveRetrieveCard = document.querySelectorAll('.saved-card');

//Data
const savedLists = [];

let curList = { list: 'New List', tasks: [] };

//Functions
const openSaveForm = function () {
  saveForm.classList.toggle('hidden');
  saveForm.focus();
};

//Will remove Error Style
const resetForm = function (e) {
  form.classList.remove('error');
  form.attributes.placeholder.textContent = 'What is your task?';
};

//Renders tasks from whichever source: (init, submit)
const renderTask = function (value) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.setAttribute('data-id', `${value.id}`);
  task.innerHTML = `<h3 class="task-name">${value.task}</h3>
              <button class="remove"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></button>`;
  taskList.prepend(task);
};

//Removes Tasks
const removeTask = function (e) {
  if (e.target.closest('.remove')) {
    curList.tasks.forEach((task, i) => {
      if (!e.target.closest('.task').dataset.id === task.id) {
        return;
      } else {
        curList.tasks.splice(i);
      }
    });

    taskList.removeChild(e.target.closest('.task'));
  }
};

//Will render card with new name
const renderSaveCard = function (list) {
  const saveCard = document.createElement('div');
  saveCard.setAttribute('data-id', `${list.id}`);
  saveCard.classList.add('card');
  saveCard.classList.add('saved-card');
  saveCard.innerText = `${list.list}`;
  savedZone.appendChild(saveCard);
};

const taskCardReset = function () {
  const revNodes = [...taskList.childNodes].reverse();
  revNodes.forEach(el => {
    if (el.nodeType !== 3 && el.classList.contains('task')) {
      taskList.removeChild(el);
    }
  });
};

//Creates Object for New list
const saveCurCard = function (entry = 'list') {
  if (!entry.value && entry.classList) {
    entry.classList.add('hidden');
    return;
  }

console.log(entry)

  if (!entry.classList) {
    savedLists.push(entry);
    renderSaveCard(entry);
    curList = entry
  }
  if (entry.classList) {
    let startList = {
      list: entry.value,
      tasks: curList.tasks,
      id: Math.random().toString().slice(-8),
    };
    savedLists.push(startList);
    entry.value = '';
    entry.classList.add('hidden');
    saveBtn.classList.add('hidden');
    taskCardReset();
    noTaskMsg.classList.remove('hidden');
    renderSaveCard(startList);
    curList.tasks = []
    curList = startList
  }
  listName.textContent = "New List"
};

//initializes with old/local data
const init = function (data) {
  if (!data.tasks[0]) {
    noTaskMsg.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    return;
  }
  listName.textContent = data.list
  data.tasks.forEach(task => renderTask(task));
};

const retrieveCard = function (e) {
  if (!e.target.closest('.saved-card')) return;
  taskCardReset();
  console.log(curList);

  let id = e.target.closest('.saved-card').dataset.id;
  savedLists.reverse().forEach((list) => {
    if (list.id === id) {
      init(list);
      console.log(list);
    }
  });
  curList.tasks[0] && noTaskMsg.classList.add('hidden');
  saveBtn.classList.remove('hidden');
  savedZone.removeChild(e.target.closest('.saved-card'));
console.log(savedLists);
};

//Will take value from form to make new entry
const submitTask = function (e) {
  if (!form.value) {
    form.classList.add('error');
    form.attributes.placeholder.textContent = 'You gotta type something in!';
    return;
  }

  //local reserve value to construct task
  let submitted = { task: form.value, id: Math.random().toString().slice(-8) };

  curList.tasks.push(submitted);
  renderTask(submitted);
  form.value = '';
  saveBtn.classList.remove('hidden');
  noTaskMsg.classList.add('hidden');
};

// Window Response functions
const displayNoTaskMsg = function (e) {
  if (tasks.length === 0) {
    saveBtn.classList.add('hidden');
    noTaskMsg.classList.remove('hidden');
  }
};

//displays save only when task are present
const displaySaveBtn = function (e) {
  if (!e.target.closest('.save')) {
    saveForm.classList.add('hidden');
  }
};

//EVENT LISTENERS
saveBtn.addEventListener('click', openSaveForm);
addBtn.addEventListener('click', submitTask);
form.addEventListener('keypress', resetForm);
form.addEventListener('keydown', function (e) {
  e.keyCode === 13 && submitTask();
});
saveForm.addEventListener('keydown', function (e) {
  e.keyCode === 13 && saveCurCard(saveForm);
});
document.addEventListener('click', function (e) {
  removeTask(e);
  displayNoTaskMsg(e);
  displaySaveBtn(e);
  retrieveCard(e);
});

init(curList);

const Checker = document.querySelector('.checker');

Checker.addEventListener('click', function (e) {
  console.log('savedLists', savedLists);
  console.log('curList', curList);
});

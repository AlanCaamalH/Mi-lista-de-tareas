const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const count = document.getElementById('task-count');
const empty = document.getElementById('empty-state');
const clearButton = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('pwa-tasks') || '[]');

function saveTasks() {
  localStorage.setItem('pwa-tasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  tasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task${task.done ? ' done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Marcar ${task.text} como completada`);
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement('span');
    label.textContent = task.text;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = 'Eliminar';
    remove.addEventListener('click', () => {
      tasks = tasks.filter(current => current.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, label, remove);
    list.appendChild(item);
  });

  const pending = tasks.filter(task => !task.done).length;
  count.textContent = `${pending} ${pending === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
  empty.hidden = tasks.length > 0;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  saveTasks();
  renderTasks();
  input.value = '';
  input.focus();
});

clearButton.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => document.getElementById('connection-status').textContent = 'PWA activa')
      .catch(() => document.getElementById('connection-status').textContent = 'Modo web');
  });
}

renderTasks();

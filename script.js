const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
    todo = [];
}

function CreateToDoItems() {
    if (todoValue.value === "") {
        todoAlert.innerText = "Enter your task!";
        todoValue.focus();
    } else {
        let IsPresent = false;
        todo.forEach((element) => {
            if (element.item === todoValue.value) {
                IsPresent = true;
            }
        });

        if (IsPresent) {
            setAlertMessage("This task already exists");
            return;
        }

        let li = document.createElement("li");
        const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div><div>
                      <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/assets/edit.png" />
                      <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/assets/delete.png" /></div></div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);

        if (!todo) {
            todo = [];
        }
        let itemList = { item: todoValue.value, status: false };
        todo.push(itemList);
        setLocalStorage();

        setAlertMessage("New task added!");
    }

    todoValue.value = "";
}


function ReadToDoItems() {
    todo.forEach((element) => {
        let li = document.createElement("li");
        let style = "";
        if (element.status) {
            style = "style='text-decoration: line-through;'";
        }
        const todoItems = `<div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${element.item
            }
      ${style === ""
                ? ""
                : '<img class="todo-controls" src="/assets/checkmark.png" />'
            }</div><div>
      ${style === ""
                ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/assets/edit.png" />'
                : ""
            }
      <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/assets/delete.png" /></div></div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}
ReadToDoItems();

function UpdateToDoItems(e) {
    if (
        e.parentElement.parentElement.querySelector("div").style.textDecoration ===
        ""
    ) {
        todoValue.value =
            e.parentElement.parentElement.querySelector("div").innerText;
        updateText = e.parentElement.parentElement.querySelector("div");
        addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
        addUpdate.setAttribute("src", "/assets/refresh.png");
        todoValue.focus();
    }
}

function UpdateOnSelectionItems() {
    let IsPresent = false;
    todo.forEach((element) => {
        if (element.item == todoValue.value) {
            IsPresent = true;
        }
    });

    if (IsPresent) {
        setAlertMessage("This task already exist.");
        return;
    }

    todo.forEach((element) => {
        if (element.item == updateText.innerText.trim()) {
            element.item = todoValue.value;
        }
    });
    setLocalStorage();

    updateText.innerText = todoValue.value;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "/assets/plus.png");
    todoValue.value = "";
    setAlertMessage("Task Updated!");
}

function DeleteToDoItems(e) {
    let deleteValue =
        e.parentElement.parentElement.querySelector("div").innerText;

    if (confirm(`Remove this task "${deleteValue}"?`)) {
        e.parentElement.parentElement.setAttribute("class", "deleted-item");
        todoValue.focus();

        todo.forEach((element) => {
            if (element.item == deleteValue.trim()) {
                todo.splice(element, 1);
            }
        });

        setTimeout(() => {
            e.parentElement.parentElement.remove();
        }, 1000);

        setLocalStorage();
    }
}

function CompletedToDoItems(e) {
    if (e.parentElement.querySelector("div").style.textDecoration === "") {
        const img = document.createElement("img");
        img.src = "/assets/checkmark.png";
        img.className = "todo-controls";
        e.parentElement.querySelector("div").style.textDecoration = "line-through";
        e.parentElement.querySelector("div").appendChild(img);
        e.parentElement.querySelector("img.edit").remove();

        todo.forEach((element) => {
            if (
                e.parentElement.querySelector("div").innerText.trim() == element.item
            ) {
                element.status = true;
            }
        });
        setLocalStorage();
        setAlertMessage("Task Completed!");
    }
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.classList.add("toggleMe");
    }, 1000);
}

function clearAllTasks() {
    if (todo.length === 0) {
        setAlertMessage("No tasks to clear!");
        return;
    }

    if (confirm("Clear all tasks?")) {

        listItems.innerHTML = "";

        todo = [];
        setLocalStorage();

        setAlertMessage("All tasks cleared!");
    }
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const inputTask = document.querySelector("#input-task");
const buttonAdd = document.querySelector("#button-add-task");
const taskList = document.querySelector("#task-list");
const taskStorage = JSON.parse(localStorage.getItem("data")) || [];
if (taskStorage.length) {
    for (let task of taskStorage) {
        console.log(task);
        createCell(task.task, task.checked);
    }
}
window.onload = (event) => {
    console.log("Welcome to ToDO List");
};
function saveTaskList(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let taskString = JSON.stringify(data);
        try {
            yield localStorage.setItem("data", taskString);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function changeCell(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        let target = event.target;
        let parent = target.offsetParent;
        let index = [].indexOf.call(taskList === null || taskList === void 0 ? void 0 : taskList.children, parent);
        if (target.className === "remove") {
            taskList === null || taskList === void 0 ? void 0 : taskList.removeChild(parent);
            // delete taskStorage[index];
            taskStorage.splice(index, 1);
        }
        if (target.className === "check") {
            if ((_a = parent === null || parent === void 0 ? void 0 : parent.children.namedItem("task-text")) === null || _a === void 0 ? void 0 : _a.classList.contains("marked")) {
                // console.log("it is marked");
                target.innerText = "○";
                (_b = parent === null || parent === void 0 ? void 0 : parent.children.namedItem("task-text")) === null || _b === void 0 ? void 0 : _b.classList.remove("marked");
                taskStorage[index].checked = false;
            }
            else {
                target.innerText = "✓";
                (_c = parent === null || parent === void 0 ? void 0 : parent.children.namedItem("task-text")) === null || _c === void 0 ? void 0 : _c.classList.add("marked");
                taskStorage[index].checked = true;
            }
        }
        yield saveTaskList(taskStorage);
    });
}
function createCell(taskText, checked) {
    return __awaiter(this, void 0, void 0, function* () {
        let checkChar = checked ? "✓" : "○";
        let cell = document.createElement("li"), check = document.createElement("span"), task = document.createElement("p"), remove = document.createElement("span");
        try {
            cell.className = "cell";
            check.className = "check";
            task.setAttribute("name", "task-text");
            if (checked)
                task.classList.add("marked");
            remove.className = "remove";
            check.innerText = checkChar;
            task.innerText = taskText;
            remove.innerText = "✕";
            yield cell.appendChild(check);
            yield cell.appendChild(task);
            yield cell.appendChild(remove);
            yield cell.addEventListener("click", changeCell);
            yield taskList.appendChild(cell);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function addTask(taskText) {
    return __awaiter(this, void 0, void 0, function* () {
        if (taskText) {
            try {
                yield createCell(taskText, false);
                let data = {
                    checked: false,
                    task: taskText,
                };
                taskStorage.push(data);
                inputTask.value = "";
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
buttonAdd === null || buttonAdd === void 0 ? void 0 : buttonAdd.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    let taskText = inputTask === null || inputTask === void 0 ? void 0 : inputTask.value;
    try {
        yield addTask(taskText);
        yield saveTaskList(taskStorage);
    }
    catch (error) {
        console.error(error);
    }
}));
inputTask === null || inputTask === void 0 ? void 0 : inputTask.addEventListener("keydown", (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.key === "Enter") {
        let taskText = inputTask === null || inputTask === void 0 ? void 0 : inputTask.value;
        try {
            yield addTask(taskText);
            yield saveTaskList(taskStorage);
        }
        catch (error) {
            console.error(error);
        }
    }
}));
// cellDefault?.addEventListener("click", changeCell);

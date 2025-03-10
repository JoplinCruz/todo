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
class MakeColor {
    constructor() {
        this.colors = [
            "--color-cream",
            "--color-grass",
            "--color-cielo",
            "--color-grenade",
            "--color-rose",
        ];
        this.shadow = [...this.colors];
        this.lastColor = "";
    }
    get() {
        if (!this.shadow.length)
            this.shadow.push(...this.colors);
        let length = this.shadow.length - 1;
        let choice = (Math.random() * length) >> 0;
        let color = this.shadow[choice];
        if (color === this.lastColor) {
            choice = choice === length ? choice-- : choice++;
            color = this.shadow[choice];
        }
        this.lastColor = color;
        this.shadow.splice(choice, 1);
        return color;
    }
}
class TaskStorage {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem("data")) || [];
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tasks.length) {
                for (let task of this.tasks) {
                    yield renderTask(task.task, task.checked);
                }
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let taskString = JSON.stringify(this.tasks);
            try {
                yield localStorage.setItem("data", taskString);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    add(text, check) {
        let data = {
            task: text,
            checked: check,
        };
        this.tasks.push(data);
    }
    update(index, check) {
        this.tasks[index].checked = check;
    }
    delete(index) {
        this.tasks.splice(index, 1);
    }
}
const makeColor = new MakeColor();
const taskStorage = new TaskStorage();
function changeTask(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        let target = event.target;
        let parent = target.offsetParent;
        let index = [].indexOf.call(taskList === null || taskList === void 0 ? void 0 : taskList.children, parent);
        if (target.className === "remove") {
            taskList === null || taskList === void 0 ? void 0 : taskList.removeChild(parent);
            taskStorage.delete(index);
        }
        if (target.className === "check") {
            if ((_a = parent === null || parent === void 0 ? void 0 : parent.children.namedItem("task-text")) === null || _a === void 0 ? void 0 : _a.classList.contains("marked")) {
                target.innerText = "○";
                (_b = parent === null || parent === void 0 ? void 0 : parent.children.namedItem("task-text")) === null || _b === void 0 ? void 0 : _b.classList.remove("marked");
                taskStorage.update(index, false);
            }
            else {
                target.innerText = "✓";
                (_c = parent === null || parent === void 0 ? void 0 : parent.children.namedItem("task-text")) === null || _c === void 0 ? void 0 : _c.classList.add("marked");
                taskStorage.update(index, true);
            }
        }
        yield taskStorage.save();
    });
}
function renderTask(taskText, checked) {
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
            let color = makeColor.get();
            cell.style.background = `linear-gradient(to right, var(--color-transparent), var(${color}) 25%, var(${color}) 75%, var(--color-transparent) 100%)`;
            yield cell.addEventListener("click", changeTask);
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
                yield renderTask(taskText, false);
                taskStorage.add(taskText, false);
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
        yield taskStorage.save();
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
            yield taskStorage.save();
        }
        catch (error) {
            console.error(error);
        }
    }
}));
window.onload = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Welcome to the ToDO List");
    yield taskStorage.load();
});
// cellDefault?.addEventListener("click", changeCell);

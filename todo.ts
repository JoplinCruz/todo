const inputTask = document.querySelector("#input-task") as HTMLInputElement;
const buttonAdd = document.querySelector(
    "#button-add-task"
) as HTMLButtonElement;
const taskList = document.querySelector("#task-list") as HTMLUListElement;
// const cellDefault = document.querySelector("#task-list .cell") as HTMLLIElement;

type Task = {
    checked: boolean;
    task: string;
};

const taskStorage: Task[] =
    JSON.parse(localStorage.getItem("data") as string) || [];

if (taskStorage.length) {
    for (let task of taskStorage) {
        console.log(task);
        createCell(task.task, task.checked);
    }
}

window.onload = (event) => {
    console.log("Welcome to ToDO List");
};

async function saveTaskList(data: Task[]) {
    let taskString = JSON.stringify(data);
    try {
        await localStorage.setItem("data", taskString);
    } catch (error) {
        console.error(error);
    }
}

async function changeCell(event: Event) {
    let target = event.target as HTMLElement;
    let parent = target.offsetParent;
    let index = [].indexOf.call(taskList?.children, parent as never);

    if (target.className === "remove") {
        taskList?.removeChild(parent as Node);
        // delete taskStorage[index];
        taskStorage.splice(index, 1);
    }
    if (target.className === "check") {
        if (
            parent?.children
                .namedItem("task-text")
                ?.classList.contains("marked")
        ) {
            // console.log("it is marked");
            target.innerText = "○";
            parent?.children.namedItem("task-text")?.classList.remove("marked");
            taskStorage[index].checked = false;
        } else {
            target.innerText = "✓";
            parent?.children.namedItem("task-text")?.classList.add("marked");
            taskStorage[index].checked = true;
        }
    }
    await saveTaskList(taskStorage);
}

async function createCell(taskText: string, checked: boolean) {
    let checkChar: string = checked ? "✓" : "○";

    let cell = document.createElement("li"),
        check = document.createElement("span"),
        task = document.createElement("p"),
        remove = document.createElement("span");

    try {
        cell.className = "cell";
        check.className = "check";
        task.setAttribute("name", "task-text");
        if (checked) task.classList.add("marked");
        remove.className = "remove";

        check.innerText = checkChar;
        task.innerText = taskText;
        remove.innerText = "✕";

        await cell.appendChild(check);
        await cell.appendChild(task);
        await cell.appendChild(remove);

        await cell.addEventListener("click", changeCell);

        await taskList.appendChild(cell);
    } catch (error) {
        console.error(error);
    }
}

async function addTask(taskText: string) {
    if (taskText) {
        try {
            await createCell(taskText, false);

            let data: Task = {
                checked: false,
                task: taskText,
            };
            taskStorage.push(data);

            inputTask.value = "";
        } catch (error) {
            console.error(error);
        }
    }
}

buttonAdd?.addEventListener("click", async (event) => {
    let taskText = inputTask?.value;
    try {
        await addTask(taskText);
        await saveTaskList(taskStorage);
    } catch (error) {
        console.error(error);
    }
});

inputTask?.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        let taskText = inputTask?.value;
        try {
            await addTask(taskText);
            await saveTaskList(taskStorage);
        } catch (error) {
            console.error(error);
        }
    }
});

// cellDefault?.addEventListener("click", changeCell);

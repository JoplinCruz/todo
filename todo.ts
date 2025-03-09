const inputTask = document.querySelector("#input-task") as HTMLInputElement;
const buttonAdd = document.querySelector(
    "#button-add-task"
) as HTMLButtonElement;
const taskList = document.querySelector("#task-list") as HTMLUListElement;

interface ColorMaker {
    colors: string[];
    shadow: string[];
    lastColor: string;
    get: () => string;
}
class MakeColor implements ColorMaker {
    colors: string[];
    shadow: string[];
    lastColor: string;
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
    get(): string {
        if (!this.shadow.length) this.shadow.push(...this.colors);

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

const makeColor = new MakeColor();

type Task = {
    checked: boolean;
    task: string;
};

const taskStorage: Task[] =
    JSON.parse(localStorage.getItem("data") as string) || [];

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
    let index: number = [].indexOf.call(taskList?.children, parent as never);

    if (target.className === "remove") {
        taskList?.removeChild(parent as Node);
        taskStorage.splice(index, 1);
    }
    if (target.className === "check") {
        if (
            parent?.children
                .namedItem("task-text")
                ?.classList.contains("marked")
        ) {
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

        let color: string = makeColor.get();
        cell.style.background = `linear-gradient(to right, var(--color-transparent), var(${color}) 25%, var(${color}) 75%, var(--color-transparent) 100%)`;

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

window.onload = async (event) => {
    console.log("Welcome to the ToDO List");
    if (taskStorage.length) {
        for (let task of taskStorage) {
            await createCell(task.task, task.checked);
        }
    }
};

// cellDefault?.addEventListener("click", changeCell);

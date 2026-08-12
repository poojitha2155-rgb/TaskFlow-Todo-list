// ===============================
// TASK DATA
// ===============================

let tasks = JSON.parse(
    localStorage.getItem("taskflowTasks")
) || [

    {
        id: 1,
        title: "Learn JavaScript",
        description: "Complete JavaScript fundamentals",
        priority: "high",
        date: "",
        completed: true
    },

    {
        id: 2,
        title: "Build a Todo App",
        description: "Create a modern task management application",
        priority: "medium",
        date: "",
        completed: true
    },

    {
        id: 3,
        title: "Learn React",
        description: "Start learning React fundamentals",
        priority: "medium",
        date: "",
        completed: false
    },

    {
        id: 4,
        title: "Build Projects",
        description: "Create projects for your portfolio",
        priority: "low",
        date: "",
        completed: false
    }

];


let currentFilter = "all";


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// DISPLAY TASKS
// ===============================

function renderTasks() {

    const taskList =
        document.getElementById("taskList");

    const emptyState =
        document.getElementById("emptyState");

    const searchValue =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    taskList.innerHTML = "";


    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(searchValue);


        if (currentFilter === "active") {

            return !task.completed && matchesSearch;

        }


        if (currentFilter === "completed") {

            return task.completed && matchesSearch;

        }


        return matchesSearch;

    });


    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className =
            `task ${task.completed ? "completed" : ""}`;


        taskElement.innerHTML = `

            <div
                class="check"
                onclick="toggleTask(${task.id})"
            >
                <i class="fa-solid fa-check"></i>
            </div>


            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-description">
                    ${escapeHTML(task.description || "No description")}
                </div>

            </div>


            <div class="task-meta">

                <span class="priority ${task.priority}">
                    ${capitalize(task.priority)}
                </span>


                ${
                    task.date
                    ?
                    `<span class="due-date">
                        <i class="fa-regular fa-calendar"></i>
                        ${formatDate(task.date)}
                    </span>`
                    :
                    ""
                }

            </div>


            <button
                class="delete"
                onclick="deleteTask(${task.id})"
            >
                <i class="fa-regular fa-trash-can"></i>
            </button>

        `;


        taskList.appendChild(taskElement);

    });


    updateStats();

}


// ===============================
// ADD TASK
// ===============================

document
    .getElementById("taskForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const title =
            document
                .getElementById("taskTitle")
                .value
                .trim();


        const description =
            document
                .getElementById("taskDescription")
                .value
                .trim();


        const priority =
            document
                .getElementById("taskPriority")
                .value;


        const date =
            document
                .getElementById("taskDate")
                .value;


        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            priority: priority,

            date: date,

            completed: false

        };


        tasks.unshift(newTask);


        saveTasks();

        renderTasks();

        closeTaskModal();

        this.reset();

    });


// ===============================
// COMPLETE TASK
// ===============================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();

}


// ===============================
// MODAL
// ===============================

function openTaskModal() {

    document
        .getElementById("taskModal")
        .classList.add("show");


    setTimeout(() => {

        document
            .getElementById("taskTitle")
            .focus();

    }, 100);

}


function closeTaskModal() {

    document
        .getElementById("taskModal")
        .classList.remove("show");

}


// Close modal by clicking outside

document
    .getElementById("taskModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeTaskModal();

        }

    });


// ===============================
// FILTERS
// ===============================

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener("click", function() {

            document
                .querySelectorAll(".filter")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            this.classList.add("active");


            currentFilter =
                this.dataset.filter;


            renderTasks();

        });

    });


// ===============================
// SEARCH
// ===============================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderTasks
    );


// ===============================
// STATISTICS
// ===============================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const progress =
        total === 0
        ?
        0
        :
        Math.round(
            (completed / total) * 100
        );


    document
        .getElementById("totalTasks")
        .textContent = total;


    document
        .getElementById("completedTasks")
        .textContent = completed;


    document
        .getElementById("pendingTasks")
        .textContent = pending;


    document
        .getElementById("progressPercent")
        .textContent = `${progress}%`;


    const circle =
        document.querySelector(
            ".progress-circle"
        );


    circle.style.background =
        `conic-gradient(
            #7c3aed ${progress * 3.6}deg,
            #eeeeee ${progress * 3.6}deg
        )`;

}


// ===============================
// HELPERS
// ===============================

function capitalize(value) {

    return value.charAt(0).toUpperCase()
        + value.slice(1);

}


function formatDate(date) {

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// ===============================
// INITIAL LOAD
// ===============================

renderTasks();
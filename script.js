// ============================
// STORAGE
// ============================

let tasks = JSON.parse(localStorage.getItem("focusflowTasks")) || [];
let freeTime = Number(localStorage.getItem("freeTime")) || 0;

// ============================
// INITIAL LOAD
// ============================

window.onload = function () {
    displayTasks();

    if (freeTime > 0) {
        document.getElementById(
            "freeTimeDisplay"
        ).innerText = `Free Time: ${freeTime} hrs`;
    }

    checkWorkload();
};

// ============================
// ADD TASK
// ============================

function addTask() {
    const title = document.getElementById("taskTitle").value.trim();

    const importance = parseInt(
        document.getElementById("taskImportance").value
    );

    const hours = parseFloat(
        document.getElementById("taskHours").value
    );

    const deadline =
        document.getElementById("taskDeadline").value;

    if (!title || !hours || !deadline) {
        alert("Please complete all fields.");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        importance,
        hours,
        deadline
    };

    tasks.push(task);

    saveTasks();
    displayTasks();
    checkWorkload();

    // Clear inputs

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskHours").value = "";
    document.getElementById("taskDeadline").value = "";
}

// ============================
// DELETE TASK
// ============================

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
    checkWorkload();
}

// ============================
// SAVE TASKS
// ============================

function saveTasks() {
    localStorage.setItem(
        "focusflowTasks",
        JSON.stringify(tasks)
    );
}

// ============================
// DISPLAY TASKS
// ============================

function displayTasks() {
    const taskList =
        document.getElementById("taskList");

    if (!taskList) return;

    if (tasks.length === 0) {
        taskList.innerHTML =
            `<p class="empty-state">No tasks added yet.</p>`;
        return;
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {
        let className = "low";

        if (task.importance === 3)
            className = "high";

        if (task.importance === 2)
            className = "medium";

        const taskCard = document.createElement("div");

        taskCard.className = `task ${className}`;

        taskCard.innerHTML = `
            <div class="task-title">
                ${task.title}
            </div>

            <div class="task-meta">
                Importance:
                ${
                    task.importance === 3
                        ? "High"
                        : task.importance === 2
                        ? "Medium"
                        : "Low"
                }
            </div>

            <div class="task-meta">
                Hours Needed:
                ${task.hours}
            </div>

            <div class="task-meta">
                Deadline:
                ${task.deadline}
            </div>

            <button
                style="margin-top:10px;"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>
        `;

        taskList.appendChild(taskCard);
    });
}

// ============================
// FREE TIME
// ============================

function calculateFreeTime() {
    const classHours =
        Number(
            document.getElementById("classHours").value
        ) || 0;

    const sleepHours =
        Number(
            document.getElementById("sleepHours").value
        ) || 0;

    freeTime = 24 - classHours - sleepHours;

    if (freeTime < 0) freeTime = 0;

    localStorage.setItem(
        "freeTime",
        freeTime
    );

    document.getElementById(
        "freeTimeDisplay"
    ).innerText =
        `Free Time: ${freeTime} hrs`;

    checkWorkload();
}

// ============================
// DEADLINE SCORE
// ============================

function getDeadlineScore(deadline) {
    const today = new Date();

    const dueDate = new Date(deadline);

    const diff =
        Math.ceil(
            (dueDate - today) /
                (1000 * 60 * 60 * 24)
        );

    if (diff <= 1) return 5;

    if (diff <= 3) return 4;

    if (diff <= 7) return 3;

    return 1;
}

// ============================
// ENERGY SCORE
// ============================

function getEnergyScore(taskHours, energy) {
    if (energy === 1) {
        if (taskHours <= 1) return 3;
        return 0;
    }

    if (energy === 2) {
        if (taskHours <= 3) return 2;
        return 1;
    }

    return 3;
}

// ============================
// TIME SCORE
// ============================

function getTimeScore(taskHours) {
    if (taskHours <= freeTime)
        return 3;

    return -5;
}

// ============================
// RECOMMENDATION ENGINE
// ============================

function generateRecommendation() {

    if (tasks.length === 0) {

        document.getElementById(
            "recommendationResult"
        ).innerHTML =
            "<h3>No tasks available.</h3>";

        return;
    }

    const energy =
        parseInt(
            document.getElementById("energyLevel")
                .value
        );

    let bestTask = null;
    window.bestRecommendedTask = null;
    let highestScore = -999;

    tasks.forEach(task => {

        const score =
            task.importance * 2 +
            getDeadlineScore(
                task.deadline
            ) +
            getEnergyScore(
                task.hours,
                energy
            ) +
            getTimeScore(
                task.hours
            );

        if (score > highestScore) {
            highestScore = score;
            bestTask = task;
        }
    });

    if (!bestTask) return;
    window.bestRecommendedTask = bestTask;
    document.getElementById(
        "recommendationResult"
    ).innerHTML = `
        <h3>
            Recommended:
            ${bestTask.title}
        </h3>

        <p>
            Hours Needed:
            ${bestTask.hours}
        </p>

        <p>
            Importance:
            ${
                bestTask.importance === 3
                    ? "High"
                    : bestTask.importance === 2
                    ? "Medium"
                    : "Low"
            }
        </p>

        <p>
            Deadline:
            ${bestTask.deadline}
        </p>

        <p>
            Priority Score:
            ${highestScore}
        </p>
    `;
}

// ============================
// OVERWHELM WARNING
// ============================

function checkWorkload() {

    const warning =
        document.getElementById(
            "overwhelmWarning"
        );

    if (!warning) return;

    const totalHours =
        tasks.reduce(
            (sum, task) =>
                sum + task.hours,
            0
        );

    if (freeTime === 0) {

        warning.innerHTML =
            "⚠️ Calculate your free time first.";

        return;
    }

    if (totalHours > freeTime) {

        warning.innerHTML = `
            ⚠️ You have
            ${totalHours.toFixed(1)}
            hours of work but only
            ${freeTime}
            hours available.
        `;

    } else {

        warning.innerHTML = `
            ✅ Your workload fits today's schedule.
        `;
    }
    function startFocusSession(){

    if(!window.bestRecommendedTask){

        alert(
        "Generate a recommendation first."
        );

        return;
    }

    localStorage.setItem(
        "currentTask",
        bestRecommendedTask.title
    );

    window.location.href =
    "pomodoro.html";
}
}
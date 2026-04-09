// --- TASK LOGIC ---
function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const effort = document.getElementById('taskEffort').value;
    const deadline = document.getElementById('taskDeadline').value;

    if (!title || !deadline) {
        alert("Please enter title and date!");
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ 
        title, 
        effort: parseInt(effort), 
        deadline, 
        id: Date.now(),
        completed: false 
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('taskTitle').value = '';
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    taskList.innerHTML = tasks.length === 0 
        ? "<p style='text-align:center; opacity:0.5;'>No tasks yet. Add one above!</p>" 
        : tasks.map(t => `
            <div class="task-item">
                <div>
                    <input type="checkbox" onclick="deleteTask(${t.id})"> 
                    <span style="margin-left:10px;">${t.title}</span>
                    <div style="font-size: 10px; color: #888; margin-left: 25px;">
                        Due: ${t.deadline} | Effort: ${t.effort === 3 ? 'High' : t.effort === 2 ? 'Med' : 'Low'}
                    </div>
                </div>
            </div>
        `).join('');
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// --- MOOD & TIME CALCULATION ---
// NEW: Save Task with Time Requirement
function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const effort = document.getElementById('taskEffort').value;
    const deadline = document.getElementById('taskDeadline').value;
    const hoursNeeded = document.getElementById('taskHours').value; // Get hours

    if (!title || !deadline || !hoursNeeded) {
        alert("Please fill in all fields!");
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ 
        title, 
        effort: parseInt(effort), 
        deadline, 
        hours: parseFloat(hoursNeeded), // Save as number
        id: Date.now()
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload(); // Refresh to show task
}

// NEW: Mood & Time calculation including Sleep
function saveMoodAndGo() {
    const energy = document.getElementById('energyLevel').value;
    const start = document.getElementById('classStart').value;
    const end = document.getElementById('classEnd').value;
    const sleepNeeded = 8; // You can make this an input too!

    const startTime = new Date(`2026-01-01T${start}:00`);
    const endTime = new Date(`2026-01-01T${end}:00`);
    let classDuration = (endTime - startTime) / (1000 * 60 * 60);
    if (classDuration < 0) classDuration += 24;

    // TOTAL FREE TIME = 24 - Class - Sleep
    const freeTime = 24 - (classDuration + sleepNeeded);

    localStorage.setItem('userEnergy', energy);
    localStorage.setItem('freeTime', freeTime.toFixed(1));
    
    window.location.href = 'planner.html';
}
function generateCalendar() {
    const cal = document.getElementById('miniCalendar');
    if (!cal) return;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    let html = '';
    for(let i = 0; i < 7; i++) {
        let d = new Date();
        d.setDate(today.getDate() + i);
        html += `
            <div style="padding:10px; background:#2a2a2a; border-radius:5px; border: ${i===0?'1px solid var(--primary-lavender)':'none'}">
                <div style="font-size:0.8rem; color:var(--primary-lavender)">${days[d.getDay()]}</div>
                <div style="font-weight:bold">${d.getDate()}</div>
            </div>
        `;
    }
    cal.innerHTML = html;
}
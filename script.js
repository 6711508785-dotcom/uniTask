import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } 
       from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtngyrbT-xuq1nQvLXE9J8ntMuxCW5bsk",
  authDomain: "unitask-31951.firebaseapp.com",
  projectId: "unitask-31951",
  storageBucket: "unitask-31951.firebasestorage.app",
  messagingSenderId: "1036156264167",
  appId: "1:1036156264167:web:fa2e929ff5a5bf002a8c42",
  measurementId: "G-WK2RHMDB41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCol = collection(db, "assignments");

// ฟังก์ชันสุ่มสีพาสเทล
const getRandomPastel = () => {
    const colors = ['#fbcfe8', '#e9d5ff', '#a5f3fc', '#bae6fd', '#ddd6fe'];
    return colors[Math.floor(Math.random() * colors.length)];
};

window.addTask = async () => {
    const subject = document.getElementById('subjectName').value;
    const name = document.getElementById('taskName').value;
    const date = document.getElementById('dueDate').value;

    if (subject && name && date) {
        await addDoc(tasksCol, {
            subject: subject,
            title: name,
            deadline: date,
            color: getRandomPastel(), // บันทึกสีสุ่มลงใน DB เลย
            createdAt: new Date()
        });
        document.getElementById('subjectName').value = '';
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
    } else {
        alert("กรอกข้อมูลให้ครบก่อนน้าา ~");
    }
};

window.deleteTask = async (id) => {
    await deleteDoc(doc(db, "assignments", id));
};

const q = query(tasksCol, orderBy("deadline", "asc"));
onSnapshot(q, (snapshot) => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    snapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.style.setProperty('--accent-color', data.color || '#e5e7eb');

        taskItem.innerHTML = `
            <div style="flex:1">
                <span class="subject-tag">${data.subject}</span>
                <h3 style="margin: 8px 0 4px 0; font-size: 1.1rem;">${data.title}</h3>
                <small>📅 Deadline: ${data.deadline}</small>
            </div>
            <button class="btn-delete" onclick="deleteTask('${id}')">ลบ</button>
        `;
        taskList.appendChild(taskItem);
    });
});

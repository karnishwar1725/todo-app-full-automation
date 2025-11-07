const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

let todos = [
  { id: 1, text: "Complete project setup", done: false },
  { id: 2, text: "Test automation pipeline", done: false },
  { id: 3, text: "Deploy to Azure", done: false }
];

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY
  }
});

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Task text is required" });
  }

  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    text: text.trim(),
    done: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.post("/api/todos/:id/toggle", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(item => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Task not found" });
  }

  todo.done = !todo.done;

  if (todo.done) {
    const mailOptions = {
      from: "noreply@yourapp.com",
      to: "karnivarun25@gmail.com",
      subject: "✅ Task Completed",
      text: `The task "${todo.text}" has been marked as completed!`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email failed:", err.message);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter(item => item.id !== id);

  if (todos.length === before) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
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
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text,
    done: false
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.post("/api/todos/:id/toggle", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: "Task not found" });
  todo.done = !todo.done;
  if (todo.done) {
    const mailOptions = {
      from: "noreply@yourapp.com",
      to: "karnivarun25@gmail.com",
      subject: "✅ Task Completed",
      text: `The task "${todo.text}" has been marked as completed!`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Error sending email:", error);
      else console.log("Email sent:", info.response);
    });
  }
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`To-Do app running on http://localhost:${PORT}`);
});

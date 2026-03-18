require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Todo = require("./models/Todo");

const app = express();
const PORT = process.env.PORT || 3000;


let requestCount = 0;


app.use((req, res, next) => {
  requestCount++;
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url} | Request #${requestCount}`);
  next();
});


app.use(morgan("dev"));


app.use(express.json());


app.use(express.static("public"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));


app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});


app.post("/todos", async (req, res) => {
  const { title } = req.body;
  const todo = await Todo.create({ title });
  res.status(201).json(todo);
});


app.put("/todos/:id", async (req, res) => {
  const { completed } = req.body;
  const todo = await Todo.findByIdAndUpdate(req.params.id, { completed }, { new: true });
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});


app.delete("/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo deleted successfully" });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
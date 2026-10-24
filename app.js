require('dotenv').config(); // Load .env file

const express = require('express');
const app = express();

// body parsing Middleware
app.use(express.json());

let todos = [
    { id: 1, task: 'Learn Node.js', completed: false },
    { id: 2, task: 'Build CRUD API', completed: false },
    { id: 3, task: 'Deploy API', completed: true }
];

// GET all todos
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

// BONUS: GET only active (incomplete) todos
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter((t) => !t.completed);
    res.status(200).json(activeTodos);
});

// GET single todo by ID
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
});

// POST new todo with validation: "task" field is required
app.post('/todos', (req, res) => {
    const { task, completed = false } = req.body;

    // Validation
    if (!task || typeof task !== 'string' || task.trim() === '') {
        return res.status(400).json({
            error: 'Validation failed',
            message: 'The "task" field is required and must be a non-empty string'
        });
    }

    const newTodo = {
        id: todos.length + 1,
        task: task.trim(),
        completed: Boolean(completed)
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// PATCH Update -> Partial
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body);
    res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id);
    if (todos.length === initialLength) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App Server is listening on port ${PORT}`);
});
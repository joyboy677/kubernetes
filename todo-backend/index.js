const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_TODO_LENGTH = parseInt(process.env.MAX_TODO_LENGTH, 10) || 140;

app.use(express.json());

let todos = [
    'Learn Kubernetes basics',
    'Deploy application to cluster',
    'Configure persistent volumes'
];

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const todoText = req.body.todo || req.body.text;

    if (!todoText || typeof todoText !== 'string' || todoText.trim() === '') {
        return res.status(400).json({ error: 'Todo item text is required' });
    }

    if (todoText.length > MAX_TODO_LENGTH) {
        return res.status(400).json({ error: `Todo item exceeds maximum ${MAX_TODO_LENGTH} characters` });
    }

    const newTodo = todoText.trim();
    todos.push(newTodo);

    res.status(201).json(newTodo);
});

app.listen(PORT, () => {
    console.log(`Todo Backend running on port ${PORT}`);
});
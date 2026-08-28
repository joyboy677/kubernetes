const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

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

    if (todoText.length > 140) {
        return res.status(400).json({ error: 'Todo item exceeds maximum 140 characters' });
    }

    const newTodo = todoText.trim();
    todos.push(newTodo);

    res.status(201).json(newTodo);
});

app.listen(PORT, () => {
    console.log(`Todo Backend running on port ${PORT}`);
});
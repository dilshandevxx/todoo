const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all todos for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const [todos] = await db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a todo
router.post('/', auth, async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ message: 'Task description is required' });
    }

    try {
        const [result] = await db.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', [req.user.id, task]);
        const [newTodo] = await db.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
        res.status(201).json(newTodo[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update todo status
router.put('/:id', auth, async (req, res) => {
    const { completed } = req.body;
    try {
        await db.query('UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?', [completed, req.params.id, req.user.id]);
        res.json({ message: 'Todo updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let todos = [];
const router = express_1.Router();
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/todo', (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text,
    };
    todos.push(newTodo);
    res.status(201).json({
        message: 'Added Todo',
        todo: newTodo,
        todos: todos,
    });
});
router.put('/todo/:todoId', (req, res, next) => {
    const todoText = req.body.text;
    const todoId = req.params.todoId;
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex >= 0) {
        const todoId = todos[todoIndex].id;
        todos[todoIndex] = { id: todoId, text: todoText };
        return res.status(200).json({ message: 'Updated Todo', todos: todos });
    }
    res.status(404).json({ message: 'Could not find todo for this id.' });
});
router.delete('/todo/:todoId', (req, res, next) => {
    const todoId = req.params.todoId;
    todos = todos.filter(todo => todo.id !== todoId);
    res.status(200).json({ message: 'Deleted todo', todos: todos });
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos = [];
const router = express_1.Router();
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
exports.default = router;

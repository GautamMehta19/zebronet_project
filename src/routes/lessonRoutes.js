const express = require('express');
const { createLesson, getLessons, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/:id/:courseId')
    .post(auth, createLesson)
    .get(auth, getLessons)

router.route('/:id/:lessonId')
    .put(auth, updateLesson);

router.route('/:id/:courseId/:lessonId')
    .delete(auth, deleteLesson);

module.exports = router;

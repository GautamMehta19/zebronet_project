const express = require('express');
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/:id')
    .post(auth, createCourse)
    .get(auth, getCourses);

router.route('/:id/:courseId')
    .put(auth, updateCourse)
    .delete(auth, deleteCourse);

module.exports = router;

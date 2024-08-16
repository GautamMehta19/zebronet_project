const lessonModel = require('../models/lessonModel.js');
const courseModel = require('../models/courseModel.js');

const createLesson = async (req, res) => {
    try {
        let data = req.body
        let { title, content } = data
        if (!title || !content) {
            return res.status(400).json({
                status: false,
                message: `these are required fields - title, content`
            });
        };
        let courseId = req.params.courseId
        if (!courseId) {
            return res.status(400).json({
                status: false,
                message: `courseId is required in params`
            });
        };
        const getCourse = await courseModel.findById(courseId)
        if (!getCourse) {
            return res.status(400).json({
                status: false,
                message: `this courseId not present in database`
            });
        }
        data.courseId = courseId;
        const lesson = await lessonModel.create({ title, content, course: courseId });
        await courseModel.findByIdAndUpdate(courseId, { $push: { lessons: lesson._id } }, { new: true })

        return res.status(201).json({
            status: true,
            message: `successfully created`,
            data: lesson
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };
};

const getLessons = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const getCourse = await courseModel.findById(courseId)
        if (!getCourse) {
            return res.status(400).json({
                status: false,
                message: `this courseId not present in database`
            });
        }
        const lessons = await lessonModel.find({ course: courseId });
        return res.status(200).json({
            status: true,
            message: `Got the list`,
            data: lessons
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };

};

const updateLesson = async (req, res) => {
    try {
        let data = req.body
        let { title, content } = data
        const lessonId = req.params.lessonId
        if (!lessonId) {
            return res.status(400).json({
                status: false,
                message: 'lessonId not present'
            });
        }
        const Lesson = await lessonModel.findById(lessonId);
        if (!Lesson) {
            return res.status(404).json({
                status: false,
                message: 'Lesson not found'
            });
        }
        if (title) {
            Lesson.title = title
        }
        if (content) {
            Lesson.content = content
        }
        const updatedLesson = await Lesson.save();
        return res.status(200).json({
            status: true,
            message: 'Sucessfully Updated',
            data: updatedLesson
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };
};

const deleteLesson = async (req, res) => {
    try {
        const lessonId = req.params.lessonId
        if (!lessonId) {
            return res.status(400).json({
                status: false,
                message: 'lessonId not present'
            });
        }
        const lesson = await lessonModel.findById(lessonId);
        if (!lesson) {
            return res.status(400).json({
                status: false, 
                message: 'Lesson is not present with this id' 
            });
        };
        const courseId = req.params.courseId;
        await courseModel.findByIdAndUpdate(courseId, { $pull: { lessons: lessonId } }, { new: true });
        await lessonModel.findByIdAndDelete(lessonId);
        return res.status(200).json({
            status: true,
            message : `Lesson removed`
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };
    
};

module.exports = { createLesson, getLessons, updateLesson, deleteLesson };

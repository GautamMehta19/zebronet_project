const courseModel = require('../models/courseModel.js');
const lessonModel = require('../models/lessonModel.js');

const createCourse = async (req, res) => {
    try {
        let data = req.body;
        const { title, description } = data;

        if (!title || !description) {
            return res.status(400).json({
                status: false,
                message: `these are required fields - title, description`
            });
        };
        data.userId = req.user._id
        const course = await courseModel.create(data);
        return res.status(201).json({
            status: true,
            message: `successfully course created`,
            data: course
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };
};

const getCourses = async (req, res) => {
    try {
        const userId = req.user._id
        const courses = await courseModel.find({ userId: userId }).populate('lessons');
        return res.status(200).json({
            status: true,
            message: "list of courses",
            data: courses
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };

};

const updateCourse = async (req, res) => {
    try {
        let data = req.body
        let { title, description } = data
        const courseId = req.params.courseId
        if (!courseId) {
            return res.status(400).json({
                status: false,
                message: 'courseId not present'
            });
        }
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                status: false,
                message: 'Course not found'
            });
        }
        if (title) {
            course.title = title
        }
        if (description) {
            course.description = description
        }
        const updatedCourse = await course.save();
        return res.status(200).json({
            status: true,
            message: 'Sucessfully Updated',
            data: updatedCourse
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };
};

const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId
        if (!courseId) {
            return res.status(400).json({
                status: false,
                message: 'courseId not present'
            });
        }
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                status: false,
                message: 'Course not found'
            });
        }
        if(course.lessons.length != 0){
            for(let i=0; i<course.lessons.length; i++){
                let lessionId = course.lessons[i]
                await lessonModel.findByIdAndDelete(lessionId)
            }
        }
        await course.deleteOne();
        return res.status(200).json({
            status: true,
            message: 'Course removed'
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };

};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };

const express = require('express');
const router = express.Router();
//const Controller = require("../Controller")
//const dao = require("../db/DAO");
const course_dao = require('../db/course_dao')
const user_dao = require('../db/user_dao');
//const c = new Controller(course_dao);
const { body, param, oneOf } = require('express-validator')
const {validationHandler, isLoggedIn} = require('../middlewares/validation') 
const dayjs = require('dayjs');
const e = require('express');



/**
 * API:
 *                GET /api/courses
 * =================================================
 */

router.get('/courses', async(req, res) => {
    try{
        let result = await course_dao.getAllCourses();
        let resJson = await Promise.all(result.map(async (e) => {
            delete e.enrolled
            return{
                ...e,
                incompatibles: await course_dao.retrieveIncomp(e.id),
                enrolled: await course_dao.enrolled(e.id)
            }
        }));
        return res.status(200).json(resJson).end()
    } catch(err) {
        return res.status(500).json({message: "error"})
    }
})

/**
 * API:
 *                GET /api/studyPlan/:student_id
 * =================================================
 */

router.get('/studyPlan/:student_id',
    isLoggedIn,
    param('student_id').isEmail(),
    validationHandler,
    async(req, res) => {
    try {
        console.log(req.params.student_id)
        let result = await course_dao.getStudyPlan(req.params.student_id)
        let resJson = await Promise.all(result.map(async (e) => {
            delete e.enrolled;
            return{
                ...e,
                incompatibles: await course_dao.retrieveIncomp(e.id),
                enrolled: await course_dao.enrolled(e.id)
            }
        }));
        console.log(result)
        return res.status(200).json(resJson).end()
    } catch (error) {
        res.status(500).json({message: "error"}).end()
    }
})

/**
 * API:
 *      POST /api/addToStudyPlan/:student_id/:isFullTime
 * =================================================
 */

router.post('/addToStudyPlan/:student_id/:isFullTime', isLoggedIn,
    body().notEmpty(),
    param('student_id').isEmail(),
    param('isFullTime').isNumeric({min:0, max:1}),
    body('*.id').isLength({min:7}),
    validationHandler,
    async(req, res) => {
    try {
        // Check sulla propedeuticità
        if(req.body.filter(sp => sp.propedeuticity ?
            req.body.filter(course => sp.propedeuticity === course.id).length > 0 : true).length === 0) {
                return res.status(422).json({message:"Propedeuticity error"}).end();
        }

        let credits = req.body.reduce((c1, c2) => {return c1 + c2.cfu;}, 0);
        // Check sui vincoli di crediti
        if((req.params.isFullTime===1 && !(credits >= 60 && credits <= 80))
            || (req.params.isFullTime===0 && !(credits >= 20 && credits <= 40))) {
            return res.status(422).json({message:"Credit error"}).end();
        }
        else {
            req.body.forEach(async(elem) => {
                //  Check sul massimo di iscritti
                let enrolled = await course_dao.enrolled(elem.id);
                if(elem.max_students !== null && enrolled > elem.max_students)
                    return res.status(422).json({message:"Max enrolled reached"}).end();
                else{
                    await course_dao.deleteAllFromSP(req.params.student_id);
                    await course_dao.insertCourse_SP(req.params.student_id, elem.id)
                    await user_dao.insertStudyPlan(req.params.student_id, req.params.isFullTime);
                    return res.status(201).end()
                }
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "error"}).end()
    }
})

/**
 * API:
 *      DELETE /api/deleteStudyPlan/:student_id
 * =================================================
 */

router.delete('/deleteStudyPlan/:student_id', 
    isLoggedIn,
    param('student_id').isEmail(),
    validationHandler,
    async(req, res) => {
        try {
            await course_dao.deleteAllFromSP(req.params.student_id);
            await user_dao.deleteStudyPlan(req.params.student_id);
            return res.status(204).end();
        } catch (error) {
            res.status(500).json({message: "error"}).end()
        }
    }
)

module.exports = router;
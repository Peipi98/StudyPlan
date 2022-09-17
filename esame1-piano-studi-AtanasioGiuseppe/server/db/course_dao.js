"use strict";

const sqlite = require('sqlite3');

const db = new sqlite.Database('stud_plans.db', (err) => {
    if(err) throw err;
  });

exports.getAllCourses = () => {
    return new Promise((res, rej) => {
        db.all('SELECT * FROM courses', (err, rows) =>{
            if (err) rej(err);
            res(rows)
        });
    })
}

exports.getCourse = (course_id) => {
    return new Promise((res, rej) => {
        db.get("SELECT * FROM courses WHERE id=(?)", [course_id], (err,row) => {
            if (err) rej(err);
            res(row)
        })
    })
}

exports.enrolled = (course_id) => {
    return new Promise((res, rej) => {
        db.get(`
            SELECT COUNT(*) as enrolled
            FROM study_plan
            WHERE course_id = (?)
        `, [course_id], (err, row) => {
            if(err) rej(err)
            else res(row.enrolled)
        })
    })
}

/* 

    STUDY PLAN 

*/

exports.getStudyPlan = (student_id) => {
    return new Promise((res, rej) => {
        let sql = `
            SELECT  C.*
            FROM  courses C, study_plan S
            WHERE C.id = S.course_id
            AND S.student_id = (?)
        `;
        db.all(sql, [student_id], (err,rows) =>{
            if(err) rej(err)
            res(rows)
        })
    })
}

exports.insertCourse_SP = (student_id, course_id) => {
    return new Promise((res, rej) => {
        let sql = `
            INSERT OR IGNORE INTO study_plan(student_id, course_id) VALUES((?), (?))
        `;
        db.run(sql, [student_id, course_id], (err) => {
            if(err) rej(err)
            res()
        })
    })
}

exports.deleteFromSP = (student_id, course_id) => {
    return new Promise((res, rej) => {
        db.run(`DELETE FROM study_plan WHERE student_id=(?) AND course_id=(?)`,
        [student_id, course_id], (err) => {
            if (err) rej(err)
            res()
        })
    })
}

exports.deleteAllFromSP = (student_id) => {
    return new Promise((res, rej) => {
        db.run(`
            DELETE FROM study_plan 
            WHERE   student_id=(?)`,
            [student_id], (err) => {
            if (err) rej(err)
            res()
        })
    })
}

/* 

    INCOMPATIBLES

*/

exports.retrieveIncomp = async(course_id) => {
    return new Promise((res, rej) =>{
        db.all(`
            SELECT i.incompatible as incompatible
            FROM incompatibles i
            WHERE course_id = (?)
        `, [course_id], (err, rows) =>{
            if(err) rej(err)
            let result = rows.map(r=>r.incompatible)
            res(result)
        })
    })
}

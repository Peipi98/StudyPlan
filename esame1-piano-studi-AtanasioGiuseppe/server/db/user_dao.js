'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');
const { resolve } = require('path');
const passport = require('passport');

const db = new sqlite.Database('stud_plans.db', (err) => {
  if(err) throw err;
});

//non entra
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
            const user = {
              id: row.id, 
              username: row.email, 
              name: row.name + " " + row.surname, 
              isFullTime: row.isFullTime,
              hasStudyPlan: row.hasStudyPlan
            }
            resolve(user);
          }
      });
    });
  };

exports.getUser = (email,password) => {
    return new Promise((resolve,reject)=>{
        const sql=`SELECT *
                FROM users
                WHERE email=(?)
              `;
            db.get(sql,[email],(err,row)=>{
            if(err) { reject(err); }
            else if (row==undefined) { resolve(false); }
            else{
                const user = {
                  id: row.id, 
                  username: row.email, 
                  name: row.name + " " + row.surname, 
                  isFullTime: row.isFullTime,
                  hasStudyPlan: row.hasStudyPlan
                };
                const salt=row.salt;
                crypto.scrypt(password,salt,32,(err,hashedPassword)=>{
                    if(err) reject(err);

                    const passwordHex=Buffer.from(row.hash, 'hex');
                    if(!crypto.timingSafeEqual(passwordHex,hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                })
            }
        })
        
    })
}

exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = (?)';
    db.get(sql, [email], (err, row) => {
      if (err) 
        reject(err);
      else if (row === undefined)
        resolve({error: 'User not found.'});
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const user = {
          id: row.id, 
          username: row.email, 
          name: row.name + " " + row.surname, 
          isFullTime: row.isFullTime,
          hasStudyPlan: row.hasStudyPlan
        }
        resolve(user);
      }
  });
});
}

exports.insertStudyPlan = (student_id, isFullTime) => {
  return new Promise((res, rej) => {
    db.run(`
      UPDATE users
        SET isFullTime = (?), hasStudyPlan = 1
        WHERE email = (?)
    `,[isFullTime, student_id],  (err) => {
      if (err) rej(err)
      else res()
    })
  })
}

exports.deleteStudyPlan = (student_id) => {
  return new Promise((res, rej) => {
    db.run(`
    UPDATE users
      SET hasStudyPlan = 0
    WHERE email = (?)
    `, [student_id], (err) => {
      if (err) rej(err)
      else res()
    })
  })
}
'use strict';
const sqlite = require('sqlite3');

class DAO {
    static db;
    constructor() {

        this.db = new sqlite.Database("stud_plans.db", (err)=>{
            if(err) throw err;
            else console.log("connect to database");
        });
        
        /* ----- TABLES CREATION ----- */
        this.newTableUsers();
        this.newTableCourses();
        this.newTableStudyPlan();
        this.newTableIncompatibles();

        /* ----- TABLES DELETION ----- */
        // this.dropTableUsers()
        // this.dropTableCourses()
        // this.dropTableStudyPlan()
        // this.dropTableIncompatibles();

       }

    /**
     *  + --------------------------------------------- +
     *  |                                               |
     *  |           DATABASE: OPERATIONS                |
     *  |                                               |
     *  + --------------------------------------------- +
     */

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
            if (err) {
              console.log('Error running sql ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve({ id: this.lastID })
            }
          })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log("here")
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
    }
    
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err, rows) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        })
    }

  /**
   *  + --------------------------------------------- +
   *  |                                               |
   *  |           DATABASE: CREATE TABLES             |
   *  |                                               |
   *  + --------------------------------------------- +
   */

  /**
  * ========================
  *       USER TABLE
  * ========================
  *  - newTableUser(): create the users table, if it does not already exist.
  *  - dropTableUser(): drop the users table.
  */
    newTableUsers() {
      let users=[
        {
          email: "testuser@polito.it",
          name: "Rosario",
          surname: "Sorbello",
          isFullTime: 0,
          hasStudyPlan: 0,
          hash: "6d043aecca29f97f8ed82ce492be1f49bac9f9106deed31a3b05fce7e4952c68",
          salt: "8a1b21a5a7faa946"
        },
        {
          email: "u2@p.it",
          name: "Guido",
          surname: "La Vespa",
          isFullTime: 0,
          hasStudyPlan: 0,
          hash: "83cad75fdca4b1e1f05a20fe91e54aef9562ca4d1f42af06e0cacfbb1d8c1f36",
          salt: "811804a11d0d9b0a"
        },
        {
          email: "u3@p.it",
          name: "Leoluca",
          surname: "Orlando",
          isFullTime: 0,
          hasStudyPlan: 0,
          hash: "b89eceb1b39310780ff0527cca62eb7811ccd3a1a427c5441cca6cb8ea947209",
          salt: "55b5c4c9b18eff34"
        },
        {
          email: "u4@p.it",
          name: "Mario",
          surname: "Rossi",
          isFullTime: 0,
          hasStudyPlan: 0,
          hash: "c293626cca52ec840aba302d9a6f53ad788d121efe451e292efad44bced5893c",
          salt: "c77c534ecce87504"
        },
        {
          email: "u5@p.it",
          name: "Ciccio",
          surname: "Pasticcio",
          isFullTime: 0,
          hasStudyPlan: 0,
          hash: "39216aca61ba1099d28677f6f86c6b98c85769b9839b201588245c2d1c6eef4d",
          salt: "103333288a20ce10"
        }
      ]
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users(
                id INTEGER, 
                email VARCHAR UNIQUE, 
                name VARCHAR, 
                surname VARCHAR,
                isFullTime INTEGER NOT NULL CHECK(isFullTime IN(0,1)),
                hasStudyPlan INTEGER NOT NULL CHECK(hasStudyPlan IN(0,1)),
                hash VARCHAR, 
                salt VARCHAR, 
                PRIMARY KEY(id)) `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID)
            }
        })

        let sql = `INSERT OR IGNORE INTO users(
          email, 
          name, 
          surname, 
          isFullTime,
          hasStudyPlan,
          hash,
          salt
          ) VALUES ((?), (?), (?), (?), (?), (?), (?))`;
        users.forEach(async (e) => {
          this.db.run(sql, [e.email, e.name, e.surname, e.isFullTime, e.hasStudyPlan, e.hash, e.salt], (err)=>{
            if (err) {
              reject(err);
                return;
              }
            resolve(this.lastID);
          });
        })
    })}

    dropTableUsers() {
        return new Promise((res, rej) => {
            const sql = "DROP TABLE IF EXISTS users";
            this.db.run(sql, (err)=>{
                if (err) {
                    rej(err);
                    return;
                }
                res(this.lastID);
            });
        });
    }

  /**
  * ========================
  *       COURSES TABLE
  * ========================
  *  - newTableCourses(): create the users table, if it does not already exist.
  *  - dropTableCourses(): drop the users table.
  */

  newTableCourses() {
    return new Promise((resolve, reject) => {
        this.db.run(`CREATE TABLE IF NOT EXISTS courses(
            id VARCHAR(7),
            name VARCHAR,
            max_students INTEGER,
            propedeuticity VARCHAR,
            cfu INTEGER(2), 
            PRIMARY KEY(id)) `, (err) => {
        if (err) {
            reject(err);
        } else {
            resolve(this.lastID)
        }
    })
  })}

  dropTableCourses() {
      return new Promise((res, rej) => {
          const sql = "DROP TABLE IF EXISTS courses";
          this.db.run(sql, (err)=>{
              if (err) {
                  rej(err);
                  return;
              }
              res(this.lastID);
          });
      });
  }

  /**
  * ========================
  *       STUDY_PLAN TABLE
  * ========================
  *  - newTableStudyPlan(): create the users table, if it does not already exist.
  *  - dropTableStudyPlan(): drop the users table.
  */

  newTableStudyPlan() {
    return new Promise((resolve, reject) => {
      this.db.run(`CREATE TABLE IF NOT EXISTS study_plan(
          student_id INTEGER,
          course_id VARCHAR(7),
          PRIMARY KEY(student_id, course_id),
          FOREIGN KEY(student_id) REFERENCES users(id),
          FOREIGN KEY(course_id) REFERENCES courses(id))`, (err) => {
        if (err) {
            reject(err);
        } else {
            resolve(this.lastID)
        }
      });
    })
  }

  dropTableStudyPlan() {
    return new Promise((res, rej) => {
      this.db.run('DROP TABLE IF EXISTS study_plan', (err) => {
          if (err) {
            rej(err);
            return;
        }
        res(this.lastID);
      })
    })
  }

  /**
  * ========================
  *       INCOMPATIBLES TABLE
  * ========================
  *  - newTableIncompatibles(): create the users table, if it does not already exist.
  *  - dropTableIncompatibles(): drop the users table.
  */

  newTableIncompatibles() {
    return new Promise((res, rej) => {
      let sql = `
        CREATE TABLE IF NOT EXISTS incompatibles(
          course_id VARCHAR(7),
          incompatible VARCHAR(7),
          PRIMARY KEY(course_id, incompatible),
          FOREIGN KEY(course_id) REFERENCES courses(id)
          FOREIGN KEY(incompatible) REFERENCES courses(id)
        )
      `;
      this.db.run(sql, err => {
        if (err) rej(err)
        res(this.lastID)
      })
    })
  }

  dropTableIncompatibles() {
    return new Promise((res, rej) => {
      this.db.run("DROP TABLE IF EXISTS incompatibles", (err) => {
        if (err) rej(err)
        res(this.lastID)
      })
    })
  }
}

module.exports = new DAO();
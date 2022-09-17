// import dayjs from 'dayjs';
const APIURL=new URL('http://localhost:3001/api/');


/*
    =============================
    GET: /api/courses
    =============================
*/
async function getAllCourses() {
    const res = await fetch(new URL('courses', APIURL));
    const data = await res.json();

    if(res.ok) {
        return data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }
    else{
        throw data;
    }
}

/*
    =============================
    GET: /api/studyPlan/:id
    =============================
*/

async function getStudyPlan(student_id) {
  const res = await fetch(new URL(`studyPlan/${student_id}`, APIURL),{credentials: 'include'});
  const data = await res.json();
  if(res.ok)
    return data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  else
    throw data;
}

/*
    =============================
    POST: /api/addToStudyPlan/:id 
    =============================
*/

async function addToStudyPlan(student_id, isFullTime, courses) {
  const res = await fetch(new URL(`addToStudyPlan/${student_id}/${isFullTime}`, APIURL),{
    method: 'POST',
    credentials: 'include',
    headers : {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courses)
  });
  
  if(res.ok)
    return;
  else
    return await res.json();
}

/*
    =============================
    DELETE: /deleteStudyPlan/:student_id
    =============================
*/

async function deleteStudyPlan(student_id) {
  const res = await fetch(new URL(`deleteStudyPlan/${student_id}`, APIURL), {
    method: 'DELETE',
    credentials: 'include'
  })

  if(res.ok) return;
}

/*
    =============================
    POST: /sessions -> login
    =============================
*/

async function logIn(credentials) {
  let response = await fetch(new URL('sessions', APIURL), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

/*
    =============================
    DELETE: /sessions/current
    =============================
*/

async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
  }


async function getUserInfo() {
  const response = await fetch(new URL('sessions/current', APIURL), {credentials: 'include'});
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = {
  getAllCourses, 
  getStudyPlan, 
  addToStudyPlan, 
  deleteStudyPlan,
  getUserInfo, 
  logOut, 
  logIn}
export default API;
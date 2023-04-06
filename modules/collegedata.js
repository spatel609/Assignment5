const { resolve } = import('path');


 class Data{
    constructor(students,courses){
        this.students=students;
        this.courses=courses;
    }
}


var dataCollection=null;



 exports.initilize= function (){
    return new Promise((resolve, reject) => {
    const fs=require('fs')
   
    //reading courses json
    var studentData = () => JSON.parse(fs.readFileSync("Data/students.json", "UTF8"));
    var CourseData = () => JSON.parse(fs.readFileSync("Data/courses.json", "UTF8"));
    dataCollection=new Data(studentData(),CourseData())
    resolve;
})
    
}

//CRA

 exports.getAllStudents = function(){
    return new Promise((resolve, reject) => {
    if (dataCollection.length === 0) {
        reject("no results returned");
    }else{
        resolve(dataCollection.students)
    }
})
}


 exports.getCOurses = function (){
    return new Promise((resolve, reject) => {
    if (dataCollection.length === 0) {
        reject("no results returned");
    }else{
        resolve(dataCollection.courses)
    }
})
}

module.exports.addStudents = function(studentData){
    return new Promise(function (resolve, reject) {
    studentData.TA = studentData.TA === undefined ? false : true;

    var studentNum = dataCollection.students.length + 1;
    studentData.studentNum = studentNum;

    dataCollection.students.push(studentData);

    resolve(dataCollection);
    });

}

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};
module.exports.getCourseById=function(id) {
    return new Promise((resolve, reject) => {
      const course = courses.find(c => c.courseId === id);
      if (course) {
        resolve(course);
      } else {
        reject(new Error("query returned 0 results"));
      }
    });
  }

   module.exports.updateStudent=function(studentData) {
    return new Promise((resolve, reject) => {
        students=dataCollection.students
        for (let i = 0; i < students.length; i++) {
          if (students[i].studentNum === studentData.studentNum) {
            students[i].firstName = studentData.firstName;
            students[i].lastName = studentData.lastName;
            students[i].email = studentData.email;
            students[i].addressStreet = studentData.addressStreet;
            students[i].addressCity = studentData.addressCity;
            students[i].addressProvince = studentData.addressProvince;
            students[i].TA = studentData.TA ? true : false;
            students[i].status = studentData.status;
            students[i].course = studentData.course;
            resolve();
            return;
          }
        }
        reject("Student not found");
      });
  }

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};





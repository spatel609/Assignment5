var HTTP_PORT = process.env.PORT || 8081;
var express = require("express");
var exphbs = require("express-handlebars")
var app = express();
const cd = require('./modules/collegedata.js');

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));

app.set('views', './views');

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    layoutsDir: __dirname + "/views/layouts/",
    defaultLayout: 'main',
    helpers: {
      navLink: function(url, options) {
        return '<li' +
          ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
          '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
      },

      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
    
    }
  }));
app.set("view engine", ".hbs");


//express route 
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.render("home")
});

app.get("/about", (req, res) => {
    res.render("about")
});
app.get("/users", (req, res) => {
    res.sendFile(__dirname + '/views/users.html');
});

app.get("/students/add", (req, res) => {
    res.render('addStudent.hbs')
});

app.post('/students/add',  (req, res) => {
    cd.addStudents(req.body).then(studentData => {
        res.redirect('/students');
      });
  });

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo')
});
app.get("/students",(req,res)=>{
    var course=req.query.course
    if (typeof course !== 'undefined') {
        // The variable has a value
        cd.getStudentsByCourse(course).then(studentData => {
          res.render("students", {students: studentData});
          });
      } else {
        cd.getAllStudents().then(studentData => {
          res.render("students", {students: studentData});
          });
      }
});




app.get("/courses", (req, res) => {
  cd.getCOurses().then(courseData => {
    if (courseData.length === 0) {
      // no courses found
      res.render("courses", { message: "no results" });
    } else {
      // courses found, render them using the courses template
      res.render("courses", {courses: courseData});
    }
  })
    .catch(err => {
      // error occurred, render the error message using the courses template
      res.render("courses", { message: err.message });
    });
});

app.get("/student/:num",(req,res)=>{
    var num = req.params.num;
    var numValue = parseInt(num);
    cd.getStudentByNum(numValue).then(studentData => {
      res.render("student", { student: studentData }); 
      });
  
});

app.get("/course/:id", (req, res) => {
  collegeData.getCourseById(req.params.id)
    .then(data => {
      res.render("course", { course: data });
    })
    .catch(err => {
      res.render("error", { message: err.message });
    });
});

app.post("/student/update", (req, res) => {
  cd.updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating student");
    });
});

app.get('*', function(req, res){
    res.status(404).send('PAGE NOT FOUND!!!!');
  });
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)
cd.initilize()
});

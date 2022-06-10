const db= require('./db')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port=5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
/////////////get \\\\\\\\\\\\
app.get("/getitem",(req,res)=>{
  const sqlSelect = "SELECT name,email,role FROM users";
  db.query(sqlSelect ,(result,err)=>{
      if(result){
          console.log(result);
          res.send(result);
      }else{
  res.send(err);
      }
  } )
  });

////////////////////Login\\\\\\\\\\\\\\\\
app.post("/insertLogin", (req, res) => {
  const email1 = req.body.email;
  const password1 = req.body.password;
  console.log(req);
  db.query(
    "SELECT name,email FROM users WHERE email=? AND password=?",
    [email1, password1],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ message: "incorrect email or password" });
      }
    }
  );
});

// resgiter // 
app.get("/checkemail", (req, res) => {
  const sqlSelect = "SELECT email FROM users";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
app.post("/insertuser", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role= req.body.role;
  const sqlInsert = "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";
  db.query(sqlInsert, [name, email, password, role], (err, result) => {
    if(result)
    res.send(result);
    if(err)
    console.log("not added");
  });
});

////////////////adding orders\\\\\\\\\\\\\\\\\\
app.post("/addorder", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const total = req.body.total;
  const tel = req.body.tel;
  const sqlSelect = "SELECT id FROM users WHERE email=?";
  db.query(sqlSelect, [doctor], (err, result) => {
    if (result) {
      let doctor_id = Object.values(JSON.parse(JSON.stringify(result)));

      const sqlInsert =
        "INSERT INTO appointments (user_id,doctor_id,mobile,date,clock) VALUES (?,?,?,?,?)";
      db.query(
        sqlInsert,
        [username, doctor_id[0].id, tel, date, time],
        (err, result) => {
          console.log(err);
        }
      );
    }
  });
});


// app.listen(3001, () => {
//   console.log("server running on port 3001");
// });
// app.get("/", (req, res) => {
//   res.json({ message: "ok" });
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

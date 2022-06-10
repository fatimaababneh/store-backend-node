const db= require('../db')
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port=5000;
// const Getitem =(req,res)=>{
// const sqlSelect = "SELECT name FROM users";
// db.query(sqlSelect ,(result,err)=>{
//     if(result){
//         console.log(result);
//         res.send(result);
//     }else{
// res.send(err);
//     }
   
// } )
// }
///////////////////////////////////////////////////////handling login
app.post("/api/insertLogin", (req, res) => {
    const email1 = req.body.email;
    const password1 = req.body.password;
    db.query(
      "SELECT * FROM clients WHERE email=? AND password=?",
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
  
// const Adduser=(req,res)=>{
// const sqlAdd="";
// db.query(sqlAdd,(result,err)=>{
//     if(result){
//         res.send(result);
//     }else{ res.send(err);}
// })
// }

// module.exports = {Getitem};
// module.exports = {Adduser};
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
const db= require('./db')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/////////////get \\\\\\\\\\\\
app.get("/getusers",(req,res)=>{
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

/////////////Login\\\\\\\\\\\\\\\\
app.post("/login", (req, res) => {
  const email1 = req.body.email;
  const password1 = req.body.password;
  console.log(req);
  db.query(
    "SELECT id,name,email,role FROM users WHERE email=? AND password=?",
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

/////////// resgiter //////////// 
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
  const sqlSearch = "SELECT name,email,role FROM users WHERE email=? AND password=?"
  db.query(
    "SELECT name,email,role FROM users WHERE email=?",
    [email],
    (err, result) => {

      if (result.length > 0) {
        res.send({ message: "user exists" });
      } else {
        const sqlInsert = "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";
        db.query(sqlInsert, [name, email, password, role], (err, result) => {
                if(result){
          const sqlSelect = "SELECT name,email,role FROM users WHERE email=? AND password=?";
                      if(result){
                        db.query(sqlSelect, [email,password], 
                          (err, result) => {
                            if (err) {
                              res.send({ err: err });
                            }
                            if (result.length > 0) {
                              res.send(result);
                            } 
                          })
                          }
      
          else{
            res.send({ message: "not added" });
        }
      
      
      
      }
      });
      }
    }
  );

});

////////////////adding orders\\\\\\\\\\\\\\\\\\
app.post("/addorder", (req, res) => {
  const email = req.body.email;
  const total = req.body.total;
  const role = req.body.role;
  const mobile = req.body.mobile;
  const items = req.body.items;
  console.log(req)

  const sqlSelect = "SELECT id FROM users WHERE email=?";
  if(role>0){
  db.query(sqlSelect, [email], (err, result) => {
    if (result) {
      let [user_id] = result;
      let {id} = user_id;
      const sqlInsert = "INSERT INTO orders (user_id,total,mobile) VALUES (?,?,?)";
      db.query(sqlInsert,[id, total, mobile], (err, result) => {
          if(result){
          res.send(result)

          //////get order_id from orders \\\\\\\\\
          const sqlSelect = "SELECT id FROM orders WHERE user_id=? AND mobile=?";
                if(result){
                  db.query(sqlSelect, [id,mobile], (err, result) => {
                  let [order_id] = result;
                  let {id} = order_id;
                    items.map((element)=>{

                      const sqlInsert = "INSERT INTO order_item (order_id,item_id,quantity) VALUES (?,?,?)";
                      db.query(sqlInsert,[id, element.item_id, element.quantity], (err, result) => {
                          if(result)
                          res.send(result)
                          if(err)
                          console.log(err)
                          })

                    })

                    
                  })
                
                }

                      }

              if(err)
              console.log(err)
        
    });
    }
  });
  }
});

///////get all stores\\\\\\
app.get("/getstores",(req,res)=>{
      const sqlSelect = "SELECT  store.id ,store.name , users.name as owner, store.image, store.description FROM store JOIN users ON store.user_id = users.id ";
      db.query(sqlSelect ,(result,err)=>{
          if(result){
              console.log(result);
              res.send(result);
          }else{
          res.send(err);
          }
      } )
  });


///////get store and all items of that store\\\\\\
app.get('/store/product/:id',(req,res)=>{
  const {id} = req.params;
  const sqlSelect = "SELECT item.id ,item.name as product_name, item.price, item.url_imag as product_image, item.description as product_description, store.name as store_name, store.image as store_image, store.description as store_description FROM item LEFT JOIN store ON store.id=item.store_id WHERE item.store_id=? ";
  db.query(sqlSelect ,[id],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});

/////////////////get orders of 
app.get('/order/store/:id',(req,res)=>{
  const {id} = req.params;
  const sqlSelect = "SELECT item.id ,item.name as product_name, item.price, item.url_imag as product_image, order_item.quantity FROM item LEFT JOIN order_item ON order_item.item_id=item.id WHERE item.store_id=? ";
  db.query(sqlSelect ,[id],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});



/////////create store\\\\\\//////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\
app.post('/insert/store',(req,res)=>{
  const id = req.body.user_id;
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const sqlSelect = "INSERT INTO store(name,user_id,image,description) VALUES (?,?,?,?)";
  db.query(sqlSelect ,[name,id,image,description],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});





/////////add products\\\\\\//////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\
app.post('/insert/product',(req,res)=>{
  const store_id = req.body.store_id;
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.url_imag;
  const description = req.body.description;
  const sqlSelect = "INSERT INTO item(name,store_id,price,url_imag,description) VALUES (?,?,?,?,?)";
  db.query(sqlSelect ,[name,store_id,price,image,description],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});

////////delete product \\\\\\\\\\\\\\
app.delete('/delete/product/:id',(req,res)=>{
  const {id} = req.params;

  const sqlSelect = "DELETE FROM item where id=?";
  db.query(sqlSelect ,[id],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});


//////////////////
app.get('/product/:id',(req,res)=>{
  const {id} = req.params;
  const sqlSelect = "SELECT item.id ,item.name as product_name, item.price, item.url_imag as product_image, item.description as product_description, store.name as store_name, store.image as store_image, store.description as store_description FROM item LEFT JOIN store ON store.id=item.store_id WHERE item.id=? ";
  db.query(sqlSelect ,[id],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});



///////veiw all orders of user \\\\\\\\\\
app.get('/get/orders/:id',(req,res)=>{
  const {id} = req.params;

  const sqlSelect = "SELECT orders.mobile as order_mobile, orders.total from orders where user_id=?";
  db.query(sqlSelect ,[id],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});



///////veiw all store of user \\\\\\\\\\
app.get('/get/store/user/:id',(req,res)=>{
  const {id} = req.params;

  const sqlSelect = "SELECT id,name from store where user_id=?";
  db.query(sqlSelect ,[id],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});




/////////user infooooo \\\\\\\\\\\\\
app.get('/user/:id',(req,res)=>{
  const {id} = req.params;

  const sqlSelect = "SELECT name,number,email,role from users where id=?";
  db.query(sqlSelect ,[id],(result,err)=>{
    if(result){ 
      res.send(result);
    }else{
      res.send(err);
    }
  })

});



const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

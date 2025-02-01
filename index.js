const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");

const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const connection = mysql.createConnection(conf);

const app = express();


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", express.static(path.join(__dirname, "public")));

app.post("/todo/add", (req, res) => {
  const todo = req.body.todo;

  insert(todo);

  res.json({ result: "Ok" });
});

app.get("/todo", (req, res) => {
  select().then(todos => res.json({ todos: todos }));
});

app.put("/todo/complete", (req, res) => {
  const todo = req.body;

  try {
    select()
    .then(todos => {
      todos.map((element) => {
      if (element.id === todo.id) {
        element.completed = true;
        update(element);
      }

      return element;
    });
    })
    
  } catch (e) {
    console.log(e);
  }
  res.json({ result: "Ok" });
});

app.delete("/todo/:id", (req, res) => {
  select()
  .then(todos => {
    todos = todos.filter((element) => element.id == req.params.id);
    remove(todos[0]);
  })
  
  res.json({ result: "Ok" });
});



const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
          connection.query(sql, function (err, result) {
             if (err) {
                console.error(err);
                reject();     
             }   
             console.log('done');
             resolve(result);         
       });
    })
 }

 const createTable = () => {
    return executeQuery(`
    CREATE TABLE IF NOT EXISTS todo
       ( id INT PRIMARY KEY AUTO_INCREMENT, 
          name VARCHAR(255) NOT NULL, 
          completed BOOLEAN ) 
       `);      
 }

 const insert = (todo) => {
    const template = `
    INSERT INTO todo (name, completed) VALUES ('$NAME', '$COMPLETED')
       `;
    let sql = template.replace("$NAME", todo.name);
    sql = sql.replace("$COMPLETED", todo.completed ? 1 : 0);
    return executeQuery(sql); 
 }

 const select = () => {
    const sql = `
    SELECT id, name, completed FROM todo 
       `;
    return executeQuery(sql); 
 }

 const update = (todo) =>{
    let sql = `
    UPDATE todo SET completed = '$COMPLETED' WHERE id = '$ID'
    `;

    sql = sql.replace("$COMPLETED", todo.completed  ? 1 : 0);
    sql = sql.replace("$ID", todo.id);
    return executeQuery(sql); 
 }


 const remove = (todo) => {
  let sql =  `
  DELETE FROM todo WHERE id = '$ID'
  `;

  sql = sql.replace("$ID", todo.id);
  return executeQuery(sql); 
 }

 
 createTable().then ( () => {
  const server = http.createServer(app);

  server.listen(80, () => {
    console.log("- server running");
  })
  }
);
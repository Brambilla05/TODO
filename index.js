const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const http = require("http");
app.use(bodyParser.urlencoded({
   extended: true
}));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));

let todos = [];

app.post("/todo/add", (req, res) => {

   const todo = req.body.todo;

   todo.id = "" + new Date().getTime();

   todos.push(todo);

   res.json({result: "Ok"});

});

app.get("/todo", (req, res) => {

   res.json({todos: todos});

});


app.put("/todo/complete", (req, res) => {
console.log("pr");
    const todo = req.body;
 
    try {
 
       todos = todos.map((element) => {
 
          if (element.id === todo.id) {
 
             element.completed = true;
 
          }
 
          return element;
 
       })
 
    } catch (e) {
 
       console.log(e);
 
    }
 
    res.json({result: "Ok"});
 
 });



 app.delete("/todo/:id", (req, res) => {

    todos = todos.filter((element) => element.id !== req.params.id);
 
    res.json({result: "Ok"});  
 
 })



const server = http.createServer(app);

server.listen(80, () => {

  console.log("- server running");

});



let todos = [];
const todoInput = document.getElementById("todoInput");
const insertButton = document.getElementById("submit");
const parentElement = document.getElementById("tb");
const render = () => {
    console.log(todos);
    let html = "";
    html += todos.map(e => {
        if (!e.completed)
            return "<tr><td>" + e.name + "</td><td><button type ='button' class = 'btn btn-outline-success'>Complete</button></td><td><button type ='button' class = 'btn btn-outline-danger'>Delete</button></td></tr>";
        else
            return "<tr class = 'todocompletata'><td>" + e.name + "</td><td><!--<button type = 'button' class = 'btn btn-outline-success'>Complete</button>--></td><td><button type = 'button' class = 'btn btn-outline-danger'>Delete</button></td></tr>";
    })
    parentElement.innerHTML = html;
    document.querySelectorAll(".btn-outline-success").forEach((button, index) => {
        button.onclick = () => {
            console.log("prova");
            completeTodo(todos[index]).then(() => {
                load().then((json) => {
                    todos = json.todos;
                    render();
                });
            });
        }
    })
    document.querySelectorAll(".btn-outline-danger").forEach((button, index) => {
        button.onclick = () => {
            deleteTodo(todos[index].id).then(() => {
                load().then((json) => {
                    todos = json.todos;
                    render();
                });
            });
        }
    });
}

const send = (todo) => {

    return new Promise((resolve, reject) => {

        fetch("/todo/add", {

            method: 'POST',

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(todo)

        })

            .then((response) => response.json())

            .then((json) => {

                resolve(json);

            })

    })

}

const load = () => {

    return new Promise((resolve, reject) => {

        fetch("/todo")

            .then((response) => response.json())

            .then((json) => {

                resolve(json);

            })

    })

}

insertButton.onclick = () => {

    const todo = {

        name: todoInput.value,

        completed: false

    }

    send({ todo: todo })

        .then(() => load())

        .then((json) => {

            todos = json.todos;

            todoInput.value = "";

            render();

        });

}

load().then((json) => {

    todos = json.todos;

    render();

});


const completeTodo = (todo) => {

    return new Promise((resolve, reject) => {

        fetch("/todo/complete", {

            method: 'PUT',

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(todo)

        })

            .then((response) => response.json())

            .then((json) => {

                resolve(json);

            })

    })

}


const deleteTodo = (id) => {

    return new Promise((resolve, reject) => {

        fetch("/todo/" + id, {

            method: 'DELETE',

            headers: {

                "Content-Type": "application/json"

            },

        })

            .then((response) => response.json())

            .then((json) => {

                resolve(json);

            })

    })

}


setInterval(() => {

    load().then((json) => {

        todos = json.todos;

        todoInput.value = "";

        render();

    });

}, 30000);
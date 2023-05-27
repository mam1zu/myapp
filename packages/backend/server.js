const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const mysql_con = mysql.createConnection({
    host: 'localhost',
    user: 'api',
    password: 'hagyagi',
    database: 'myapp_db',
    stringifyObjects: true,
});

mysql_con.connect((err) => {
    if(err) {
        console.log("failed to connect to MySQL.");
        throw err;
    }
    console.log("MySQL connection established.");
    mysql_con.query(`CREATE DATABASE IF NOT EXISTS myapp_db`, (err, result) => {
        if(err) {
            console.log("MySQL Query failed");
            throw err;
        }
        console.log("Database created");
    });

    const create_users_table = 'CREATE TABLE IF NOT EXISTS users_table(key INT NOT NULL PRIMARY KEY AUTO_INCREMENT, id TEXT NOT NULL, pass_hash TEXT NOT NULL)';
    const create_todos_table = 'CREATE TABLE IF NOT EXISTS todos_table(id TEXT NOT NULL PRIMARY KEY, todos TEXT';

    mysql_con.query(create_users_table, (err, result) => {
        if(err) throw err;
    });
    mysql_con.query(create_todos_table, (err, result) => {
        if(err) throw err;
    });
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send("API Server");
})

app.post('/api/login', (req, res) => {
    const id = req.body.id;
    const pass_hash = req.body.pass_hash;
    if(typeof id != "string" ||typeof pass_hash != "string") {
        res.status(400).send("Invalid parameters");
        return;
    }
    if(id && pass_hash) {
        mysql_con.query("SELECT * FROM users_table WHERE id = ? AND pass_hash = ?", [id, pass_hash], (err, result, fields) => {
            //これでいいのか?
            if(err) {
                res.status(500).send("Internal Server Errorらしい");
                throw err;
            }
            if(result) {
                res.status(200).send("エロあるよ(笑)");
            }
            else {
                res.status(400).send("ない");
            }
        });
    }
    else {
        res.status(400).send("Invalid parameters");
    }
});

app.get('/api/gettodos', (req, res) => {
    const id = req.body.id;
    if(typeof id != "string") {
        res.status(400).send("Invalid parameters");
        return;
    }
    if(id) {
        mysql_con.query("SELECT todos FROM todos_table WHERE id = ?", [id], (err, result, fields) => {
            if(err) {
                res.status(500).send("Internal Server Error");
                throw err;
            }
            const todos_return = JSON.parse(result[0].todos);
            res.status(200).json(todos_return);
        });
    }
});

app.get('/api/removetodo', (req, res) => {
    const id = req.body.id;
    const rm_todoid = req.body.todoid;
    if(typeof id != "string" || rm_todoid != "string") {
        res.status(400).send("Invalid parameters");
        return;
    }
    if(id && todoid) {
        const old_todos = {}, new_todos = {};
        mysql_con.query("SELECT todos FROM todos_table WHERE id = ?", [id], (err, result, fields) => {
            if(err || !result) {
                res.status(500).send("Internal Server Error");
                return;
            }
            old_todos = JSON.parse(result[0].todos);
            new_todos = JSON.stringify(old_todos.filter((todo) => todo.id !== rm_todoid));
        });
        mysql_con.query("UPDATE todos_table SET todos = ? WHERE id = ?", [new_todos, id], (err, result, fields) => {
            if(err || !result) {
                res.status(500).send("Internal Server Error");
                return;
            }
            res.status(200).send("Oke");
        })
    }
});

app.post('/api/addtodo', (req, res) => {
    const id = req.body.id;
    const add_todo = req.body.todo;

    if(typeof id != "string" || typeof add_todo != "string") {
        res.status(400).send("Invalid parameters");
        return;
    }
    if(id && add_todo) {
        const old_todos = {}, new_todos = {};
        mysql_con.query("SELECT todos FROM todos_table WHERE id = ?", [id], (err, result, fields) => {
            if (err || !result) {
                res.status(500).send("Internal Server Error");
                return;
            }
            old_todos = JSON.parse(result[0].todos);
            new_todos = JSON.stringify([...old_todos, add_todo]);
        });
        mysql_con.query("UPDATE todos_table SET todos = ? WHERE id = ?", [new_todos, id], (err, result, fields) => {
            if (err || !result) {
                res.status(500).send("Internal Server Error");
                return;
            }
            res.status(200).send("おけ(笑)")
        });
    }
})

app.use((err, req, res, next) => {
    res.status(500).send('Internal Server Error');
})

app.listen(8000, () => {
    console.log("Login API Server Start \n Listening on port: 8000");
});
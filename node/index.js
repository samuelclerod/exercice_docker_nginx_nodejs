const express = require('express');
const app = express();

const { readFileSync, fstat } = require('fs');

const port = process.env.PORT || 3000

const config = {
  host: 'db',
  user: 'root',
  password: 'pass',
  database: 'nodedb'
}
const data = readFileSync('./users.json');
const usersArray = JSON.parse(data);
const mysql = require('mysql');
const connection = mysql.createConnection(config);
const dropusers = `drop table if exists users`;
const createTable = "create table users (id int auto_increment, name varchar(50), PRIMARY KEY (id))";
const insertUsers = `insert into users (name) values ${usersArray.map(user => `('${user}')`).join(',')}`;
const selectUsers = `select * from users`;
let output = `<h1> Full Cycle!</h1> `;

const handleSelectdUsers = (err, users) => {
  if (err) throw err;
  output += `<ul> `;
  users.map(user => {
    output += `<li> ${user.name}</li> `;
  });
  output += `</ul> `;
}
connection.query(dropusers)
connection.query(createTable)
connection.query(insertUsers);
connection.query(selectUsers, handleSelectdUsers);
connection.end();

app.get('/', (req, res) => {
  res.send(output);
});

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

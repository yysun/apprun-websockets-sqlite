// @ts-check
const app = require('apprun').app;
const sqlite3 = require('sqlite3').verbose();
const file = "db/todo.db";

function using(fn) {
  const db = new sqlite3.Database(file);
  fn(db);
  db.close();
}

app.on('@get-all-todo', (json, ws) => {
  using(db => {
    const sql = 'select * from todo';
    db.all(sql, function (err, rows) {
      json.state = rows;
      console.log('  >', json);
      ws.send(JSON.stringify(json));
    });
  });
});

app.on('@get-todo', (json, ws) => {
  using(db => {
    const sql = 'select * from todo where id=?';
    db.get(sql, json.state.id, function (err, row) {
      json.state = row;
      console.log('  >', json);
      ws.send(JSON.stringify(json));
    });
  });
});

app.on('@create-todo', (json) => {
  using(db => {
    const sql = 'insert into todo (title, done) values (?,?)';
    db.run(sql, json.state.title, json.state.done);
    console.log('  >', 'created');
  });
});

app.on('@update-todo', (json) => {
  using(db => {
    const sql = 'update todo set title=?, done=? where id=?';
    db.run(sql, json.state.title, json.state.done, json.state.id);
    console.log('  >', 'updated');
  });
});

app.on('@delete-todo', (json) => {
  using(db => {
    const sql = 'delete from todo where id=?';
    db.run(sql, json.state.id);
    console.log('  >', 'deleted');
  });
});

app.on('@delete-all-todo', () => {
  using(db => {
    const sql = 'delete from todo';
    db.run(sql);
    console.log('  >', 'deleted all');
  });
});

// @ts-check
const app = require('apprun').app;
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
const dbFile = "./sqlite.db";
const exists = fs.existsSync(dbFile);

function using(fn) {
  const db = new sqlite3.Database(dbFile);
  fn(db);
  db.close();
}

console.log('Using database: ', dbFile);

const db = new sqlite3.Database(dbFile);
db.serialize(() => {
  if (!exists) {
    db.run(`CREATE TABLE Todo (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                title       TEXT    NOT NULL,
                done        NUMERIC NOT NULL DEFAULT 0,
                CONSTRAINT Todo_ck_done CHECK (done IN (0, 1))
              );`);
    console.log("New table created!");
  }
});


app.on('@get-all-todo', (json, ws) => {
  using(db => {
    const sql = 'select * from todo';
    db.all(sql, function (err, rows) {
      json.state = rows || [];
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

app.on('@create-todo', (json, ws) => {
  using(db => {
    const sql = 'insert into todo (title, done) values (?,?)';
    db.run(sql, json.state.title, json.state.done, function () {
      json.state.id = this.lastID;
      console.log('  >', 'created', json);
      ws.send(JSON.stringify(json));
    });
  });
});

app.on('@update-todo', (json, ws) => {
  using(db => {
    const sql = 'update todo set title=?, done=? where id=?';
    db.run(sql, json.state.title, json.state.done, json.state.id, function () {
      console.log('  >', 'updated', json);
      ws.send(JSON.stringify(json));
    });
  });
});

app.on('@delete-todo', (json, ws) => {
  using(db => {
    const sql = 'delete from todo where id=?';
    db.run(sql, json.state.id, function () {
      console.log('  >', 'deleted', json);
      ws.send(JSON.stringify(json));
    });
  });
});

app.on('@delete-all-todo', (json, ws) => {
  using(db => {
    const sql = 'delete from todo';
    db.run(sql, function () {
      console.log('  >', 'deleted all', json);
      ws.send(JSON.stringify(json));
    });
  });
});

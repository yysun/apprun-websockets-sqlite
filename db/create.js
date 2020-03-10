const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/todo.db');

db.serialize(function () {
  // db.run('Drop TABLE Todo');

  // db.run(`CREATE TABLE Todo (
  //   id          INTEGER PRIMARY KEY AUTOINCREMENT,
  //   title       TEXT    NOT NULL,
  //   done        NUMERIC NOT NULL DEFAULT 0,
  //   ip          VARCHAR(15) NOT NULL,
  //   CONSTRAINT Todo_ck_done CHECK (done IN (0, 1))
  // );`);

  // const stmt = db.prepare("INSERT INTO todo (title, done, ip) VALUES (?,?,?)");
  // for (let i = 0; i < 10; i++) {
  //   const d = new Date().toLocaleTimeString();
  //   stmt.run(d, 0, i);
  // }
  // stmt.finalize();

  db.each("SELECT * FROM todo", function (err, row) {
    console.log(row);
  });

});

db.close();
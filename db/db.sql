CREATE TABLE Todo (
  id          INTEGER PRIMARY KEY,
  title       TEXT    NOT NULL,
  done        NUMERIC NOT NULL DEFAULT 0,
  CONSTRAINT Todo_ck_done CHECK (done IN (0, 1))
);
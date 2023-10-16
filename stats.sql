CREATE TABLE stats (
  time DATETIME DEFAULT CURRENT_TIMESTAMP,
  uuid TEXT,
  boxx INT,
  boxy INT,
  boxw INT,
  boxh INT,
  centx INT,
  centy INT,
  score REAL,
  predictSeq TEXT,
  predictLetter TEXT,
  verdictLetter TEXT
);
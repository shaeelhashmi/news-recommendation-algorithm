package queries

var DeleteQueries = []string{
	`DELETE FROM science WHERE userName = ?;`,
	`DELETE FROM business WHERE userName = ?;`,
	`DELETE FROM health WHERE userName = ?;`,
	`DELETE FROM sports WHERE userName = ?;`,
	`DELETE FROM entertainment WHERE userName = ?;`,
	`DELETE FROM world WHERE userName = ?;`,
	`DELETE FROM users WHERE username = ?;`,
}
var Tables = []string{
	`CREATE TABLE IF NOT EXISTS science (
		userName VARCHAR(255) NOT NULL PRIMARY KEY,
		visit INT DEFAULT 0,
		latestVisit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userName) REFERENCES users(username)
		ON UPDATE CASCADE
	);`,
	`CREATE TABLE IF NOT EXISTS business (
		userName VARCHAR(255) NOT NULL PRIMARY KEY,
		visit INT DEFAULT 0,
		latestVisit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userName) REFERENCES users(username)
		ON UPDATE CASCADE
	);`,
	`CREATE TABLE IF NOT EXISTS health (
		userName VARCHAR(255) NOT NULL PRIMARY KEY,
		visit INT DEFAULT 0,
		latestVisit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userName) REFERENCES users(username)
		ON UPDATE CASCADE
	);`,
	`CREATE TABLE IF NOT EXISTS sports (
		userName VARCHAR(255) NOT NULL PRIMARY KEY,
		visit INT DEFAULT 0,
		latestVisit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userName) REFERENCES users(username)
		ON UPDATE CASCADE
	);`,
	`CREATE TABLE IF NOT EXISTS entertainment (
		userName VARCHAR(255) NOT NULL PRIMARY KEY,
		visit INT DEFAULT 0,
		latestVisit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userName) REFERENCES users(username)
		ON UPDATE CASCADE
	);`,
	`CREATE TABLE IF NOT EXISTS world (
		userName VARCHAR(255) NOT NULL PRIMARY KEY,
		visit INT DEFAULT 0,
		latestVisit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userName) REFERENCES users(username)
		ON UPDATE CASCADE
	);`,
}

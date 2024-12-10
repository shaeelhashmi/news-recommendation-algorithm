package Auth

import (
	"crypto/rand"
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"log"
	"net/http"
	"os"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
)

var Db *sql.DB

func CheckSessionExists(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) bool {
	EnableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	session, err := store.Get(r, "user-session")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
		return false
	}
	if session.Values["username"] == nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
		return false
	}
	username := session.Values["username"].(string)
	var exists bool
	err = Db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", username).Scan(&exists)
	if err != nil || !exists {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
		return false
	}

	w.Write([]byte(session.Values["username"].(string)))
	return true
}
func LogoutHandler(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	EnableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	session, err := store.Get(r, "user-session")
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	session.Options.MaxAge = -1
	err = session.Save(r, w)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logged out"))
}
func EnableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

func ConnectDB() *sql.DB {
	err1 := godotenv.Load()
	if err1 != nil {
		log.Fatal("Error loading .env file")
	}
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "auth",
	}
	// Get a database handle.
	var err error
	Db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := Db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
	return Db
}

func hashPassword(password string, salt []byte) string {
	var passwordBytes = []byte(password)
	var sha512Hasher = sha512.New()
	passwordBytes = append(passwordBytes, salt...)
	sha512Hasher.Write(passwordBytes)
	var hashedPasswordBytes = sha512Hasher.Sum(nil)
	var hashedPasswordHex = hex.EncodeToString(hashedPasswordBytes)
	return hashedPasswordHex
}

func generateRandomSalt(saltSize int) []byte {
	var salt = make([]byte, saltSize)
	_, err := rand.Read(salt[:])
	if err != nil {
		panic(err)
	}
	return salt
}
func SignUphandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	EnableCors(&w)
	if r.Method == http.MethodPost {
		username := r.FormValue("username")
		password := r.FormValue("password")
		salt := generateRandomSalt(16)
		hashedPassword := hashPassword(password, salt)
		tx, err := Db.Begin()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		var exists bool
		_, err = tx.Exec(`
		CREATE TABLE IF NOT EXISTS users (
username VARCHAR(255) NOT NULL PRIMARY KEY,
password VARCHAR(255) NOT NULL,
salt BLOB NOT NULL
);`)
		if err != nil {
			tx.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		err = Db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", username).Scan(&exists)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		if exists {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("Username already exists"))
			return
		}

		tables := []string{
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

		for _, table := range tables {
			_, err = tx.Exec(table)
			if err != nil {
				tx.Rollback()
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("Internal server error"))
				return
			}
		}

		_, err = tx.Exec("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)", username, hashedPassword, salt)
		if err != nil {
			tx.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		InsertionTable := []string{
			"INSERT INTO health (userName, visit) VALUES (?, ?)",
			"INSERT INTO sports (userName, visit) VALUES (?, ?)",
			"INSERT INTO entertainment (userName, visit) VALUES (?, ?)",
			"INSERT INTO world (userName, visit) VALUES (?, ?)",
			"INSERT INTO science (userName, visit) VALUES (?, ?)",
			"INSERT INTO business (userName, visit) VALUES (?, ?)",
		}
		for _, table := range InsertionTable {
			_, err = tx.Exec(table, username, 0)
			if err != nil {
				tx.Rollback()
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("Internal server error"))
				return
			}
		}
		err = tx.Commit()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("User created successfully"))
		return
	}
	http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
}
func LoginHandler(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodPost {
		username := r.FormValue("username")
		password := r.FormValue("password")
		session, err := store.Get(r, "user-session")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		var exists bool
		err = Db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", username).Scan(&exists)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		if !exists {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Invalid username or password"))
			return
		}
		stmt, err := Db.Prepare("SELECT password, salt FROM users WHERE username = ?")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		defer stmt.Close()
		var hashedPassword string
		var salt []byte
		err = stmt.QueryRow(username).Scan(&hashedPassword, &salt)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		passwordHash := hashPassword(password, salt)
		if passwordHash != hashedPassword {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Invalid username or password"))
			return
		}

		session.Values["username"] = username
		store.Save(r, w, session)
		err = session.Save(r, w)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Logged in"))
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
func ChangePasswordHandler(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	w.Header().Set("Content-Type", "application/json")
	EnableCors(&w)
	if r.Method == http.MethodPost {
		session, err := store.Get(r, "user-session")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		username := session.Values["username"].(string)
		oldPassword := r.FormValue("oldPassword")
		newPassword := r.FormValue("newPassword")
		stmt, err := Db.Prepare("SELECT password, salt FROM users WHERE username = ?")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		defer stmt.Close()
		var hashedPassword string
		var salt []byte
		err = stmt.QueryRow(username).Scan(&hashedPassword, &salt)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		passwordHash := hashPassword(oldPassword, salt)
		if passwordHash != hashedPassword {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Invalid password"))
			return
		}
		newSalt := generateRandomSalt(16)
		newHashedPassword := hashPassword(newPassword, newSalt)
		stmt, err = Db.Prepare("UPDATE users SET password = ?, salt = ? WHERE username = ?")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		defer stmt.Close()
		_, err = stmt.Exec(newHashedPassword, newSalt, username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Password changed successfully"))
		return
	}
	http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
}
func ChangeUsernameHandler(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	w.Header().Set("Content-Type", "application/json")
	EnableCors(&w)
	if r.Method == http.MethodPost {
		session, err := store.Get(r, "user-session")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		username := session.Values["username"].(string)
		newUsername := r.FormValue("newUsername")
		var exists bool
		err = Db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", newUsername).Scan(&exists)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		if exists {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("Username already exists"))
			return
		}
		_, err = Db.Exec("SET sql_mode = ''")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		stmt, err := Db.Prepare("UPDATE users SET username = ? WHERE username = ?")

		if err != nil {

			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		defer stmt.Close()
		_, err = stmt.Exec(newUsername, username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}

		session.Values["username"] = newUsername
		err = session.Save(r, w)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Username changed successfully"))

	}
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Write([]byte("Invalid request method"))
}

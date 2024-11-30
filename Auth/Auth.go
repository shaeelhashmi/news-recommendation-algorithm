package Auth

import (
	"crypto/rand"
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
)

var db *sql.DB

func CheckSessionExists(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	session, err := store.Get(r, "user-session")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
		return
	}
	if session.Values["username"] == nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
		return
	}

	w.Write([]byte(session.Values["username"].(string)))
}
func LogoutHandler(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	fmt.Println("Logging out")
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
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

func ConnectDB() {
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
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

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
	enableCors(&w)
	if r.Method == http.MethodPost {
		username := r.FormValue("username")
		password := r.FormValue("password")
		salt := generateRandomSalt(16)
		hashedPassword := hashPassword(password, salt)
		stmt, err := db.Prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		defer stmt.Close()
		var exists bool
		err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", username).Scan(&exists)
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

		_, err = stmt.Exec(username, hashedPassword, salt)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("User created"))
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
		stmt, err := db.Prepare("SELECT password, salt FROM users WHERE username = ?")
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
func ChangeUsernameHandler(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	w.Header().Set("Content-Type", "application/json")
	enableCors(&w)
	if r.Method == http.MethodPost {
		session, err := store.Get(r, "user-session")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		username := session.Values["username"].(string)
		newUsername := r.FormValue("newUsername")
		fmt.Println(username, newUsername)
		var exists bool
		err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)", newUsername).Scan(&exists)
		if err != nil {
			fmt.Println(err, "1")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		if exists {
			fmt.Println(err, "2")
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("Username already exists"))
			return
		}

		stmt, err := db.Prepare("UPDATE users SET username = ? WHERE username = ?")
		if err != nil {
			fmt.Println(err, "3")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		defer stmt.Close()

		_, err = stmt.Exec(newUsername, username)
		if err != nil {
			fmt.Println(err, "4")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}

		session.Values["username"] = newUsername
		err = session.Save(r, w)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal server error"))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Username changed successfully"))

	}
}

package Auth

import (
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

// type signupData struct {
// 	Username string `json:"username"`
// 	Password string `json:"password"`
// 	Salt     []byte
// }

func CheckSessionExists(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	session, err := store.Get(r, "user-session")
	if err != nil {
		http.Error(w, "Unable to get session", http.StatusInternalServerError)
		return
	}
	if session.Values["userName"] == nil {
		http.Error(w, "No session found", http.StatusUnauthorized)
		return
	}

	w.Write([]byte("Session found"))
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

	fmt.Println("Connected!")

}

var (
	store = sessions.NewCookieStore([]byte("secret-key"))
)

func hashPassword(password string, salt []byte) string {

	var passwordBytes = []byte(password)

	var sha512Hasher = sha512.New()

	passwordBytes = append(passwordBytes, salt...)

	sha512Hasher.Write(passwordBytes)

	var hashedPasswordBytes = sha512Hasher.Sum(nil)

	var hashedPasswordHex = hex.EncodeToString(hashedPasswordBytes)

	return hashedPasswordHex

}
func LoginHandler(w http.ResponseWriter, r *http.Request) {
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

package Auth

import (
	"crypto/rand"
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/alexedwards/scs/mysqlstore"
	"github.com/alexedwards/scs/v2"
	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB
var SessionManager *scs.SessionManager

type signupData struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Salt     []byte
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
func ConnectDB() {
	godotenv.Load()
	// Establish connection to MySQL.
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

	// Initialize a new session manager and configure it to use mysqlstore as the session store.
	SessionManager = scs.New()
	SessionManager.Store = mysqlstore.New(db)
}
func generateRandomSalt(saltSize int) []byte {

	var salt = make([]byte, saltSize)

	_, err := rand.Read(salt[:])

	if err != nil {

		panic(err)

	}

	return salt

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

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()
	var data signupData
	err = json.Unmarshal(body, &data)
	if err != nil {
		fmt.Print(err)
		http.Error(w, "Error unmarshaling JSON", http.StatusInternalServerError)
		return
	}
	fmt.Print(data.Username, data.Password)
	salt := generateRandomSalt(16)
	hashedPassword := hashPassword(data.Password, salt)
	stmt, err := db.Prepare("INSERT INTO users (username, password,salt) VALUES (?, ?, ?)")
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(data.Username, hashedPassword, salt)
	if err != nil {
		fmt.Println(err)
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}
		http.Error(w, "Failed to insert user", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "User %s successfully signed up!", data.Username)
}
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		enableCors(&w)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.WriteHeader(http.StatusOK)
		return
	}
	enableCors(&w)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var data signupData
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error unmarshaling JSON", http.StatusInternalServerError)
		return
	}

	// Modify the SQL query to select both password and salt
	stmt, err := db.Prepare("SELECT password, salt FROM users WHERE username = ?")
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	var storedPassword string
	var storedSalt []byte

	// Use QueryRow to fetch both password and salt
	err = stmt.QueryRow(data.Username).Scan(&storedPassword, &storedSalt)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		} else {
			fmt.Println(err)
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}
	enteredPassword := hashPassword(data.Password, storedSalt)
	if storedPassword != enteredPassword {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}
	SessionManager.Put(r.Context(), "username", data.Username)
	io.WriteString(w, "You have been logged in successfully!")
}

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	enableCors(&w)
// 	if r.Method == http.MethodOptions {
// 		enableCors(&w)
// 		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
// 		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

// 		w.WriteHeader(http.StatusOK)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")

// 	body, err := io.ReadAll(r.Body)
// 	if err != nil {
// 		http.Error(w, "Error reading request body", http.StatusInternalServerError)
// 		return
// 	}
// 	defer r.Body.Close()

// 	var data signupData
// 	err = json.Unmarshal(body, &data)
// 	if err != nil {
// 		response := map[string]string{"message": "Internal server error"}
// 		jsonResponse, err := json.Marshal(response)
// 		if err != nil {
// 			http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
// 			return
// 		}
// 		w.WriteHeader(http.StatusInternalServerError)
// 		w.Write(jsonResponse)
// 		return
// 	}

// 	// Modify the SQL query to select both password and salt
// 	stmt, err := db.Prepare("SELECT password, salt FROM users WHERE username = ?")
// 	if err != nil {
// 		response := map[string]string{"message": "Internal server error"}
// 		jsonResponse, err := json.Marshal(response)
// 		if err != nil {
// 			http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
// 			return
// 		}
// 		w.WriteHeader(http.StatusInternalServerError)
// 		w.Write(jsonResponse)
// 		return
// 	}
// 	defer stmt.Close()

// 	var storedPassword string
// 	var storedSalt []byte

// 	// Use QueryRow to fetch both password and salt
// 	err = stmt.QueryRow(data.Username).Scan(&storedPassword, &storedSalt)
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			response := map[string]string{"message": "Invalid username or password"}
// 			w.WriteHeader(http.StatusUnauthorized)
// 			jsonResponse, err := json.Marshal(response)
// 			if err != nil {
// 				http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
// 				return
// 			}
// 			w.Write(jsonResponse)
// 			return
// 		} else {
// 			response := map[string]string{"message": "Internal server error"}
// 			jsonResponse, err := json.Marshal(response)
// 			if err != nil {
// 				http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
// 				return
// 			}
// 			w.Write(jsonResponse)
// 			return
// 		}
// 	}
// 	enteredPassword := hashPassword(data.Password, storedSalt)
// 	if storedPassword != enteredPassword {
// 		response := map[string]string{"message": "Invalid username or password"}
// 		jsonResponse, err := json.Marshal(response)
// 		w.WriteHeader(http.StatusUnauthorized)
// 		if err != nil {
// 			http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
// 			return
// 		}
// 		w.Write(jsonResponse)
// 		return
// 	}
// 	SessionManager.Put(r.Context(), "username", data.Username)
// 	response := map[string]string{"message": "Logged in successfully"}
// 	jsonResponse, err := json.Marshal(response)
// 	if err != nil {
// 		http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
// 		return
// 	}
// 	w.Write(jsonResponse)
// }

package interest

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	auth "scraper/Auth"

	"github.com/gorilla/sessions"
)

var db = auth.Db

func InterestManage(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	db = auth.ConnectDB()
	w.Header().Set("Content-Type", "application/json")
	auth.EnableCors(&w)
	if r.Method == "POST" {

		var requestData struct {
			PostType string `json:"PostType"`
		}
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = json.Unmarshal(body, &requestData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		PostType := requestData.PostType
		sessions, err := store.Get(r, "user-session")
		if err != nil {
			fmt.Println(err, '1')
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Print(PostType)
		if !auth.CheckSessionExists(w, r, store) {
			fmt.Println("Unauthorized")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}
		username := sessions.Values["username"]
		stmt, err := db.Prepare("INSERT INTO " + PostType + " (username, visit) VALUES (?, 1) ON DUPLICATE KEY UPDATE visit = visit + 1")
		if err != nil {
			fmt.Println(err, '2')
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		_, err = stmt.Exec(username)
		if err != nil {
			fmt.Println(err, '3')
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Success"))
	}
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Write([]byte("Method Not Allowed"))
}

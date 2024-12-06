package interest

import (
	"encoding/json"
	"io"
	"net/http"
	auth "scraper/Auth"
	"time"

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
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !auth.CheckSessionExists(w, r, store) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		username := sessions.Values["username"]
		stmt, err := db.Prepare("UPDATE " + PostType + " SET visit=visit+1, latestVisit=? WHERE username=?")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		_, err = stmt.Exec(time.Now(), username)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		_, err = stmt.Exec(username)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write([]byte("Success"))
		return
	}
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Write([]byte("Method Not Allowed"))
}

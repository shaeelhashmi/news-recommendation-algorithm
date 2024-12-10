package deleteaccount

import (
	"net/http"
	auth "scraper/Auth"

	queries "scraper/Queries"

	"github.com/gorilla/sessions"
)

var db = auth.Db

func Delete(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	auth.EnableCors(&w)
	if r.Method == "POST" {
		db = auth.ConnectDB()
		session, err := store.Get(r, "user-session")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !auth.CheckSessionExists(w, r, store) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		username := session.Values["username"]
		var exist bool
		stmt, err := db.Prepare("SELECT EXISTS(SELECT 1 FROM users WHERE username=?)")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = stmt.QueryRow(username).Scan(&exist)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !exist {
			http.Error(w, "User does not exist", http.StatusNotFound)
			return
		}
		password := r.FormValue("password")
		stmt, err = db.Prepare("SELECT password,salt FROM users WHERE username=?")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var (
			dbPassword string
			salt       []byte
		)
		err = stmt.QueryRow(username).Scan(&dbPassword, &salt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if auth.HashPassword(password, salt) != dbPassword {
			http.Error(w, "Incorrect password", http.StatusUnauthorized)
			return
		}
		tx, err := db.Begin()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		for _, query := range queries.DeleteQueries {
			stmt, err = tx.Prepare(query)
			if err != nil {
				tx.Rollback()
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			_, err = stmt.Exec(username)
			if err != nil {
				tx.Rollback()
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		err = tx.Commit()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		session.Options.MaxAge = -1
		err = session.Save(r, w)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Account deleted"))
		return
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Method not allowed"))
		return
	}
}

package main

import (
	"encoding/json"
	"net/http"
	auth "scraper/Auth"
	"scraper/DataStructures"
	deleteaccount "scraper/DeleteAccount"
	fyp "scraper/Fyp"
	interest "scraper/Interest"
	Scraper "scraper/News/CNN/Scrapper"
	"time"

	"github.com/gorilla/sessions"
	"github.com/rs/cors"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

type JsonResponse struct {
	Headlines []DataStructures.Response `json:"News"`
}

var (
	store = sessions.NewCookieStore([]byte("secret-key"))
)

func main() {
	var (
		world         *DataStructures.LinkedList
		business      *DataStructures.LinkedList
		entertainment *DataStructures.LinkedList
		science       *DataStructures.LinkedList
		sports        *DataStructures.LinkedList
		health        *DataStructures.LinkedList
	)

	updateHeadlines := func() {
		world = Scraper.ImportHeadlines("div.card", "https://edition.cnn.com/world")
		business = Scraper.ImportHeadlines("div.card", "https://edition.cnn.com/business")
		entertainment = Scraper.ImportHeadlines("div.card", "https://edition.cnn.com/entertainment")
		science = Scraper.ImportHeadlines("div.card", "https://edition.cnn.com/science")
		sports = Scraper.ImportHeadlines("div.card", "https://edition.cnn.com/sport")
		health = Scraper.ImportHeadlines("div.card", "https://edition.cnn.com/health")
	}

	updateHeadlines()

	go func() {
		for {
			time.Sleep(30 * time.Minute)
			updateHeadlines()
		}
	}()

	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})
	auth.ConnectDB()
	mux := http.NewServeMux()
	mux.HandleFunc("/news/", func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("topic")
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		endUrl := q
		if r.Method == "OPTIONS" {
			return
		}
		var jsonResponse JsonResponse
		if endUrl == "world" {
			jsonResponse = JsonResponse{Headlines: DataStructures.GetResponse(world)}
		} else if endUrl == "business" {
			jsonResponse = JsonResponse{Headlines: DataStructures.GetResponse(business)}
		} else if endUrl == "entertainment" {
			jsonResponse = JsonResponse{Headlines: DataStructures.GetResponse(entertainment)}
		} else if endUrl == "science" {
			jsonResponse = JsonResponse{Headlines: DataStructures.GetResponse(science)}
		} else if endUrl == "sports" {
			jsonResponse = JsonResponse{Headlines: DataStructures.GetResponse(sports)}
		} else if endUrl == "health" {
			jsonResponse = JsonResponse{Headlines: DataStructures.GetResponse(health)}
		} else {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("404 page not found"))
			return
		}
		json.NewEncoder(w).Encode(jsonResponse)
	})
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		auth.LoginHandler(w, r, store)
	})
	mux.HandleFunc("/checklogin", func(w http.ResponseWriter, r *http.Request) {
		auth.CheckSessionExists(w, r, store)
	})
	mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		auth.LogoutHandler(w, r, store)
	})
	mux.HandleFunc("/signup", func(w http.ResponseWriter, r *http.Request) {
		auth.SignUphandler(w, r)
	})
	mux.HandleFunc("/changeusername", func(w http.ResponseWriter, r *http.Request) {
		auth.ChangeUsernameHandler(w, r, store)
	})
	mux.HandleFunc("/changepassword", func(w http.ResponseWriter, r *http.Request) {
		auth.ChangePasswordHandler(w, r, store)
	})
	mux.HandleFunc("/interest", func(w http.ResponseWriter, r *http.Request) {
		interest.InterestManage(w, r, store)
	})
	mux.HandleFunc("/fyp", func(w http.ResponseWriter, r *http.Request) {
		fyp.Fyp(w, r, world, business, entertainment, science, sports, health, store)
	})
	mux.HandleFunc("/delete", func(w http.ResponseWriter, r *http.Request) {
		deleteaccount.Delete(w, r, store)
	})

	handler := corsHandler.Handler(mux)
	http.ListenAndServe(":8080", handler)

}

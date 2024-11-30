package main

import (
	"encoding/json"
	"net/http"
	auth "scraper/Auth"
	"scraper/DataStructures"
	headlines "scraper/News/CNN/Headlines"
	"sync"
	"time"

	"github.com/gorilla/sessions"
	"github.com/rs/cors"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

var cache = &sync.Map{}

type JsonResponse struct {
	Headlines []DataStructures.Response `json:"News"`
}
type LinksResponse struct {
	Links []DataStructures.LinksResponse `json:"Links"`
}

var (
	store = sessions.NewCookieStore([]byte("secret-key"))
)

func main() {
	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // React default port
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true, // Allow credentials (cookies)
	})
	auth.ConnectDB()
	mux := http.NewServeMux()
	mux.HandleFunc("/links", func(w http.ResponseWriter, r *http.Request) {
		Links := headlines.ImportLinks("nav li.subnav__section")
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Cache-Control", "public, max-age=1800")
		if r.Method == "OPTIONS" {
			return
		}
		if data, ok := cache.Load("links"); ok {
			json.NewEncoder(w).Encode(LinksResponse{Links: data.([]DataStructures.LinksResponse)})
			return
		}
		cache.Store("links", Links)
		json.NewEncoder(w).Encode(LinksResponse{Links: Links})
	})
	mux.HandleFunc("/news/", func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("topic")
		q2 := r.URL.Query().Get("subtopic")
		var endUrl string
		if q2 != "" {
			endUrl = q + "/" + q2
		} else {
			endUrl = q
		}
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Cache-Control", "public, max-age=1800")
		if r.Method == "OPTIONS" {
			return
		}
		if data, ok := cache.Load(q); ok {
			jsonResponse := JsonResponse{Headlines: data.([]DataStructures.Response)}
			json.NewEncoder(w).Encode(jsonResponse)
			return
		}
		news := headlines.ImportHeadlines(endUrl, "div.card")
		if len(news) == 0 {
			http.Error(w, "404 page not found", http.StatusNotFound)
			return
		}
		cache.Store(endUrl, news)
		go func() {
			<-time.After(30 * time.Minute)
			cache.Delete(endUrl)
		}()

		jsonResponse := JsonResponse{Headlines: news}
		json.NewEncoder(w).Encode(jsonResponse)
	})
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		auth.LoginHandler(w, r, store)
	})
	mux.HandleFunc("/checklogin", func(w http.ResponseWriter, r *http.Request) {
		auth.CheckSessionExists(w, r, store)
	})
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		http.Error(w, "404 page not found", http.StatusNotFound)
	})
	handler := corsHandler.Handler(mux)
	http.ListenAndServe(":8080", handler)

}

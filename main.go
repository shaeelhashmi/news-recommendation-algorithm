package main

import (
	"encoding/json"
	"log"
	"net/http"
	"scraper/DataStructures"
	headlines "scraper/News/CNN/Headlines"
	"sync"
	"time"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

var cache = &sync.Map{}

type JsonResponse struct {
	Headlines []DataStructures.Response `json:"News"`
}
type LinksResponse struct {
	Links []DataStructures.LinksResponse `json:"Links"`
}

func main() {
	http.HandleFunc("/links", func(w http.ResponseWriter, r *http.Request) {
		Links := headlines.ImportLinks("nav a.subnav__section-link")
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		json.NewEncoder(w).Encode(LinksResponse{Links: Links})
	})
	http.HandleFunc("/news/", func(w http.ResponseWriter, r *http.Request) {
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
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "404 page not found", http.StatusNotFound)
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}

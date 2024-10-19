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

var cache = &sync.Map{}

type JsonResponse struct {
	Headlines []DataStructures.Response `json:"News"`
}

func main() {
	http.HandleFunc("/news/", func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("q")
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Cache-Control", "public, max-age=1800")
		if data, ok := cache.Load(q); ok {
			json.NewEncoder(w).Encode(data)
			return

		}
		news := headlines.ImportHeadlines(q)
		cache.Store(q, news)
		go func() {
			<-time.After(30 * time.Minute)
			cache.Delete("politics")
		}()
		jsonResponse := JsonResponse{Headlines: news}

		err := json.NewEncoder(w).Encode(jsonResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

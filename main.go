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

var (
	mu sync.Mutex
)

type JsonResponse struct {
	Headlines []DataStructures.Response `json:"News"`
}

func main() {
	ticker := time.NewTicker(30 * time.Minute)
	defer ticker.Stop()
	NewsHeadlines := headlines.ImportHeadlines()
	go func() {
		for range ticker.C {
			NewsHeadlines = headlines.ImportHeadlines()
			mu.Lock()
		}
	}()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		mu.Lock()
		defer mu.Unlock()
		jsonResponse := JsonResponse{Headlines: NewsHeadlines}
		if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

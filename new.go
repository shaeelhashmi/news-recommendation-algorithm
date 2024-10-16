package main

import (
	"encoding/json"
	"log"
	"net/http"
	headlines "scraper/News/CNN"
	"sync"
	"time"
)

var (
	responses []headlines.Response
	mu        sync.Mutex
)

type JsonResponse struct {
	Headlines []headlines.Response `json:"News"`
}

func main() {
	ticker := time.NewTicker(30 * time.Minute)
	defer ticker.Stop()
	responses = append(responses, headlines.ImportHeadlines("div.container__field-links.container_lead-package__field-links div.card")...)
	go func() {
		for range ticker.C {
			var newResponses []headlines.Response
			newResponses = append(newResponses, headlines.ImportHeadlines("div.container__field-links.container_lead-package__field-links div.card")...)
			mu.Lock()
			responses = newResponses
			mu.Unlock()
		}
	}()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		jsonResponse := JsonResponse{Headlines: responses}
		if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}

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
	Headlines []headlines.Response `json:"headlines"`
}

func main() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	responses = headlines.ImportHeadlines()
	go func() {
		for range ticker.C {
			newResponses := headlines.ImportHeadlines()
			mu.Lock()
			responses = newResponses
			mu.Unlock()
		}
	}()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")              // Set the content type to application/json
		jsonResponse := JsonResponse{Headlines: responses}              // Create a JsonResponse with the scraped data
		if err := json.NewEncoder(w).Encode(jsonResponse); err != nil { // Encode the response as JSON
			http.Error(w, err.Error(), http.StatusInternalServerError) // Handle any encoding errors
			return
		}
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}

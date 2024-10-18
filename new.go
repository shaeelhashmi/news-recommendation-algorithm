package main

import (
	"encoding/json"
	"log"
	"net/http"
	DataStructures "scraper/DataStructures"
	headlines "scraper/News/CNN"
	"sync"
	"time"
)

var (
	responses *DataStructures.LinkedList
	mu        sync.Mutex
)

type JsonResponse struct {
	Headlines []DataStructures.Response `json:"News"`
}

func main() {
	ticker := time.NewTicker(30 * time.Minute)
	defer ticker.Stop()
	responses = headlines.ImportHeadlines("div.container__field-links.container_lead-package__field-links div.card")
	DataStructures.AppendList(responses, headlines.ImportHeadlines("div.zone__items.layout--wide-left-balanced-2 div.stack div.card"))
	go func() {
		for range ticker.C {
			newResponses := headlines.ImportHeadlines("div.container__field-links.container_lead-package__field-links div.card")
			DataStructures.AppendList(newResponses, headlines.ImportHeadlines("div.zone__items.layout--wide-left-balanced-2 div.stack div.card"))
			mu.Lock()
			responses = newResponses
			mu.Unlock()
		}
	}()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		data := DataStructures.GetResponse(responses)

		mu.Lock()
		defer mu.Unlock() // Ensure the mutex is unlocked after encoding
		jsonResponse := JsonResponse{Headlines: data}
		if err := json.NewEncoder(w).Encode(jsonResponse); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

package main

import (
	"encoding/json"
	"fmt"
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

func main() {
	http.HandleFunc("/news/", func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("topic")
		q2 := r.URL.Query().Get("subtopic")
		fmt.Print(q, q2)
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
			w.WriteHeader(http.StatusOK)
			return // Exit early for OPTIONS request
		}
		if data, ok := cache.Load(q); ok {
			json.NewEncoder(w).Encode(data)
			return

		}

		news := headlines.ImportHeadlines(endUrl)
		cache.Store(endUrl, news)
		go func() {
			<-time.After(30 * time.Minute)
			cache.Delete(endUrl)
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

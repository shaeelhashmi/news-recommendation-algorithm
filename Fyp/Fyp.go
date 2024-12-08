package fyp

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	auth "scraper/Auth"
	"scraper/DataStructures"
	"time"

	"github.com/gorilla/sessions"
)

type pair struct {
	weight   float64
	category string
}
type ReadData struct {
	visit       int
	latestVisit time.Time
}

type fyppage2 struct {
	Img         DataStructures.Image `json:"Img"`
	Links       string               `json:"Links"`
	Description string               `json:"Description"`
	Category    string               `json:"Category"`
}

type JsonResponse struct {
	Fyp []fyppage2 `json:"fyp"`
}

func IsEmpty(data ReadData) bool {
	if data.visit == 0 && data.latestVisit.IsZero() {
		return true
	}
	return false
}
func Read(name string, userName string, db *sql.DB, data *ReadData) bool {
	var latestVisitRaw []byte
	err := db.QueryRow("SELECT visit, latestVisit FROM "+name+" WHERE username=?", userName).Scan(&data.visit, &latestVisitRaw)
	if err != nil {
		return false
	}
	latestVisit, err := time.Parse("2006-01-02 15:04:05", string(latestVisitRaw))
	if err != nil {
		return false
	}
	data.latestVisit = latestVisit
	return true
}
func mergeSort(arr []pair) []pair {
	if len(arr) <= 1 {
		return arr
	}

	mid := len(arr) / 2
	left := mergeSort(arr[:mid])
	right := mergeSort(arr[mid:])
	return merge(left, right)
}

func merge(left, right []pair) []pair {
	result := make([]pair, 0, len(left)+len(right))
	i, j := 0, 0
	for i < len(left) && j < len(right) {
		if left[i].weight > right[j].weight {
			result = append(result, left[i])

			i++
		} else {
			result = append(result, right[j])
			j++
		}
	}

	result = append(result, left[i:]...)
	result = append(result, right[j:]...)

	return result
}
func MaxSize(world, business, entertainment, science, sports *DataStructures.LinkedList) int {
	max := DataStructures.GetLength(world)
	if DataStructures.GetLength(business) > max {
		max = DataStructures.GetLength(business)
	}
	if DataStructures.GetLength(entertainment) > max {
		max = DataStructures.GetLength(entertainment)
	}
	if DataStructures.GetLength(science) > max {
		max = DataStructures.GetLength(science)
	}
	if DataStructures.GetLength(sports) > max {
		max = DataStructures.GetLength(sports)
	}
	return max
}
func Fyp(w http.ResponseWriter, r *http.Request, world, business, entertainment, science, sports *DataStructures.LinkedList, store *sessions.CookieStore) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	auth.EnableCors(&w)
	db := auth.ConnectDB()
	auth.EnableCors(&w)
	session, err := store.Get(r, "user-session")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
	}
	if session.Values["username"] == nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
	}
	userName, ok := session.Values["username"].(string)
	if !ok || userName == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session not found"))
		return
	}
	if r.Method == "GET" {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Cache-Control", "public, max-age=1800")
		var worldData ReadData
		var businessData ReadData
		var entertainmentData ReadData
		var scienceData ReadData
		var sportsData ReadData
		if !Read("world", userName, db, &worldData) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Data not found"))
			return
		}
		if !Read("business", userName, db, &businessData) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Data not found"))
			return
		}
		if !Read("entertainment", userName, db, &entertainmentData) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Data not found"))
			return
		}
		if !Read("science", userName, db, &scienceData) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Data not found"))
			return
		}
		if !Read("sports", userName, db, &sportsData) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Data not found"))
			return
		}
		weightArray := []pair{
			{CalculateWeight(worldData), "world"},
			{CalculateWeight(businessData), "business"},
			{CalculateWeight(entertainmentData), "entertainment"},
			{CalculateWeight(scienceData), "science"},
			{CalculateWeight(sportsData), "sports"},
		}
		weightArray = mergeSort(weightArray)
		var response []DataStructures.Fyppage

		chosen := 0
		var selected []DataStructures.Fyppage
		for i := 0; i < 5; i++ {

			switch weightArray[0].category {
			case "world":
				selected = append(selected, DataStructures.ListToFyppage(world, "world")...)

			case "business":
				selected = append(selected, DataStructures.ListToFyppage(business, "business")...)

			case "entertainment":
				selected = append(selected, DataStructures.ListToFyppage(entertainment, "entertainment")...)

			case "science":
				selected = append(selected, DataStructures.ListToFyppage(science, "science")...)

			case "sports":
				selected = append(selected, DataStructures.ListToFyppage(sports, "sports")...)

			}
			chosen++
			weightArray = weightArray[1:]
			if chosen == 2 || i == 4 {
				selected = randomSort(selected)
				response = append(response, selected...)
				selected = nil
			}
		}

		if len(response) == 0 {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("No data found"))
			return
		}
		Response := []fyppage2{}
		fmt.Println(response)
		for _, item := range response {
			fmt.Println(item.Data.Img)
			Response = append(Response, fyppage2{
				Img:         item.Data.Img,
				Links:       item.Data.Links,
				Description: item.Data.Description,
				Category:    item.Category,
			})
		}
		jsonResponse := JsonResponse{Fyp: Response}
		err := json.NewEncoder(w).Encode(jsonResponse)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Method not allowed"))
		return
	}

}
func randomSort(data []DataStructures.Fyppage) []DataStructures.Fyppage {
	for i := 0; i < len(data); i++ {
		j := rand.Intn(len(data))
		data[i], data[j] = data[j], data[i]
	}
	return data
}

func CalculateWeight(data ReadData) float64 {
	daysSinceLastVisit := float64(time.Since(data.latestVisit).Hours() / 24)
	if daysSinceLastVisit < 1 {
		daysSinceLastVisit = 1
	}
	return float64(data.visit) / (0.2 * daysSinceLastVisit)
}

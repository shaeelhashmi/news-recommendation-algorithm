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

type ReadData struct {
	visit       int
	latestVisit time.Time
}
type fyppage struct {
	data     DataStructures.Response
	category string
}
type fyppage2 struct {
	Data     DataStructures.Response `json:"data"`
	Category string                  `json:"category"`
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
func MaxSize(world, business, entertainment, science, sports []DataStructures.Response) int {
	max := len(world)
	if len(business) > max {
		max = len(business)
	}
	if len(entertainment) > max {
		max = len(entertainment)
	}
	if len(science) > max {
		max = len(science)
	}
	if len(sports) > max {
		max = len(sports)
	}
	return max
}
func Fyp(w http.ResponseWriter, r *http.Request, world, business, entertainment, science, sports []DataStructures.Response, store *sessions.CookieStore) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Cache-Control", "public, max-age=1800")
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

		worldWeight := CalculateWeight(worldData)
		businessWeight := CalculateWeight(businessData)
		entertainmentWeight := CalculateWeight(entertainmentData)
		scienceWeight := CalculateWeight(scienceData)
		sportsWeight := CalculateWeight(sportsData)
		var response []fyppage
		size := MaxSize(world, business, entertainment, science, sports)
		starts := []int{0, 0, 0, 0, 0}
		for i := 0; i < size; i++ {
			currentNumber := 5
			weight := []float64{worldWeight, businessWeight, entertainmentWeight, scienceWeight, sportsWeight}
			if starts[0] >= len(world) {
				weight[0] = 0
			}
			if starts[1] >= len(business) {
				weight[1] = 0
			}
			if starts[2] >= len(entertainment) {
				weight[2] = 0
			}
			if starts[3] >= len(science) {
				weight[3] = 0
			}
			if starts[4] >= len(sports) {
				weight[4] = 0
			}
			MaxWeight := MaximumWeight(weight)
			var selected []fyppage
			if MaxWeight == worldWeight {
				weight[0] = 0
				MaxWeight = MaximumWeight(weight)
				for j := starts[0]; j < starts[0]+currentNumber && j < len(world); j++ {
					selected = append(selected, fyppage{data: world[j], category: "world"})
				}
				starts[0] += currentNumber
				currentNumber--
			}
			if MaxWeight == businessWeight {
				weight[1] = 0
				for j := starts[1]; j < starts[1]+currentNumber && j < len(business); j++ {
					selected = append(selected, fyppage{data: business[j], category: "business"})
				}
				starts[1] += currentNumber
				currentNumber--
			}
			if MaxWeight == entertainmentWeight {
				weight[2] = 0
				for j := starts[2]; j < starts[2]+currentNumber && j < len(entertainment); j++ {
					selected = append(selected, fyppage{data: entertainment[j], category: "entertainment"})
				}
				starts[2] += currentNumber
				currentNumber--
			}
			if MaxWeight == scienceWeight {
				weight[3] = 0
				for j := starts[3]; j < starts[3]+currentNumber && j < len(science); j++ {
					selected = append(selected, fyppage{data: science[j], category: "science"})

				}
				starts[3] += currentNumber
				currentNumber--
			}
			if MaxWeight == sportsWeight {
				for j := starts[4]; j < starts[4]+currentNumber && j < len(sports); j++ {
					selected = append(selected, fyppage{data: sports[j], category: "sports"})
				}
				starts[4] += currentNumber
				currentNumber--
			}
			selected = randomSort(selected)

			response = append(response, selected...)
		}

		if len(response) == 0 {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("No data found"))
			return
		}
		Response := []fyppage2{}
		fmt.Println(len(response))
		for _, item := range response {
			Response = append(Response, fyppage2{
				Data:     item.data,
				Category: item.category,
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
	}

}
func randomSort(data []fyppage) []fyppage {
	for i := 0; i < len(data); i++ {
		j := rand.Intn(len(data))
		data[i], data[j] = data[j], data[i]
	}
	return data
}
func MaximumWeight(weight []float64) float64 {
	max := weight[0]
	for i := 1; i < len(weight); i++ {
		if weight[i] > max {
			max = weight[i]
		}
	}
	return max
}
func CalculateWeight(data ReadData) float64 {
	daysSinceLastVisit := float64(time.Since(data.latestVisit).Hours() / 24)
	if daysSinceLastVisit < 1 {
		daysSinceLastVisit = 1
	}
	return float64(data.visit) / (0.2 * daysSinceLastVisit)
}

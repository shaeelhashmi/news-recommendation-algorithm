package headlines

import (
	"scraper/DataStructures"
	Scraper "scraper/News/CNN/Scrapper"
)

func ImportHeadlines(a string) []DataStructures.Response {
	var query string
	if a == "headlines" {
		query = "https://edition.cnn.com/"
	} else {
		query = "https://edition.cnn.com/" + a
	}
	responses := Scraper.ImportHeadlines("div.card", query)
	return DataStructures.GetResponse(responses)
}

// func ImportPoliticalNews() []DataStructures.Response {
// 	responses := Scraper.ImportHeadlines(" div.card", "https://edition.cnn.com/politics")
// 	return DataStructures.GetResponse(responses)
// }

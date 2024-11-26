package headlines

import (
	"scraper/DataStructures"
	Scraper "scraper/News/CNN/Scrapper"
)

func ImportHeadlines(a string, ele string) []DataStructures.Response {

	query := "https://edition.cnn.com/" + a

	responses := Scraper.ImportHeadlines(ele, query)
	return DataStructures.GetResponse(responses)
}
func ImportLinks(a string) []DataStructures.LinksResponse {
	return Scraper.ImportLinks(a)
}

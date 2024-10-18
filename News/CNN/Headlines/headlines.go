package headlines

import (
	"scraper/DataStructures"
	Scraper "scraper/News/CNN/Scrapper"
)

func ImportHeadlines() []DataStructures.Response {
	responses := Scraper.ImportHeadlines("div.stack_condensed__items div.card", "https://edition.cnn.com/")
	DataStructures.AppendList(responses, Scraper.ImportHeadlines(" div.stack div.stack__items  div.card", "https://edition.cnn.com/"))
	return DataStructures.GetResponse(responses)
}

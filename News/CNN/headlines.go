package headlines

import (
	"fmt"
	"strings"

	"github.com/gocolly/colly"
)

type Image struct {
	Src     string
	IsVideo bool
}
type Response struct {
	Img         Image
	Links       string
	Description string
}

func ImportHeadlines(element string) []Response {
	var images []Image
	var urls []string
	var descriptions []string
	var uniqueUrls = make(map[string]bool)
	collector := colly.NewCollector()
	collector.OnHTML(element, func(e *colly.HTMLElement) {
		isFound := false
		desc := e.DOM.Find("span.container__headline-text").Text()
		desc = strings.TrimSpace(desc)
		if desc != "Catch up on today’s global news" {

			url, exists := e.DOM.Find("a").Attr("href")
			if exists {
				urls = append(urls, "https://edition.cnn.com"+url)
			}
			src, exists := e.DOM.Find("img").Attr("src")
			if exists {
				images = append(images, Image{Src: src, IsVideo: false})
				isFound = true
			}
			src, exists = e.DOM.Find("video source").Attr("src")
			if exists {
				images = append(images, Image{Src: src, IsVideo: true})
				isFound = true

			}

			descriptions = append(descriptions, desc)
			if !isFound {
				images = append(images, Image{Src: "", IsVideo: false})
			}
		}

	})
	e := collector.Visit("https://edition.cnn.com/")
	if e != nil {
		fmt.Println(e)
	}
	for url := range uniqueUrls {
		urls = append(urls, url)
	}
	var response []Response
	for i := 0; i < len(images); i++ {
		response = append(response, Response{Img: images[i], Links: urls[i], Description: descriptions[i]})
	}
	return response
}

package Scraper

import (
	"fmt"
	DataStructures "scraper/DataStructures"
	"strings"

	"github.com/gocolly/colly"
)

func ImportHeadlines(element string, address string) *DataStructures.LinkedList {
	var images []DataStructures.Image
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
				images = append(images, DataStructures.Image{Src: src, IsVideo: false})
				isFound = true
			}
			src, exists = e.DOM.Find("video source").Attr("src")
			if exists {
				images = append(images, DataStructures.Image{Src: src, IsVideo: true})
				isFound = true

			}

			descriptions = append(descriptions, desc)
			if !isFound {
				images = append(images, DataStructures.Image{Src: "", IsVideo: false})
			}
		}

	})
	e := collector.Visit(address)
	if e != nil {
		fmt.Println(e)
	}
	for url := range uniqueUrls {
		urls = append(urls, url)
	}
	response := DataStructures.NewLinkedList()
	for i := 0; i < len(images); i++ {
		DataStructures.Append(response, DataStructures.Response{Img: images[i], Links: urls[i], Description: descriptions[i]})
	}
	return response
}

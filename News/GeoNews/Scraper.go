package geonews

import (
	"fmt"
	"scraper/DataStructures"
	"strings"

	"github.com/gocolly/colly"
)

func ImportHeadlines(element string, address string) *DataStructures.LinkedList {
	var images []DataStructures.Image
	var urls []string
	var descriptions []string
	collector := colly.NewCollector(
		colly.IgnoreRobotsTxt(), // Ignore robots.txt
	)
	collector.OnHTML(element, func(e *colly.HTMLElement) {
		isFound := false
		desc := e.DOM.Find("h2").Text()
		desc = strings.TrimSpace(desc)
		if desc != "" {

			url, exists := e.DOM.Find("a").Attr("href")
			if exists {
				urls = append(urls, url)
			}
			src, exists := e.DOM.Find("img").Attr("data-src")
			if exists {
				images = append(images, DataStructures.Image{Src: src, IsVideo: false})
				isFound = true
			}
			if !isFound {
				src, exists = e.DOM.Find("img").Attr("src")
				if exists {
					images = append(images, DataStructures.Image{Src: src, IsVideo: false})
					isFound = true
				}
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
	response := DataStructures.NewLinkedList()
	uniqueItems := make(map[string]*DataStructures.Node)
	order := []string{}
	for i := 0; i < len(images); i++ {
		newItem := DataStructures.Response{Img: images[i], Links: urls[i], Description: descriptions[i]}

		if existingNode, exists := uniqueItems[descriptions[i]]; exists && images[i].Src != "" {
			existingNode.Value = newItem
		} else if !exists {
			node := &DataStructures.Node{
				Value: newItem,
				Next:  nil,
			}
			uniqueItems[descriptions[i]] = node
			order = append(order, descriptions[i])
		}

	}
	collector.OnScraped(func(r *colly.Response) {
		fmt.Println("Scraping completed")
	})
	for _, key := range order {
		DataStructures.Append(response, uniqueItems[key].Value)
	}
	return response
}

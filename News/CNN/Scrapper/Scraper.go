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
	for _, key := range order {
		DataStructures.Append(response, uniqueItems[key].Value)
	}
	return response
}
func ImportLinks(element string) []DataStructures.LinksResponse {
	collector := colly.NewCollector()
	Links := make(map[string]DataStructures.LinksResponse)
	uniqueUrls := make(map[string]bool)
	var order []string
	collector.OnHTML(element, func(e *colly.HTMLElement) {

		url, exist := e.DOM.Find("a.subnav__section-link").Attr("href")
		if !exist || !ValidLink(url) {
			return
		}
		if uniqueUrls[url] {
			return
		}
		uniqueUrls[url] = true
		var subLinks []DataStructures.Links
		e.ForEach("a.subnav__subsection-link", func(_ int, el *colly.HTMLElement) {
			url := el.Attr("href")
			text := el.Text
			if !ValidLink(url) {
				return
			}
			if !validTxt(text) {
				return
			}
			subLinks = append(subLinks, DataStructures.Links{Text: strings.TrimSpace(el.Text), URL: el.Attr("href")})
		})
		text := strings.TrimSpace(e.DOM.Find("a.subnav__section-link").Text())
		if !validTxt(text) {
			return
		}
		Links[url] = DataStructures.LinksResponse{Links: DataStructures.Links{Text: text, URL: url}, SubLinks: subLinks}
		order = append(order, url)
	})
	collector.Visit("https://edition.cnn.com/")
	var answer []DataStructures.LinksResponse
	for _, key := range order {
		answer = append(answer, Links[key])
	}
	return answer
}
func ValidLink(url string) bool {
	url = strings.TrimSpace(url)
	NewUrl := strings.Split(url, "/")
	lastElement := NewUrl[len(NewUrl)-1]
	return !strings.Contains(strings.ToLower(lastElement), "cnn")
}
func validTxt(txt string) bool {
	return txt != "" && !strings.Contains(strings.ToLower(txt), "video") && !strings.Contains(strings.ToLower(txt), "live") && !strings.Contains(strings.ToLower(txt), "watch") && !strings.Contains(strings.ToLower(txt), "cnn") && !strings.Contains(strings.ToLower(txt), "tv") && !strings.Contains(strings.ToLower(txt), "listed") && !strings.Contains(strings.ToLower(txt), "edition") && !strings.Contains(strings.ToLower(txt), "Features")
}

package headlines

import (
	"fmt"

	"github.com/PuerkitoBio/goquery"
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

func ImportHeadlines() []Response {
	var images []Image
	var urls []string
	var descriptions []string
	var uniqueUrls = make(map[string]bool)
	collector := colly.NewCollector()
	collector.OnHTML("div.stack_condensed__inner div.container__field-links.container_grid-3__field-links", func(e *colly.HTMLElement) {

		e.DOM.Find("a").Each(func(_ int, el *goquery.Selection) {
			url, exists := el.Attr("href")
			if exists && len(url) > 0 {
				if len(urls) == 0 || urls[len(urls)-1] != url {
					uniqueUrls["https://edition.cnn.com"+url] = true
				}
			}
			el.Find("div.image img").Each(func(_ int, img *goquery.Selection) {
				src, exists := img.Attr("src")
				if exists {
					images = append(images, Image{Src: src, IsVideo: false})
				}
			})
			el.Find("video source").Each(func(_ int, video *goquery.Selection) {
				src, exists := video.Attr("src")
				if exists {
					images = append(images, Image{Src: src, IsVideo: true})
				}

			})
			el.Find("span.container__headline-text").Each(func(_ int, description *goquery.Selection) {
				desc := description.Text()
				descriptions = append(descriptions, desc)
			})
		})
		collector.OnHTMLDetach("div.container__field-links.container_grid-3__field-links")
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

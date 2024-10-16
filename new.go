package main

import (
	"fmt"
	headlines "scraper/News/CNN"
)

func main() {
	responses := headlines.ImportHeadlines()

	for _, response := range responses {
		if response.Img.IsVideo {
			fmt.Println("Video: ", response.Img.Src)
		} else {
			fmt.Println("Image: ", response.Img.Src)
		}
		fmt.Println("Link: ", response.Links)
		fmt.Println("Description: ", response.Description)
	}
}

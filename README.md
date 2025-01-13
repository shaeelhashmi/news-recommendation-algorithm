# News Recommendation algorithm
## Summary:
This project implements a News Recommendation Algorithm in Go, combining SQL for user authentication and tracking news visit history, including categories and recency. The algorithm builds a personalized FYP by prioritizing frequently visited and recently accessed topics while maintaining diversity through randomization. Web scraping is powered by the Colly library, with caching and hash sets optimizing performance.
## Features
- News Recommendation Algorithm
  - Personalized FYP based on:
    - User's news visit history (categories and recency)
    - Randomized content diversity
- SQL for:
  - User authentication
  - Storing user visit history
- Web scraping powered by the Colly library
- React for the frontend with Tailwind CSS for styling
- Caching and hash sets for optimized performance
## Getting started:
### Prerequisites:
- MySql Database
- Golang
- Node.js
### Video demonstration:
Watch this video to see the website in action. Video link [here](https://www.linkedin.com/feed/update/urn:li:activity:7202682563788689408/)
### Installation:
* You can install the zip file of the project from [here](https://github.com/shaeelhashmi/news-recommendation-algorithm)
* If you have git installed type
```
git clone https://github.com/shaeelhashmi/news-recommendation-algorithm
```
### Execution:
Once in the news-recommendation-algorithm [set up your .env file](# Setting up .env) and then run: 
```
go run main.go
```
Then start the frontend server by typing the following commands:
```
cd my-project
```
Once in the directory install the necessary packages.
```
npm install
```
```
npm run dev
```
### Setting up .env
The env file has this format:
</br>
` DBUSER="Your database username" `
</br>
` DBPASS="Database password" `
</br>
` SESSION_KEY="A random key for creating a secure session" `

# WebScrapper
Simple Node application to scrap data off website.
Cheerio.js package is used to accomplish this
Modifications required to be done to code to apply to other websites


## Overview
1. Insert intended url at the variable url
2. run() takes in three variables:
- the url variable
- number of webpage to iterate through. PS.This application assumes that webpages could be navigated via a different number at the url endpoint.
- filename to write results to

3. scrapHTMLFromPage() targets the html element to extract. Inspect element of webpage to get the exact html tag to extract


## To run
```
$ cd WebScrapper
```
```
$ node app.js
```

## Results
Result would at root folder, with filename as passed into run()

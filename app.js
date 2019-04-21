const fs = require('fs')
const express = require('express')
const app = express()
const rp = require('request-promise')
const $ = require('cheerio')
const queryString = require('querystring')


const url = 'http://femalemag.com.my/relationships-sex/7-reasons-why-couples-hold-hands/'

app.get('/', (req, res)=>{

    // webpage is a single page webpage with 8 different url endpoints embedded
    let pages = 8

    // runs scarpHTMLFromPage which returns a promise per url
    let promises = []
    for(let i=1; i<pages+1; i++){
        promises.push(scrapHTMLFromPage(url+i))        
    }

    // once all promises are done results are written into reuslt.json
    Promise.all(promises)
    .then(data=>{
        writeToFile(data, 'result.json')
    })

})

function scrapHTMLFromPage(url){
    return rp(url)
    .then(html=>{
        // html is the entire html body of the url webpage
        const content = $('.theiaPostSlider_slides', html)

        // p is a children under content
        const p = content.find('p')

        // returns the text attribute of p
        return p.text()
    })
}

//log to local text file
function writeToFile(data, fileName){
    console.log('writing to '+fileName+'...')
    fs.writeFile(fileName, JSON.stringify(data, null, 4), function(err)
    {
        if(err){
            console.log('Error: failed to write to '+fileName)
        }else{
            console.log('Result is in '+fileName)
        }
    })
}


let port = process.env.PORT || 8888
app.listen(port, ()=>{
    console.log('Connection established')
    console.log('Go to localhost:8888')
})  
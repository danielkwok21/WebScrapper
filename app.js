const fs = require('fs')
const express = require('express')
const app = express()
const rp = require('request-promise')
const $ = require('cheerio')
const queryString = require('querystring')


const url = 'http://www.msialogistics.com/category/lr/lorry-transport'
const alphas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

app.get('/:alpha', (req, res)=>{
    const param = {
        classid: 'LL200',
        alpha: req.params.alpha
    }
    const query = queryString.stringify(param)
    let queryUrl = url+'?'+query
        
    scrapEmailFromPage(queryUrl)
        .then(result=>{
        res.send(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.get('/', (req, res)=>{
    let promises = []
    for(let i=0; i<alphas.length; i++){
        const param = {
            classid: 'LL200',
            alpha: alphas[i]
        }
        const query = queryString.stringify(param)
        let queryUrl = url+'?'+query
        promises.push(scrapEmailFromPage(queryUrl))
    }

    Promise.all(promises)
    .then(result=>{
        res.send(result)
        writeToFile(result, 'result.json')
    })
    .catch(err=>{
        console.log(err)
    })
})

let port = process.env.PORT || 8888
app.listen(port, ()=>{
    console.log('Connection established')
    console.log('Go to localhost:8888')
})  

function scrapEmailFromPage(url){
    return rp(url)
    .then(html=>{
        const table = $('#content_box > #article_box3 > div > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr td > div > a', html)
        
        const emailRegex = RegExp('email[0-9]')
        let word = []
    
        for(let i=0; i<table.length; i++){
            const id = table[i].attribs.id
            if(emailRegex.test(id)){
                if(table[i].attribs.title)
                    word.push(table[i].attribs.title)
            }
        }        
        return word
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

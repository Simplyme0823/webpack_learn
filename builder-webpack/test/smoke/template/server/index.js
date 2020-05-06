if(typeof window ==='undefined'){
    global.window = {}
}

const fs = require('fs')
const path = require('path')
//这里使用express为例
const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server');
const template = fs.readFileSync(path.join(__dirname,'../dist/search.html'),'utf-8')
const data = require('./data.json') //mock

/*
const renderMarkup = (str) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>fdsa
        <div id="root">${str}</div>
    </body>
    </html>`
}*/

//修改模板，引用客户端的serach.html
const renderMarkup = (str) => {
const dataStr = JSON.stringify(data)
    return template.replace('<!--HTML_PLACEHOLDER-->',str).replace('<!--DATA-->',`<script>window.DATA= ${dataStr}</script>`)
}

const server = (port) => {
    const app = express()
    app.use(express.static('dist'))
    app.get('/search', (req, res) => {

        //这里返回的是字符串
        //res.status(200).send(renderToString(SSR))
        res.status(200).send(renderMarkup(renderToString(SSR)))
    })
    app.listen(port, () => {
        console.log('server is running on port 3000')
    })
}

server(process.env.PORT || 3000)
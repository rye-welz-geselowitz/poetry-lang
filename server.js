const express = require('express')
const path = require('path')
const bodyParser=require('body-parser');
const app = express()
const rhyme = require('rhyme-plus');
const interpreter = require('./interpreter');

const publicPath = path.join(__dirname, './public');
const indexHtmlPath = path.join(__dirname, './index.html');

app.use(express.static(publicPath));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);
});

app.put('/interpret',function(req,res,next){
    try{
        rhyme((r)=>{
            const interpeted = interpreter.interpret(req.body.text, r);
            res.send(interpeted)
        })

    }
    catch(err){
        res.send(error)
    }
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))

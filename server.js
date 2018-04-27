const express = require('express')
const path = require('path')
const bodyParser=require('body-parser');
const app = express()
const rhyme = require('./rhyme-plus');
const interpreter = require('./interpreter');

const publicPath = path.join(__dirname, './public');
const nodeModules = path.join(__dirname, './node_modules');
const indexHtmlPath = path.join(__dirname, './index.html');

app.use(express.static(publicPath));
app.use(express.static(nodeModules));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(indexHtmlPath);
});


app.post('/interpret',function(req,res,next){
    try{
        rhyme((r)=>{
            try{
                const interpreted = interpreter.interpret(req.body.text, r);
                res.send({result: interpreted})
            }
            catch(err){
                res.send({error: err})
            }
        })
    }
    catch(err){
        console.log(err)
        res.send({error: err})
    }
})

// app.get('/dict', (req, res) => {
//     res.sendFile(path.join(__dirname, './cmudict.0.7a'));
// });

// app.get('/rhyme',(req, res) => {
//     try{
//         rhyme((r)=>{
//             console.log(r)
//             res.send(r)
//         })
//     }
//     catch(err){
//         console.log(err)
//         res.send({error: err})
//     }
// })


app.listen(3000, () => console.log('Example app listening on port 3000!'))

const express = require('express');
const jwt = require('jsonwebtoken');
var _url = 'mongodb://localhost:27017/mydb';
var url1='mongodb+srv://akash0208:akash@123@cluster0-ucifv.mongodb.net/'
var Promise = require('bluebird');
var cors = require('cors')
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    })
})



function fun(req) {

    var pop;
    return new Promise((resolve, reject) => {
        MongoClient.connect(url1, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
  var dbo = db.db("kb");
   var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

            // db.collections().toArray(function(err, result) {
            //         if (err) {

            //         reject({ 'err': err }).then().catch((err) => { console.log(err, 'e2'); });
            //     }
            //     console.log(result,'RESULT')
            //     pop = result
            //     resolve(pop);
            //     db.close();
            // })
            // var dbo = db.db('mydb');
            // dbo.collection('customers').find({}).toArray(function(err, result) {
            //     if (err) {

            //         reject({ 'err': err }).then().catch((err) => { console.log(err, 'e2'); });
            //     }
            //     pop = result
            //     resolve(pop);
            //     db.close();
            // })
        })
    })
}
app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, '14103231', { algorithm: 'HS512' }, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            console.log(authData, 'DATA');

            res.json({
                message: 'POst created ......',
                authData
            })
        }
    });

})
app.post('/api/login', async(req, res) => {
    console.log(req.body,'BODY');
    var q = await fun(req.body);
    console.log(q, 'qqqqqq');
    if (q == undefined) {
        res.status(404).send('Sorry, we cannot find User with that ID!')
    }
    const user = {
        is: q.id,
        username: q.desc,
        email: q.url
    }
    jwt.sign({ q }, '14103231', { expiresIn: '1h', algorithm: 'HS512' }, (err, token) => {
        console.log(err, 'ERRRR')
        res.json({
            token
        })
    })
})
app.post('/api/log', async(req, res) => {
    // console.log(req.body);
    var q = await fun({ id: 'all' });
    console.log(q, 'qqqqqq');
    if (q == undefined) {
        res.status(404).send('Sorry, we cannot find that!')
    }
    const user = {
        is: q.id,
        username: q.desc,
        email: q.url
    }
    jwt.sign({ q }, '14103231', { expiresIn: '1day' }, (err, token) => {
        console.log(err, 'ERRRR')
        res.json({
            token
        })
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== undefined) {
        const bearer = bearerHeader.split(' ');
        console.log(bearer, 'B');

        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}
app.listen(4000, () => {
    console.log('Server running at 4000');
})
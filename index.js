const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json())  

const port = 3000;

var USERS = [];

var QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},

{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}
];

var SUBMISSONS = [];

const SECRETKEY = 'leetcode-clone-key';

app.get('/', (req, res) => {
    res.send("Hello World!!!")
})

// Function to generate JWT token on successful login
const generateAuthToken = (email) => {
    let role = 'user'
    if (email == 'ankit@segumento.com')
        role = 'admin'

    const token = jwt.sign({ email , role}, SECRETKEY, { expiresIn: '1h' }); // Token expires in 1 hour
    return token;
}

const verifyToken = (req, res, next) => {
    if (!req.headers.authorisation) {
        res.status(401).send("Authorisation header missing.")
        return;
    }

    const token = req.headers.authorisation.split(' ')[1];

    if (!token) {
        return res.status(401).send("Authorisation token missing.")
      }

    jwt.verify(token, SECRETKEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Attach user information to the request for further processing
    req.user = decoded;
    next();
  });
}


app.post('/signup', (req, res) => {
    let params = req.body;

    if (!params || !params.email || !params.password) {
        res.status(401).send("Invalid details")
        return;
    }

    for (let user of USERS) {
        if (user.email == params.email){
            res.status(201).send(`User with email ${user.email} already exists.`)
            return;
        }
    }

    USERS.push({
        email: params.email,
        password: params.password
    });
    res.status(200).send(`User registration successfull.`)
    return;

})

app.post('/login', (req, res) => {
    let params = req.body;

    if (!params || !params.email || !params.password) {
        res.status(401).send("Invalid details")
        return;
    }

    for (let user of USERS) {
        if (user.email == params.email && user.password == params.password){
            
            res.status(200).json({
                message: "Logged in Successfully.",
                token: generateAuthToken(email)
            })
            return;
        }
    }

    res.status(401).send(`Invalid login details!!!`)
    return;

});

app.get('/questions', verifyToken, (req, res) => {
    let limit = 10;

    if (req.query && req.query.limit) {
        if(!parseInt(req.query.limit)) {
            res.status(401).send("Invalid details")
            return;
        } else{
            if (parseInt(req.query.limit) > QUESTIONS.length) {
                limit = QUESTIONS.length;
            } else {
                limit = parseInt(req.query.limit);
            }
        }
    } else {
        res.status(401).send("Invalid details")
        return;
    }
    res.status(200).json({
        message: "Successfully fetched data.",
        data : QUESTIONS.slice(0,limit)
    });
    return;
})

app.get("/submissions", (req, res) => {
    // return the users submissions for this problem
    let email = req.user? req.user.email : null;
    
    let result = [];
    for (let submission in SUBMISSONS) {

    }
   res.send("Hello World from route 4!")
 });

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
})
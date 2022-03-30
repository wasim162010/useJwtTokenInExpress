var express =  require("express");
var session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

var app = express();
app.use(session({secret: "It's a session for the login"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/sayHello',function(req, res) {

    const token = req.headers.authorization.split(' ')[1];  
    console.log(token);

    if(!token)
    {
        res.status(401).json({success:false, message: "Issue in authenticating access token"});
    }

    jwt.verify(token, 'Key1', (err, verifiedJwt) => {
        if(err){
            res.status(401).json({success:false, message: "Invalid user"});
        }else{
            res.status(200).send("hello world");
        }
      })

})


app.post('/login', function(req, res) {

    if(req.body.pwd == 'challenge_asset') {
        
        req.session.IsloggedIn = true;

        let token;
        token = jwt.sign(
            { userId: req.body.id, pwd: req.body.pwd },
            "Key1",
            { expiresIn: "1h" }
          );

          res
            .status(200)
            .json({
      success: true,
      data: {
        userId: req.body.id,
        pwd: req.body.pwd,
        token: token,
      },
    });

    }

});

app.listen(8080); 



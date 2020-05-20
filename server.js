const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

//If we are in dev/testing mode we allow our proces.env to access the secret key in .env file
if(process.env.NODE_ENV != 'production')
     require('dotenv').config();

// require('stripe') will call the library, returning a function that requies the secret key as the param
// After making this call we obtain this stripe object which allows us to call the API
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



const app = express();
const port = process.env.PORT || 5000;

//SPECIFY MIDDLEWARES TO USE

//Use bodyparser which takes all incoming requests and converts their body tag to json 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Cross site origin request middleware which allows use to specify that we can take requests from apps hosted in different origins
//In our case, we want the client app (localhost:3000) to be able to make request to the server (localhost:5000) which are different origins

// MORE ON USE: https://stackoverflow.com/questions/11321635/nodejs-express-what-is-app-use
app.use(cors());

//In production, want to be able to serve all of our files in our build
if (process.env.NODE_ENV === 'production'){
    //static let's us serve files from a specified location. 
    app.use(express.static(path.join(__dirname, 'client/build')));
    //Any GET request that the user requests from the server, we call this function.
    //In this case we specify that ANY URL the user requests (hence *) will invoke the callback function.
    app.get('*', function(req, res){
        //Send a response back to the client (serve a file)
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    });
}

console.log("STACK:" + app.stack);


app.listen(port, error =>{
    if(error) throw error;
    console.log('Server running on port ' + port);
});

// Build the /payment route to send our Stripe token to!
app.post('/payment', (req, res) => {
    /* 
        req.body contains all of the parameters passed by the forntend to here
        we create a specific body to send through the Stripe API to make a payment request
    */
    const body = {
        source: req.body.token.id,
        amount: req.body.amount,
        current: 'usd'
    };

    // Make the request to charge the payment through Stripe API
    // We use the body we created above to specify the details and a function that stripe gives us an error if there is one and a response
    stripe.charges.create(body, (stripeError, stripeRes) => {
        if(stripeError)
            res.status(500).send({error: stripeError})
        else
            res.status(200).send({success: stripeRes})
    })


});







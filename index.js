const express = require('express');
const cors = require('cors');
const port = process.env.PORT||4040;
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ha0qjez.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


//JWT verify function
const verifyJwt=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:'UnAuthorized Access'});
  }
  const token=authHeader.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN, function(err, decoded) {
    if(err){
      return res.status(403).send({message:'Forbidden Access'});
    }
    req.decoded=decoded;
     next();
  });
}


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    const userCollection = client.db("Green_DB").collection('users');
   
    //Api for upsert login data into user db
    app.put("/Tuser/:email",async(req,res)=>{
      const email=req.params.email;
      const filter={email:email};
      const options={upsert:true};
      const user=req.body;
      console.log(user);
      const updateDoc = {
        $set: user
      };
      const result= await userCollection.updateOne(filter,updateDoc,options);
      const token = jwt.sign({email:email},process.env.ACCESS_TOKEN,{ expiresIn: '7d' });
      res.send({result,token});
    });
    app.put("/Stduser/:phoneNumber",async(req,res)=>{
      const phoneNumber=req.params.phoneNumber;
      const filter={phoneNumber:phoneNumber};
      const options={upsert:true};
      const user=req.body;
      console.log(user);
      const updateDoc = {
        $set: user
      };
      const result= await userCollection.updateOne(filter,updateDoc,options);
      const token = jwt.sign({phoneNumber:phoneNumber},process.env.ACCESS_TOKEN,{ expiresIn: '7d' });
      res.send({result,token});
    });


    app.get("/get",(req,res)=>{
        res.send("MongoDB is well connected");
    })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello From GreenWay Academic Web!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
const express = require('express');
const cors = require('cors');
const app=express()
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())

// Brand-Shop
// FE8Xegc3yyoXYZOR


const uri = `mongodb+srv://${process.env.User}:${process.env.Pass}@cluster0.je93mhd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection=client.db('productDB').collection('products')
    const storedProductCollection=client.db('storedProductDB').collection('storedProducts')

    app.get('/products',async(req,res)=>{
        const cursor=productCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })
    app.get('/products/:brand',async(req,res)=>{
        const brand=req.params.brand
        const query={brand: brand}
        const cursor=productCollection.find(query)
        const result=await cursor.toArray()
        res.send(result)
    })
    app.get('/products/:brand/:id',async(req,res)=>{
       const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await productCollection.findOne(query)
        res.send(result)
    }) 
    app.get('/storedProducts',async(req,res)=>{
      const cursor=storedProductCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    }) 

    app.get('/storedProducts/:id',async(req,res)=>{
      const id=req.params.id
       const query={_id: id}
       const result=await storedProductCollection.findOne(query)
       res.send(result)
   }) 


    app.post('/products', async(req,res)=>{
        const newProduct=req.body;
        console.log(newProduct);
        const result=await productCollection.insertOne(newProduct);
        res.send(result)

    })
    app.post('/storedProducts', async(req,res)=>{
        const newProduct=req.body;
        console.log(newProduct);
        const result=await storedProductCollection.insertOne(newProduct);
        res.send(result)

    })

    app.delete('/storedProducts/:id', async(req,res)=>{
      const id=req.params.id;
      console.log(id)
      const query={_id: id}
      const result=await storedProductCollection.deleteOne(query)
      res.send(result)

    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Brand Shop is opening Soon')
})

app.listen(port,()=>{
    console.log(`Brand Shop is opening on port: ${port}`)
})
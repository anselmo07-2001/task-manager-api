const { MongoClient, ObjectId } = require("mongodb")


const connectionUrl = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

MongoClient.connect(connectionUrl, {useUnifiedTopology:  true}, (error, client) => {
    if (error) {
        return console.log("Unabled to connect to the database")
    }

    const db = client.db(databaseName)

    // Example pano maginsert ng document sa collection sa mongo db
    // db.collection("users").insertOne({
    //     name: "Kikay",
    //     age: 11
    // }, (error, result) => {
    //     if(error) {
    //         return console.log("Unable to insert user")
    //     }

    //     console.log(result.ops)
    // })

   
    // Example pano maginsert ng mga documents sa collection sa mongo db
    // db.collection("task").insertMany([
    //     {
    //         description: "Cooking the food",
    //         completed : true
    //     },
    //     {
    //         description: "wash the dog",
    //         completed : true
    //     },
    //     {
    //         description: "Sleep 8 hours",
    //         completed : false
    //     },
    // ], (error, success) => {
    //     if (error) {
    //         return console.log("Unabled to insert multiple files")
    //     }

    //     console.log("Successfully inserted multiple files")
    // })

   
    // Example pano mag read ng isang document
    // db.collection("task").findOne({ _id : ObjectId("6402e490ec1b951cd427ad12")}, (err, data) => {
    //     console.log(data)
    // })

    // Example pano mag read ng mga documents at ireturn ito sa isang array of object
    // db.collection("task").find({ completed : true}).toArray((err,data) => {
    //     console.log(data)
    // })

    //Example pano mag update ng documents,  dito hindi na naglalagay ng callback 
    //instead yung update value nlng, kapag walang nakalagay na callback, magrereturn ito ng promise
    // db.collection("task")
    //   .updateMany({ completed: false}, { $set : { completed: true}})
    //   .then((result) => {
    //     console.log(result)
    //    }).catch((err) => {
    //     console.log(err)
    //    })

    //Example pano mag delete ng documents, note, hindi na gumagamit dito ng callback, 
    // db.collection("task")
    //   .deleteOne({ _id: new ObjectId("6402e490ec1b951cd427ad12")})
    //   .then((result) => console.log(result))
    //      .catch((err) => console.log(err))
     




    console.log("Connected to MongoDB")
 
})
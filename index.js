const express = require("express")
const app = express()
app.use(express.json())

// define my in-memory database
let db = [
    {
        "id": "1",
        "title": "To Kill a Mockingbird",
        "details": [
          {
            "id": "1",
            "author": "Harper Lee",
            "genre": "Fiction",
            "publicationYear": 1960
          }
        ]
      },
      {
        "id": "2",
        "title": "Hello World",
        "details": [
          {
            "id": "1",
            "author": "Harper Lee",
            "genre": "Fiction",
            "publicationYear": 1960
          }
        ]
      },
      {
        "id": "3",
        "title": "KGadi",
        "details": [
          {
            "id": "1",
            "author": "Harper Lee",
            "genre": "Fiction",
            "publicationYear": 1960
          }
        ]
      }
];

//listening for incoming connections
const PORT = 3000;
app.listen(PORT,() =>{
    console.log("listening for connections");
});

//building my API ENDPOINTS

//get endpoints
app.get("/whoami",(request,response) =>{
    response.status(200).json({"studentNumber" : "2653945"});
});

app.get("/books",(request,response) =>{
    response.status(200).json(db);
});

app.get("/books/:id",(request,response) =>{
    db.forEach(book => {
        if(book.id === request.params.id){
            response.status(200).json({message: "the book is found",result:book});
            return;
        }
    });
    response.status(404).json({message: "404 Not Found", result:{}});
});

//post endpoints
//if data is missing return 400 bad request
app.post("/books", (request,response) =>{
    const {id,title,details} = request.body;
   
    if(id === "" || title === "" || details[0].author === "" || details[0].genre === "" || details[0].publicationYear === ""){
        response.status(400).json({"error": "Missing required book details"});
    }else{
        // let details = {
        //     id : id,
        //     author : detail[0].author,
        //     genre : detail[0].genre,
        //     publicationYear: detail[0].publicationYear
        // }
      
        let data = {
            id : id,
            title: title,
            details : [details]
        }

        db.push(data);
        response.status(200).json({message: "Success"})

    }
});

app.post("/book/:id/details", (request,response) =>{
    const {details} = request.body;

    if(details[0].author === "" || details[0].genre === "" || details[0].publicationYear === ""){
        response.status(400).json({"error": "Missing required book details"});
    }else{

        db.forEach(book => {
            if(book.id === request.params.id){
                // let detail = {
                //     id : id,
                //     author : author,
                //     genre : genre,
                //     publicationYear: publicationYear
                // }
                book[details].push(details);
                response.status(200).json({message: "Details added",result:book});
            }
        });
    }

});

//put endpoints

app.put("/books/:id", (request,response) =>{
    //i am updating the title of the book and all of the details
    db.forEach(book => {
        if(book.id === request.params.id){
            let {title,details} = request.body;
            book.title = title; // updating the title
            details[0].id = book.details[0].id; // not updating the id of the detail
            book.details[0] = details; // updating the details
            response.status(200).json({message: "the book is found and updated",result:book});
            return;
        }
    });
    response.status(404).json({message: "404 Not Found", result:{}});

});

//below all is working
//delete endpoints
app.delete("/books/:id",(request,response) =>{
    for(let i = 0 ; i < db.length; i++){
        if(db[i].id === request.params.id){
            db.splice(i,1);
            response.status(200).json({message: `Book ${request.params.id} removed`});
            return;
        }
    }
    response.status(400).json({message: `Book ${request.params.id} not found`});

});

app.delete("/books/:id/details/:detailId",(request,response) =>{
    console.log(request.params);
    
    for(let i = 0 ; i < db.length; i++){
        if(db[i].id === request.params.id){
            for(let j = 0; j < db[i].details.length; j++){
                if(db[i].details[j].id === request.params.detailId){
                    db[i].details.splice(j,1);
                    response.status(200).json({message: `detail ${request.params.detailId} removed`});
                    return;
                }
            }
            
        }
    }
    response.status(400).json({message: `detail ${request.params.detailId} not found`});

});


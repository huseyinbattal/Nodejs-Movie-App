const express = require('express');
const { modelName } = require('../models/Movie');
const router = express.Router();
//Model
const MovieModel = require('../models/Movie');

//GET ALL MOVIES : .../api/movies/ 
router.get('/', (req, res) => {
    MovieModel.find()
                    .then((movieList)=>{res.json(movieList);})
                    .catch((errorMsg)=>{res.json(errorMsg);});
})

//GET ALL MOVIES : .../api/movies/listWithDirector
router.get('/listWithDirector', (req, res) => {
    MovieModel.aggregate(
        [
            {
                $lookup:
                        {
                            from:'directors',
                            localField:'director_id',
                            foreignField:'_id',
                            as:'director'
                        }
            }
        ]
    )
                    .then((movieList)=>{res.json(movieList);})
                    .catch((errorMsg)=>{res.json(errorMsg);});
})

//GET ALL MOVIES : .../api/movies/ 
router.get('/between/:startYear/:endYear', (req, res) => {
    const {startYear,endYear} = req.params;
    //greater than or equal --- less than or equal 
    MovieModel.find({year:{"$gte":parseInt(startYear),"$lte":parseInt(endYear)}})
                    .then((movieList)=>{res.json(movieList);})
                    .catch((errorMsg)=>{res.json(errorMsg);});
})

//GET ALL MOVIES : .../api/movies/top10
router.get('/top10', (req, res) => {
    MovieModel.find().sort({imdb_score:-1}).limit(10)
                    .then((movieList)=>{res.json(movieList);})
                    .catch((errorMsg)=>{res.json(errorMsg);});
})

//GET A MOVIE : .../api/movies/:movieId 
router.get('/:movieId', (req, res,next) => {
    MovieModel.findById(req.params.movieId)
                    .then((movieList)=>{          
                        res.json(movieList);})
                    .catch((errorMsg)=>{
                        next({message:"The movie was not found.(CATCH)",code:99});
                        res.json(errorMsg);});
})

//POST
router.post('/', function (req, res) {
    /*const movie = new MovieModel({
        title : req.body.title,
        imdb_score:req.body.imdb_score,
        category:req.body.category,
        country:req.body.country,
        year:req.body.year
    })*/
    const movie = new MovieModel(req.body);
    /*movie.save((err,data)=>{
        if (err) {res.json(err);}
        res.json(data);
    });*/
    movie.save()
            .then((data)=>{res.json(data);})
            .catch((err)=>{res.json(err)});
})
//localhost:3000/api/movies/:movieId
//XXXXXX.findByIdAndUpdate("_id",req.body).YYYYYYYYYYY
router.put('/:movieId',(req,res,next)=>{
    MovieModel.findByIdAndUpdate(req.params.movieId,req.body,{new:true})
                    .then((data)=>{res.json(data)})
                    .catch((err)=>{
                        next({message:'The movie was not found.',code:99})
                        res.json(err)
                    })
})
//localhost:3000/api/movies/:movieId
router.delete('/:movieId',(req,res,next)=>{
    MovieModel.findByIdAndRemove(req.params.movieId)
                .then((data)=>{res.json({isDelete:true,deletedData:data})})
                .catch((err)=>{
                    next({message:'The movie was not found.',code:99})
                    res.json(err)
                })
})

/*
modelName.functionName(Filter,propObjs)[.SKIP-LIMIT-SORT]
            .then((resultObj)=>{res.json(resultObj)})
            .catch((resultError)=>{res.json(resultError)})
*/
module.exports = router;
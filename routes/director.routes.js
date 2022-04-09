const express = require('express')
const router = express.Router()

const DirectorModel = require('../models/Director')

router.get('/',(req,res,next)=>{
    const resultQuery=DirectorModel.aggregate([
        {
            $lookup:
                {
                    from:'movies',
                    localField:'_id',
                    foreignField:'director_id',
                    as:'movies'
                }
        },
        {
            $unwind:{
                path:'$movies',
                preserveNullAndEmptyArrays:false
            }
        },
        {
            $group:{
                _id:{
                    name:'$name',
                    surname:'$surname'
                },
                movies:{
                    $push:'$movies'
                }
            }
        },
        {
            $project:{
                _id:'$_id._id',
               name:'$_id.name',
                surname:'$_id.surname',
                'movies.title':1,
                'movies.imdb_score':true // ==1
            }
        }

    ]);                    
    
    resultQuery.then((data)=>{res.json(data);})
                    .catch((err)=>{
                        next({message:'The director was not',code:99})
                        res.json(err)});
})

const mongoose = require('mongoose')
router.get('/:directorId',(req,res,next)=>{
    const resultQuery =DirectorModel.aggregate(
        [
            {
                $match:{_id:mongoose.Types.ObjectId(req.params.directorId)}
            },
            {
                $lookup:
                    {
                        from:'movies',
                        localField:'_id',
                        foreignField:'director_id',
                        as:'movies'
                    }
            }
        ]
    );

    resultQuery.then((data)=>{res.json(data);})
                    .catch((err)=>{
                        next({message:'The director was not',code:99})
                        res.json(err)});
})


router.post('/', function (req, res,next) {
    const newDirector = new DirectorModel(req.body);
    newDirector.save()
            .then((data)=>{res.json(data);})
            .catch((err)=>{
                next({message:'The director was not',code:99})
                res.json(err)});
})

router.put('/:directorId',(req,res,next)=>{
    DirectorModel.findByIdAndUpdate(req.params.directorId,req.body,{new:true})
                    .then((data)=>{res.json(data)})
                    .catch((err)=>{
                        next({message:'The Director was not found.',code:99})
                        res.json(err)
                    })
})

router.delete('/:directorId',(req,res,next)=>{
    DirectorModel.findByIdAndRemove(req.params.directorId)
                .then((data)=>{res.json(data)})
                .catch((err)=>{
                    next({message:'The Director was not found.',code:99})
                    res.json(err)
                })
})

module.exports = router;
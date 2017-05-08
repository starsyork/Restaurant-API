import mongoose from 'mongoose';
import {Router} from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

export default({config, db}) => {
  let api = Router();

  // CRUD Create Read Update Delete

  //'/v1/foodtruck/add'
  api.post('/add', (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(err => {
      if(err) {
        res.send(err);
      }
      res.json({message: 'foodtruck saved successfully'});
    });
  });

  // '/v1/foodtruck'  - Read
  api.get('/', (req, res) => {
    FoodTruck.find({}, (err, foodtruck) =>{  //find({}) means reaturn everythings, if something in {} means return some thing specifc
      if(err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/:id'  - Read 1
  api.get('/:id',(req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // 'v1/foodtruck/:id'  -Update
  api.put('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) =>{
      if(err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;

      foodtruck.save(err => {
        if(err){
          res.send(err);
        }
        res.json({message: "FoodTruck info updated"});
      });
    });
  });

  // 'v1/foodtruck/:id'  --Delete

  api.delete('/:id',(req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    },(err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json({message: "FoodTruck Successfully Removed!"});
    });
  });

  //Add review for a specific foodtruck id
  // '/v1/foodtruck/review/add/:id'
  api.post('/reviews/add/:id', (req, res) =>{
    FoodTruck.findById(req.params.id,(err, foodtruck)=>{
      if(err){
        res.send(err);
      }

      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save((err,review) =>{
        if(err){
          res.send(err);
        }
        foodtruck.reviews.push(newReview);      //this gonna push the array of reviews to reviews in foodtruck controller
        foodtruck.save(err=>{
          if(err){
            res.send(err);
          }
          res.json({message:'FoodTruck review saved!'})
        });
      });
    });
  });

  return api
}

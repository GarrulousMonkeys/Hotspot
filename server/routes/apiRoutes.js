import Spot from '../db/Spots';
import User from '../db/Users';
import SpotsUsers from '../db/spotsUsersJoin';
import { sendBackJSON } from '../db/queryHelpers';
import {requestMultipleYelp, generateYelpNewBusParam, requestYelp} from '../yelp/yelpQuery';
import {requestYelp2} from '../yelp/yelpQuery2';
import Promise from 'bluebird';
import _ from 'lodash';

export default function(app) {
  // RETFUL API for posting current location and retrieving restaurants near the user
  app.post('/api/restaurants', (req, res) => {
    let setParameters = {
      term: 'restaurants',
      ll: `${req.body.latitude},${req.body.longitude}`,
      radius_filter: 2500,
      limit: 15
    };
    requestYelp2(setParameters)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });  
  });

  // RESTFUl API for retrieving spots from the db
  app.get('/api/spots', (req, res) => {
    let spotsReturn;
    if (!req.user) {
      req.user = {
        id: Math.random() * 1000,
        username: 'defaultUser'
      };
    }
    Spot.getAllSpots()
      .then((spots) => {
        // console.log(req);
        if (spots.length === 0) {
          spotsReturn = [];
          // return sendBackJSON(res, [], 'no spots');
          return [];
        }
        spotsReturn = spots;
        return requestMultipleYelp(spots.map((spot) => {
          return generateYelpNewBusParam(spot.name, spot.longitude, spot.latitude);
        }));
      })
      .then((yelpResults) => {
        if (yelpResults.length === 0) {
          return [];
        }
        return spotsReturn.map((spot) => {
          let match = yelpResults.filter((result) => {
            let lowerLength = Math.min([spot.length, result.length]);
            return result.name.indexOf(spot.name.slice(lowerLength)) !== -1;
          });
          if (match.length === 0) {
            spot.yelpData = {
              cuisine: null,
              image: null
            };
          } else {
            spot.yelpData = match[0];
          }
          spot.username = req.user.username;
          return spot;
        });
      })
      .then((augmentedSpots) => {
        var uniqueAugmentedSpots = [];
        var uniqueSpotIDs = [];

        var latitudes = _.map(augmentedSpots, 'latitude');
        var names = _.map(augmentedSpots, 'name');

        //create array of unique identifier for spots (latitude + name)
        var spotIDs = _.map(latitudes, (latitude, index) => {
          return latitude.toString() + names[index];
        });

        _.each(augmentedSpots, (spot) => {

          var spotCount = 0;
          var ratingSum = 0;
          var spotID = spot.latitude.toString() + spot.name;

          //check if this spot is in the unique list yet
          if (uniqueSpotIDs.indexOf(spotID) === -1) {
            uniqueSpotIDs.push(spotID);

            //compare this spot against all spots to compute average rating
            _.each(augmentedSpots, (spotCompare) => {
              if(spot.name === spotCompare.name && spot.latitude === spotCompare.latitude) {
                spotCount++;
                ratingSum += Number(spotCompare.rating);
              }
            });

            var averageRating = ratingSum / spotCount;

            spot.rating = averageRating;
            spot.username = req.user.username;

            uniqueAugmentedSpots.push(spot);
          }
        });

        sendBackJSON(res, uniqueAugmentedSpots, 'got all spots');
      })
      .catch((err) => console.log(err));
  });

  app.get('/api/spots/:id', (req, res) => {
    Spot.getOne(req.params.id)
      .then((spot) => sendBackJSON(res, spot, 'got one spot'))
      .catch((err) => console.log(err));
  });

  app.post('/api/spots', (req, res) => {
    console.log(req);
    Spot.create(req.body)
      .then((spot) => {
        return SpotsUsers.create({userid: req.user.id, username: req.user.username, spotid: spot[0].id});
      })
      .then((spotuser) => sendBackJSON(res, req.body, 'created new spot'))
      .catch((err) => {
        console.log(err);
        return sendBackJSON(res, err, 'error');
      });
  });

  app.put('/api/spots/:id', (req, res) => {
    Spot.update(req.body)
      .then((result) => sendBackJSON(res, result, 'updated a spot'))
      .catch((err) => sendBackJSON(res, err, 'error'));
  });

  app.delete('/api/spots/:id', (req, res) => {
    Spot.update(req.body)
      .then((result) => sendBackJSON(res, result, 'updated a spot'))
      .catch((err) => sendBackJSON(res, err, 'error'));
  });
}

import _ from 'lodash';
import DB from './queries';
import dbConnection from './dbConnect';
import SpotsUsers from './spotsUsersJoin';
import Promise from 'bluebird';

const spotSchema = {
  columns: {
    name: 'string',
    rating: 'number',
    latitude: 'number',
    longitude: 'number',
    yelp_id: 'string'
  },
  tableName: 'spots'
};

class Spot extends DB {
  constructor(dbConnection, schema) {
    super(dbConnection, schema);
  }

  getAllForUser(user) {
    return SpotsUsers.find({userid: user.id})
      .then((spotsUsers) => {
        return Promise.all(spotsUsers.map((spotUser) => this.find({id: spotUser.spotid})));
      })
      .then((results) => results.map((result) => result[0]))
      .catch((err) => console.log(err));
  }

  getAllSpots() {
    return this.getAll()
      .then((data) => {
        return Promise.all(data);
      })
      .catch((err) => console.log(err));
  }
}

export default new Spot(dbConnection, spotSchema);

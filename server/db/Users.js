import _ from 'lodash';
import bcrypt from 'bcrypt-nodejs';
import dbConnection from './dbConnect';
import DB from './queries';
import {createInsertQuery} from './queryHelpers';

const userSchema = {
  columns: {
    name: 'string',
    username: 'string',
    password: 'string',
    facebookId: 'number',
    facebookAccessToken: 'string'
  },
  tableName: 'users'
};

class User extends DB {
  constructor(dbConnection, userSchema) {
    super(dbConnection, userSchema);
  }

  create(obj) {
    return this.pg.query(createInsertQuery(this.schema, {
      username: obj.username,
      password: this.generateHash(obj.password)
    }));
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  isValidPassword(password, id) {
    return this.find({id: id})
    .then((user) => {
      return bcrypt.compareSync(password, user[0].password);
    })
    .catch((err) => console.log(err));
  }

  getThisUser(user) {
    return this.find({name: user.name})
      .then((data) => {
        return Promise.all(data);
      })
      .catch((err) => console.log(err));
  }

}

export default new User(dbConnection, userSchema);

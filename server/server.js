import express from 'express';
import serverConfig from './server-config';
import Spot from './db/Spots';
import User from './db/Users';
import {facebookAuthConfig} from './auth/fbAuth';
import localAuthConfig from './auth/localAuth';
import primaryRoutes from './routes/primaryRoutes';
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';


const app = express();
const port = process.env.PORT || 8732;

console.log('User', User);
// Server and auth configuration
localAuthConfig(User);
facebookAuthConfig(User);
serverConfig(app, User);

// Render the main splash page upon arrival
primaryRoutes(app);

// Wire up routes for authentication
authRoutes(app);

// RESTFUL routes for retrieving data from the database
apiRoutes(app);

// start the server
app.listen(port, () => {
  console.log('server started on port' + port);
});

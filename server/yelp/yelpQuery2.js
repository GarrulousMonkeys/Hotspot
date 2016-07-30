// Required modules to handle Yelp's oAuth requirement
import oauthSignature from 'oauth-signature';
import n from 'nonce';
import request from 'request';
import qs from 'querystring';
import _ from 'lodash';
import Promise from 'bluebird';

// Import sercet API keys (All 4 are needed)
// cant import from non existant file in deployment
// import Y from '../config-public/yelpconfig';
// import Y from '../config/yelpconfig';

const YELP_CONSUMER_KEY = process.env.YELP_CONSUMER_KEY || 0;
const YELP_CONSUMER_SECRET = process.env.YELP_CONSUMER_SECRET || 0;
const YELP_TOKEN = process.env.YELP_TOKEN || 0;
const YELP_TOKEN_SECRET = process.env.YELP_TOKEN_SECRET || 0;


// Yelp Endpoint
const endpointNewPlace = 'https://api.yelp.com/v2/search';

// Yelp call
export const requestYelp2 = function (setParameters) {
  const httpMethod = 'GET';

  const url = endpointNewPlace;

  const requiredParameters = {
    oauth_consumer_key: YELP_CONSUMER_KEY,
    oauth_token: YELP_TOKEN,
    oauth_nonce: n()(),
    oauth_timestamp: n()().toString().substr(0, 10),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0'
  };

  const parameters = _.assign(setParameters, requiredParameters);

  const consumerSecret = YELP_CONSUMER_SECRET;
  const tokenSecret = YELP_TOKEN_SECRET;

  // Call Yelp servers for a oAuth signature (only good for 300 sec)
  const signature = oauthSignature.generate(
    httpMethod,
    url,
    parameters,
    consumerSecret,
    tokenSecret,
    {encodeSignature: false}
  );

  parameters.oauth_signature = signature;

  const paramUrl = qs.stringify(parameters);

  const apiUrl = url + '?' + paramUrl;

  return new Promise((resolve, reject) => {
    request(apiUrl, function(err, res, body) {
      if (err) {
        console.log('**********************************');
        console.log('ERROR', err);
        reject(err);
      }

      const data = JSON.parse(body);
        if (data.businesses.length > 0) {
          let resolveBusinesses = data.businesses.map((business) => {
            return parseYelpData(business);
          })
          resolve(resolveBusinesses);
        } else {
          resolve();
      }
    });
  });

};

// Parse required data out of Yelp's response data
export const parseYelpData = function (business) {
  const parsed = {
    name: business.name,
    lat: business.location.coordinate.latitude, 
    long: business.location.coordinate.longitude,
    cuisine: business.categories[0][0],
    image: business.image_url,
    businessId: business.id,
    address: business.location.display_address,
    neighborhoods: business.location.neighborhoods,
    text: business.snippet_text
  };

  return parsed;
};

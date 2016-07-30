import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import token from '../token';

// MapBox Variables
L.mapbox.accessToken = token;
let defaultCoord = [37.771219, -122.453442]; 
let mainMap;
let restaurantPoints;
let nearbyPoints;
let pointQuery;
let currLoc;

let thumbs = {
  1: '/../components/assets/thumbdown.png',
  2: '/../components/assets/thumbdownleft.png',
  3: '/../components/assets/thumbside.png',
  4: '/../components/assets/thumbupleft.png',
  5: '/../components/assets/thumbup.png'
};
//let pin = '/../components/assets/fire.png'
let fistBump = 'http://emojipedia-us.s3.amazonaws.com/cache/2c/08/2c080d6b97f0416f9d914718b32a2478.png';
let pin = 'http://www.i2clipart.com/cliparts/1/7/3/2/clipart-location-marker-1732.png';
let waitingImage = 'http://67.media.tumblr.com/b8eaede3855fb0526843e91f46052746/tumblr_o6lfbf4eKP1ufjgb9o1_250.gif';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.actions.fetchCollection()
      .then((results) => {
        this.renderMap();
        this.getUserLocation();
      });
  }

  componentWillUpdate() {
    setTimeout(() => {
      let flag = false;

      if (restaurantPoints) { 
        mainMap.removeLayer(restaurantPoints);
        flag = true;
      }

      if (pointQuery) { 
        mainMap.removeLayer(pointQuery); 
        flag = true;
      }

      if (flag) { this.addPointsLayer() };

      if (nearbyPoints) {
        mainMap.removeLayer(nearbyPoints); 
      }

      if (this.props.PanelMode === 'nearby') {
        this.addNearbyLayer();
      }
    },0);
  }

  renderMap() {

    // Creates base map layer
    mainMap = L.mapbox.map('map-one', 'cpwalker.h2ec4f4i')
      .setView(defaultCoord, 14);

    // Creates seachbar
    let geocoderControl = L.mapbox.geocoderControl('mapbox.places', {
      autocomplete: true,
      keepOpen: true,
      proximity: true,
      container: 'geocoder-container'
    });
    geocoderControl.addTo(mainMap);

    // Handler when search term clicked
    geocoderControl.on('select', (res) => this.foundRestaurant(res) );
    
    // Call addPointLayer to plot the markers
    this.addPointsLayer();

  }

  getUserLocation() {

    currLoc = L.mapbox.featureLayer().addTo(mainMap);

    // search current location and center map to the coordinates
    navigator.geolocation.getCurrentPosition(
      (pos) => { 
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;

        let geojson = {
          type: 'Feature',
          geometry: {
              type: 'Point',
              coordinates: [lng, lat]
          },
          properties: {
            "marker-color": '#90a4ae'
          }
        }

        currLoc.setGeoJSON(geojson);
        mainMap.setView([lat, lng]);
      },
      (err) => { 
        alert('Our apologies, but it appears we are unable to find you') 
      }
    );

  }

  addPointsLayer() {
    // Creates new layer for markers
    restaurantPoints = L.mapbox.featureLayer().addTo(mainMap);

    // Handle for when layer is added
    restaurantPoints.on('layeradd', (point) => {
      let marker = point.layer;
      let content = `<div class='pop-up'><p class='pop-up-title'>${marker.feature.properties.title}</p>
                      <img class='pop-up-image' src="${marker.feature.properties.image}" alt="" />
                      <p class='pop-up-neighborhood'>Neighborhood: ${marker.feature.properties.neighborhood}</p>
                      <p class='pop-up-text'>What people think: "${marker.feature.properties.text}"</p></div>`

      // Sets the thumbs as the icon
      marker.setIcon(L.icon(marker.feature.properties.icon));

      // Sets the content to the popup in the marker
      marker.bindPopup(content);
    });

    // Grabs collection from store
    let collection = this.props.totalCollection;
    // If any filters have been selected and a filtered collection exists, send that into the map instead
    if (this.props.filteredCollection.length > 0) {
      collection = this.props.filteredCollection;
    }

    restaurantPoints.setGeoJSON(this.formatGeoJSON(collection));
  }

  formatGeoJSON(array) {
    const geoPointArray = array.map((spot) => {

      //Compute integer rating
      let ratingInt = Math.max(Math.round(spot.rating), 1);

      //let ratingImg = spot.rating === '5' ? thumbUp : thumbDown;
      let ratingImg = thumbs[ratingInt];
      let neighborhood = spot.yelpData.neighborhoods ? spot.yelpData.neighborhoods[0] : '';
      return this.geoJSONPoint(spot.longitude, spot.latitude, spot.name, ratingImg, spot.yelpData.image, spot.yelpData.text, neighborhood);
    });
    return [
      {
        type: 'FeatureCollection',
        features: geoPointArray
      }
    ];
  }

  geoJSONPoint(longitude, latitude, name, thumb, image, text, neighborhood) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      properties: {  // for styling
        title: name,
        image: image,
        text: text,
        neighborhood: neighborhood,
        icon: {
          iconUrl: thumb,
          iconSize: [35, 35],
          iconAnchor: [35, 17],
          popupAnchor: [-17, -17]
        }
      }
    };
  };

  addNearbyLayer() {

    nearbyPoints = L.mapbox.featureLayer().addTo(mainMap);

    nearbyPoints.on('layeradd', (point) => {
      let marker = point.layer;
      let content = `<div class='popup-info'><h2 class='pop-up-title'>${marker.feature.properties.title}</h2>
                      <img class='pop-up-image' src="${marker.feature.properties.image}" alt="" />
                      <p class='pop-up-neighborhood'>Neighborhood: ${marker.feature.properties.neighborhood}</p>
                      <p class='pop-up-text'>What people think: "${marker.feature.properties.text}"</p></div>`
      marker.setIcon(L.icon(marker.feature.properties.icon));
      marker.bindPopup(content);
    });

    let collection = this.props.nearby;
    let geoNearbyArr = collection.map((near) => {
      return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [near.long, near.lat]
            },
            properties: {  // for styling
              title: near.name,
              image: near.image,
              text: near.text,
              neighborhood: near.neighborhood,
              icon: {
                iconUrl: pin,
                iconSize: [35, 35],
                iconAnchor: [35, 17],
                popupAnchor: [-17, -17]
              }
            }
          };
    });
    
    nearbyPoints.setGeoJSON( [{ type: 'FeatureCollection', features: geoNearbyArr}] );
  }

  foundRestaurant(res) {
    pointQuery = L.mapbox.featureLayer().addTo(mainMap);
    
    pointQuery.on('layeradd', (point) => {
      let marker = point.layer;
      let feature = marker.feature;
      marker.setIcon(L.icon(feature.properties.icon));

      let content = `<div class='pop-up'>
                      <h4 class='pop-up-title'>${feature.properties.title}</h4>
                      <form><p class='pop-up-text'>Would you go back?</p>
                        <label> 
                          <input class='pop-up-text' type="radio" name="goBack" required=""> Definitely and absolutely!
                        </label>
                        <br />
                        <label> 
                          <input class='pop-up-text' type="radio" name="goBack"> Never ever ever.
                        </label>
                        <br />
                        <input class='pop-up-button' type="button" id="submit" value="thumbs">
                      </form>
                      </div>
                      <img class="pop-up-image" src="${feature.properties.image}" alt="" />`;

      marker.bindPopup(content);
    });

    let coordinates = res.feature.center;
    let pickedPlace = this.geoJSONPoint(coordinates[0], coordinates[1], res.feature.text, fistBump, waitingImage);

    pointQuery.setGeoJSON(pickedPlace);
    pointQuery.openPopup();

    // Add listener for submission
    document.getElementById('submit').addEventListener('click',() => {
      let radios = document.getElementsByName('goBack');

      let rating;
      radios[0].checked === true ? rating = 5 : rating = 0;
      this.props.actions.clickLocationSubmit(res.feature.text, coordinates[1], coordinates[0], rating);
      mainMap.closePopup();
    });
  };

  render() {
    return (
      <div className='map' id='map-one'></div>
    );
  }
}

// Redux Functions
function mapStateToProps(state) {
  return {
    filters: state.FilterSelectedRestaurants.filters,
    totalCollection: state.CollectionRestaurantsFilters.collection,
    filteredCollection: state.FilterSelectedRestaurants.filteredRestaurants,
    PanelMode: state.PanelMode.panelMode,
    nearby: state.Nearby.collection,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);

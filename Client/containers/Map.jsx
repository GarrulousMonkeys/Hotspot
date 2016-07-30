import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import token from '../token';

// MapBox Variables

//Ryan's access token below:
//L.mapbox.accessToken = 'pk.eyJ1IjoiY3B3YWxrZXIiLCJhIjoiOWNjQUpDVSJ9.nI3OoM0N6iIVv5GlhYBxoA';
L.mapbox.accessToken = token;

let defaultCoord = [37.784005, -122.401551]; //(Moscone Center)
//let defaultCoord = [37.8043700, -122.2708000]; //(Oakland)
let mainMap;
let restaurantPoints;
let pointQuery;
let currLoc;
//let thumbDown = 'http://emojipedia-us.s3.amazonaws.com/cache/8f/32/8f32d2d9cdc00990f5d992396be4ab5a.png';
//let thumbUp = 'http://emojipedia-us.s3.amazonaws.com/cache/79/bb/79bb8226054d3b254d3389ff8c9fe534.png';
let fistBump = 'http://emojipedia-us.s3.amazonaws.com/cache/2c/08/2c080d6b97f0416f9d914718b32a2478.png';
let waitingImage = 'http://img4.wikia.nocookie.net/__cb20140321012355/spiritedaway/images/1/1f/Totoro.gif';

let thumbs = {
  1: '/../components/assets/thumbdown.png',
  2: '/../components/assets/thumbdownleft.png',
  3: '/../components/assets/thumbside.png',
  4: '/../components/assets/thumbupleft.png',
  5: '/../components/assets/thumbup.png'
};

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
            "marker-color": '#CC0000'
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
      let content = `<div class='popup-info'><h2>${marker.feature.properties.title}</h2>
                      <img src="${marker.feature.properties.image}" alt="" />
                      <p>Neighborhood: ${marker.feature.properties.neighborhood}</p>
                      <p>What people think: "${marker.feature.properties.text}"</p></div>`

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

  foundRestaurant(res) {
    pointQuery = L.mapbox.featureLayer().addTo(mainMap);
    
    pointQuery.on('layeradd', (point) => {
      let marker = point.layer;
      let feature = marker.feature;
      marker.setIcon(L.icon(feature.properties.icon));

      let content = `<h4 class='pop-up-title'>${feature.properties.title}</h4>
                      <form>Would you go back?
                        <br />
                        <label> 
                          <input type="radio" name="goBack" required=""> Definitely and absolutely
                        </label>
                        <br />
                        <label> 
                          <input type="radio" name="goBack"> Never ever ever
                        </label>
                        <br />
                        <input type="button" id="submit" value="Thumbs!!!!">
                      </form>`;

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
    filteredCollection: state.FilterSelectedRestaurants.filteredRestaurants
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);

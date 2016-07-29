import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

// MapBox Variables
L.mapbox.accessToken = 'pk.eyJ1Ijoicm1jY2hlc24iLCJhIjoiY2lxbHkxbXFiMDA5dWZubm5mNWkwdGYwbiJ9.QC1lP-2tNymbJ5tHaMugZw';
let defaultCoord = [37.784005, -122.401551]; //(Moscone Center)
//let defaultCoord = [37.8043700, -122.2708000]; //(Oakland)
let mainMap;
let restaurantPoints;
//let thumbDown = 'http://emojipedia-us.s3.amazonaws.com/cache/8f/32/8f32d2d9cdc00990f5d992396be4ab5a.png';
//let thumbUp = 'http://emojipedia-us.s3.amazonaws.com/cache/79/bb/79bb8226054d3b254d3389ff8c9fe534.png';
let fistBump = 'http://emojipedia-us.s3.amazonaws.com/cache/2c/08/2c080d6b97f0416f9d914718b32a2478.png';
let waitingImage = 'http://img4.wikia.nocookie.net/__cb20140321012355/spiritedaway/images/1/1f/Totoro.gif';

let thumbUp = '/../component/map/assets/thumbup.png';
let thumbDown = '/../component/map/assets/thumbdown.png';
let thumbSide = '/../component/map/assets/thumbside.png';
let thumbUpLeft = '/../component/map/assets/thumbupleft.png';
let thumbDownLeft = '/../component/map/assets/thumbdownleft.png';

let thumbs = {
  1: '/../component/map/assets/thumbdown.png',
  2: '/../component/map/assets/thumbdownleft.png',
  3: '/../component/map/assets/thumbside.png',
  4: '/../component/map/assets/thumbupleft.png',
  5: '/../component/map/assets/thumbup.png'
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

  shouldComponentUpdate() {
    return restaurantPoints !== undefined;
  }

  componentWillUpdate() {
    mainMap.removeLayer(restaurantPoints);
    this.addPointsLayer();
  }

  renderMap() {
    // Creates base map layer
    mainMap = L.mapbox.map('map-one', 'mapbox.streets')
      .setView(defaultCoord, 13);

    // Creates seachbar
    let geocoderControl = L.mapbox.geocoderControl('mapbox.places', {
      autocomplete: true,
      keepOpen: true,
      proximity: true,
      container: 'geocoder-container'
    });
    geocoderControl.addTo(mainMap);

    // Handler when search term clicked
    geocoderControl.on('select', (res, mainMap) => this.foundRestaurant(res) );
    
    // Call addPointLayer to plot the markers
    this.addPointsLayer();

  }

  getUserLocation() {
    // search current location and center map to the coordinates
    navigator.geolocation.getCurrentPosition(
      (position) => { mainMap.setView([position.coords.latitude, position.coords.longitude]); },
      (err) => { alert('Our apologies, but it appears we are unable to find you') } 
    );
  }

  addPointsLayer() {
    
    // Creates new layer for markers
    restaurantPoints = L.mapbox.featureLayer().addTo(mainMap);

    // Handle for when layer is added
    restaurantPoints.on('layeradd', (point) => {
      let marker = point.layer;
      let content = `<h2>${marker.feature.properties.title}</h2>
                      <img src="${marker.feature.properties.image}" alt="" />
                      <p>Neighborhood: ${marker.feature.properties.neighborhood}</p>
                      <p>What people think: "${marker.feature.properties.text}"</p>`

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

    console.log(collection);

    restaurantPoints.setGeoJSON(this.formatGeoJSON(collection));
  }

  formatGeoJSON(array) {
    const geoPointArray = array.map((spot) => {

      //Compute integer rating
      let ratingInt = Math.max(Math.round(spot.rating), 1);

      //let ratingImg = spot.rating === '5' ? thumbUp : thumbDown;
      let ratingImg = thumbs[ratingInt];
      return this.geoJSONPoint(spot.longitude, spot.latitude, spot.name, ratingImg, spot.yelpData.image, spot.yelpData.text, spot.yelpData.neighborhoods[0]);
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
    let pointQuery = L.mapbox.featureLayer().addTo(mainMap);
    
    pointQuery.on('layeradd', (point) => {
      let marker = point.layer;
      let feature = marker.feature;
      marker.setIcon(L.icon(feature.properties.icon));

      let content = `<h2>${feature.properties.title}</h2>
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
                      </form>
                      <img src="${feature.properties.image}" alt="">`;

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
      Actions.clickLocationSubmit(res.feature.text, coordinates[1], coordinates[0], rating);
    });
  };

  render() {
    return <div className='map' id='map-one'></div>;
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

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CollectionModel from '../components/CollectionModel';
import NearbyModel from '../components/NearbyModel';
import ProfileSpotsModel from '../components/ProfileSpotsModel';
import FilterItem from '../components/FilterItem';
import * as Actions from '../actions';
import CollectionDetailModel from '../components/CollectionDetailModel';

const Menu = require('react-burger-menu').slide;

class Panel extends React.Component {

  componentDidMount() {
    this.props.actions.fetchUser();
    this.props.actions.fetchNearMe();
    this.props.actions.fetchCollection();
  }

  render() {
    let panelItems, heading;
    this.props.actions.createFilters(this.props.totalCollection, this.props.filters);

    if (this.props.panelMode === 'filter') {
      heading = <h2>categories</h2>
      panelItems = this.props.filters.map((filter) => {
        return (<FilterItem filter={filter}
                            appliedFilters={this.props.filterSelected}
                            toggleFilter={this.props.actions.toggleFilter}
                            collection={this.props.totalCollection}
                            key={filter}/>);
      });
    } else if (this.props.filteredCollection.length !== 0) {
      heading = <h2>hello, {this.props.user}</h2>
      panelItems = this.props.filteredCollection.map((restaurant) => {
        return (<CollectionModel item={restaurant} key={restaurant.name}/>);
      });
    } else if (this.props.panelMode === 'collection') {
      heading = <h2>spots</h2>
      panelItems = this.props.totalCollection.map((restaurant) => {
        return (<CollectionModel item={restaurant}
          viewCollectionItem={this.props.actions.viewCollectionItem}
          key={restaurant.name}/>);
      });
    } else if (this.props.panelMode === 'profile') {
      heading = <div><h2>hello, {this.props.user}</h2><img className='fire' src='../components/Assets/fire.png'/><h3>your spots</h3></div>
      panelItems = this.props.totalCollection.map((restaurant) => {
        return (<ProfileSpotsModel item={restaurant}
          viewCollectionItem={this.props.actions.viewCollectionItem}
          key={restaurant.name}/>);
      });
    } else if (this.props.panelMode === 'nearby') {
      heading = <h2>nearby</h2>
      panelItems = this.props.nearby.map((restaurant) => {
        return (<NearbyModel item={restaurant}
          viewCollectionItem={this.props.actions.viewCollectionItem}
          key={restaurant.name}/>);
      });
    } else {
      return (<h1></h1>);
    }
    return (
      <Menu id={ 'panel' }
            right
            noOverlay
            customBurgerIcon={ false }
            customCrossIcon={ false }
            width={ 400 }
            isOpen={ this.props.isOpen }>
        {heading}
        {panelItems}
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    totalCollection: state.CollectionRestaurantsFilters.collection,
    filters: state.FilterSelectedRestaurants.filters,
    user: state.User.User,
    nearby: state.Nearby.collection,
    filterSelected: state.FilterSelectedRestaurants.filterSelected,
    filteredCollection: state.FilterSelectedRestaurants.filteredRestaurants,
    panelMode: state.PanelMode.panelMode,
    isOpen: state.PanelMode.isOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel);

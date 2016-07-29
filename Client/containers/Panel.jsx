import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CollectionModel from '../components/CollectionModel';
import FilterItem from '../components/FilterItem';
import * as Actions from '../actions';
import CollectionDetailModel from '../components/CollectionDetailModel';

const Menu = require('react-burger-menu').slide;

class Panel extends React.Component {

  componentDidMount() {
    this.props.actions.fetchUser();
    this.props.actions.fetchCollection();
  }

  heading() {
    if (this.props.panelMode === 'filter') {
      return (<h2>categories</h2>);
    } else {
      return (<h2>hello, {this.props.user}</h2>);
    }
  }

  render() {
    let panelItems;

    this.props.actions.createFilters(this.props.totalCollection, this.props.filters);

    if (this.props.panelMode === 'filter') {
      panelItems = this.props.filters.map((filter) => {
        return (<FilterItem filter={filter}
                            appliedFilters={this.props.filterSelected}
                            toggleFilter={this.props.actions.toggleFilter}
                            collection={this.props.totalCollection}
                            key={filter}/>);
      });
    } else if (this.props.filteredCollection.length !== 0) {
      panelItems = this.props.filteredCollection.map((restaurant) => {
        return (<CollectionModel item={restaurant} key={restaurant.name}/>);
      });
    } else {
      panelItems = this.props.totalCollection.map((restaurant) => {
        return (<CollectionModel item={restaurant}
          viewCollectionItem={this.props.actions.viewCollectionItem}
          key={restaurant.name}/>);
      });
    }
    return (
      <Menu id={ 'panel' }
            right
            noOverlay
            customBurgerIcon={ false }
            customCrossIcon={ false }
            width={ 400 }
            isOpen={ this.props.isOpen }>
        {this.heading()}
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

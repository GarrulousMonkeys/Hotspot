import React from 'react';
import { connect } from 'react-redux';
import CollectionModel from '../components/CollectionModel';
var Menu = require('react-burger-menu').push;

class Panel extends React.Component {



  renderPanel() {
    if (this.props.PanelMode === 'collection') {
      return (
        <div className='collection'>
          {this.props.collection.map((restaurant) =>
            <CollectionModel restaurant={restaurant} />
          )}
        </div>
      );
    } else if (this.props.PanelMode === 'filter') {
      return (
        <div className='filters'>
             {this.props.filters.map((filter) =>
              <FilterItem filter={filter} appliedFilters={this.props.filterSelected} toggleFilter={this.props.actions.toggleFilter}/>
              )}        
        </div>
      );
    }
  }

  render() {
    return (
      <Menu right isOpen={this.props.PanelMode ? true : false} >
          <div className='panelBody panel'>
              {this.renderPanel()}
          </div>
        </Menu>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({toggleCollectionList, toggleFilterList}, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    collection: state.CollectionRestaurantsFilters.collection,
    filters: state.CollectionRestaurantsFilters.filterOptions,
    filterSelected: state.FilterSelectedRestaurants.filterSelected,
    filteredRestaurants: state.FilterSelectedRestaurants.filteredRestaurants,
    PanelMode: state.PanelMode
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Panel);
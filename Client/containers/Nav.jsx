import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleCollectionList, toggleFilterList, logout } from '../actions/index';

class Nav extends React.Component {

  collectionClick(e) {
    e.preventDefault();
    this.props.actions.toggleCollectionList(this.props.PanelMode, this.props.isOpen);
  }

  filterClick(e) {
    e.preventDefault();
    this.props.actions.toggleFilterList(this.props.PanelMode, this.props.isOpen);
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-inverse">
      <span className="hotspot"><a href='/'>HOTSPOT</a></span>
          <a className='btn btn-default btn-lg navbutton' href="/logout">Sign Out</a>
          <div onClick={this.filterClick.bind(this)} className='btn btn-default btn-lg navbutton'>Filter</div>
          <div onClick={this.collectionClick.bind(this)} className='btn btn-default btn-lg navbutton' >Profile</div>
      </nav>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({toggleCollectionList, toggleFilterList, logout}, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    PanelMode: state.PanelMode.panelMode,
    isOpen: state.PanelMode.isOpen
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);

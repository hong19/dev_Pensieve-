import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CosmicCorner from './component/CosmicCorner.jsx';
import CosmicMain from './component/CosmicMain.jsx';

class WithinCosmic extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_leavevonIndex = this._refer_leavevonIndex.bind(this);
    this.style={
      Within_Cosmic_: {
        width: '100%',
        height: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Cosmic_corner_: {
        width: '17%',
        height: '5%',
        position: 'fixed',
        top: '92%',
        right: '6%',
        boxSizing: 'border-box'
      }
    }
  }

  _refer_leavevonIndex(identifier, route){
    switch (route) {
      case 'user':
        window.location.assign('/user/overview');
        break;
      default:
        window.location.reload();
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Within_Cosmic_}>
        <Switch>
          <Route path={this.props.match.path} render={(props)=> <CosmicMain {...props} _refer_leavevonIndex={this._refer_leavevonIndex}/>}/>
        </Switch>
        <div
          style={this.style.Within_Cosmic_corner_}>
          <CosmicCorner
            match={this.props.match}
            _refer_leavevonIndex={this._refer_leavevonIndex}/>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(WithinCosmic));

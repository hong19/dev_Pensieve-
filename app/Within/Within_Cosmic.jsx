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
import CosmicUser from './component/CosmicUser.jsx';
import CosmicNoun from './component/CosmicNoun.jsx';
import CosmicRelated from './component/CosmicRelated.jsx';

class WithinCosmic extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchTo: null
    };
    this._refer_von_cosmic = this._refer_von_cosmic.bind(this);
    this.style={
      Within_Cosmic_: {
        width: '100%',
        height: '100%',
        position: 'static',
        overflow: 'auto'
      },
      Within_Cosmic_corner_: {
        position: 'fixed',
        bottom: '3%',
        right: '9%',
        boxSizing: 'border-box'
      }
    }
  }

  _refer_von_cosmic(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          this.setState((prevState, props)=>{
            let switchTo = {
              params: '/cosmic/people/'+identifier,
              query: ''
            };
            return {switchTo: switchTo}
          })
        }
        break;
      case 'noun':
        this.setState((prevState, props)=>{
          let switchTo = {
            params: '/cosmic/nouns/'+identifier,
            query: ''
          };
          return {switchTo: switchTo}
        })
        break;
      default:
        return
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Within_Cosmic_}>
        <Switch>
          <Route path={this.props.match.path+"/people/:id"} render={(props)=> <CosmicUser {...props}/>}/>
          <Route path={this.props.match.path+"/nouns/:id"} render={(props)=> <CosmicNoun {...props}/>}/>
          <Route path={this.props.match.path+"/units/:id/related"} render={(props)=> <CosmicRelated {...props}/>}/>
          <Route path={this.props.match.path} render={(props)=> <CosmicMain {...props} _refer_von_cosmic={this._refer_von_cosmic}/>}/>
        </Switch>
        <div
          style={this.style.Within_Cosmic_corner_}>
          <CosmicCorner
            match={this.props.match}/>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(WithinCosmic));

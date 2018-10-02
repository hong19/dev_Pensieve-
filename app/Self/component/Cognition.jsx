import React from 'react';
import CogStorage from './CogStorage.jsx';
import CogMutual from './CogMutual.jsx';
import CogMove from './CogMove.jsx';

export default class Cognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_Cognition =this._render_Cognition.bind(this);
    this.style={
      selfCom_Cognition_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  _render_Cognition(){
    switch (this.props.focus) {
      case "storage":
        return (
          <CogStorage
            userBasic={this.props.userBasic}
            range={this.props.range}
            _set_Range={this.props._set_Range}
            _refer_leaveSelf={this.props._refer_leaveSelf}/>
        )
        break;
      case "mutual":
        return (
          <CogMutual
            range={this.props.range}
            _set_Range={this.props._set_Range}/>
        )
        break;
      case "move":
        return (
          <CogMove
            userBasic={this.props.userBasic}
            range={this.props.range}
            _set_Range={this.props._set_Range}
            _refer_leaveSelf={this.props._refer_leaveSelf}/>
        )
        break;
      default:
        return (
          <CogMove
            userBasic={this.props.userBasic}
            range={this.props.range}
            _set_Range={this.props._set_Range}
            _refer_leaveSelf={this.props._refer_leaveSelf}/>
        )
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Cognition_}>
        {this._render_Cognition()}
      </div>
    )
  }
}
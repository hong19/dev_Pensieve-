import React from 'react';
import cxBind from 'classnames/bind';
import LtdUnitsRaws from './LtdUnitsRaws.jsx';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class MainIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsBasicSet: {},
      rawsArr: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_Share = this._handleClick_Share.bind(this);
    this._render_LtdUnitsRaws = this._render_LtdUnitsRaws.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      withinCom_MainIndex_: {
        width: '100%',
        minHeight: '110%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_MainIndex_scroll_: {
        width: '101%',
        position: "relative"
      }
    }
  }

  _handleClick_Share(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      unitModalify: true,
      focusUnitName: event.currentTarget.getAttribute('unitname')
    })
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitName: null
    })
  }

  _render_LtdUnitsRaws(){
    let point = 0;
    let raws = [];
    while (point< this.state.unitsList.length) {
      let number = Math.floor(Math.random()*3)+1;
      if(this.state.unitsList.length-point < number){number = this.state.unitsList.length-point;};
      raws.push(
        <LtdUnitsRaws
          key={'key_LtdUnits_raw_'+point+'_'+number}
          point={point}
          number={number}
          unitsList={this.state.unitsList}
          unitsBasicSet={this.state.unitsBasicSet}
          _handleClick_Share={this._handleClick_Share}/>
      )
      point +=  number;
    };
    this.setState({rawsArr: raws});
  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/cosmic/compound/index';
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {
          self.setState((prevState, props)=>{
            let resObj = JSON.parse(res.data);
            return({
              axios: false,
              unitsList: resObj.main.unitsList,
              unitsBasicSet: resObj.main.unitsBasicSet
            });
          }, self._render_LtdUnitsRaws);
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          console.log(thrown);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
      });
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_MainIndex_}>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          {this.state.rawsArr}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit} style={{position: "fixed"}}>
              <UnitModal
                unitId={this.state.focusUnitName}
                unitInit={Object.assign(this.state.unitsBasicSet[this.state.focusUnitName], {marksify: true, initMark: "all", layer: 0})}
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
import React from 'react';
import { connect } from "react-redux";
import AuthorBlock from './AuthorBlock/AuthorBlock.jsx';
import {widthDivisionRatial} from '../../config/styleParams.js'; //dividing markglayer width, used for determineing the position
import SvgCircle from '../../Component/Svg/SvgCircle.jsx';
import SvgCurCir from '../../Component/Svg/SvgCurCir.jsx';
import OpenedMark from '../../Component/OpenedMark/OpenedMark.jsx';

class MarksAuthor extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.Com_ImgLayer=React.createRef();
    this._set_markJump = this._set_markJump.bind(this);
    this._render_SpotsorMark = this._render_SpotsorMark.bind(this);
    this._handleClick_ImgLayer_circle = this._handleClick_ImgLayer_circle.bind(this);
    this._handleClick_SpotsLayer = this._handleClick_SpotsLayer.bind(this);
    this.style = {

    };
  }

  _handleClick_ImgLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let markKey = this.props.markOpened ? (false) : (event.currentTarget.getAttribute('id'));
    this.props._set_Markvisible(markKey);
  }

  _handleClick_SpotsLayer(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_spotsVisible();
  }

  _set_markJump(direction, currentSerial){
    let markKey;
    switch (direction) {
      case 'next':
        markKey = this.props.marksData.list[(currentSerial+1)];
        this.props._set_Markvisible(markKey);
        break;
      case 'previous':
        markKey = this.props.marksData.list[(currentSerial-1)];
        this.props._set_Markvisible(markKey);
        break;
      case 'continue':
        this.props._set_layerstatus();
        break;
      default:
        return
    }
  }

  _render_SpotsorMark(){
    //already order the list by serial records when mount at Unit
    let currentSerial = this.props.marksData.list.indexOf(this.props.currentMark);

    //there are two possibility for currentSerial='-1': 'all' or not in this 'layer'
    //So it's important to check currentSerial when markOpened,
    //because we don't open anything if the id is not belong to this layer
    if(this.props.markOpened && currentSerial>(-1)){
      let markKey = this.props.currentMark;
      return (
        <OpenedMark
          {...this.props}
          currentSerial={currentSerial}
          widthDivisionRatial={widthDivisionRatial}
          notify={this.props.unitCurrent.marksInteraction[markKey].notify?true:false}
          _handleClick_ImgLayer_circle={this._handleClick_ImgLayer_circle}
          _set_markJump={this._set_markJump}>
          <AuthorBlock
            currentSerial={currentSerial}
            markKey={markKey}
            marksLength={this.props.marksData.list.length}
            markData={this.props.marksData.data[markKey]}
            _set_markJump={this._set_markJump}/>
        </OpenedMark>
      );
    }else{
      const self = this,
      imgWidth = this.props.imgWidthHeight.width,
      imgHeight = this.props.imgWidthHeight.height;
      currentSerial = currentSerial< 0? 0 : currentSerial;

      let circlesArr = self.props.marksData.list.map(function(id, index){
        const markData = self.props.marksData.data[id];
        const coordinate = {top: markData.top, left: markData.left};
        return (
          <div
            id={id}
            key={"key_Mark_Circle_"+index}
            className={'circleMarkSpotSvg'}
            style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
            onClick={self._handleClick_ImgLayer_circle}>
            <SvgCircle
              notify={self.props.unitCurrent.marksInteraction[id].notify ?true:false}
              current={(currentSerial==markData.serial)? true :false}/>
              {
                (currentSerial==markData.serial) &&
                <div
                  className={'boxMarkCurCir'}
                  style={ (coordinate.left < '15%') ? {
                    left:'70%',
                    transform: 'translate(0, -50%) scaleX(-1)'
                  }: {
                    left:'-70%'
                  }}>
                  <SvgCurCir/>
                </div>
              }
          </div>
        )
      });
      return (
        <div
          className={'boxImgPosition'}
          style={{
            width: imgWidth,
            height: imgHeight,
            right: this.props.baseHorizonRatial+'%',
            transform: 'translate('+this.props.baseHorizonRatial+'%,-50%)'}}>
            {circlesArr}
        </div>
      );
    }
  }

  render(){
    return(
      <div
        className={'boxAbsoluteFull'}
        ref={this.Com_ImgLayer}
        onClick={this._handleClick_SpotsLayer}>
        {
          this.props.spotsVisible &&
          this._render_SpotsorMark()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(MarksAuthor);

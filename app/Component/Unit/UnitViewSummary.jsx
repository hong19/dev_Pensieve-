import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {NounsExtensible} from './UnitComponent.jsx';
import ImgPreview from '../ImgPreview.jsx';
import DateConverter from '../DateConverter.jsx';
import MarksArticle from '../MarksArticle.jsx';
import SvgCreateonDialog from '../Svg/SvgCreateonDialog.jsx'
import {NameLarge} from '../AccountPlate.jsx';

const styleMiddle = {
  boxInlineRelative: {
    display: 'inline-block',
    position: 'relative',
    boxSizing:'border-box',
  },
  imgBLockPreview: {
    display: 'inline-block',
    width: '100%',
    height: '47%',
    position: 'relative',
    boxSizing: 'border-box',
    marginBottom: '4%',
    boxShadow: '0rem 0.1rem 0.5rem 0px',
    borderRadius: '0.5vw',
    overflow: 'hidden',
    cursor: 'pointer'
  },
}

class UnitSummaryNail extends React.Component {
  //assume there is a future requirement for animating to /related
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitViewSummaryNail_: {
        width: '100%',
        height: '20%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      }
    };
  }

  componentDidMount(){
    //there should be some animation to toggle between close and extend, as a refer hint
    this.props._close_modal_Unit(); //temp method, should refer to /relations after relations component was created
  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitViewSummaryNail_}>

      </div>
    )
  }
}

class UnitViewSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.marksArticle = React.createRef();
    this._set_layerstatus = this._set_layerstatus.bind(this);
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this._handleClick_UnitAction_response = this._handleClick_UnitAction_response.bind(this);
    this._handleWheel_marksArticle = (event)=>{event.stopPropagation();};
    this.style={
      Com_UnitViewSummary_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_Marksarticle: {
        width: "52%",
        height: '70%',
        position: 'absolute',
        right: '3%',
        top: '9%',
        boxSizing: 'border-box',
        paddingBottom: '3%',
        backgroundColor: 'transparent',
        overflowY: 'auto'
      },
      Com_UnitViewSummary_thumbnails_: {
        width: '14%',
        height: '44%',
        position: 'absolute',
        top: '49%',
        left: '20%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_panel_: {

      },
      Com_UnitViewSummary_nodes_: {
        position: 'absolute',
        top: '53%',
        left: '5%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_author_: {
        position: 'absolute',
        top: '21%',
        left: '6%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_panel_response_: {
        width: '18%',
        height: '16%',
        position: 'absolute',
        bottom: '4%',
        left: '33%',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      Com_UnitViewSummary_author_name: {
        display: 'inline-block',
        boxSizing: 'border-box',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      Com_UnitViewSummary_author_date: {
        color: '#e6e6e6',
      },
    };
  }

  _set_layerstatus(layer, markKey){
    let moveCount = (layer=='cover')? 0 : 100;
    let marksStatus = markKey? {marksify: true, initMark: markKey}: {marksify: false, initMark: "all"};
    this.props._set_layerstatus(true, parseInt(moveCount), marksStatus);
  }

  _handleClick_UnitAction_response(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Modalmode("response");
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
  }

  componentDidMount(){
    this.marksArticle.current.addEventListener('wheel', this._handleWheel_marksArticle, {passive: false})
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //so we could only add listener like this way to set the 'passive' manually.
    //and becuase we preventDefault in LayerScroll, the scroll will totally be ignore
    //so we need to stopPropagation if there is a scroll box in any child of LayerScroll
  }

  componentWillUnmount(){
    this.marksArticle.current.removeEventListener('wheel',this._handleWheel_marksArticle);
  }

  render(){
    //prepare beneath line for future, connecting to /related
    if(this.props.moveCount > 240) return (<UnitSummaryNail  _close_modal_Unit={this.props._close_modal_Unit}/>);

    return(
      <div
        style={this.style.Com_UnitViewSummary_}>
        <div
          style={this.style.Com_UnitViewSummary_author_}>
          <div
            style={Object.assign({}, this.style.Com_UnitViewSummary_author_date, styleMiddle.boxInlineRelative)}>
            <DateConverter
              datetime={this.props.unitCurrent.createdAt}/>
          </div>
          <div
            onClick={this._handleClick_Account}
            style={this.style.Com_UnitViewSummary_author_name}>
            <NameLarge
              firstName={this.props.unitCurrent.authorBasic.firstName}
              lastName={this.props.unitCurrent.authorBasic.lastName}/>
          </div>
        </div>
        <div
          ref={this.marksArticle}
          style={this.style.Com_UnitViewSummary_Marksarticle}>
          <MarksArticle
            layer={'cover'}
            marksObj={{list: this.props.unitCurrent.coverMarksList, data: this.props.unitCurrent.coverMarksData}}
            _set_MarkInspect={this._set_layerstatus}/>
          <MarksArticle
            layer={'beneath'}
            marksObj={{list: this.props.unitCurrent.beneathMarksList, data: this.props.unitCurrent.beneathMarksData}}
            _set_MarkInspect={this._set_layerstatus}/>
        </div>
        <div
          style={this.style.Com_UnitViewSummary_thumbnails_}>
          <div
            style={Object.assign({}, styleMiddle.imgBLockPreview)}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={this.props.unitCurrent.coverSrc}
              _handleClick_ImgPreview_preview={this._set_layerstatus}/>
          </div>
          {
            this.props.unitCurrent.beneathSrc &&
            <div
              style={Object.assign({}, styleMiddle.imgBLockPreview)}>
              <ImgPreview
                blockName={'beneath'}
                previewSrc={this.props.unitCurrent.beneathSrc}
                _handleClick_ImgPreview_preview={this._set_layerstatus}/>
            </div>
          }
        </div>
        <div
          style={this.style.Com_UnitViewSummary_nodes_}>
          <NounsExtensible
            nouns={this.props.unitCurrent.nouns}
            _handleClick_listNoun={this.props._refer_toandclose}/>
        </div>
        <div
          style={this.style.Com_UnitViewSummary_panel_}>
          <div
            style={this.style.Com_UnitViewSummary_panel_response_}
            onClick={this._handleClick_UnitAction_response}>
            <SvgCreateonDialog/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(UnitViewSummary));

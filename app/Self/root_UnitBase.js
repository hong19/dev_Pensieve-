import React from 'react';
import ReactDOM from 'react-dom';
import UnitBase from './UnitBase.jsx'

let loggedin = !!window.localStorage['token'];
if(loggedin){
  axios.get('/router/status', {
    headers: {
        'token': window.localStorage['token']
    }
  }).then(function(res){
    let resStatus = res.status;
    if(resStatus == 200 && !res.data.error){
      ReactDOM.hydrate(<UnitBase userBasic={res.data.userBasic}/>, document.getElementById("root"));
    }else{
        window.location.assign('/login')
    }
  }).catch(
      (err)=>{
          console.log('err during promise of check authorization: '+err);
          res.status(500).json({
            success: false,
            err: err
          });
      }
  )
}else{
  window.location.assign('/login')
}

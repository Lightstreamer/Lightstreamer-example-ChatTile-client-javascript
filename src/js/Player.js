/*
  Copyright 2013 Weswit s.r.l.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

define(["Subscription","./lsClient"],
    function(Subscription,lsClient) {
  
  function getRandomNum() {
    var rndP = Math.random();
    rndP *= 12;
    return Math.floor(rndP)+1;
  }
  
  var HOT_FONT_SIZE = "18px";
  var COLD_FONT_SIZE = "9px";
  
  var IMG_HEIGHT = 46;
  var IMG_WIDTH = 20;
  
  var BALL_HEIGHT = 30;
  var BALL_WIDTH = 30;
 
  
  var COLORS = ["#000000","#950000","#7F3300","#757575","#7F6A00","#4CA700","#3A6E24","#009999","#004A7F","#000ED2","#57007F","#980082"];
 
  function addTransitionEnd(obj,event) {
    try {
      obj.addEventListener("webkitTransitionEnd", event,false);
      obj.addEventListener("oTransitionEnd", event,false);
      obj.addEventListener("transitionend", event,false);
    } catch(e) {
      console.log(e);
    }
  }
  
  var Player = function(info) {
    this.nick = info.getValue("key");
    this.ua = info.getValue("usrAgnt");
    this.message = info.getValue("msg");
    
    this.div = null;
    this.sub = null;
    
    this.messageEl = null;
    this.uaEl = null;
    
    this.hotTimeout = null;
      
    this.randomNum = getRandomNum();
    this.color = COLORS[this.randomNum-1];
  };
  
  Player. prototype = {
    getColor: function() {
      return this.color;
    },
      
    makeTile: function(container,msnry) {
      
      //let's create and attach a new tile
      this.div = document.createElement('div');
      this.div.id = this.nick;
      this.div.className = "item";
      this.div.style.backgroundColor = this.getColor();
      
      var nickDiv = document.createElement('div');
      nickDiv.className = "nicks";
      nickDiv.appendChild(document.createTextNode(this.nick));
      this.div.appendChild(nickDiv);

      this.uaEl = document.createTextNode(this.ua || "-");
      var uaDiv = document.createElement('div');
      uaDiv.className = "usragent";
      uaDiv.appendChild(this.uaEl);
      this.div.appendChild(uaDiv);
      
      this.messageEl = document.createTextNode("-");
      var msgDiv = document.createElement('div');
      msgDiv.className = "msgs";
      msgDiv.appendChild(this.messageEl);
      this.divMsg = msgDiv;
      this.div.appendChild(msgDiv);
      
      this.talk(this.message||"-",true);
      
      //why do we use a fragment?
      var fragment = document.createDocumentFragment();
      fragment.appendChild(this.div);
      
      // append elements to container
      container.appendChild( fragment );
      // add and lay out newly appended elements
      msnry.appended(this.div);
      msnry.layout();
      
    },
    removeTile: function(msnry,notInMsnry) {
      if (!this.div) {
        //while morphing tile exists, so we can skip this
        return;
      }
      
      //if (!notInMsnry) {
      try {
        msnry.remove(this.div);
        msnry.layout();
      } catch(e) {
      }
      
      if (this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
      }
      
      this.div = null;
    },
    talk: function(newMsg,isFirst) {
      var newMsg = newMsg || '';
      
      if (newMsg!=this.message || isFirst) {
        
        if (this.messageEl) {
          if (newMsg == '') {
            this.messageEl.nodeValue = "-";
          } else {
            this.messageEl.nodeValue = newMsg;
          }
        }
        
        if (this.hotTimeout !== null) {
          clearTimeout(this.hotTimeout);
        }
        if (!isFirst) {
          this.divMsg.className = "msgs-hot";
          var that = this;
          this.hotTimeout = setTimeout(function(){
            that.coldStyle();
          }, 300);
        } else {
          this.divMsg.className = "msgs";
        }
        this.message = newMsg;

      }
    },
    
    updatePlayer: function(info) {
      var newUa = info.getValue("usrAgnt");
      var newMsg = info.getValue("msg");
      
      if (newUa !== null) {
        this.ua = newUa;
        if (this.uaEl) {
          this.uaEl.nodeValue = newUa;
        }
      }
      
      this.talk(newMsg);
    },
    
    coldStyle: function() {
      if (this.div) {
        this.divMsg.className = "msgs";
      }
    }
  };
  
  return Player;
  
});

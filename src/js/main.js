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

var unfilteredPlayers = document.location.search.indexOf("unfiltered") > -1;
  
require(["login","Buddies","lsClient","DisplaySwitch","Subscription","StaticGrid"], 
    function(login,Buddies,lsClient,DisplaySwitch,Subscription,StaticGrid) {
  
  var inOutSwitch = new DisplaySwitch("loginDiv","game_div");
  inOutSwitch.show("loginDiv");
  
  var container = document.querySelector('.masonry');
  var msnry = new Masonry( container, { 
    columnWidth: 284  } );
  var buddies = new Buddies(unfilteredPlayers,container,msnry,document.getElementById("iam"),document.getElementById("room_d"));
  
  var buddiesSchema = ["command", "key", "nick", "msg", "usrAgnt"];

  var subBuddies = new Subscription("COMMAND","Players_list",buddiesSchema);
  if(unfilteredPlayers) {
    subBuddies.setRequestedMaxFrequency("unfiltered");
  }
  subBuddies.setRequestedSnapshot("yes");
  subBuddies.addListener(buddies);
  
  var myNick = "";
  
  var loginHandler = {
      
      onLogin: function(newNick,changed) {
        myNick = newNick;
        inOutSwitch.show("game_div");
                
        buddies.setOwnerNick(newNick);
        document.getElementById("iam").innerHTML = "";
        document.getElementById("iam").appendChild(document.createTextNode("You are " + newNick ));
        setTimeout(function(){document.getElementById("user_msg").value = "";},100);
        
        lsClient.subscribe(subBuddies);
      },
      
      onLogout: function() {
        inOutSwitch.show("loginDiv");
        lsClient.unsubscribe(subBuddies);
        
        buddies.setOwnerNick(null);
      }
    };
    
    login.init(loginHandler.onLogin,loginHandler.onLogout);
    window.login = login;
    
  });

  var client = null;
  require(["lsClient","StatusWidget"],function(lsClient,StatusWidget) {   
  lsClient.addListener(new StatusWidget("right", "15px", true));
  
  client = lsClient;
});
  
  //###### Common to index_master.html and index.html

var lastMex = "";
function ssubmit(message) {
  if (message == lastMex) {
    return;
  }
  lastMex = message;
  var completeMex = "m|"+message;
  client.sendMessage(completeMex);
}

function clear_input() {
  document.getElementById("user_msg").value = "";
  ssubmit("");
}
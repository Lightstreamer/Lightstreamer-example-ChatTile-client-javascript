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

define(["./Player","./lsClient"],function(Player,lsClient) {
      
  var Buddies = function(unfilteredPlayers,container,msnry,meDiv,room) {
    this.unfilteredPlayers = unfilteredPlayers;
    if(this.unfilteredPlayers) {
      alert("WARNING: unfiltered players!");
    }
    this.status = null;
    
    this.meDiv = meDiv;
    this.me = null;
    
    this.container = container;
    this.msnry = msnry;
    this.room = room;
    
    this.players = {};
  };
  
  Buddies.prototype = {
    
    setOwnerNick: function(nick) {
      this.me = nick;
      if (nick!=null && this.players[nick]) {
        this.setOwnerColor();
      }
    },
    
    setOwnerColor: function() {
      this.meDiv.style.backgroundColor = this.players[this.me].getColor();
    },
    
    clearTiles: function() {
      for (var i in this.players) {
        this.players[i].removeTile(this.msnry);
      }
    },

    makeTiles: function() {
      for (var i in this.players) {
        this.players[i].makeTile(this.container,this.msnry);
      }
    },
    
    onUnsubscription: function() {     
      //do clear 
      this.clearTiles();
      
      this.players = {};
    },
      
    //subscription listener  
    onItemUpdate: function(info){
      
      if (info.getValue("command") == "ADD") {
        
        var newPlayer = new Player(info);
        var playerNick = info.getValue("key");
        this.players[playerNick] = newPlayer;
       
        if (playerNick == this.me) {
          this.setOwnerColor();
        }

        newPlayer.makeTile(this.container,this.msnry);
        
      } else if (info.getValue("command") == "DELETE") {
        var removingPlayer = this.players[info.getValue("key")];
        
        delete(this.players[info.getValue("key")]);
        removingPlayer.removeTile(this.msnry);
        return;
      } 
      
      this.players[info.getValue("key")].updatePlayer(info);
    }
  };

  return Buddies;
  
});
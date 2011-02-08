var Player = Class.create(Sprite, {
  type: "player",
  layer: "player_view",
  colliding: 0,
  radius: 35,
  prevPosition: [0, 0],
  updatePosition: function($super, position){
    // Only update the Gun Vector on substantial movements
    var newGV = [];
    newGV[0] = (this.prevPosition[0] - this.position[0] + this.vector[0]) * 0.5;
    newGV[1] = (this.prevPosition[1] - this.position[1] + this.vector[1]) * 0.5;
    this.prevPosition = [this.position[0], this.position[1]];
    if (Math.abs(newGV[0] + newGV[1]) > 0.2) {
      this.vector[0] = newGV[0];
      this.vector[1] = newGV[1];
    }
    $super();
    
    this.testCollisions($$('.enemy1'));
    this.testCollisions($$('.crystal'));
    
    if (this.colliding > 0){
      this.colliding -= 1;
      if (this.colliding <= 0){
        this.sprite.setStyle({backgroundColor: "#33A"});
      }
    }
  },
  collision: function(sprite){
    if (sprite.spriteObject.type == "enemy1"){
      (gameData.playerHealth < 0) ? gameData.playerHealth = 0 : gameData.playerHealth -= 1;
      $('lives').innerHTML = "<p>Player Health: "+ gameData.playerHealth +"</p>";
      $('lives').setStyle({"width": gameData.playerHealth * 1.7 + "px"});
      if (this.colliding <= 0){
        // initial impact code
        this.sprite.setStyle({backgroundColor: "#F52"});
        audio.play('electric');
      }
      this.colliding = 2;
    }
    else if (sprite.spriteObject.type == "crystal") {
      gameData.score += sprite.spriteObject.points;
      $('score').innerHTML = "<p>Score: " + gameData.score + "</p>";
      sprite.remove();
      audio.play('win');
    }
  }
});
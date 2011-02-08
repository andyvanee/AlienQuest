var Shot = Class.create(Sprite, {
  type: "shot",
  layer: "shot_view",
  kills: 0,
  radius: 20,
  updatePosition: function($super){
    this.position[0] = this.position[0] - this.vector[0];
    this.position[1] = this.position[1] - this.vector[1];
    $super();
    
    this.testCollisions($$('.enemy1'));
    
    // Remove Shots outside of the bounding box
    if ((this.position[0] > $(window).innerWidth) || (this.position[1] > $(window).innerHeight) ||
            (this.position[0] < 0) || (this.position[1] < 0))
    { this.sprite.remove(); }
    
  },
  collision: function(sprite){
    sprite.remove();
    gameData.score += 20;
    $('score').innerHTML = "<p>Score: " + gameData.score + "</p>";
    audio.play('grenade');
  }

});
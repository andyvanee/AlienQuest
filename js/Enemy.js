var Enemy = Class.create(Sprite, {
  position: [0,0],
  type: "enemy1",
  layer: "enemy_view",
  seeking: 0.2,
  maxSpeed: 4,
  target: [0,0],
  updatePosition: function($super){
    this.target = $$('.player').first().spriteObject.position;
    // Confine to window
    if (this.position[0] > $(window).innerWidth || this.position[0] < 0)
    {this.vector[0] = 0-this.vector[0]}
    if (this.position[1] > $(window).innerHeight || this.position[1] < 0)
    {this.vector[1] = 0-this.vector[1]}
    
    // Random Walk
    this.vector[0] = this.vector[0] + ((Math.random() - 0.5) * 0.6);
    this.vector[1] = this.vector[1] + ((Math.random() - 0.5) * 0.6);
    
    // Enemies chase player
    if (this.target[0] > this.position[0]) this.vector[0] = this.vector[0] + this.seeking;
    else this.vector[0] = this.vector[0] - this.seeking;
    if (this.target[1] > this.position[1]) this.vector[1] = this.vector[1] + this.seeking;
    else this.vector[1] = this.vector[1] - this.seeking;
    
    this.vector[0] = this.vector[0] > this.maxSpeed ? this.maxSpeed : this.vector[0];
    this.vector[1] = this.vector[1] > this.maxSpeed ? this.maxSpeed : this.vector[1];
    
    // Update position
    this.position[0] = this.position[0] + this.vector[0];
    this.position[1] = this.position[1] + this.vector[1];
    $super();
  }
});
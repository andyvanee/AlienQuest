var Sprite = Class.create({
  position: [0,0],
  vector: [0,0],
  radius: 20,
  type: "sprite",
  layer: "enemy_view",
  sprite: undefined,
  initialize: function(position, vector){
    this.position = position;
    this.vector = vector;
    this.sprite = new Element('div').addClassName(this.type).addClassName('sprite');
    this.sprite.setStyle({left: this.position[0] + "px", top: this.position[1] + "px"});
    this.sprite.spriteObject = this;
    $(this.layer).insert(this.sprite);
    // alert(this.type + ":" + this.position[0] + ":" + this.position[1]);
  },
  updatePosition: function(position){
    if (position) this.position = position;
    this.sprite.setStyle({
      left: this.position[0] + "px",
      top: this.position[1] + "px"
    });
  },
  updateVector: function(vector){
    // Do something with the vector
    this.vector = vector;
  },
  testCollisions: function(spriteArray){
    if (spriteArray.length > 0) {
      spriteArray.each(function(element){
        if (Math.abs(element.cumulativeOffset().left - this.sprite.cumulativeOffset().left) < this.radius) {
          if (Math.abs(element.cumulativeOffset().top - this.sprite.cumulativeOffset().top) < this.radius) {
            this.collision(element);
          }
        }
      }, this);
    }
  },
  collision: function(sprite){
    // Remove elements, play SFX, ...
  }
});
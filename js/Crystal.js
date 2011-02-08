var Crystal = Class.create(Sprite, {
  type: "crystal",
  layer: "crystal_view",
  points: 100,
  radius: 40,
  updatePosition: function(position){
    if (position) {
      this.position = position;
      this.sprite.setStyle({
        left: this.position[0] + "px",
        top: this.position[1] + "px"
      });
    }
  }
});
var gameData = {
  gameTime: 0,
  audioTime: 0,
  playerHealth: 100,
  playing: false,
  enemySpawnRate: 0.2,
  score: 0
}

var audio = {
  canRewind: undefined,
  play: function(soundID){
    var thisSound = $(soundID);
    // Catch unloaded sounds
    try {
      if (audio.canRewind == undefined) {
        thisSound.Rewind ? audio.canRewind = true : audio.canRewind = false;
      }
      
      if (audio.canRewind == false) {
        thisSound.Play();
      }
      else {
        thisSound.Rewind();
        thisSound.Play();
      }
    }
    catch(e) {
      setTimeout("audio.play("+soundID.toString()+")", 600);
      console.log("sound exception: " + soundID);
    }
  },
  initSound: function(event){
    if (gameData.playing) {
      $(event).Play();
    }
  }
}
document.observe('dom:loaded', function(event) {
  // Alias spacebar to dom:click
  document.observe('keyup', function(event) {
    if (event.keyCode == 32) document.fire('dom:click')
  });
  
  document.observe('mousemove', function(event){
    if (!gameData.playing) return false;
    $$('.player').each(function(element){
      element.spriteObject.position = [event.pointerX(), event.pointerY()];
    });
  });
  
  document.observe('click', function(event) {
    event.target.fire('dom:click');
  });
  
  document.observe('dom:click', function(event) {
    // Shoot a bullet
    if (!gameData.playing) return false;
    
    var shotVector = [];
    var playerVec = [$$('.player').first().spriteObject.vector[0], $$('.player').first().spriteObject.vector[1]];
    shotVector[0] = playerVec[0]
    shotVector[1] = playerVec[1];

    // If the (x + y) sum of the shot vector is too small, scale it up. 
    var shotSum = Math.abs(shotVector[0] + shotVector[1]);
    if (shotSum < 1) {
      shotVector[0] = shotVector[0] / shotSum;
      shotVector[1] = shotVector[1] / shotSum; }
    if (shotSum < 2) {
      shotVector[0] = shotVector[0] * 2;
      shotVector[1] = shotVector[1] * 2; }

    /*     shotVector[1] = vector[1];   */
    if (Math.abs(shotVector[0]) > 10) {shotVector[0] = (shotVector[0] > 0)? 10 : -10;}
    if (Math.abs(shotVector[1]) > 10) {shotVector[1] = (shotVector[1] > 0)? 10 : -10;}
    new Shot(
        [$$('.player').first().spriteObject.position[0], $$('.player').first().spriteObject.position[1] ], shotVector);
    //newShot($$('.player').first().position, shotVector);
    audio.play('clik');
  });
});

window.onload = function(){
  startScreen();
}

function startGameLoops(){
  // Start the Main Game Loop
  new PeriodicalExecuter(function(pe) {
    if (!gameData.playing) pe.stop();
    else executer();
  }, 0.026);
  
  // Start the Enemy Spawning Loop
  enemySpawn(1);
  enemySpawn(1);
  new PeriodicalExecuter(function(pe) {
    if (!gameData.playing) pe.stop();
    else enemySpawn();
  }, 0.5);
  
  // Start the Game Audio Loop
  gameAudioTick();
  new PeriodicalExecuter(function(pe) {
    if (!gameData.playing) pe.stop();
    else gameAudioTick();
  }, 3);
  
  // Start the Game Time loop
  new PeriodicalExecuter(function(pe) {
    if (!gameData.playing) pe.stop();
    else {
      gameData.gameTime +=1;
      var minutes = Math.floor(gameData.gameTime / 60);
      var seconds = gameData.gameTime - (minutes * 60);
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      $('time').innerHTML = "<p>Time: " + minutes + ":" + seconds + "</p>";
    }
  }, 1);

  // Initialize game elements
  var player = new Player([40,100], [0,0]);
  $('lives').innerHTML = "<p>Player Health: "+ gameData.playerHealth +"</p>";
  $('lives').setStyle({"width": gameData.playerHealth * 1.7 + "px"});
  $('score').innerHTML = "<p>Score: " + gameData.score + "</p>";
  newCrystalSet();
}

/*-- Main Game Loop --*/

function executer() {

  /*-- Position Updating Routines --*/
  $$('.sprite').each(function(element){
    element.spriteObject.updatePosition();
  });    

  if (gameData.playerHealth < 1) {
    gameData.playing = false;
    endCredits();
  }
  if ($$('.crystal').size() < 1) {
    gameData.playing = false;
    levelUp();
  }
}

function gameAudioTick() {
  if (gameData.audioTime == 0) {
    audio.play('bgloop');
  }
  if (gameData.audioTime == 1) {
    audio.play('longpad2');
  }
  if (gameData.audioTime == 7) {
    audio.play('longpad');
  }
  gameData.audioTime += 1;
}

function enemySpawn(chance){
  if (chance == undefined) chance = gameData.enemySpawnRate;
  if (Math.random() < chance) {
    var enemyX = Math.random() > 0.5 ? 0:$(window).innerWidth,
    enemyY = Math.random() * $(window).innerHeight;
    // alert([enemyX, enemyY]);
    new Enemy([enemyX, enemyY], [0,0]);
  }
}

function newGame(){
  $$('.dialogue').each(function(element){element.remove()});
  $$('.sprite').each(function(element){element.remove()});
  gameData.playerHealth = 100;
  gameData.score = 0;
  gameData.colliding = 0;
  gameData.gameTime = 0;
  gameData.playing = true;
  gameData.audioTime = 0;
  gameData.enemySpawnRate = 0.2;
  startGameLoops();
}

function newCrystalSet(){
  for(var i=0; i<32; i++) {
    var position = [Math.random() * $(window).innerWidth, Math.random() * $(window).innerHeight];
    new Crystal(position, [0,0]);
  }
}

var gcIndex = 0;

function levelUp(){
  var dialogue = new Element('div').addClassName('dialogue');
  $$('.enemy1').each(function(element) {element.remove()});
  $$('.shot').each(function(element) {element.remove()});
  dialogue.innerHTML = "<h1>Level Up!</h1> Recharging…";
  $('dialogue_view').insert(dialogue);
  
  // Recharge life loop
  new PeriodicalExecuter(function(pe) {
    (gameData.playerHealth < 100) ? gameData.playerHealth += 1 : gameData.playerHealth = 100;
    $('lives').innerHTML = "<p>Player Health: "+ gameData.playerHealth +"</p>";
    $('lives').setStyle({"width": gameData.playerHealth * 1.7 + "px"});
    if (gameData.playing) pe.stop();
  }, 0.1);
  
  // Pause and go..
  new PeriodicalExecuter(function(pe) {
    $$('.dialogue').each(function(element) {element.remove()});
    gameData.playing = true;
    startGameLoops();
    pe.stop();
  }, 0.8);
  gameData.enemySpawnRate += 0.05;
}

function startScreen(){
  // alert("eC called");  
  var dialogue = new Element('div').addClassName('dialogue');
  $('dialogue_view').insert(dialogue);
  $$('.dialogue')[0].innerHTML = "<h1>Alien Quest</h1><p>After years battling the aliens, humanity is low on resources.</p><p>Collect the crystals and blast the alien hordes.</p><p>[ Mouse = move ] [ Space or Click = shoot ]</p><br><button onclick='newGame()'>Start</button>";

}

function endCredits(){
  // alert("eC called");
  $('bgloop').Stop();
  $('longpad').Stop();
  $('longpad2').Stop();
  var dialogue = new Element('div').addClassName('dialogue');
  $('dialogue_view').insert(dialogue);
  gcIndex = 0;
  new PeriodicalExecuter(function(pe) {
    if (gcIndex >= gameData.strings.endCredits.length) {
      pe.stop()
      addReplayButton();
    }
    else { playGameCredits();}
  }, 0.046);

}

function playGameCredits(){
  $$('.dialogue')[0].innerHTML = $$('.dialogue')[0].innerHTML + gameData.strings.endCredits[gcIndex];
  gcIndex = gcIndex + 1;
}
function addReplayButton(){
  $$('.dialogue')[0].innerHTML = $$('.dialogue')[0].innerHTML + "<br><button onclick='newGame()'>Play Again</button>";
}




/*--------   Strings   --------*/
gameData.strings = {
  endCredits: "The alien forces have defeated you.\n\n.=======.\n| X   X |\n|       |\n| ----- |\n ======= \n\n\n".toArray()
}  
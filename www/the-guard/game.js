
/**
 * author: Sanjeev Chandel
 * email: zenista@rocketmail.com
 * website: www.kadoo.in
 * version: 1.0.0
 * date: 01-jan-2014
 * game: The Guard: No Trespassing Allowed!
 * about: Shot down the aliens evading your city.
 *		  All else failed, you are the only hope now. 
 *		  The last man standing between human civilization and alien force.
 *		  You are the Guard.
 */

var Main = {
  // common shared stuff for all stages

  // mobile or desktop (where does the user wants to play the game?)
  userWantsToPlayOn: 'mobile',
  logo: null,

  // setup background
  // same background shared by 3 stages (preload/menu/game)
  setupBackground: function(g) {
    //create background
    g.stage.backgroundColor = '#000';  
    g.add.tileSprite(0,0, g.world.width, g.world.height, 'pat01');
  },

  setupLogo: function(g,x,y, small) {
    // put the logo
    if(small===true) {
      Main.logo = g.add.image(x, y, 'logo-small');
    } else {
      Main.logo = g.add.image(x, y, 'logo');
    }

    Main.logo.anchor.setTo(0.5, 0.5);
  }
};

Main.Boot = function(game) {
  this.game = game;
};

Main.Boot.prototype = {
  preload: function() {
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setShowAll();
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVeritcally = true;
    this.scale.refresh();

    // game wide physic system 
    // i m using lightweight and traditional Arcade physics system.
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // preload common assets required for all stages
    // background patterns
    this.load.image('logo', 'assets/logo.png');
    this.load.image('pat01', 'assets/pat01.png');

    // preload progress bar texture
    this.load.image('preloaderBack', 'assets/preloaderBack.png');
    this.load.image('preloaderBar', 'assets/preloader.png');
  },

  create: function() {
    // hack to auto resize according to screen available, otherwise have to
    // manually rotate it
    // this.game.stage.enableOrientationCheck(true, false, 'orientation');
    this.state.start('preloader');
  }
}

// Preloader State
Main.Preloader = function(game) {
  this.game = game;
}

Main.Preloader.prototype = {
  setupPreloaderBar: function() {
    Main.setupLogo(this, this.world.centerX, this.world.centerY-100);
    this.preloaderBack = this.add.image(this.world.centerX, this.world.centerY+100, 'preloaderBack');
    this.preloaderBack.anchor.setTo(0.5, 0);
    this.preloaderBar = this.add.image(this.preloaderBack.x-((this.preloaderBack.width/2)-32), this.preloaderBack.y+60, 'preloaderBar');

    // setup asset pre-loader progress bar
    this.load.setPreloadSprite(this.preloaderBar);
  },

  preload: function() {
    Main.setupBackground(this);
    this.setupPreloaderBar();
   
    // load font
    // this.load.bitmapFont('ab', 'assets/fonts/ab.png', 'assets/fonts/ab.xml');

    // load other assets now
    this.load.image('logo-small', 'assets/logo-small.png');
    this.load.image('dial', 'assets/dial.png');
    this.load.image('railtracks', 'assets/railtracks.png');
    this.load.spritesheet('blast01', 'assets/blast01.png', 5, 5, 14);
    this.load.spritesheet('vehicle', 'assets/vehicleSpriteSheet.png', 500, 340, 5);
    this.load.image(  'powerUpBurger', 'assets/powerUpBurger.png');
    this.load.image(  'powerUpDrink', 'assets/powerUpDrink.png');
    this.load.spritesheet(  'player', 'assets/player2SpriteSheet.png', 264, 128, 10);
    this.load.image(        'playerGunTip', 'assets/playerGunTip.png');
    this.load.image(        'playerBullets', 'assets/playerBullets.png');
    this.load.spritesheet(  'enemies', 'assets/enemies.png', 112, 92, 2);
    this.load.image(        'enemyBullets', 'assets/enemyBullets.png');
    this.load.spritesheet(  'enemyBulletSplatters', 'assets/blastSpriteSheet.png', 20, 20, 20);

    // load audio 
    this.load.audio('background', ['assets/audio/background.mp3', 'assets/audio/background.ogg']);
    this.load.audio('playerFire', ['assets/audio/playerFire.mp3', 'assets/audio/playerFire.ogg']);
    this.load.audio('playerHit', ['assets/audio/playerHit.mp3', 'assets/audio/playerHit.ogg']);
    this.load.audio('playerShock', ['assets/audio/playerShock.mp3', 'assets/audio/playerShock.ogg']);
    this.load.audio('enemyFire', ['assets/audio/enemyFire.mp3', 'assets/audio/enemyFire.ogg']);
    this.load.audio('enemyHit', ['assets/audio/enemyHit.mp3', 'assets/audio/enemyHit.ogg']);
    this.load.audio('powerUpHit', ['assets/audio/powerUpHit.mp3', 'assets/audio/powerUpHit.ogg']);

    // pause and mute buttons
    this.load.spritesheet(  'buttons', 'assets/buttons.png', 40, 40, 18);
    this.load.spritesheet(  'menuButtonsSpriteSheet', 'assets/menuButtonsSpriteSheet.png', 250, 40, 30);
    this.load.image(  'instructions', 'assets/instructions.png');
    this.load.image(  'credits', 'assets/credits.png');
    this.load.image(  'gameOver', 'assets/gameOver.png');
  },

  create: function() {
    this.state.start('menu');   // start the main game state
  }
}

// Menu State
Main.Menu = function(game) {
  this.game = game;
}

Main.Menu.prototype = {
  create: function() {
    Main.setupBackground(this);

    var bx = this.world.centerX;
    var by = this.world.centerY;
    var bh = 50;
    var bw = 128;

    Main.setupLogo(this, bx, by-100);
    by += 120;
    // bx -= 20;

    var btnPlayOnDesktop = this.add.button( bx-bw, by + bh*0, 'menuButtonsSpriteSheet', startGameState, this, 0, 1, 2);
    var btnPlayOnMobile = this.add.button(  bx+bw, by + bh*0, 'menuButtonsSpriteSheet', startGameState, this, 3, 4, 5);
    var btnInstructions = this.add.button(  bx-bw, by + bh*1, 'menuButtonsSpriteSheet', startHelpState, this, 6, 7, 8);    
    var btnCredits = this.add.button(       bx+bw, by + bh*1, 'menuButtonsSpriteSheet', startCreditsState, this, 15, 16, 17);

    btnPlayOnDesktop.name = 'desktop';
    btnPlayOnMobile.name = 'mobile';

    btnPlayOnDesktop.anchor.setTo(0.5,0.5);
    btnPlayOnMobile.anchor.setTo(0.5, 0.5);
    btnInstructions.anchor.setTo(0.5, 0.5);
    btnCredits.anchor.setTo(0.5, 0.5);

    function startGameState(button) {
      Main.userWantsToPlayOn = button.name;    // desktop or mobile (touch)
      this.state.start('game');
    };

    function startHelpState(button) {
      this.state.start('help');
    };

    function startCreditsState(button) {
      this.state.start('credits');
    };
  }
}

// Instructions/Help State
Main.Help = function(game) {
  this.game = game;
}

Main.Help.prototype = {
  create: function() {
    Main.setupBackground(this);
    Main.setupLogo(this, this.world.centerX, this.world.centerY-230, true);
    var s = this.add.sprite(this.world.centerX, this.world.centerY-130, 'instructions');
    s.anchor.setTo(0.5, 0);
    
    var btnBackToMenu = this.add.button(
      s.x, s.y+440, 
      'menuButtonsSpriteSheet', 
      startMenuState, this, 18, 19, 20);

    btnBackToMenu.anchor.setTo(0.5, 0);

    function startMenuState(button) {
      this.game.state.start('menu');   // start the main game state
    }
  }
}

// GameOver State
Main.GameOver = function(game) {
  this.game = game;
}

Main.GameOver.prototype = {
  create: function() {
    Main.setupBackground(this);
    Main.setupLogo(this, this.world.centerX, this.world.centerY-100);
    var s = this.add.sprite(this.world.centerX, this.world.centerY+100, 'gameOver');
    s.anchor.setTo(0.5, 0);
    
    var b1 = this.add.button(s.x, s.y+340, 'menuButtonsSpriteSheet', startGameState, this, 12, 13, 14);
    var b2 = this.add.button(s.x, s.y+420, 'menuButtonsSpriteSheet', startMenuState, this, 9, 10, 11);
    b1.anchor.setTo(0.5, 0);
    b2.anchor.setTo(0.5, 0);

    function startMenuState(button) {
      this.state.start('menu');   // start the main game state
    };

    function startGameState(button) {
      this.state.start('game');   // start the main game state
    };
  }
}

// Credits State
Main.Credits = function(game) {
  this.game = game;
}

Main.Credits.prototype = {
  create: function() {
    Main.setupBackground(this);
    Main.setupLogo(this, this.world.centerX, this.world.centerY-220, true);
    var s = this.add.sprite(this.world.centerX, this.world.centerY-120, 'credits');
    s.anchor.setTo(0.5, 0);
    
    var b1 = this.add.button(s.x, s.y+380, 'menuButtonsSpriteSheet', startMenuState, this, 18, 19, 20);
    b1.anchor.setTo(0.5, 0);

    function startMenuState(button) {
      this.state.start('menu');   // start the main game state
    };
  }
}

// Main Game State
Main.Game = function(game) {
  this.game = game;
}

Main.Game.prototype = {
  // constant 
  vehicle:               null,
  player:                null,
  playerGunTip:          null,
  playerBullets:         null,
  enemyBullets:          null,
  enemies:               null,
  powerUpBurger:         null,
  powerUpDrink:          null,
  statusBar:             null,
  dialer:                null,
  levelPrefix:           'Level: ',           // String
  healthPrefix:          'Health: ',          // String
  scorePrefix:           'Score: ',           // String
  bottomLeft:            {x:0, y:0},         // bottom left corner of the game
  playerFire:            null,
  playerHit:             null,
  playerShock:           null,
  enemyFire:             null,
  enemyHit:              null,
  powerUpHit:            null,
  btnPauseGame:          null,

  // emitters
  enemyBlastEmitter:        null,
  enemyBulletBlastEmitter:  null,

  // vars
  levelCounter:           null,
  levelMaxScore:          null,
  levelAutoIncrease:      null,
  nextPowerUpAt:          null,
  poolSize:               null,
  playerBulletSpeed:      null,
  enemyBulletSpeed:       null,
  playerNextAttack:       null,
  playerAttackRate:       null,
  enemyNextFire:          null,
  enemyFireRate:          null,
  enemyBirthRate:         null,
  enemyNextBirth:         null,
  enemyWalkSpeed:         null,
  playerHealth:           null,              // Number: player health counter (100% full health)
  scoreTotal:             null,              // Number: score counter

  bootstrap: function() {
    // bootstrap initial vars for this state
    // useful to clean restart the game
    this.levelCounter =           1;
    this.levelMaxScore =          5000;
    this.levelAutoIncrease =      5000;
    this.nextPowerUpAt =          0;
    this.poolSize =               100;
    this.playerBulletSpeed =      500;
    this.enemyBulletSpeed =       200;
    this.playerNextAttack =       0;
    this.playerAttackRate =       200;
    this.enemyNextFire =          0;
    this.enemyFireRate =          2000;
    this.enemyBirthRate =         1000;
    this.enemyNextBirth =         0;
    this.enemyWalkSpeed =         120;
    this.playerHealth =           100;              
    this.scoreTotal =             0;   
  },

  preload: function() {
    // all assets have already been loaded in Main.Preloader state
    // load any assets specific to this state only if any
  }, 

  setupRailtracks: function() {
    var railtracks1, railtracks2, railtracks3;
    var railtrackWidth = 220;
    var railtrackLength = this.world.width;
    var railtrackGap = 140;

    // lay railtracks
    railtracks1 = this.add.tileSprite(railtrackWidth*-1, this.world.height - railtrackWidth*1.25, railtrackLength*2, railtrackWidth, 'railtracks');
    railtracks1.rotation = this.physics.arcade.angleToXY(railtracks1, this.world.width-railtrackWidth, railtrackWidth*-1);

    railtracks2 = this.add.tileSprite(0, this.world.height, railtrackLength*2, railtrackWidth, 'railtracks');
    railtracks2.rotation = this.physics.arcade.angleToXY(railtracks2, this.world.width+railtrackWidth,0);
  },

  startMusic: function() {
    this.music = this.add.audio('background',1,true);
    this.music.stop();
    this.music.play('',0,1,true); 
    this.sound.usingAudioTag = true;
    this.sound.usingWebAudio = true;
  },

  setupSoundfx: function() {
    // audio effects
    this.playerFire = this.add.audio('playerFire');
    this.playerHit = this.add.audio('playerHit');
    this.playerShock = this.add.audio('playerShock');
    this.enemyHit = this.add.audio('enemyHit');
    this.enemyFire = this.add.audio('enemyFire');
    this.powerUpHit = this.add.audio('powerUpHit');
  },

  setupVehicle: function() {
    this.vehicle = this.add.sprite(0, this.world.height, 'vehicle');
    this.vehicle.anchor.setTo(0.25, 0.5);
    this.vehicle.angle = -45;
    this.vehicle.animations.add('hit', [1,0,2,0], 12);
    this.vehicle.animations.add('shock', [1,0,1,0,2,0,2,0,3,0,3,0,4,0,4,0], 12, true);
    this.vehicle.frame = 0; // imp: reset default frame 
    // this.vehicle.anchor.setTo(0.1, 0.5);
    
    // this.physics.enable(this.vehicle, Phaser.Physics.ARCADE);

    // vehicle animations
  },

  setupPlayer: function() {
    // main player
    this.player = this.add.sprite(0,0, 'player', 0);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('fire', [1,2,0], 24);
    this.player.frame = 0;    // imp: reset default frame
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
  },

  setupPlayerGunTip: function() {
    // tip of the gun - useful to position the bullet before firing
    this.playerGunTip = this.add.image(0,0, 'playerGunTip', 0);
    this.playerGunTip.anchor.setTo(-158, 0.5);
  },

  setupPlayerGroup: function() {
    this.setupVehicle();
    this.setupPlayer();
    this.setupPlayerGunTip();

    this.playerGroup = this.add.group();
    // this.playerGroup.enableBody = true;
    // this.playerGroup.physicsBodyType = Phaser.Physics.ARCADE;
    // this.playerGroup.add(this.vehicle);
    this.playerGroup.add(this.player);
    this.playerGroup.add(this.playerGunTip);

    // this.playerGroup.rotation = this.physics.arcade.angleToXY(this.playerGroup, this.world.width, 0);
    // console.log('angle: ', this.physics.arcade.angleToXY(this.player, this.world.width, 0));
    this.playerGroup.x = 120;
    this.playerGroup.y = this.world.height -120;
    // this.playerGroup.reset(this.world.centerX, this.world.centerY);
  },

  setupButtons: function() {
    // pause, mute and reload buttons
    this.btnPauseGame = this.add.button(0, 0, 'buttons', this.pauseGame, this, 0, 1, 2);
    this.game.onPause.add(this.onPauseGame, this);
    this.game.onResume.add(this.onResumeGame, this);

    this.add.button(40, 0, 'buttons', this.muteGame, this, 6, 7, 8);
    this.add.button(80, 0, 'buttons', this.restartGame, this, 12, 13, 14);
  },

  setupPowerups: function() {
    // setup powerUps
    this.powerUpBurger = this.add.sprite(-100, -100, 'powerUpBurger', 0);
    this.physics.enable(this.powerUpBurger, Phaser.Physics.ARCADE);
    // this.powerUpBurger.body.immovable = true;

    this.powerUpDrink = this.add.sprite(-100, -100, 'powerUpDrink', 0);
    this.physics.enable(this.powerUpDrink, Phaser.Physics.ARCADE);
    // this.powerUpDrink.body.immovable = true;
  },

  setupStatusbar: function() {
    // create status bar font style config
    this.statusBar = this.add.text(this.world.width-10, 35, this.buildStatusBarText());
    this.statusBar.anchor.setTo(1,1);
    this.statusBar.fill = '#fff000';
    this.statusBar.fontSize = '25px';
    this.statusBar.fontWeight = 'bold';
    this.statusBar.shadow = '#666666';
  },

  setupInputControls: function() {
    // dialer control (only for mobile/touch devices)
    if(Main.userWantsToPlayOn === 'mobile') {
      // dialer cordinates 
      var dailerPoints = {
        x: this.world.width-10,
        y: this.world.height-5
      };

      this.dialer = this.add.sprite(dailerPoints.x - 50, dailerPoints.y - 50, 'dial');
      this.dialer.anchor.setTo(0.5, 0.5);
    }
  },

  setupEnemies: function() {
    // create and init enemies
    this.enemies = this.add.group();
    this.enemies.createMultiple(this.poolSize, 'enemies', 0, false);
    this.enemies.setAll('anchor.x', 0.5);
    this.enemies.setAll('anchor.y', 0.5);
    this.physics.enable(this.enemies, Phaser.Physics.ARCADE);
  },

  setupPlayerBullets: function () {
    this.playerBullets = this.add.group();
    this.playerBullets.createMultiple(this.poolSize, 'playerBullets');
    this.physics.enable(this.playerBullets, Phaser.Physics.ARCADE);
  },

  setupEnemyBullets: function () {
    this.enemyBullets = this.add.group();
    this.enemyBullets.createMultiple(this.poolSize, 'enemyBullets');
    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 0.5);
    this.physics.enable(this.enemyBullets, Phaser.Physics.ARCADE);
  },

  create: function() {
    this.bottomLeft.x = 0;
    this.bottomLeft.y = this.world.height;

    // 1st init all vars
    this.bootstrap();
    Main.setupBackground(this);
    this.setupRailtracks();
    this.startMusic();
    this.setupSoundfx();

    // this.setupEmitters();
    this.setupButtons();
    this.setupPlayerGroup();
    this.setupPlayerBullets();

    this.setupEnemies();
    this.setupEnemyBullets();

    this.setupPowerups();
    this.setupStatusbar();
    this.setupInputControls();    // for desktop or touch devices
  },

  update: function() {
    // update level config 1st
    this.updateLevelConfig();
    this.managePowerUps();

    if(Main.userWantsToPlayOn === 'desktop') {
      // for desktop mode
      this.playerGroup.rotation = this.physics.arcade.angleToPointer(this.playerGroup);
    }
    else {
      // default mode: for mobile/touch screen mode
      this.dialer.rotation = this.physics.arcade.angleToPointer(this.dialer); 
      this.playerGroup.angle = this.dialer.angle-270;
    }

    // shoot bullets
    if(this.input.activePointer.isDown) {
      this.fire();
    }

    // send enemies to attack player
    this.sendEnemies();
    this.attackPlayer();

    // collision handlers
    this.physics.arcade.collide(this.playerBullets, this.enemyBullets, this.enemyBulletKilled, null, this);
    this.physics.arcade.overlap(this.playerBullets, this.enemies, this.enemyKilled, null, this);
    this.physics.arcade.overlap(this.playerBullets, this.powerUpBurger, this.takePowerUpBurger, null, this);
    this.physics.arcade.overlap(this.playerBullets, this.powerUpDrink, this.takePowerUpDrink, null, this);
    this.physics.arcade.overlap(this.enemyBullets, this.player, this.playerInjured, null, this);
    this.physics.arcade.overlap(this.enemies, this.player, this.playerPounced, null, this);
  },

  managePowerUps: function() {
    //schedule 1st power mannually
    if(this.nextPowerUpAt === 0) {
      this.schedulePowerUp();
    }

    // time to show a powerUp ?
    if(this.time.now > this.nextPowerUpAt)
    {
      this.schedulePowerUp();

      // get random location to display powerUp
      var x = this.rnd.integerInRange(0, this.world.width-20);
      var y = this.rnd.integerInRange(0, this.world.height-20);

      // choose amount burger / drink
      var powerUp = this.rnd.pick([this.powerUpBurger, this.powerUpDrink]);
      powerUp.reset(x,y);

      // remove powerUp after 5 sec and reschedule
      setTimeout(function(self) {
        powerUp.reset(-30, -30);
      }, 5000, this);
    }
  },

  schedulePowerUp: function() {
    // powerups will be displayed randomly between 90 sec interval
    // var minPowerUpInterval, maxPowerUpInterval;
    // minPowerUpInterval = this.time.now + 3500;         
    // maxPowerUpInterval = minPowerUpInterval + 60000;  
    // this.nextPowerUpAt = this.rnd.timestamp(minPowerUpInterval, maxPowerUpInterval);
    this.nextPowerUpAt = this.time.now + 60*1000;
    console.log('now: ', this.time.now, ' next powerup at: ', this.nextPowerUpAt);
  },

  // game ended 
  gameOver: function() {
    this.music.stop();
    this.game.state.start('gameOver');
  },

  recoverOutOfWorldSprites: function(g) {
    console.log('recovering out of world sprites');
    console.log('g: ', g);
    g.forEach(function(child) {
      if(child.inWorld === false) {
        child.kill();
      }
    }, this);
  },

  fire: function() {
    // fire bullet from the tip of the gun 
    if(this.time.now > this.playerNextAttack) {
      // recover out of world bullets
      if (this.playerBullets.countDead() < 5) {
        this.recoverOutOfWorldSprites(this.playerBullets);
      };

      if(this.playerBullets.countDead() > 0) {
        this.playerNextAttack = this.time.now + this.playerAttackRate;   

        var bullet = this.playerBullets.getFirstDead();

        // position the bullet on the tip of the gun 
        bullet.reset(this.playerGunTip.getBounds().x, this.playerGunTip.getBounds().y);
        bullet.anchor.setTo(0.5, 1.2);
        this.player.animations.play('fire');

        setTimeout( function(self) {
          self.playerFire.play();
          bullet.angle = self.playerGroup.angle;
          self.physics.arcade.velocityFromAngle(bullet.angle, self.playerBulletSpeed, bullet.body.velocity);
        }, 50, this);
      };
    };
  },

  sendEnemies: function() {
    if(this.time.now > this.enemyNextBirth) {
      this.enemyNextBirth = this.time.now + this.enemyBirthRate;

      var location = this.getRandomLocation();
      var enemy = this.enemies.getFirstDead();

      if(enemy) {        
        enemy.reset(location.x, location.y);
        enemy.animations.add('walk');
        enemy.animations.play('walk', 8, true);
        enemy.rotation = this.physics.arcade.moveToObject(enemy, this.bottomLeft, this.enemyWalkSpeed);
      }
    }
  },

  // get a random location from either far top or far right,
  // for an enemy birth
  getRandomLocation: function() {
    var x = 0, y = 0;

    if(this.rnd.pick(['top', 'right']) === 'top') {
      // get location from far top
      x = this.rnd.integerInRange(0, this.world.width);
      y = 0;
    } 
    else {
      // get location from far right
      x = this.world.width;
      y = this.rnd.integerInRange(0, this.world.height);
    }

    return {x: x, y: y};
  },

  attackPlayer: function() {
    var aliveEnemiesCount, randomEnemyIndex, randomEnemy, bullet;
    aliveEnemiesCount = this.enemies.countLiving();

    if(aliveEnemiesCount > 0 && this.game.time.now > this.enemyNextFire) {
      this.enemyNextFire = this.game.time.now + this.enemyFireRate;
      randomEnemy = this.enemies.getRandom(0, this.enemies.countLiving());

      bullet = this.enemyBullets.getFirstDead();
      bullet.reset(randomEnemy.getBounds().centerX, randomEnemy.getBounds().centerY);
      bullet.angle = randomEnemy.angle;
      this.physics.arcade.velocityFromAngle(bullet.angle, this.enemyBulletSpeed, bullet.body.velocity);
      this.enemyFire.play();
    }
  },

  enemyBulletKilled: function(pBullet, eBullet) {
    pBullet.kill();
    this.particleEmitters(
      this.PARTICLE_EFFECT__ENEMY_BULLET_KILL, 
      eBullet.x, eBullet.y);
    eBullet.kill();

    this.scoreUpdate(10);
  },

  // Enemy gets a hit from the player. Gets upside down and dies in his own fart. Seriously!
  enemyKilled: function(bullet, enemy) {
    bullet.kill();
    this.particleEmitters(
      this.PARTICLE_EFFECT__ENEMY_KILL, 
      enemy.x, enemy.y);
    enemy.kill();
    this.scoreUpdate(50);
  },

  // particle emitters
  PARTICLE_EFFECT__PLAYER_KILL:           0,
  PARTICLE_EFFECT__PLAYER_HIT:            1,
  PARTICLE_EFFECT__PLAYER_POUNCED:        2,
  PARTICLE_EFFECT__ENEMY_KILL:            3,
  PARTICLE_EFFECT__ENEMY_BULLET_KILL:     4,
  PARTICLE_EFFECT__VEHICLE_HIT:           5,
  PARTICLE_EFFECT__VEHICLE_KILL:          6,
  PARTICLE_EFFECT__POWER_UP_DRINK_KILL:   7,
  PARTICLE_EFFECT__POWER_UP_BURGER_KILL:  8,

  particleEmitters: function(key, x, y, size) {
    var frames = [];
    var lifespan = 2000;
    var total = 500;
    var maxParticleScale = 2;
    var soundfx = null;
    
    switch(key) {
      case this.PARTICLE_EFFECT__PLAYER_KILL:
        frames = [5,6,7,8,1,13];
        lifespan = 3500;
        total = 2000;
        maxParticleScale = 4;
        soundfx = this.playerHit;
        break;

      case this.PARTICLE_EFFECT__PLAYER_POUNCED:
      case this.PARTICLE_EFFECT__PLAYER_HIT:
        frames = [6,7];
        lifespan = 500;
        total = 100;
        soundfx = this.playerHit;
        break;

      case this.PARTICLE_EFFECT__ENEMY_KILL:
        frames = [0,1,2];
        maxParticleScale = 3;
        soundfx = this.enemyHit;
        break;

      case this.PARTICLE_EFFECT__ENEMY_BULLET_KILL:
        frames = [6,7];
        lifespan = 1000;
        total = 100;
        soundfx = this.playerHit;
        break;

      case this.PARTICLE_EFFECT__VEHICLE_HIT:
        frames = [3,4,5];
        lifespan = 1000;
        total = 100;
        soundfx = this.playerHit;
        break;

      case this.PARTICLE_EFFECT__VEHICLE_KILL:
        frames = [3,4,5];
        lifespan = 3500;
        total = 2000;
        maxParticleScale = 4;
        break;

      case this.PARTICLE_EFFECT__POWER_UP_DRINK_KILL:
        frames = [8,9,10];
        lifespan = 500;
        total = 100;
        soundfx = this.powerUpHit;
        break;

      case this.PARTICLE_EFFECT__POWER_UP_BURGER_KILL:
        frames = [11,12,13];
        lifespan = 500;
        total = 100;
        soundfx = this.powerUpHit;
        break;
    };

    var e = this.add.emitter(x, y, 250);
    e.makeParticles('blast01', frames);
    e.gravity = 0;
    e.maxParticleScale = maxParticleScale;

    if(size) {
      e.height = size.height;
      e.width = size.width;
    };

    e.start(true, lifespan, null, total);

    if(soundfx) {
      soundfx.play();
    };
  },

  animateEnemyUpsideDown: function(enemy) {
    var splatter = this.enemySplatters.getFirstDead();
    splatter.reset(enemy.x, enemy.y);
    splatter.rotation = enemy.rotation;
    splatter.animations.add('kill');
    splatter.animations.play('kill', 25, false, true);
    this.enemyHit.play();
  },

  playerPounced: function(player, enemy) {
    console.log('player pounced');
    this.particleEmitters(
      this.PARTICLE_EFFECT__PLAYER_POUNCED,
      player.x,
      player.y
      );
    this.particleEmitters(
      this.PARTICLE_EFFECT__ENEMY_KILL,
      enemy.x,
      enemy.y);
    enemy.kill();
    this.vehicle.animations.play('shock');
    this.healthUpdate(-20);
  },

  playerInjured: function(player, eBullet) {
    console.log('player injured');
    this.particleEmitters(
      this.PARTICLE_EFFECT__PLAYER_HIT,
      eBullet.x,
      eBullet.y
      );
    eBullet.kill();
    this.healthUpdate(-10);
  },

  // build status bar text
  buildStatusBarText: function() {
    // build status bar text
    var t = '';

    // player's health progress bar
    t += this.healthPrefix + this.playerHealth + '%';

    // a seprator
    t += '   ';
    
    // score info
    t += this.scorePrefix + this.scoreTotal;

    // a seprator
    t += '   ';
    
    // score info
    t += this.levelPrefix + this.levelCounter;

    return t;
  },

  // score updater
  scoreUpdate: function(scoreNew) {
      this.scoreTotal += scoreNew;
      this.statusBar.setText( this.buildStatusBarText() );
  },

  healthUpdate: function(healthNew) {
    this.playerHealth += healthNew;
    this.statusBar.setText( this.buildStatusBarText() );

    // update visual appearance of the player as per current health stats
    if(this.playerHealth < 1) 
    {
      this.particleEmitters(
        this.PARTICLE_EFFECT__PLAYER_KILL, 
        this.player.x, this.player.y, 
        {width: this.player.width, height: this.player.height}
      );

      this.particleEmitters(
        this.PARTICLE_EFFECT__VEHICLE_KILL, 
        this.vehicle.x, this.vehicle.y, 
        {width: this.vehicle.width, height: this.vehicle.height}
      );

      this.player.kill();
      this.vehicle.kill();
      this.playerShock.play();

      setTimeout(function(self) {
        self.gameOver();
      }, 2500, this);
    }
    else
    {
      if(this.playerHealth < 25) {
        // this.playerHead.animations.play('injured_4');
      }
      else if(this.playerHealth < 50) {
        // this.playerHead.animations.play('injured_3');
      }
      else if(this.playerHealth < 75) {
        // this.playerHead.animations.play('injured_2');
      }
      else if(this.playerHealth < 100) {
        // this.playerHead.animations.play('injured_1');
      }
      else
      {
        // this.playerHead.animations.play('injured_0');
      }

      this.vehicle.animations.play('hit');
    }
  },

  updateLevelConfig: function() {
    // auto level changer
    // changes game config automatically on 1st 5000 score
    // then on multiple of 5000
    if(this.scoreTotal > this.levelMaxScore) {
      this.levelCounter++;
      this.levelMaxScore += this.levelAutoIncrease;
      this.enemyBirthRate -= this.enemyBirthRate * 0.2; 

      console.log('level updated to: ', this.levelCounter);
      console.log('level auto increase: ', this.levelAutoIncrease);
      console.log('level MaxScore: ', this.levelMaxScore);
      console.log('enemy BirthRate: ', this.enemyBirthRate);
      console.log('---------------------');
    }
  },

  takePowerUpBurger: function (bullet, powerUp) {
    this.takePowerUp(bullet, powerUp, 10);
  },

  takePowerUpDrink: function (bullet, powerUp) {
    this.takePowerUp(bullet, powerUp, 20);
  },

  takePowerUp: function(powerUp, bullet, healthIncrease) {
    // if player is weak... increase health
    // else ignore
    if(this.playerHealth < 100) {
      this.healthUpdate(healthIncrease);
    }
    
    if(powerUp.key === 'powerUpBurger') {
      this.particleEmitters(
        this.PARTICLE_EFFECT__POWER_UP_BURGER_KILL,
        powerUp.x, powerUp.y
        );
    } else {
      this.particleEmitters(
        this.PARTICLE_EFFECT__POWER_UP_DRINK_KILL,
        powerUp.x, powerUp.y
        );
    }

	bullet.kill();
    powerUp.kill();
  },

  pauseGame: function(button) {
    this.game.paused = true; 
  },

  onPauseGame: function() {
    this.btnPauseGame.setFrames(3, 4, 5);
    console.log('game paused');
  },

  onResumeGame: function() {
    this.game.paused = false;
    this.btnPauseGame.setFrames(0, 1, 2);
    console.log('game relived');
  },

  muteGame: function(button) {
    if(this.game.sound.mute === true) {
      this.game.sound.mute = false;
      button.setFrames(6, 7, 8);
    }
    else {
      this.game.sound.mute = true;
      button.setFrames(9, 10, 11);
    }
  },

  restartGame: function(button) {
    this.game.state.start('menu');
  },

  render: function() {
    // debug info
  }
};

var w=1920, h=1080;

if(window.innerWidth) {
  w = window.innerWidth*window.devicePixelRatio;
  h = window.innerHeight*window.devicePixelRatio;  
}
else if(window.width()) {
  w = window.width();
  h = window.height();
};

var game = new Phaser.Game(w,h, Phaser.AUTO, '');
game.state.add('boot', Main.Boot, true);
game.state.add('preloader', Main.Preloader);
game.state.add('menu', Main.Menu);
game.state.add('help', Main.Help);
game.state.add('credits', Main.Credits);
game.state.add('gameOver', Main.GameOver);
game.state.add('game', Main.Game);

// $(window).resize(function(){
//   game.scale.setShowAll();
//   game.scale.refresh();
// });

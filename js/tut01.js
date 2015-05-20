var game = new Phaser.Game(800,         // 800px wide
                           600,         // 600px high
                           Phaser.AUTO, // Automatically switch between WebGL and Canvas
                           '',          // id of DOM element to insert into
                           { preload: preload,  // name of preload function
                             create: create,    // name of create function
                             update: update }); // name of update function

var score = 0;
var scoreText;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

function create() {
    // enable Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // background image
    game.add.sprite(0, 0, 'sky');

    // what objects we can jump on
    platforms = game.add.group();

    // enable physics for the platforms
    platforms.enableBody = true;

    // create ground we can stand on
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    // Scale sprite to fit in game
    ground.scale.setTo(2, 2);

    // so ground doesn't move when touched
    ground.body.immovable = true;

    // create some ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    // done with world building, time to add the player
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    // enable physics on the player
    game.physics.arcade.enable(player);

    // give the player a slight bounce
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    // add some animations for the guy
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7 , 8], 10, true);

    // I think this goes here
    cursors = game.input.keyboard.createCursorKeys();

    stars = game.add.group();
    stars.enableBody = true;

    // make all the stars line up
    for (var i = 0; i < 12; i++) {
        // create a star
        var star = stars.create (i * 70, 0, 'star');
        // make it gravitate
        star.body.gravity.y = 6;
        // randomize that bounce boyee
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // scoring
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
}

function update() {
    // player and world collisions
    game.physics.arcade.collide(player, platforms);

    // reset velocity
    if (cursors.left.isDown) {
        // move left
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown) {
        // move right
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else {
        // stand still
        player.animations.stop();
        player.frame = 4;
        player.body.velocity.x = 0;
    }

    // allow jumping if touching the ground
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }

    // make the stars collide with the platforms
    game.physics.arcade.collide(stars, platforms);
    // check if player overlaps with a star
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

function collectStar (player, star) {
    // remove the star
    star.kill();

    // update score
    score += 10;
    scoreText.text = 'score: ' + score;
}
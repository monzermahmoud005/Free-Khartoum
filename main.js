
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1d212d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player, cursors, enemies;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('enemy', 'assets/enemy.png');
}

function create() {
    // Background
    this.add.image(400, 300, 'background');

    // Ground
    const ground = this.physics.add.staticGroup();
    ground.create(400, 568, 'ground').setScale(2).refreshBody();

    // Player
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, ground);

    // Enemies
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 200, y: 0, stepX: 100 }
    });
    enemies.children.iterate(function (enemy) {
        enemy.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(enemies, ground);
    this.physics.add.overlap(player, enemies, hitEnemy, null, this);

    // Input
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function hitEnemy(player, enemy) {
    enemy.disableBody(true, true);
}

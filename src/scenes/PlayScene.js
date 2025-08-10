/* global Phaser */

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  preload() {
    // Simple placeholder assets via generated textures

    // Generate visible 32x16 ground tile and 16x16 block tile
    const tex = this.make.graphics({ x: 0, y: 0, add: false });
    // Ground 32x16 (green)
    tex.fillStyle(0x65a30d, 1); // grass
    tex.fillRect(0, 0, 32, 12);
    tex.fillStyle(0x3f6212, 1); // dirt edge
    tex.fillRect(0, 12, 32, 4);
    tex.generateTexture('ground32x16', 32, 16);
    tex.clear();
    // Block 16x16
    tex.fillStyle(0xf59e0b, 1);
    tex.fillRect(0, 0, 16, 16);
    tex.lineStyle(2, 0xb45309, 1);
    tex.strokeRect(1, 1, 14, 14);
    tex.generateTexture('block16', 16, 16);
    tex.clear();
    // Placeholder player frames (24x32) for idle/walk/jump (more visible)
    // idle
    tex.fillStyle(0xffffff, 1); // outline
    tex.fillRect(0, 0, 24, 32);
    tex.fillStyle(0xff6b9e, 1); // body
    tex.fillRect(3, 8, 18, 22);
    tex.fillStyle(0xfee2e2, 1); // head
    tex.fillRect(6, 2, 12, 10);
    tex.generateTexture('player_idle', 24, 32);
    tex.clear();
    // walk1
    tex.fillStyle(0xffffff, 1);
    tex.fillRect(0, 0, 24, 32);
    tex.fillStyle(0xff6b9e, 1);
    tex.fillRect(3, 8, 18, 22);
    tex.fillStyle(0xfee2e2, 1);
    tex.fillRect(6, 2, 12, 10);
    tex.fillStyle(0xb91c1c, 1); // leg forward
    tex.fillRect(4, 26, 8, 3);
    tex.generateTexture('player_walk1', 24, 32);
    tex.clear();
    // walk2
    tex.fillStyle(0xffffff, 1);
    tex.fillRect(0, 0, 24, 32);
    tex.fillStyle(0xff6b9e, 1);
    tex.fillRect(3, 8, 18, 22);
    tex.fillStyle(0xfee2e2, 1);
    tex.fillRect(6, 2, 12, 10);
    tex.fillStyle(0xb91c1c, 1); // other leg
    tex.fillRect(12, 26, 8, 3);
    tex.generateTexture('player_walk2', 24, 32);
    tex.clear();
    // jump
    tex.fillStyle(0xffffff, 1);
    tex.fillRect(0, 0, 24, 32);
    tex.fillStyle(0xff6b9e, 1);
    tex.fillRect(3, 8, 18, 22);
    tex.fillStyle(0xfee2e2, 1);
    tex.fillRect(6, 2, 12, 10);
    tex.fillStyle(0x7f1d1d, 1); // tucked legs
    tex.fillRect(8, 24, 8, 3);
    tex.generateTexture('player_jump', 24, 32);
    tex.clear();
    // Flag (12x32): pole + small banner
    tex.fillStyle(0x6b7280, 1); // pole
    tex.fillRect(0, 0, 2, 32);
    tex.fillStyle(0xf87171, 1); // flag
    tex.fillRect(2, 6, 10, 6);
    tex.generateTexture('flag', 12, 32);
    tex.clear();
    // Cloud (48x24): simple puffs
    tex.fillStyle(0xffffff, 1);
    tex.fillCircle(12, 14, 10);
    tex.fillCircle(22, 10, 10);
    tex.fillCircle(34, 14, 10);
    tex.fillRect(8, 14, 28, 6);
    tex.generateTexture('cloud', 48, 24);
    tex.clear();
    // Coin (12x12) and spark (4x4)
    tex.fillStyle(0xfcd34d, 1); // gold base
    tex.fillCircle(6, 6, 6);
    tex.fillStyle(0xf59e0b, 1); // inner ring
    tex.fillCircle(6, 6, 4);
    tex.fillStyle(0xfffbeb, 1); // highlight
    tex.fillCircle(8, 4, 2);
    tex.generateTexture('coin', 12, 12);
    tex.clear();
    tex.fillStyle(0xffffff, 1);
    tex.fillRect(0, 0, 4, 4);
    tex.generateTexture('spark', 4, 4);
    tex.clear();
    // On-screen buttons
    // base circle 56x56
    tex.fillStyle(0x0f172a, 0.35);
    tex.fillCircle(28, 28, 28);
    tex.lineStyle(2, 0x94a3b8, 0.8);
    tex.strokeCircle(28, 28, 28);
    tex.generateTexture('btnBase', 56, 56);
    tex.clear();
    // left arrow
    tex.fillStyle(0x94a3b8, 1);
    tex.beginPath();
    tex.moveTo(36, 16);
    tex.lineTo(20, 28);
    tex.lineTo(36, 40);
    tex.closePath();
    tex.fillPath();
    tex.generateTexture('btnLeftIcon', 56, 56);
    tex.clear();
    // right arrow
    tex.fillStyle(0x94a3b8, 1);
    tex.beginPath();
    tex.moveTo(20, 16);
    tex.lineTo(36, 28);
    tex.lineTo(20, 40);
    tex.closePath();
    tex.fillPath();
    tex.generateTexture('btnRightIcon', 56, 56);
    tex.clear();
    // jump icon (up arrow)
    tex.fillStyle(0x94a3b8, 1);
    tex.beginPath();
    tex.moveTo(28, 14);
    tex.lineTo(16, 30);
    tex.lineTo(40, 30);
    tex.closePath();
    tex.fillPath();
    tex.generateTexture('btnJumpIcon', 56, 56);
    tex.clear();
    // Traps and platforms
    // Spike (16x16)
    tex.fillStyle(0x6b7280, 1);
    tex.fillTriangle(0, 16, 8, 0, 16, 16);
    tex.generateTexture('spike', 16, 16);
    tex.clear();
    // Lava (32x16)
    tex.fillStyle(0xb91c1c, 1);
    tex.fillRect(0, 8, 32, 8);
    tex.fillStyle(0xf97316, 1);
    tex.fillRect(0, 0, 32, 10);
    tex.generateTexture('lava32', 32, 16);
    tex.clear();
    // Moving platform (48x12)
    tex.fillStyle(0x64748b, 1);
    tex.fillRect(0, 0, 48, 12);
    tex.fillStyle(0x334155, 1);
    tex.fillRect(0, 8, 48, 4);
    tex.generateTexture('plat48', 48, 12);
    tex.clear();
    // Enemy (20x16)
    tex.fillStyle(0x8b5cf6, 1); // body
    tex.fillRect(0, 4, 20, 12);
    tex.fillStyle(0xffffff, 1); // eyes
    tex.fillRect(4, 6, 4, 4);
    tex.fillRect(12, 6, 4, 4);
    tex.fillStyle(0x000000, 1);
    tex.fillRect(5, 8, 2, 2);
    tex.fillRect(13, 8, 2, 2);
    tex.generateTexture('enemy', 20, 16);
    tex.destroy();

    // Optional external assets (only load when URL flags are set to avoid 404 noise)
    // Usage: add ?art=1&player=1 to the URL after you place files into /assets
    const params = new URLSearchParams(window.location.search);
    const enableArt = params.get('art') === '1' || params.get('art') === 'true';
    const enablePlayer = params.get('player') === '1' || params.get('player') === 'true';
    if (enableArt) {
      this.load.spritesheet('tiles', 'assets/tileset.png', { frameWidth: 16, frameHeight: 16 });
      this.load.spritesheet('coinSprite', 'assets/coin.png', { frameWidth: 16, frameHeight: 16 });
      this.load.spritesheet('enemySprite', 'assets/enemy.png', { frameWidth: 16, frameHeight: 16 });
    }
    if (enablePlayer) {
      this.load.image('playerCustom', 'assets/player.png');
      const pfw = Number.parseInt(params.get('pfw') || '24', 10);
      const pfh = Number.parseInt(params.get('pfh') || '32', 10);
      this.playerFrameWidth = pfw;
      this.playerFrameHeight = pfh;
      this.load.spritesheet('playerSheet', 'assets/player_sheet.png', { frameWidth: pfw, frameHeight: pfh });
    }
  }

  create(data) {
    const w = this.scale.width;
    const h = this.scale.height;
    this.worldWidth = 3000;
    this.difficulty = data?.difficulty || 'normal';
    this.enemySpeed = data?.enemySpeed ?? 70;
    // Determine availability of external assets
    this.useTiles = this.textures.exists('tiles');
    this.useCoinSheet = this.textures.exists('coinSprite');
    this.useEnemySheet = this.textures.exists('enemySprite');

    // Background clouds
    for (let i = 0; i < 6; i += 1) {
      const cx = 80 + i * 220;
      const cy = 60 + (i % 2) * 20;
      this.add.image(cx, cy, 'cloud').setScrollFactor(0.3);
    }

    // Platforms group
    this.platforms = this.physics.add.staticGroup();

    // Ground
    const groundWidth = 32;
    // Create ground with gaps for pits
    const pits = [
      { start: 22, end: 28 }, // small pit
      { start: 55, end: 65 }, // larger pit
      { start: 82, end: 86 },
    ];
    for (let i = 0; i < Math.ceil(this.worldWidth / groundWidth); i += 1) {
      const inPit = pits.some((p) => i >= p.start && i <= p.end);
      if (inPit) continue;
      let ground;
      if (this.useTiles) {
        ground = this.platforms.create(i * groundWidth, h - 32, 'tiles', 0).setOrigin(0, 0).setScale(2);
      } else {
        ground = this.platforms.create(i * groundWidth, h - 16, 'ground32x16').setOrigin(0, 0);
      }
      ground.refreshBody();
      ground.body.updateFromGameObject();
    }

    // A few simple blocks to mimic level 1 style
    const blocksLayout = [
      { x: 250, y: h - 80 },
      { x: 266, y: h - 120 },
      { x: 282, y: h - 80 },
      { x: 400, y: h - 120 },
      { x: 416, y: h - 120 },
      { x: 432, y: h - 120 },
      { x: 600, y: h - 80 },
      { x: 616, y: h - 80 },
      { x: 632, y: h - 80 },
    ];
    blocksLayout.forEach(({ x, y }) => {
      let b;
      if (this.useTiles) {
        b = this.platforms.create(x, y - 16, 'tiles', 1).setOrigin(0, 0).setScale(2);
      } else {
        b = this.platforms.create(x, y, 'block16').setOrigin(0, 0);
      }
      b.refreshBody();
      b.body.updateFromGameObject();
    });

    // End flag
    this.endFlag = this.physics.add.staticImage(this.worldWidth - 120, this.useTiles ? h - 0 : h - 16, 'flag').setOrigin(0, 1).setScale(this.useTiles ? 2 : 1);

    // Player
    const hasSheet = this.textures.exists('playerSheet');
    this.useCustomPlayer = this.textures.exists('playerCustom') && this.textures.get('playerCustom').source[0]?.height > 0;
    const playerKey = hasSheet ? 'playerSheet' : (this.useCustomPlayer ? 'playerCustom' : 'player_idle');
    this.player = this.physics.add.sprite(40, h - 60, playerKey);
    this.player.setCollideWorldBounds(true);
    if (hasSheet) {
      const bw = Math.floor((this.playerFrameWidth || 24) * 0.6);
      const bh = Math.floor((this.playerFrameHeight || 32) * 0.9);
      this.player.body.setSize(bw, bh);
      this.player.body.setOffset(((this.playerFrameWidth || 24) - bw) / 2, (this.playerFrameHeight || 32) - bh);
    } else if (!this.useCustomPlayer) {
      this.player.body.setSize(16, 28);
      this.player.body.setOffset(0, 0);
    } else {
      // Reasonable default body for custom image
      const bw = Math.floor(this.player.displayWidth * 0.6);
      const bh = Math.floor(this.player.displayHeight * 0.9);
      this.player.body.setSize(bw, bh);
      this.player.body.setOffset((this.player.displayWidth - bw) / 2, this.player.displayHeight - bh);
    }

    // Animations
    if (hasSheet) {
      // Expecting rows: idle=0 (2 frames), walk=1 (6 frames), jump=2 (1 frame), fall=3 (1 frame), hurt=4 (1 frame)
      const fw = this.playerFrameWidth || 24;
      const fh = this.playerFrameHeight || 32;
      const framesPerRow = Math.floor(this.textures.get('playerSheet').getSourceImage().width / fw);
      const row = (r, count) => ({ start: r * framesPerRow, end: r * framesPerRow + count - 1 });
      if (!this.anims.exists('p-idle')) this.anims.create({ key: 'p-idle', frames: this.anims.generateFrameNumbers('playerSheet', row(0, 2)), frameRate: 4, repeat: -1 });
      if (!this.anims.exists('p-walk')) this.anims.create({ key: 'p-walk', frames: this.anims.generateFrameNumbers('playerSheet', row(1, 6)), frameRate: 10, repeat: -1 });
      if (!this.anims.exists('p-jump')) this.anims.create({ key: 'p-jump', frames: this.anims.generateFrameNumbers('playerSheet', row(2, 1)), frameRate: 1, repeat: -1 });
      if (!this.anims.exists('p-fall')) this.anims.create({ key: 'p-fall', frames: this.anims.generateFrameNumbers('playerSheet', row(3, 1)), frameRate: 1, repeat: -1 });
      if (!this.anims.exists('p-hurt')) this.anims.create({ key: 'p-hurt', frames: this.anims.generateFrameNumbers('playerSheet', row(4, 1)), frameRate: 1, repeat: -1 });
      this.player.anims.play('p-idle');
    } else if (!this.useCustomPlayer) {
      if (!this.anims.exists('player-idle')) {
        this.anims.create({ key: 'player-idle', frames: [{ key: 'player_idle' }], frameRate: 1, repeat: -1 });
      }
      if (!this.anims.exists('player-walk')) {
        this.anims.create({ key: 'player-walk', frames: [{ key: 'player_walk1' }, { key: 'player_walk2' }], frameRate: 8, repeat: -1 });
      }
      if (!this.anims.exists('player-jump')) {
        this.anims.create({ key: 'player-jump', frames: [{ key: 'player_jump' }], frameRate: 1, repeat: -1 });
      }
      this.player.anims.play('player-idle');
    }
    this.player.setMaxVelocity(200, 600);
    this.player.setDragX(1600);

    // Collisions
    this.physics.add.collider(this.player, this.platforms);

    // Log keyboard capture and ensure canvas focus
    this.input.keyboard.addCapture(['LEFT', 'RIGHT', 'UP', 'SPACE', 'A', 'D']);
    this.input.on('pointerdown', () => {
      if (this.game.canvas) this.game.canvas.focus();
    });

    // Overlap end flag to finish level
    this.physics.add.overlap(this.player, this.endFlag, () => {
      const timeMs = this.time.now - this.levelStartTime;
      this.registry.set('coins', this.coinCount);
      this.registry.set('timeMs', timeMs);
      this.time.delayedCall(150, () => this.scene.start('BirthdayScene'));
    });

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, this.worldWidth, h);

    // World bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, h);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Touch controls (simple): left half is left, right half is right, tap top to jump
    this.touchState = { left: false, right: false, jump: false };
    this.input.on('pointerdown', (p) => {
      const half = this.scale.width / 2;
      if (p.y < this.scale.height * 0.35) {
        this.touchState.jump = true;
      } else if (p.x < half) {
        this.touchState.left = true;
      } else {
        this.touchState.right = true;
      }
    });
    this.input.on('pointerup', () => {
      this.touchState.left = false;
      this.touchState.right = false;
      this.touchState.jump = false;
    });

    // On-screen controls (always visible; handy for mobile and to ensure input works)
    this.createOnScreenControls();

    // Coins
    this.coinCount = 0;
    this.levelStartTime = this.time.now;
    this.coins = this.physics.add.group({ allowGravity: false, immovable: true });
    const coinsLayout = [
      { x: 180, y: h - 60 },
      { x: 266, y: h - 140 },
      { x: 416, y: h - 140 },
      { x: 600, y: h - 100 },
      { x: 760, y: h - 100 },
      { x: 920, y: h - 140 },
      { x: 1100, y: h - 100 },
      { x: 1300, y: h - 140 },
      { x: 1500, y: h - 100 },
    ];
    if (this.useCoinSheet && !this.anims.exists('coin-spin')) {
      this.anims.create({ key: 'coin-spin', frames: this.anims.generateFrameNumbers('coinSprite', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    }
    coinsLayout.forEach(({ x, y }) => {
      const key = this.useCoinSheet ? 'coinSprite' : 'coin';
      const c = this.coins.create(x, y, key);
      if (this.useCoinSheet) {
        c.setScale(2);
        c.anims.play('coin-spin');
      }
      if (!this.useCoinSheet && c.refreshBody) c.refreshBody();
    });
    this.sparkEmitter = this.add.particles(0, 0, 'spark', {
      speed: { min: 40, max: 140 },
      angle: { min: 0, max: 360 },
      gravityY: 200,
      lifespan: 500,
      scale: { start: 1, end: 0 },
      quantity: 12,
      tint: [0xffffff, 0xfff3c4, 0xfcd34d, 0xf59e0b],
      emitting: false,
    });
    this.physics.add.overlap(this.player, this.coins, this.handleCollectCoin, undefined, this);

    // HUD
    this.coinText = this.add.text(12, 10, 'Coins: 0', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '18px',
      color: '#0f172a',
      backgroundColor: '#fffbeb',
      padding: { x: 6, y: 2 },
    }).setScrollFactor(0).setDepth(1000);

    // Traps: spikes and lava
    this.spikes = this.physics.add.staticGroup();
    // Scale traps based on difficulty
    const spikeCount = data?.spikeCount ?? 12;
    const spikesLayout = [];
    for (let i = 0; i < spikeCount; i += 1) {
      const x = 300 + i * 100 + (i % 2) * 30;
      spikesLayout.push({ x, y: this.useTiles ? h - 0 : h - 16 });
    }
    spikesLayout.forEach(({ x, y }) => {
      let s;
      if (this.useTiles) {
        s = this.spikes.create(x, y, 'tiles', 2).setOrigin(0, 1).setScale(2);
      } else {
        s = this.spikes.create(x, y, 'spike').setOrigin(0, 1);
      }
      s.refreshBody();
    });
    this.lava = this.physics.add.staticGroup();
    const lavaWidth = data?.lavaW ?? 10;
    const lavaSegments = [
      { from: 55, to: 55 + lavaWidth }, // matches pit tiles
    ];
    lavaSegments.forEach(({ from, to }) => {
      for (let i = from; i <= to; i += 1) {
        let seg;
        if (this.useTiles) {
          seg = this.lava.create(i * groundWidth, h - 0, 'tiles', 3).setOrigin(0, 1).setScale(2);
        } else {
          seg = this.lava.create(i * groundWidth, h - 0, 'lava32').setOrigin(0, 1);
        }
        seg.refreshBody();
      }
    });
    this.physics.add.overlap(this.player, this.spikes, this.handlePlayerDeath, undefined, this);
    this.physics.add.overlap(this.player, this.lava, this.handlePlayerDeath, undefined, this);

    // Moving platforms
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    const mp1 = this.movingPlatforms.create(1400, h - 120, 'plat48');
    const mp2 = this.movingPlatforms.create(1700, h - 160, 'plat48');
    this.tweens.add({ targets: mp1, x: { from: 1350, to: 1500 }, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: mp2, x: { from: 1650, to: 1850 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.physics.add.collider(this.player, this.movingPlatforms);

    // Falling platforms
    this.fallingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    const fp = this.fallingPlatforms.create(2100, h - 120, 'plat48');
    this.physics.add.collider(this.player, this.fallingPlatforms, (player, platform) => {
      if (!platform.falling) {
        platform.falling = true;
        this.time.delayedCall(400, () => {
          platform.setImmovable(false);
          platform.setAllowGravity(true);
        });
      }
    });

    // Enemies
    this.enemies = this.physics.add.group();
    const e1 = this.enemies.create(800, h - 40, this.useEnemySheet ? 'enemySprite' : 'enemy');
    const e2 = this.enemies.create(1250, h - 40, this.useEnemySheet ? 'enemySprite' : 'enemy');
    if (this.useEnemySheet && !this.anims.exists('enemy-walk')) {
      this.anims.create({ key: 'enemy-walk', frames: this.anims.generateFrameNumbers('enemySprite', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    }
    [e1, e2].forEach((e) => {
      e.setCollideWorldBounds(true);
      e.setVelocityX(this.enemySpeed * (Math.random() < 0.5 ? -1 : 1));
      e.setBounce(1, 0);
      e.body.setSize(18, 14).setOffset(1, 2);
      if (this.useEnemySheet) {
        e.setScale(2);
        e.anims.play('enemy-walk');
      }
    });
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);
    this.physics.add.overlap(this.player, this.enemies, this.handleEnemyOverlap, undefined, this);

    // Checkpoints
    this.respawnPoint = { x: 40, y: h - 60 };
    this.checkpoints = this.physics.add.staticGroup();
    const cp1 = this.checkpoints.create(1200, h - 16, 'flag').setOrigin(0, 1);
    const cp2 = this.checkpoints.create(2000, h - 16, 'flag').setOrigin(0, 1);
    this.physics.add.overlap(this.player, this.checkpoints, (player, flag) => {
      this.respawnPoint = { x: flag.x + 10, y: flag.y - 24 };
      flag.setTint(0x10b981);
    });
  }

  update() {
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    const moveLeft = this.cursors.left.isDown || this.keyA.isDown || this.touchState.left;
    const moveRight = this.cursors.right.isDown || this.keyD.isDown || this.touchState.right;
    const wantsJump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keySpace) || this.touchState.jump;

    if (moveLeft) {
      this.player.setAccelerationX(-800);
      this.player.setFlipX(true);
    } else if (moveRight) {
      this.player.setAccelerationX(800);
      this.player.setFlipX(false);
    } else {
      this.player.setAccelerationX(0);
    }

    if (wantsJump && onGround) {
      this.player.setVelocityY(-420);
      this.touchState.jump = false;
      if (window.SimpleAudio) window.SimpleAudio.playJump();
    }

    // Switch simple animations for placeholder character
    if (hasSheet) {
      if (!onGround) {
        const key = this.player.body.velocity.y < 0 ? 'p-jump' : 'p-fall';
        this.player.anims.play(key, true);
      } else if (moveLeft || moveRight) {
        this.player.anims.play('p-walk', true);
      } else {
        this.player.anims.play('p-idle', true);
      }
    } else if (!this.useCustomPlayer) {
      if (!onGround) {
        this.player.anims.play('player-jump', true);
      } else if (moveLeft || moveRight) {
        this.player.anims.play('player-walk', true);
      } else {
        this.player.anims.play('player-idle', true);
      }
    }

    // Fell into a pit
    if (this.player.y > this.scale.height + 60) {
      this.handlePlayerDeath();
    }
  }

  handleCollectCoin(player, coin) {
    if (!coin.active) return;
    coin.disableBody(true, true);
    this.coinCount += 1;
    if (this.coinText) this.coinText.setText(`Coins: ${this.coinCount}`);
    // Emit coins spark at world position
    this.sparkEmitter.emitParticleAt(coin.x, coin.y, 18);
    if (window.SimpleAudio) window.SimpleAudio.playCoin();
  }

  handlePlayerDeath() {
    if (this.isRespawning) return;
    this.isRespawning = true;
    this.cameras.main.flash(200, 255, 64, 64);
    this.player.setTint(0xff8a8a);
    if (window.SimpleAudio) window.SimpleAudio.playHit();
    this.time.delayedCall(200, () => {
      this.player.clearTint();
      this.player.setVelocity(0, 0);
      this.player.setX(this.respawnPoint.x);
      this.player.setY(this.respawnPoint.y);
      this.isRespawning = false;
    });
  }

  handleEnemyOverlap(player, enemy) {
    // Stomp if falling and above enemy
    const isStomp = player.body.velocity.y > 120 && player.y < enemy.y - 6;
    if (isStomp) {
      enemy.disableBody(true, true);
      player.setVelocityY(-280);
      this.sparkEmitter.emitParticleAt(enemy.x, enemy.y, 20);
    } else {
      this.handlePlayerDeath();
    }
  }

  createOnScreenControls() {
    const { width, height } = this.scale;
    const padY = height - 60;
    const leftX = 70;
    const rightX = 140;
    const jumpX = width - 70;

    const makeBtn = (x, y, iconKey, onDown, onUp) => {
      const base = this.add.image(x, y, 'btnBase').setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true });
      this.add.image(x, y, iconKey).setScrollFactor(0).setDepth(2001).setAlpha(0.9);
      base.on('pointerdown', () => { onDown(); });
      base.on('pointerup', () => { onUp(); });
      base.on('pointerout', () => { onUp(); });
      base.on('pointercancel', () => { onUp(); });
      return base;
    };

    makeBtn(leftX, padY, 'btnLeftIcon', () => { this.touchState.left = true; }, () => { this.touchState.left = false; });
    makeBtn(rightX, padY, 'btnRightIcon', () => { this.touchState.right = true; }, () => { this.touchState.right = false; });
    makeBtn(jumpX, padY, 'btnJumpIcon', () => { this.touchState.jump = true; }, () => { this.touchState.jump = false; });
  }
}

window.PlayScene = PlayScene;



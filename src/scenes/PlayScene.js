/* global Phaser */

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  alignPlayerToGround() {
    if (!this.playerBody || !this.playerBody.body) return;
    const groundTop = this.useTiles ? this.scale.height - 32 : this.scale.height - 16;
    const desiredBottom = groundTop;
    const bodyBottom = this.playerBody.body.bottom;
    const deltaY = desiredBottom - bodyBottom;
    if (deltaY !== 0) {
      this.playerBody.y += deltaY;
      if (this.playerBody.body.updateFromGameObject) this.playerBody.body.updateFromGameObject();
    }
  }

  getGroundTopY() {
    return this.useTiles ? this.scale.height - 32 : this.scale.height - 16;
  }

  safeRespawn() {
    const groundTop = this.getGroundTopY();
    const dropY = Math.max(0, (this.respawnPoint?.y ?? (groundTop - 6)) - (this.respawnDropHeight ?? 100));
    const dropX = this.respawnPoint?.x ?? 40;
    this.playerBody.setVelocity(0, 0);
    this.playerBody.setX(dropX);
    this.playerBody.setY(dropY);
    if (this.playerBody.body.updateFromGameObject) this.playerBody.body.updateFromGameObject();
  }

  createPlayerEntities() {
    const h = this.scale.height;
    const groundTopY = this.getGroundTopY();
    const startX = typeof this.spawnX === 'number' ? this.spawnX : 16;
    const startY = typeof this.spawnYOffset === 'number' ? (h - this.spawnYOffset) : (groundTopY + 1);

    // Physics body (invisible)
    this.playerBody = this.physics.add.sprite(startX, startY, 'spark');
    this.playerBody.setVisible(false);
    // Allow falling off the bottom to drop into pits; we handle reset ourselves
    this.playerBody.setCollideWorldBounds(false);
    this.playerBody.setMaxVelocity(200, 600);
    this.playerBody.setDragX(1600);
    this.playerBody.body.setSize(12, 22);
    this.playerBody.body.setOffset(0, 0);

    // Visual sprite (no physics)
    const visualKey = this.hasSheet ? 'playerSheet' : (this.useCustomPlayer ? 'playerCustom' : 'player_idle');
    this.playerSprite = this.add.sprite(this.playerBody.x, this.playerBody.body.bottom, visualKey);
    this.playerSprite.setOrigin(0.5, 1);

    // Scale visual by display height if provided
    if (typeof this.playerScale === 'number' && this.playerScale > 0) {
      this.playerSprite.setScale(this.playerScale);
    } else if (this.hasSheet && typeof this.playerDisplayHeight === 'number' && this.playerDisplayHeight > 0) {
      const baseFh = this.playerFrameHeight || 32;
      const s = Math.max(0.05, Math.min(1, this.playerDisplayHeight / baseFh));
      this.playerSprite.setScale(s);
      this.playerScale = s;
    } else if (this.hasSheet) {
      const targetDisplayHeight = 52;
      const baseFh = this.playerFrameHeight || 32;
      const s = Math.max(0.05, Math.min(1, targetDisplayHeight / baseFh));
      this.playerSprite.setScale(s);
      this.playerScale = s;
    }
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
    const enablePlayer = true; // always attempt to load player assets
    if (enableArt) {
      this.load.spritesheet('tiles', 'assets/tileset.png', { frameWidth: 16, frameHeight: 16 });
      this.load.spritesheet('coinSprite', 'assets/coin.png', { frameWidth: 16, frameHeight: 16 });
      this.load.spritesheet('enemySprite', 'assets/enemy.png', { frameWidth: 16, frameHeight: 16 });
    }
    if (enablePlayer) {
      this.load.image('playerCustom', 'assets/player.png');
      // Default to your sheet frame size (1024x1536 sheet = 4x3 grid → 256x512 frames)
      const pfw = Number.parseInt(params.get('pfw') || '256', 10);
      const pfh = Number.parseInt(params.get('pfh') || '512', 10);
      this.playerFrameWidth = pfw;
      this.playerFrameHeight = pfh;
      this.load.spritesheet('playerSheet', 'assets/player_sheet.png', { frameWidth: pfw, frameHeight: pfh });
      const ps = Number.parseFloat(params.get('ps') || '0');
      if (!Number.isNaN(ps) && ps > 0) {
        this.playerScale = ps;
      }
      const pdh = Number.parseInt(params.get('pdh') || '', 10);
      if (!Number.isNaN(pdh) && pdh > 0) {
        this.playerDisplayHeight = pdh; // desired on-screen height in pixels
      }
      // Optional cropping of the frame to remove padding in source pixels
      const ct = Number.parseInt(params.get('ct') || '0', 10);
      const cb = Number.parseInt(params.get('cb') || '0', 10);
      const cl = Number.parseInt(params.get('cl') || '0', 10);
      const cr = Number.parseInt(params.get('cr') || '0', 10);
      this.cropTop = Number.isFinite(ct) && ct > 0 ? ct : 0;
      this.cropBottom = Number.isFinite(cb) && cb > 0 ? cb : 0;
      this.cropLeft = Number.isFinite(cl) && cl > 0 ? cl : 0;
      this.cropRight = Number.isFinite(cr) && cr > 0 ? cr : 0;
      // Calibration for physics body (fractions or fixed pixel size)
      const bwf = Number.parseFloat(params.get('bwf') || '0'); // body width fraction of display width
      const bhf = Number.parseFloat(params.get('bhf') || '0'); // body height fraction of display height
      const byf = Number.parseFloat(params.get('byf') || '0'); // body bottom padding fraction of display height
      if (bwf > 0) this.bodyWidthFraction = Math.max(0.1, Math.min(1, bwf));
      if (bhf > 0) this.bodyHeightFraction = Math.max(0.1, Math.min(1, bhf));
      if (byf > 0) this.bodyBottomPadFraction = Math.max(0, Math.min(0.5, byf));
      const bwpx = Number.parseInt(params.get('bwpx') || '', 10); // body width in world pixels
      const bhpx = Number.parseInt(params.get('bhpx') || '', 10); // body height in world pixels
      if (!Number.isNaN(bwpx) && bwpx > 0) this.bodyWidthPx = bwpx;
      if (!Number.isNaN(bhpx) && bhpx > 0) this.bodyHeightPx = bhpx;
      const fpx = Number.parseInt(params.get('fpx') || '', 10); // legacy param (now superseded by rp)
      if (!Number.isNaN(fpx) && fpx >= 0) this.footOffsetPx = fpx;
      const rp = Number.parseInt(params.get('rp') || '', 10); // raise sprite above body by N px
      if (!Number.isNaN(rp)) this.bodyRaisePx = rp;
      // Optional spawn position tuning
      const sx = Number.parseInt(params.get('sx') || '', 10);
      if (!Number.isNaN(sx)) this.spawnX = sx;
      const sy = Number.parseInt(params.get('sy') || '', 10); // y offset from bottom edge
      if (!Number.isNaN(sy)) this.spawnYOffset = sy;
      // Respawn/drop and flash tuning
      const rdh = Number.parseInt(params.get('rdh') || '', 10); // respawn drop height
      if (!Number.isNaN(rdh) && rdh >= 0) this.respawnDropHeight = rdh;
      const flashMs = Number.parseInt(params.get('flash') || '', 10); // death flash duration ms
      if (!Number.isNaN(flashMs) && flashMs >= 0) this.deathFlashMs = flashMs;
    }
  }

  create(data) {
    const w = this.scale.width;
    const h = this.scale.height;
    this.worldWidth = 3000;
    this.difficulty = data?.difficulty || 'normal';
    this.enemySpeed = data?.enemySpeed ?? 70;
    this.respawnDropHeight = typeof this.respawnDropHeight === 'number' ? this.respawnDropHeight : 120; // default drop
    this.deathFlashMs = typeof this.deathFlashMs === 'number' ? this.deathFlashMs : 250; // default flash
    // Determine availability of external assets
    this.useTiles = this.textures.exists('tiles');
    this.useCoinSheet = this.textures.exists('coinSprite');
    this.useEnemySheet = this.textures.exists('enemySprite');
    this.disableAnimations = false; // re-enable animations for launch

    // If a player sheet exists, post-process it to remove white backgrounds (chroma key)
    if (this.textures.exists('playerSheet')) {
      const fwKey = this.playerFrameWidth || 24;
      const fhKey = this.playerFrameHeight || 32;
      const srcImg = this.textures.get('playerSheet').getSourceImage();
      if (srcImg && srcImg.width && srcImg.height) {
        const canvas = document.createElement('canvas');
        canvas.width = srcImg.width;
        canvas.height = srcImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(srcImg, 0, 0);
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            // If pixel is near white, make it transparent
            if (r > 245 && g > 245 && b > 245) {
              d[i + 3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          this.textures.remove('playerSheet');
          this.textures.addSpriteSheet('playerSheet', canvas, { frameWidth: fwKey, frameHeight: fhKey });
        } catch (e) {
          // If getImageData fails (tainted canvas), skip processing gracefully
        }
      }
    }

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

    // Player: use separate physics body and visual sprite
    this.hasSheet = this.textures.exists('playerSheet');
    this.useCustomPlayer = this.textures.exists('playerCustom') && this.textures.get('playerCustom').source[0]?.height > 0;
    this.createPlayerEntities();

    // Animations
    if (this.playerSprite && this.playerSprite.anims && this.hasSheet) {
      // Flexible sheet support. We will only create animations for rows that exist
      // and clamp frame counts to the available columns.
      const fw = this.playerFrameWidth || 24;
      const fh = this.playerFrameHeight || 32;
      const sheetImage = this.textures.get('playerSheet').getSourceImage();
      const cols = Math.max(1, Math.floor(sheetImage.width / fw));
      const rows = Math.max(1, Math.floor(sheetImage.height / fh));
      const rangeForRow = (rowIndex, desiredCount) => {
        if (rowIndex >= rows) return null;
        const count = Math.max(1, Math.min(desiredCount, cols));
        const start = rowIndex * cols;
        const end = start + count - 1;
        return { start, end };
      };

      const idleR = rangeForRow(0, 2);
      if (idleR && !this.anims.exists('p-idle')) {
        this.anims.create({ key: 'p-idle', frames: this.anims.generateFrameNumbers('playerSheet', idleR), frameRate: 4, repeat: -1 });
      }
      const walkR = rangeForRow(1, 6);
      if (walkR && !this.anims.exists('p-walk')) {
        this.anims.create({ key: 'p-walk', frames: this.anims.generateFrameNumbers('playerSheet', walkR), frameRate: 10, repeat: -1 });
      }
      const jumpR = rangeForRow(2, 1);
      if (jumpR && !this.anims.exists('p-jump')) {
        this.anims.create({ key: 'p-jump', frames: this.anims.generateFrameNumbers('playerSheet', jumpR), frameRate: 1, repeat: -1 });
      }
      const fallR = rangeForRow(3, 1);
      if (fallR && !this.anims.exists('p-fall')) {
        this.anims.create({ key: 'p-fall', frames: this.anims.generateFrameNumbers('playerSheet', fallR), frameRate: 1, repeat: -1 });
      }
      const hurtR = rangeForRow(4, 1);
      if (hurtR && !this.anims.exists('p-hurt')) {
        this.anims.create({ key: 'p-hurt', frames: this.anims.generateFrameNumbers('playerSheet', hurtR), frameRate: 1, repeat: -1 });
      }
      if (this.anims.exists('p-idle') && this.playerSprite) this.playerSprite.anims.play('p-idle');
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
      if (this.playerSprite) this.playerSprite.anims.play('player-idle');
    }
    // Physics tuning for better feel
    this.playerBody.setMaxVelocity(220, 600);
    this.playerBody.setDragX(1800);

    // Collisions
    this.physics.add.collider(this.playerBody, this.platforms);

    // Log keyboard capture and ensure canvas focus
    this.input.keyboard.addCapture(['LEFT', 'RIGHT', 'UP', 'SPACE', 'A', 'D']);
    this.input.on('pointerdown', () => {
      if (this.game.canvas) this.game.canvas.focus();
    });
    // Ensure multi-touch support for on-screen controls (add 2 extra pointers)
    if (this.input && this.input.addPointer) {
      this.input.addPointer(2);
    }

    // Overlap end flag to finish level
    this.physics.add.overlap(this.playerBody, this.endFlag, () => {
      const timeMs = this.time.now - this.levelStartTime;
      this.registry.set('coins', this.coinCount);
      this.registry.set('timeMs', timeMs);
      this.time.delayedCall(150, () => this.scene.start('BirthdayScene'));
    });

    // Camera follow with downward offset so the ground and player are visible on tall screens
    if (this.playerBody) {
      this.cameras.main.startFollow(this.playerBody, true, 0.1, 0.1);
      this.cameras.main.setLerp(0.1, 0.2);
      this.cameras.main.setFollowOffset(0, -40);
    }
    this.cameras.main.setBounds(0, 0, this.worldWidth, h);

    // Full Screen button (in-game) for Safari/iOS cases
    const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
    if (!isStandalone) {
      const fsBtn = this.add.text(this.scale.width - 12, 12, 'Full Screen', {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '16px',
        color: '#0f172a',
        backgroundColor: '#f1f5f9',
        padding: { x: 12, y: 8 },
      }).setScrollFactor(0).setDepth(3000).setOrigin(1, 0).setInteractive({ useHandCursor: true });
      fsBtn.on('pointerdown', () => {
        if (this.scale && !this.scale.isFullscreen && this.scale.startFullscreen) {
          try { this.scale.startFullscreen(); } catch (e) { /* noop */ }
        }
        const canLock = typeof screen !== 'undefined' && screen.orientation && screen.orientation.lock;
        if (canLock) {
          screen.orientation.lock('portrait-primary').catch(() => {});
        }
      });
    }

    // World bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, h);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Jump logic: allow double jump
    this.maxJumps = 2;
    this.jumpCount = 0;

    // Touch controls (simple): left half is left, right half is right, tap top to jump
    this.touchState = { left: false, right: false, jump: false };
    // Disabled global half-screen touch mapping to avoid conflicts with on-screen buttons

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
    this.physics.add.overlap(this.playerBody, this.coins, this.handleCollectCoin, undefined, this);

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
    this.physics.add.overlap(this.playerBody, this.spikes, this.handlePlayerDeath, undefined, this);
    this.physics.add.overlap(this.playerBody, this.lava, this.handlePlayerDeath, undefined, this);

    // Moving platforms
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    const mp1 = this.movingPlatforms.create(1400, h - 120, 'plat48');
    const mp2 = this.movingPlatforms.create(1700, h - 160, 'plat48');
    this.tweens.add({ targets: mp1, x: { from: 1350, to: 1500 }, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: mp2, x: { from: 1650, to: 1850 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.physics.add.collider(this.playerBody, this.movingPlatforms);

    // Falling platforms
    this.fallingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    const fp = this.fallingPlatforms.create(2100, h - 120, 'plat48');
    this.physics.add.collider(this.playerBody, this.fallingPlatforms, (player, platform) => {
      if (!platform.falling) {
        platform.falling = true;
        this.time.delayedCall(400, () => {
          platform.setImmovable(false);
          if (platform.body) platform.body.allowGravity = true;
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
    this.physics.add.overlap(this.playerBody, this.enemies, this.handleEnemyOverlap, undefined, this);

    // Checkpoints
    this.respawnPoint = { x: 40, y: this.getGroundTopY() - 6 };
    this.checkpoints = this.physics.add.staticGroup();
    const cp1 = this.checkpoints.create(1200, h - 16, 'flag').setOrigin(0, 1);
    const cp2 = this.checkpoints.create(2000, h - 16, 'flag').setOrigin(0, 1);
    this.physics.add.overlap(this.playerBody, this.checkpoints, (player, flag) => {
      this.respawnPoint = { x: flag.x + 10, y: flag.y - 24 };
      flag.setTint(0x10b981);
    });
  }

  update() {
    // Keep visual sprite glued to physics body
    if (this.playerSprite && this.playerBody) {
      this.playerSprite.x = this.playerBody.x;
      this.playerSprite.y = this.playerBody.body.bottom;
    }
    const onGround = this.playerBody.body.blocked.down || this.playerBody.body.touching.down;
    // Only auto-align if the body has sunk below the ground line (safety clamp)
    const groundTop = this.useTiles ? this.scale.height - 32 : this.scale.height - 16;
    // Let the player fully fall off-screen; handle reset when out of view
    if (onGround) {
      this.jumpCount = 0; // reset available jumps when we touch the ground
    }
    const moveLeft = this.cursors.left.isDown || this.keyA.isDown || this.touchState.left;
    const moveRight = this.cursors.right.isDown || this.keyD.isDown || this.touchState.right;
    const wantsJump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keySpace) || this.touchState.jump;

    if (moveLeft) {
      this.playerBody.setAccelerationX(-900);
      if (this.playerSprite) this.playerSprite.setFlipX(true);
    } else if (moveRight) {
      this.playerBody.setAccelerationX(900);
      if (this.playerSprite) this.playerSprite.setFlipX(false);
    } else {
      this.playerBody.setAccelerationX(0);
    }

    if (wantsJump && (onGround || this.jumpCount < this.maxJumps)) {
      this.playerBody.setVelocityY(-440);
      this.touchState.jump = false;
      this.jumpCount += 1;
      if (window.SimpleAudio) window.SimpleAudio.playJump();
    }

    // Clamp horizontal position within world bounds, but allow falling vertically
    if (this.playerBody.x < 8) this.playerBody.setX(8);
    if (this.playerBody.x > this.worldWidth - 8) this.playerBody.setX(this.worldWidth - 8);

    // Switch simple animations for placeholder or sheet character
    if (!this.disableAnimations && this.hasSheet) {
      let keyToPlay = null;
      if (!onGround) {
        const rising = this.playerBody.body.velocity.y < 0;
        keyToPlay = rising
          ? (this.anims.exists('p-jump') ? 'p-jump' : (this.anims.exists('p-fall') ? 'p-fall' : 'p-idle'))
          : (this.anims.exists('p-fall') ? 'p-fall' : (this.anims.exists('p-jump') ? 'p-jump' : 'p-idle'));
      } else if (moveLeft || moveRight) {
        keyToPlay = this.anims.exists('p-walk') ? 'p-walk' : 'p-idle';
      } else if (this.anims.exists('p-idle')) {
        keyToPlay = 'p-idle';
      }
      if (keyToPlay) this.playerSprite.anims.play(keyToPlay, true);
    } else if (!this.disableAnimations && !this.useCustomPlayer && this.playerSprite && this.playerSprite.anims) {
      if (!onGround) {
        this.playerSprite.anims.play('player-jump', true);
      } else if (moveLeft || moveRight) {
        this.playerSprite.anims.play('player-walk', true);
      } else {
        this.playerSprite.anims.play('player-idle', true);
      }
    }

    // Fell into a pit
    if (this.playerBody.y > this.scale.height + 60) {
      // Fell into void: silently reset above last checkpoint and drop in
      this.safeRespawn();
      return;
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
    this.cameras.main.flash(this.deathFlashMs ?? 250, 255, 64, 64);
    if (this.playerSprite) this.playerSprite.setTint(0xff8a8a);
    if (window.SimpleAudio) window.SimpleAudio.playHit();
    this.time.delayedCall(200, () => {
      if (this.playerSprite) this.playerSprite.clearTint();
      // Spawn above and let gravity pull the player down
      this.safeRespawn();
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
    // Try to respect mobile safe-area by estimating bottom inset
    const vv = (window && window.visualViewport) ? window.visualViewport : null;
    const safeInset = vv ? Math.max(0, (window.innerHeight || height) - vv.height) : 0;
    const padY = height - 60 - Math.min(40, safeInset);
    // Portrait-friendly layout: left/right bottom left, jump bottom right
    const margin = 18;
    const leftX = margin + 36;
    const rightX = margin + 100;
    const jumpX = width - (margin + 36);

    // Track active touches per button to avoid conflicts and support multi-touch
    if (!this.touchActive) {
      this.touchActive = { left: new Set(), right: new Set(), jump: new Set() };
    }

    const recomputeTouchState = () => {
      this.touchState.left = this.touchActive.left.size > 0;
      this.touchState.right = this.touchActive.right.size > 0;
      this.touchState.jump = this.touchActive.jump.size > 0;
    };

    const makeBtn = (x, y, iconKey, key) => {
      const base = this.add.image(x, y, 'btnBase').setScrollFactor(0).setDepth(2000).setInteractive({ useHandCursor: true });
      this.add.image(x, y, iconKey).setScrollFactor(0).setDepth(2001).setAlpha(0.9);
      const addPtr = (pointer) => { this.touchActive[key].add(pointer.id); recomputeTouchState(); };
      const delPtr = (pointer) => { this.touchActive[key].delete(pointer.id); recomputeTouchState(); };
      const stop = (pointer) => { if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation(); };
      base.on('pointerdown', (pointer) => { stop(pointer); addPtr(pointer); });
      base.on('pointerup',   (pointer) => { stop(pointer); delPtr(pointer); });
      base.on('pointerout',  (pointer) => { stop(pointer); delPtr(pointer); });
      base.on('pointercancel', (pointer) => { stop(pointer); delPtr(pointer); });
      return base;
    };

    // Left/right/up mapping
    makeBtn(leftX, padY, 'btnLeftIcon', 'left');
    makeBtn(rightX, padY, 'btnRightIcon', 'right');
    makeBtn(jumpX, padY, 'btnJumpIcon', 'jump');
  }
}

window.PlayScene = PlayScene;



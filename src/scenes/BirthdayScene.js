/* global Phaser */

class BirthdayScene extends Phaser.Scene {
  constructor() {
    super('BirthdayScene');
  }

  preload() {
    // Generate cake texture and ensure particles texture exists
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Cake base 48x36
    g.fillStyle(0x7c3f00, 1); // base
    g.fillRect(0, 20, 48, 16);
    g.fillStyle(0xfda4af, 1); // icing
    g.fillRect(0, 12, 48, 10);
    g.fillStyle(0xffffff, 1); // drips
    g.fillRect(6, 18, 4, 2);
    g.fillRect(20, 18, 4, 2);
    g.fillRect(34, 18, 4, 2);
    // candles
    g.fillStyle(0x60a5fa, 1);
    g.fillRect(10, 6, 4, 8);
    g.fillStyle(0x34d399, 1);
    g.fillRect(22, 6, 4, 8);
    g.fillStyle(0xfbbf24, 1);
    g.fillRect(34, 6, 4, 8);
    // flames
    g.fillStyle(0xffe08a, 1);
    g.fillTriangle(12, 2, 10, 6, 14, 6);
    g.fillTriangle(24, 2, 22, 6, 26, 6);
    g.fillTriangle(36, 2, 34, 6, 38, 6);
    g.generateTexture('cake', 48, 36);
    g.clear();
    // Ensure spark exists (if entering this scene first for any reason)
    if (!this.textures.exists('spark')) {
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 4, 4);
      g.generateTexture('spark', 4, 4);
    }
    g.destroy();
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0f172a');

    this.add.image(width / 2, height / 2 - 40, 'cake').setScale(3);

    this.add.text(width / 2, height / 2 + 40, 'Happy Birthday Reem!', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '34px',
      color: '#ffdde1',
      stroke: '#ff4d6d',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Show results if provided
    const coins = this.registry.get('coins') || 0;
    const timeMs = this.registry.get('timeMs');
    if (typeof timeMs === 'number') {
      const seconds = (timeMs / 1000).toFixed(1);
      this.add.text(width / 2, height / 2 + 84, `You collected ${coins} coin${coins === 1 ? '' : 's'} in ${seconds}s`, {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '20px',
        color: '#cbd5e1',
      }).setOrigin(0.5);
    }

    this.add.text(width / 2, height - 40, 'Tap to play again', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '18px',
      color: '#cbd5e1',
    }).setOrigin(0.5);

    // Confetti effect using new v3.60 particle API
    const colors = [0xfca5a5, 0xfef08a, 0x86efac, 0x93c5fd, 0xd8b4fe];
    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: width },
      y: -10,
      lifespan: 2000,
      speedY: { min: 180, max: 300 },
      speedX: { min: -50, max: 50 },
      quantity: 6,
      frequency: 40,
      scale: { start: 0.8, end: 0.2 },
      gravityY: 200,
      tint: colors,
      rotate: { min: 0, max: 360 },
      angle: 90,
      blendMode: 'SCREEN',
      emitting: true,
    });

    this.input.once('pointerdown', () => this.scene.start('PlayScene'));
    this.input.keyboard.once('keydown', () => this.scene.start('PlayScene'));

    if (window.SimpleAudio) {
      window.SimpleAudio.stopMusic();
      window.SimpleAudio.playWinJingle();
    }
  }
}

window.BirthdayScene = BirthdayScene;



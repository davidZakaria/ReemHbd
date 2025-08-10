/* global Phaser, SimpleAudio */

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0f172a');

    this.add.text(width / 2, 90, 'Happy Birthday Reem!', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '32px',
      color: '#ffdde1',
      stroke: '#ff4d6d',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, 140, 'Choose Difficulty', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '18px',
      color: '#cbd5e1',
    }).setOrigin(0.5);

    const makeBtn = (y, label, config) => {
      const btn = this.add.text(width / 2, y, label, {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '22px',
        color: '#0f172a',
        backgroundColor: '#f1f5f9',
        padding: { x: 14, y: 8 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', async () => {
        await SimpleAudio.ensureRunning();
        SimpleAudio.startMusic();
        this.scene.start('PlayScene', config);
      });
    };

    makeBtn(200, 'Easy',   { difficulty: 'easy',   enemySpeed: 50,  spikeCount: 8,  lavaW: 8 });
    makeBtn(250, 'Normal', { difficulty: 'normal', enemySpeed: 70,  spikeCount: 12, lavaW: 10 });
    makeBtn(300, 'Hard',   { difficulty: 'hard',   enemySpeed: 90,  spikeCount: 16, lavaW: 12 });

    this.add.text(width / 2, height - 40, 'Tip: Click once to enable audio and keyboard', {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
    }).setOrigin(0.5);
  }
}

window.MenuScene = MenuScene;



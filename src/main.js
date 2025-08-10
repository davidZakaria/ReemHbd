/* global Phaser, MenuScene, PlayScene, BirthdayScene */

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#93c5fd',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false,
    },
  },
  scene: [MenuScene, PlayScene, BirthdayScene],
};

window.addEventListener('load', () => {
  // eslint-disable-next-line no-new
  new Phaser.Game(config);
  // Start at menu
  window.game && window.game.destroy(true);
  // eslint-disable-next-line no-new
  const game = new Phaser.Game(config);
  window.game = game;
});



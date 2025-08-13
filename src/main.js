/* global Phaser, MenuScene, PlayScene, BirthdayScene */

const params = new URLSearchParams(window.location.search);
const arcadeDebug = params.get('debug') === '1' || params.get('debug') === 'true';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#93c5fd',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: arcadeDebug,
    },
  },
  scene: [MenuScene, PlayScene, BirthdayScene],
};

window.addEventListener('load', () => {
  // Clean up any previous instance (avoid clashing with the DOM element id `game`)
  if (window.phaserGame && typeof window.phaserGame.destroy === 'function') {
    window.phaserGame.destroy(true);
  }
  const gameInstance = new Phaser.Game(config);
  window.phaserGame = gameInstance;
});



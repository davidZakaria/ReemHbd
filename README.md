# Happy Birthday Reem – Web Game

A single-level mobile-friendly platformer built with Phaser 3.60 for Reem's birthday. Includes touch controls, coins, traps, enemies, checkpoints, a birthday ending screen with confetti, and optional custom art and player animations.

## Run locally

1. Install and start a static server
```sh
npm init -y
npm i -D live-server
npx live-server --host=0.0.0.0 --port=5173 --no-browser-cache
```
2. Open `http://127.0.0.1:5173/index.html`

## Optional external assets
Place PNGs in `assets/` and enable via URL flags to avoid 404s.

- Tileset: `assets/tileset.png` (spritesheet 16x16). Frames: 0=ground, 1=block, 2=spike, 3=lava
- Coin: `assets/coin.png` (spritesheet 16x16, 6 frames)
- Enemy: `assets/enemy.png` (spritesheet 16x16, 4 frames)
- Player: either `assets/player.png` (single) or `assets/player_sheet.png` (animated)

Enable art and player via URL flags:
```
/index.html?art=1&player=1&pfw=24&pfh=32
```
- `pfw`/`pfh`: frame width/height of your `player_sheet.png`

## Controls
- Keyboard: A/D or Left/Right to move, Space/Up to jump
- Touch: on-screen left/right/jump buttons; tap top to jump

## Scenes
- Menu: difficulty selector and starts the music
- Play: gameplay with traps, coins, enemies, checkpoints
- Birthday: confetti celebration, shows results, jingle

## License
For personal use in a birthday greeting.



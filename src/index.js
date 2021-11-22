import './index.css'

import Phaser from 'phaser'

import { MainMenuScene } from './scenes/mainMenuScene'
import { GameScene } from './scenes/gameScene'
import { HUDScene } from './scenes/hudScene'
import { GameOverScene } from './scenes/gameOverScene'

var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#8AA8B2',
    audio: {
        disableWebAudio: true
    },
    scene: [GameScene, HUDScene, MainMenuScene, GameOverScene]
};

var game = new Phaser.Game(config);
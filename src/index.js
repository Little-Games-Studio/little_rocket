import Phaser from 'phaser'

import { GameScene } from './scenes/gameScene'
import { PauseScene } from './scenes/pauseScene'
import { HUDScene } from './scenes/hudScene'
import { GameOverScene } from './scenes/gameOverScene'

var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    backgroundColor: '#8AA8B2',
    pixelArt: true,
    audio: {
        disableWebAudio: true
    },
    scene: [GameScene, PauseScene, HUDScene, GameOverScene ]
};

var game = new Phaser.Game(config);
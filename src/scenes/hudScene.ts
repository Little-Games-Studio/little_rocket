import * as Phaser from 'phaser';
import { GameScene } from './gameScene';

import * as arrow_left from './../assets/images/arrow_left.png'
import * as arrow_right from './../assets/images/arrow_right.png'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'HUD',
};

export class HUDScene extends Phaser.Scene {

    private myGame: GameScene;

    private score_text: any;
    private collected_stars_text: any;
    private speed_text: any;

    private leftButton: any;
    private rightButton: any;
    //rocket.cannon.currentValue
    //rocket.shield.currentValue
    //rocket.engine.currentValue

    constructor() {
        super(sceneConfig);
    }

    preload(): void {
        this.load.image('arrow_left', arrow_left);
        this.load.image('arrow_right', arrow_right);
    }

    create() {
        //  Grab a reference to the Game Scene
        this.myGame = this.scene.get('GameScene') as GameScene;

        //  Our Text object to display the Score
        this.score_text = this.add.text(10, 10, 'Score: 0', { font: '28px Arial' });
        this.collected_stars_text = this.add.text(10, 50, 'Stars: 0', { font: '28px Arial' });
        this.speed_text = this.add.text(10, 90, 'Speed: 0 km/h', { font: '28px Arial' });

        const x_left = this.cameras.main.worldView.x + 60;
        const x_right = this.cameras.main.worldView.x + this.cameras.main.width - 60;
        const y = this.cameras.main.worldView.y + this.cameras.main.height - 60;

        this.leftButton = this.add.image(x_left, y, 'arrow_left').setOrigin(0.5);
        this.leftButton.setInteractive();

        this.leftButton.on('pointerdown', () => {
            this.myGame.rocket.move_left = true;
        });

        this.leftButton.on('pointerup', () => {
            this.myGame.rocket.move_left = false;
        });

        this.rightButton = this.add.sprite(x_right, y, 'arrow_right').setOrigin(0.5);
        this.rightButton.setInteractive();

        this.rightButton.on('pointerdown', () => {
            this.myGame.rocket.move_right = true;
        });

        this.rightButton.on('pointerup', () => {
            this.myGame.rocket.move_right = false;
        });
    }

    update(): void {
        this.score_text.setText('Score: ' + this.myGame.score);
        this.collected_stars_text.setText('Stars: ' + this.myGame.collected_stars);
        this.speed_text.setText('Speed: ' + this.myGame.speed + ' km/h');
    }
}
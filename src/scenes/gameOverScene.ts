import * as Phaser from 'phaser';
import { GameScene } from './gameScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOverScene',
};

export class GameOverScene extends Phaser.Scene {

    private myGame: GameScene;
    private title: any;
    private startButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(): void {
        console.log('Game-Over Scene launched.');

        this.myGame = this.scene.get('GameScene') as GameScene;

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.title = this.add.text(screenCenterX, screenCenterY - 25, 'Game Over', { font: '28px Arial' }).setOrigin(0.5);

        this.startButton = this.add.text(screenCenterX, screenCenterY + 25, 'RESTART', { font: '28px Arial' }).setOrigin(0.5);
        this.startButton.setInteractive();

        this.startButton.once('pointerup', () => {
            this.handleClickOnRestart();
        });

        this.input.keyboard.once('keydown-ENTER', () => {
            this.handleClickOnRestart();
        }, this);
    }

    handleClickOnRestart() {
        this.myGame.reset();
        this.scene.setVisible(false);
        this.scene.pause('GameOverScene');
        this.scene.resume('GameScene');
    }
}
import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'PauseScene',
};

export class PauseScene extends Phaser.Scene {

    private pause_text: any;
    private resumeButton: any;

    constructor() {
        super(sceneConfig);
    }

    create(): void {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.pause_text = this.add.text(screenCenterX, screenCenterY - 25, 'GAME PAUSED', { font: '28px Arial' }).setOrigin(0.5);

        this.resumeButton = this.add.text(screenCenterX, screenCenterY + 25, 'RESUME', { font: '28px Arial' }).setOrigin(0.5);
        this.resumeButton.setInteractive();
        this.resumeButton.once('pointerup', () => {
            this.scene.resume('GameScene');
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.resume('GameScene');
        }, this);
    }
}
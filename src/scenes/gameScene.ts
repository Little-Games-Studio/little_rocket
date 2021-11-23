import * as Phaser from 'phaser';

import * as clouds_big from './../assets/images/background/clouds_big.png'
import * as clouds_small from './../assets/images/background/clouds_small.png'

import * as asteroid_png from './../assets/images/asteroid.png'
import * as racing_mp3 from './../assets/audio/racing.mp3'

import * as rocket_png from './../gameObjects/rocket/rocket.png'
import { Rocket } from '../gameObjects/rocket/rocket'

import * as star_png from './../assets/images/star.png'
import { Star } from '../gameObjects/star/star'
import { Asteroid } from '../gameObjects/asteroid/asteroid';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'GameScene',
    physics: {
        arcade: {
            debug: true,
        },
        matter: {
            debug: false,
            gravity: false
        }
    },
};

export class GameScene extends Phaser.Scene {

    public rocket: Rocket;
    public speed: integer = 100;
    public score: integer = 0;
    public distance_to_goal: integer;
    public collected_stars: integer = 0;

    private clouds_small: Phaser.GameObjects.TileSprite;
    private clouds_big: Phaser.GameObjects.TileSprite;

    private music: any;

    private speed_timer: integer;
    private spawn_timer: integer;

    private stars: Array<any>;
    private asteroids: Array<any>;

    constructor() {
        super(sceneConfig);
    }

    preload(): void {
        this.load.image('clouds_big', clouds_big);
        this.load.image('clouds_small', clouds_small);
        this.load.image('star', star_png);
        this.load.image('asteroid', asteroid_png);

        this.load.spritesheet('rocket', rocket_png, { frameWidth: 50, frameHeight: 140 });
        
        this.load.audio('music', [racing_mp3]); 
    }

    create(): void {

        this.clouds_small = this.add.tileSprite(300, 400, 600, 1600, 'clouds_small');
        this.clouds_big = this.add.tileSprite(300, 400, 600, 1600, 'clouds_big');

        this.clouds_small.alpha = 0.3;
        this.clouds_big.alpha = 0.6;

        this.matter.world.on('collisionstart', event => {
            for (var i = 0; i < event.pairs.length; i++) {

                var bodyA = this.getRootBody(event.pairs[i].bodyA);
                var bodyB = this.getRootBody(event.pairs[i].bodyB);

                if ((bodyA.label === 'rocket' && bodyB.label === 'star')) {
                    this.collectStar(bodyB.gameObject);
                }

                if ((bodyB.label === 'rocket' && bodyA.label === 'star')) {
                    this.collectStar(bodyA.gameObject);
                }

                if ((bodyA.label === 'rocket' && bodyB.label === 'asteroid')) {
                    this.hitAsteroid();
                }

                if ((bodyB.label === 'rocket' && bodyA.label === 'asteroid')) {
                    this.hitAsteroid();
                }
            }
        });

        this.rocket = new Rocket(this, this.cameras.main.centerX, this.cameras.main.height - 100);
        
        this.music = this.sound.add('music');
        this.music.loop = true;

        //this.music.play();

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause('GameScene');
            this.scene.launch('MainMenuScene', { is_paused: true });
        }, this);

        this.events.on('pause', () => {
            this.music.pause();
            console.log('Game paused');
        })

        this.events.on('resume', () => {
            this.music.resume();
            console.log('Game resumed');
        })

        this.stars = [];
        this.asteroids = [];

        this.score = 0;
        this.collected_stars = 0;
        this.speed = 100;
        this.speed_timer = 0;
        this.spawn_timer = 0;

        //this.music.pause();
        this.scene.pause('GameScene');
    }

    update(time, delta): void {

            this.speed_timer += delta;

            if (this.speed_timer > 1000 /*ms*/) {
                this.score += 1;
                this.speed += 1;
                this.speed_timer -= 1000;
            }

            this.clouds_small.tilePositionY -= 0.15 * delta * (this.speed / 100);
            this.clouds_big.tilePositionY -= 0.2 * delta * (this.speed / 100);

            this.rocket.update();

            this.spawn_timer += delta * (this.speed / 100);

            if (this.spawn_timer > 1000) {

                var star = new Star(this);
                this.stars.push(star);

                var asteroid = new Asteroid(this);
                this.asteroids.push(asteroid);

                this.spawn_timer -= 1000;
            }

            this.stars.forEach((child: any) => {
                child.y += 0.3 * delta * (this.speed / 100);
            });

            this.stars.forEach((star: Phaser.GameObjects.Sprite) => {
                if (star.y > 900) {
                    this.destroyStar(star);
                }
            });

            this.asteroids.forEach((child: any) => {
                child.y += 0.25 * delta * (this.speed / 100);
            });

            this.asteroids.forEach((child: Phaser.GameObjects.Sprite) => {
                if (child.y > 900) {
                    this.asteroids.splice(this.asteroids.indexOf(child), 1);
                    this.matter.world.remove(child);
                    child.destroy();
                }
            });
    }

    reset(): void {

        this.score = 0;
        this.collected_stars = 0;
        this.speed = 100;
        this.speed_timer = 0;
        this.spawn_timer = 0;

        this.stars.forEach((child: any) => {
            this.stars.splice(this.stars.indexOf(child), 0);
            this.matter.world.remove(child);
            child.destroy();
        });

        this.asteroids.forEach((child: any) => {
            this.asteroids.splice(this.asteroids.indexOf(child), 0);
            this.matter.world.remove(child);
            child.destroy();
        });

        this.stars = [];
        this.asteroids = [];

        this.rocket.x = this.cameras.main.centerX;
        this.rocket.y = this.cameras.main.height - 100;
    }

    collectStar(star): void {
        this.collected_stars += 1;
        this.score += 10;
        this.destroyStar(star);
    }

    hitAsteroid(): void {
        this.events.emit('hitAsteroid');
        this.music.pause();
        this.scene.pause('GameScene');
        this.scene.launch('GameOverScene');
    }

    destroyStar(star) {
        this.stars.splice(this.stars.indexOf(star), 1);
        this.matter.world.remove(star);
        star.destroy();
    }

    getRootBody(body) {
        if (body.parent === body) {
            return body;
        }
        while (body.parent !== body) {
            body = body.parent;
        }
        return body;
    }
}
import './index.less';
import { KEY_DOWN, KEY_LEFT, KEY_SPACE, KEY_RIGHT, KEY_UP } from '../common/js/const';
import { audio } from '../common/js/audio';

export default class controller {

    constructor(stage) {
        this.ele_btn_left = document.querySelector('.btn.left');
        this.ele_btn_right = document.querySelector('.btn.right');
        this.ele_btn_up = document.querySelector('.btn.up');
        this.ele_btn_down = document.querySelector('.btn.down');
        this.ele_btn_space = document.querySelector('.btn.space');

        this.stage = stage;
    }

    init() {
        this.bindEvent();

        document.onkeydown = (e) => {
            switch (e.keyCode) {
                case KEY_UP: {
                    this.ele_btn_up.click();
                    break;
                }
                case KEY_SPACE: {
                    this.ele_btn_space.click();
                    break;
                }
                case KEY_DOWN: {
                    this.ele_btn_down.click();
                    break;
                }
                case KEY_LEFT: {
                    this.ele_btn_left.click();
                    break;
                }
                case KEY_RIGHT: {
                    this.ele_btn_right.click();
                    break;
                }
            }
        };

    }

    bindEvent() {
        this.ele_btn_space.onclick = () => {
            this.stage.data.currentShape.fastDown();
            this.stage.shake();
            this.stage.inactive();
            audio.data.BOTTOM.play();
        };
        this.ele_btn_up.onclick = () => {
            this.stage.data.currentShape.clockwise90();
            audio.data.SPIN.play();
        };
        this.ele_btn_down.onclick = () => {
            this.stage.data.currentShape.canMove().down && this.stage.data.currentShape.moveDown();
            audio.data.BTN.play();
        };
        this.ele_btn_left.onclick = () => {
            this.stage.data.currentShape.canMove().left && this.stage.data.currentShape.moveLeft();
            audio.data.BTN.play();
        };
        this.ele_btn_right.onclick = () => {
            this.stage.data.currentShape.canMove().right && this.stage.data.currentShape.moveRight();
            audio.data.BTN.play();
        };
    }

    distory() {
        this.ele_btn_space.onclick = () => {
        };
        this.ele_btn_up.onclick = () => {
        };
        this.ele_btn_down.onclick = () => {
        };
        this.ele_btn_left.onclick = () => {
        };
        this.ele_btn_right.onclick = () => {
        };
    }
}
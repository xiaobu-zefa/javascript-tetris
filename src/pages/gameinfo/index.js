import './index.less';
import 'font-awesome/css/font-awesome.min.css';
import { INFO_STYLE } from '../common/js/const';
import { audio } from '../common/js/audio';
import Utils from '../common/js/utils';
import Shape from '../common/js/shape';

export const next = {
    data: {
        ele: document.querySelector('.next .con'),
        shape: null,
        nextShape: null,
    },
    init() {
        this.data.nextShape = Utils.randomShape();
        this.updateArea();
    },
    // 提供下一个形状
    renderNextShape() {
        let tmpShape = this.data.nextShape;
        this.data.nextShape = Utils.randomShape();
        this.updateArea();
        return tmpShape;
    },
    // 更新显示区
    updateArea() {
        if (this.data.shape) {
            this.data.shape.removeSelf();
        }
        this.data.shape = new Shape({
            stage: this,
            offSetLeft: INFO_STYLE.width / 2,
            arr: this.data.nextShape,
        });
        this.data.shape.createSelf();
    }
};

export const score = {
    data: {
        ele: document.querySelector('.score .con'),
        score: 0,
    },
    init() {
        this.data.score = 0;
        this.data.ele.innerHTML = this.data.score;
    },
    // 分数增加
    addScore(score) {
        this.data.score += score;
        this.data.ele.innerHTML = this.data.score;
    },
};

export const level = {
    data: {
        ele: document.querySelector('.level .con'),
        level: 1,
        time: 1000,
    },
    init() {
        this.changeLevel(1);
    },
    changeLevel(level) {
        console.log(level);
        this.data.time = 1100 - level * 100;
        this.data.ele.innerHTML = level;
    }
};

export const operation = {
    data: {
        ele_audio: document.querySelector('.operation .con .audio'),
        status: true, // true 开启   false  关闭
    },
    init() {
        this.bindEvent();
    },
    bindEvent() {
        this.data.ele_audio.onclick = () => {
            console.log('audio click');
            if (this.data.status) {
                audio.close();
                this.data.status = false;
                this.data.ele_audio.classList.remove('fa-volume-up');
                this.data.ele_audio.classList.add('fa-volume-off');
            }
            else {
                audio.open();
                this.data.status = true;
                this.data.ele_audio.classList.remove('fa-volume-off');
                this.data.ele_audio.classList.add('fa-volume-up');
            }
        };
    }
};


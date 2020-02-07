import './index.less';
import 'font-awesome/css/font-awesome.min.css';
import { INFO_STYLE, BLOCK_SIZE } from '../common/js/const';
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
            arr: this.data.nextShape,
        });
        this.data.shape.createSelf();
        // 调整位置
        // x 轴上最多的方块数量
        let xMaxSum = 0;
        // 左边空白了几个格
        let spaceSum = 0;
        for (let i = 0; i < this.data.shape.arr.length; i++) {
            for (let j = 0; j < this.data.shape.arr.length; j++) {

                if (this.data.shape.arr[j][i] === 1) {
                    xMaxSum++;
                    break;
                }
                else if (xMaxSum === 0 && j === this.data.shape.arr[i].length) {
                    spaceSum++;
                }
            }
        }

        let shapeWidth = xMaxSum * BLOCK_SIZE;

        this.data.shape.blocks.forEach(b => {
            let offLeft = parseInt(INFO_STYLE.width - shapeWidth) / 2 - (spaceSum * BLOCK_SIZE);
            b.blockEle.style.left = `${parseInt(b.blockStyle.left) + offLeft}px`;
        });

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


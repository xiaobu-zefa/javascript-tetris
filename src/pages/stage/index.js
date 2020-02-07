import './index.less';
import { BLOCK_SIZE, X_SUM, Y_SUM, STAGE_STYLE } from '../common/js/const';
import { next, score, level } from '../gameinfo';
import { audio } from '../common/js/audio';
import Controller from '../controller';
import Shape from '../common/js/shape';
import Block from '../common/js/block';

export const stage = {
    data: {
        ele: document.querySelector('.stage'),  // dom 元素
        allBlocks: [],                          // 存放已经固定的方块
        tmpBlocks: [],                          // 存放临时方块
        allLines: 10,                            // 总消除行数
        currentShape: null,                     // 当前形状
        btn_start: null,                        // 开始按钮
        controller: null,                       // 控制器
    },

    init() {
        this.bindEvent();
        this.data.controller = new Controller(this);
    },

    bindEvent() {
        // 开始游戏按钮
        this.data.btn_start = document.querySelector('.start');
        this.data.btn_start.onclick = () => {
            console.log('开始游戏');
            this.data.btn_start.classList.add('dis-none');
            this.data.controller.init();
            this.clearTmpBlocks();
            next.init();
            score.init();
            level.init();
            this.runGame();
        }
    },

    // 运行游戏
    runGame() {
        let shapeArr = next.renderNextShape();
        this.data.currentShape = new Shape({
            arr: shapeArr,
            offSetLeft: STAGE_STYLE.width / 2 - BLOCK_SIZE,
            stage: this,
        });
        this.data.currentShape.createSelf();
        if (!this.end()) {
            this.data.currentShape.timer = setInterval(() => {
                if (this.data.currentShape.canMove().down) {
                    this.data.currentShape.moveDown();
                }
                else {
                    this.inactive();
                }
            }, level.data.time);
        }
        else {
            this.data.currentShape.removeSelf();
        }
    },

    // 方块落下后要干的事情
    inactive() {
        this.data.currentShape.invalidation();
        clearInterval(this.data.currentShape.timer);
        this.clearBlocks();
        this.runGame();
    },

    // 消除方块
    clearBlocks() {
        let line = 0;
        for (let j = Y_SUM; j >= 0; j--) {
            let tmpBlocksIndex = [];
            // 代表这一行的上偏移量
            let lineOffsetTop = j * BLOCK_SIZE;
            // 把这一行的所有方块筛选出来
            this.data.allBlocks.forEach((bl, index) => {
                if (bl.blockEle.offsetTop === lineOffsetTop) {
                    tmpBlocksIndex.push(index);
                }
                if (tmpBlocksIndex.length === X_SUM) {
                    return;
                }
            });
            // 如果这一行的方块数量已经达到了一行最大行方块数量，那么这一行消除
            if (tmpBlocksIndex.length === X_SUM) {
                tmpBlocksIndex.forEach(index => {
                    this.data.allBlocks[index].removeSelf();
                    delete this.data.allBlocks[index];
                });
                // 然后这一行上面的所有方块全部下移一行
                this.data.allBlocks.forEach(bl => {
                    if (bl.blockEle.offsetTop < lineOffsetTop) {
                        bl.moveDown();
                    }
                });
                // 然后继续从这一行开始判断
                j++;
                // 播放消除音效
                audio.data.DESTORY.play();
                line++;

            }
        }
        // 计入总消除行数
        this.data.allLines += line;
        let tmplevel = parseInt(this.data.allLines / 10);
        if (tmplevel < 1) tmplevel = 1;
        if (tmplevel > 10) tmplevel = 10;
        level.changeLevel(tmplevel);
        // 加分
        if (line === 1) {
            score.addScore(10 * level.data.level);
        }
        else if (line === 2) {
            score.addScore(30 * level.data.level);
        }
        else if (line === 3) {
            score.addScore(60 * level.data.level);
        }
        else if (line === 4) {
            score.addScore(100 * level.data.level);
        }
    },

    // 游戏结束
    end() {
        if (
            this.data.currentShape.blocks.some(block => {
                return this.data.allBlocks.some(bl => {
                    return parseInt(block.blockEle.style.top) === parseInt(bl.blockEle.style.top) && parseInt(block.blockEle.style.left) === parseInt(bl.blockEle.style.left);
                });
            })
        ) {


            this.data.allBlocks.forEach(b => {
                b.removeSelf();
            });
            this.data.allBlocks = [];
            this.data.controller.distory();
            this.endAnimation().then(() => {
                this.data.btn_start.classList.remove('dis-none');
                this.data.btn_start.innerHTML = '重新开始';
            });
            return true;

        }
        return false;
    },

    // 急速下落后，画面震动效果
    shake() {
        this.data.ele.style.top = `${parseInt(getComputedStyle(this.data.ele).top) + 5}px`;
        setTimeout(() => {
            this.data.ele.style.top = `${parseInt(getComputedStyle(this.data.ele).top) - 5}px`;
        }, 50);
    },

    // 结束动画 从画布底部开始一行行的往上填充的方块
    endAnimation() {
        return new Promise((reslove, reject) => {
            audio.data.LOST.play();
            let i = 0, j = 0;
            let animationTimer = setInterval(() => {
                while (i < X_SUM) {
                    let block = new Block(this);
                    block.createSelf(i * BLOCK_SIZE, (Y_SUM - 1 - j) * BLOCK_SIZE);
                    block.blockEle.className = 'inactiveBlock';
                    this.data.tmpBlocks.push(block);
                    i++;
                }
                i = 0;
                j++;

                if (j >= Y_SUM) {
                    clearInterval(animationTimer);
                    reslove();
                }
            }, 80);
        });
    },

    // 清空临时方块
    clearTmpBlocks() {
        this.data.tmpBlocks.forEach((b) => {
            b.removeSelf();
        });
        this.data.tmpBlocks = [];
    }
};


import Utils from './utils';
import Shape from './shape';
import Block from './block';
import { BGM2, DESTORY, BGM1, LOST, BOTTOM, SPIN, BTN } from './audio.js'
import { STAGE_STYLE, BLOCK_SIZE, SHAPES, ALL_INACTIVE_BLOCKS, KEY_DOWN, KEY_LEFT, KEY_UP, KEY_SPACE, KEY_RIGHT, SHAPE_STATE, SHAPE_DEFAULT_OFFSET, LEVEL } from './const.js';

// 画布上一行最多的方块数量
let xSum = STAGE_STYLE.width / BLOCK_SIZE;
// 画布上一列最多的方块数量
let ySum = STAGE_STYLE.height / BLOCK_SIZE;
// 是否是暂停状态
let pause = true;
// 临时方块存放数组
let tmpBlocks = [];
// 当前控制的形状
let currentShape;
// 控制方块下落的定时器
let shapeTimer;
// 保存下一个方块的数组矩阵信息
let nextBlockArr;
// 保存下一个方块
let nextBlock;
// 保存当前级别
let currentLevel;
// 保存当前分数
let currentScore;
// 获取游戏区域
let gameStage = document.querySelector('.stage');
// 获取下一个方块显示区
let nextBlockPanel = document.querySelector('.next');
// 获取分数显示区域 
let scorePanel = document.querySelector('.score');
// 获取级别显示区域
let levelPanel = document.querySelector('.level');
// 获取所有控制按钮
let conUp = document.querySelector('.con-up');
let conDown = document.querySelector('.con-down');
let conLeft = document.querySelector('.con-left');
let conRight = document.querySelector('.con-right');
let conSpace = document.querySelector('.con-space');
let conPause = document.querySelector('.con-pause');
let conStart = document.querySelector('.con-start');


// 解决移动端 300ms 延时问题，缩放问题
Utils.banIOS();
// 初始化
init();

/** 初始化 */
function init() {
    conStart.classList.remove('dis-none');
    currentLevel = 1;
    currentScore = 0;
    // 游戏设置为暂停状态
    pause = true;
    // 页面上填充方块
    tmpBlocks = [];
    for (let i = 0; i < xSum; i++) {
        for (let j = 0; j < ySum; j++) {
            let block = new Block({
                stage: gameStage,
            });
            block.createSelf(i * BLOCK_SIZE, j * BLOCK_SIZE);
            block.changeStyle('inactiveBlock');
            tmpBlocks.push(block);
        }
    }
}

/**
 * 游戏开始
 */
function start() {
    // 全屏
    // document.documentElement.requestFullscreen(); 
    scorePanel.innerHTML = currentScore;
    levelPanel.innerHTML = currentLevel;
    pause = false;
    tmpBlocks.forEach(bl => {
        bl.removeSelf();
    });
    tmpBlocks = [];
    conStart.classList.add('dis-none');
    BGM2.play();
    run();
    listen();
}

/** 
 * 游戏运行流程 
 * 1. [如果下一个方块数组矩阵 == 空，那么就随机选一个形状信息赋值，当前形状也随机选一个形状信息创建]，执行 2 3
 * 2. 给当前形状绑定自动下落的定时器
 * 3. 控制当前形状，如果当前形状不能移动了，那么清除定时器，改变形状样式，执行 4
 * 4. 寻找能够消除的行将其消除，执行 5
 * 5. 判断游戏是否可以结束，如果不可以结束，执行 6，如果可以结束了，执行 7
 * 6. 从下一个方块数组矩阵中获取信息，创建新形状，下一个方块数组矩阵重新赋随机值，执行 2 3
 * 7. 执行游戏结束逻辑
 */
function run() {
    clearLineBlocks();
    if (currentScore >= currentLevel * 12 * 100) {
        if (currentLevel < LEVEL.length - 1) {
            currentLevel++;
        }
        levelPanel.innerHTML = currentLevel;
    }
    if (!nextBlockArr) {
        nextBlockArr = randomShape();
        currentShape = new Shape({
            arr: randomShape(),
            offSetLeft: SHAPE_DEFAULT_OFFSET.x,
            offsetTop: SHAPE_DEFAULT_OFFSET.y,
            stage: gameStage,
        });
    } else {
        currentShape = new Shape({
            arr: nextBlockArr,
            offSetLeft: SHAPE_DEFAULT_OFFSET.x,
            offsetTop: SHAPE_DEFAULT_OFFSET.y,
            stage: gameStage,
        });
        nextBlockArr = randomShape();
    }
    nextBlock && nextBlock.removeSelf();
    nextBlock = new Shape(
        {
            arr: nextBlockArr,
            offSetLeft: 0,
            offsetTop: 0,
            stage: nextBlockPanel,
        }
    );
    nextBlock.createSelf();
    currentShape.createSelf();
    if (isEnd()) {
        end();
        return;
    }
    shapeTimer = setInterval(() => {

        if (currentShape.canMove().down) {
            currentShape.moveDown();
        } else {
            clearInterval(shapeTimer);
            currentShape.changeStyle('inactiveBlock');
            currentShape.blocks.forEach(bl => {
                ALL_INACTIVE_BLOCKS.push(bl);
            });
            run();
        }
    }, LEVEL[currentLevel]);
}


/**
 * 随机选取一种形状
 */
function randomShape() {
    let num = Utils.randomNum(0, SHAPES.length - 1);
    return SHAPES[num];
}

/** 
 * 清除画面上组成一行的方块 
 * 从画布最底层开始一层层的往上遍历，如果组成了一行，那么这一行消除，这一行上面的集体下移一行
 * 因为每次形状下落还没固定，所以判断是的时候还没。。。
 */
function clearLineBlocks() {
    for (let j = ySum; j >= 0; j--) {
        let tmpBlocksIndex = [];
        // 代表这一行的上偏移量
        let lineOffsetTop = j * BLOCK_SIZE;
        // 把这一行的所有方块筛选出来
        ALL_INACTIVE_BLOCKS.forEach((bl, index) => {
            if (bl.blockEle.offsetTop === lineOffsetTop) {
                tmpBlocksIndex.push(index);
            }
            if (tmpBlocksIndex.length === xSum) {
                return;
            }
        });
        // 如果这一行的方块数量已经达到了一行最大行方块数量，那么这一行消除
        if (tmpBlocksIndex.length === xSum) {
            tmpBlocksIndex.forEach(index => {
                ALL_INACTIVE_BLOCKS[index].removeSelf();
                delete ALL_INACTIVE_BLOCKS[index];
            });
            // 然后这一行上面的所有方块全部下移一行
            ALL_INACTIVE_BLOCKS.forEach(bl => {
                if (bl.blockEle.offsetTop < lineOffsetTop) {
                    bl.moveDown();
                }
            });
            // 然后继续从这一行开始判断
            j++;
            // 播放消除音效
            DESTORY.play();
            // 加分
            currentScore += 100;
            scorePanel.innerHTML = currentScore;
        }
    }
}

/** 
 * 判断游戏是否应该结束 
 * 如果下一个要出现的形状中的任意一个方块会和所有已固定的方块任意一个重合，那么游戏就结束了
 * */
function isEnd() {
    return currentShape.blocks.some(block => {
        return ALL_INACTIVE_BLOCKS.some(bl => {
            return parseInt(block.blockEle.style.top) === parseInt(bl.blockEle.style.top) &&
                parseInt(block.blockEle.style.left) === parseInt(bl.blockEle.style.left);
        });
    });
}


/** 结束游戏 */
function end() {
    clearInterval(shapeTimer);
    removeListen();
    BGM2.stop();
    LOST.play();
    endAnimation(init);
}

/** 
 * 结束动画 
 * 从画布底部开始一行行的往上填充的方块
 * */
function endAnimation(callback) {
    let i = 0, j = 0;
    let _tmpBlocks = [];
    let animationTimer = setInterval(() => {
        while (i < xSum) {
            let block = new Block({ stage: gameStage });
            block.createSelf(i * BLOCK_SIZE, (ySum - 1 - j) * BLOCK_SIZE);
            block.blockEle.className = 'inactiveBlock';
            _tmpBlocks.push(block);
            i++;
        }
        i = 0;
        j++;
        if (j > ySum) {
            clearInterval(animationTimer);
            _tmpBlocks.forEach(bl => {
                bl.removeSelf();
            });
            ALL_INACTIVE_BLOCKS.forEach((bl, index) => {
                bl.removeSelf();
                delete ALL_INACTIVE_BLOCKS[index];
            });
            currentShape.removeSelf();
            callback();
        }
    }, 100);

}


// 急速下落后，画面震动效果
function shake() {
    gameStage.style.top = `${parseInt(getComputedStyle(gameStage).top) + 5}px`;
    setTimeout(() => {
        gameStage.style.top = `${parseInt(getComputedStyle(gameStage).top) - 5}px`;
    }, 50);
}

// /** 暂停/开始游戏 */
// function pause() {
//     if (currentShape.state === SHAPES.pause) {
//         currentShape.changeState(SHAPE_STATE.active);
//         BGM1.pause();
//         BGM2.play();
//     } else if (currentShape.state === SHAPE_STATE.active) {
//         currentShape.changeState(SHAPE_STATE.pause);
//         BGM1.play();
//         BGM2.pause();
//     }
// }


// ============================ 监听 ============================ //
conStart.onclick = () => {
    start();
};
function listen() {
    conUp.onclick = () => {
        currentShape.clockwise90();
        SPIN.play();
    };
    conDown.onclick = () => {
        currentShape.canMove().down && currentShape.moveDown();
        BTN.play();
    };
    conLeft.onclick = () => {
        currentShape.canMove().left && currentShape.moveLeft();
        BTN.play();
    };
    conRight.onclick = () => {
        currentShape.canMove().right && currentShape.moveRight();
        BTN.play();
    };
    conSpace.onclick = () => {
        clearInterval(shapeTimer);
        currentShape.fastDown();
        BOTTOM.play();
        currentShape.changeStyle('inactiveBlock');
        currentShape.blocks.forEach(bl => {
            ALL_INACTIVE_BLOCKS.push(bl);
        });
        clearLineBlocks();
        shake();
        run();
    };
    // conPause.onclick = () => {
    //     pause();
    // };
    document.onkeydown = (e) => {
        switch (e.keyCode) {
            // 上按钮是旋转整个形状
            case KEY_UP: {
                conUp.click();
                break;
            }
            case KEY_SPACE: {
                conSpace.click();
                break;
            }
            case KEY_DOWN: {
                conDown.click();
                break;
            }
            case KEY_LEFT: {
                conLeft.click();
                break;
            }
            case KEY_RIGHT: {
                conRight.click();
                break;
            }
        }
    };
}

// 移除监听
function removeListen() {
    conUp.onclick = () => {
    };
    conDown.onclick = () => {
    };
    conLeft.onclick = () => {
    };
    conRight.onclick = () => {
    };
    conSpace.onclick = () => {
    };
    // conPause.onclick = () => {
    // };
    document.onkeydown = (e) => {
    };
}




//  ============================================================================== //





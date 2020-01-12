import { STAGE_STYLE, BLOCK_SIZE, ALL_INACTIVE_BLOCKS } from './const.js';

import Block from './block';
/** 
 * 形状，接收一个二维数组，将内容为1的部分进行填充小方块，形成形状 
 * 形状能干的事情:
 * 1. 创建代表自身的DOM元素，并在页面上显示
 * 2. 判断自身能不能往上,下,左,右四个方向移动
 * 3. 往上,下,左,右四个方向移动
 * 4. 改变形状的样式
 * 5. 形状顺时针旋转90deg
 * 6. 移除页面上代表自身的DOM元素
 * */
export default class Shape {
    // 对应的二维数组
    arr;
    // 当前形状中所有的方块
    blocks;
    // 当前形状的 x 偏移
    currOffsetLeft;
    // 当前形状的 y 偏移
    currOffsetTop;
    // 在哪里创建
    stage;

    constructor({ arr = [], offSetLeft = 0, offsetTop = 0, stage = document.body }) {
        this.arr = arr;
        this.stage = stage;
        this.blocks = [];
        this.currOffsetLeft = offSetLeft;
        this.currOffsetTop = offsetTop;
    }


    /** 创建自身的DOM元素，并显示在页面 */
    createSelf() {
        this.blocks = [];
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                if (this.arr[i][j] === 1) {
                    let block = new Block({
                        stage: this.stage,
                    });
                    block.createSelf(j * BLOCK_SIZE + this.currOffsetLeft, i * BLOCK_SIZE + this.currOffsetTop);
                    this.blocks.push(block);
                }
            }
        }
    }

    /** 移除自身在页面上的DOM元素 */
    removeSelf() {
        this.blocks.forEach(e => {
            e.removeSelf();
        });
    }

    /** 
     * 改变形状的样式
     * 实际上是当前形状的所有方块改变样式
     */
    changeStyle(style) {
        this.blocks.forEach(bl => {
            bl.blockEle.className = style;
        });
    }

    /** 
     * 将形状进行顺时针90deg旋转 
     * 旋转之前这样判断：
     * 如果旋转过后的被填充的小方块的偏移量出去了画布，那么此次就不能旋转
     */
    clockwise90() {
        let newArr = [];
        // 得到旋转后的数组矩阵
        for (let i = 0; i < this.arr.length; i++) {
            let tmpArr = [];
            for (let j = this.arr.length - 1; j >= 0; j--) {
                tmpArr.push(this.arr[j][i]);
            }
            newArr.push(tmpArr);
        }
        // 对旋转后的数组矩阵的每个为 1 的位置进行判断，
        // 如果在这个位置创建的小方块超出边界或者与任意一个已固定的方块重合
        // 那么此次旋转就不能进行
        for (let i = 0; i < newArr.length; i++) {
            for (let j = 0; j < newArr.length; j++) {
                if (newArr[i][j] === 1) {
                    let x = j * BLOCK_SIZE + this.currOffsetLeft;
                    let y = i * BLOCK_SIZE + this.currOffsetTop;
                    if (x < 0 || x >= STAGE_STYLE.width || y >= STAGE_STYLE.height) {
                        return;
                    }
                    if (ALL_INACTIVE_BLOCKS.some(bl => {
                        return bl.blockEle.offsetTop === y && bl.blockEle.offsetLeft === x;
                    })) {
                        return;
                    };
                }
            }
        }
        this.arr = newArr;
        this.removeSelf();
        this.createSelf();
    }

    /** 
     * 判断整个形状能不能移动 
     * 如果组成这个形状的方块中有一个不能移动，则整个形状就不能移动
     */
    canMove() {
        let canMove = {
            up: true,
            down: true,
            left: true,
            right: true
        }
        this.blocks.some(e => {
            return !(e.canMove().up);
        }) && (canMove.up = false);
        // 如果有一个方块不能向下移动，那么整个形状就不能向下移动
        this.blocks.some(e => {
            return !(e.canMove().down);
        }) && (canMove.down = false);
        // 略...
        this.blocks.some(e => {
            return !(e.canMove().left);
        }) && (canMove.left = false);
        // 略...
        this.blocks.some(e => {
            return !(e.canMove().right);
        }) && (canMove.right = false);

        return canMove;
    }

    /** 
     * 往下方向移动
     * 就是当前形状的所有方块全部往下移动一格
     *  */
    moveDown() {
        this.blocks.forEach(block => {
            block.moveDown();
        });
        this.currOffsetTop += BLOCK_SIZE;
    }
    /** 
    * 往左方向移动
    * 就是当前形状的所有方块全部往左移动一格
    *  */
    moveLeft() {
        this.blocks.forEach(block => {
            block.moveLeft();
        });
        this.currOffsetLeft -= BLOCK_SIZE;
    }
    /**
     * 往右方向移动
     * 就是当前形状的所有方块全部往右移动一格
     *  */
    moveRight() {
        this.blocks.forEach(block => {
            block.moveRight();
        });
        this.currOffsetLeft += BLOCK_SIZE;
    }


    /** 急速下落，直接落到当前列的最低下，期间不能旋转和移动 */
    fastDown() {
        while (this.canMove().down) {
            this.moveDown();
        }
    }

}
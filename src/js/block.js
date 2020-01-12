import { STAGE_STYLE, STAGE, BLOCK_SIZE, ALL_INACTIVE_BLOCKS } from './const.js';
/**
 * 代表一个小方块
 * 一个小方块能干的事情:
 * 1. 创建代表自身的DOM元素并显示到页面中（需要指定一个父元素，在父元素中创建，然后指定相对于父元素的偏移量 x，y）
 * 2. 判断自身能不能往上,下,左,右四个方向移动
 * 3. 往上,下,左,右四个方向移动
 * 4. 改变状态
 * 4. 从页面上将自身的DOM元素删除
 */
export default class Block {
    // 维护的DOM元素
    blockEle;
    // 父元素，在此父元素中创建小方块
    stage;

    constructor({ stage = document.body }) {
        this.stage = stage;
    }

    /** 在页面上创建一个方块，也就是创建自身 
     * @param x 相对于父元素 x 的偏移量
     * @param y 相对于父元素 y 的偏移量
     */
    createSelf(x, y) {

        this.blockEle = document.createElement('div');
        this.changeStyle('activeBlock');
        this.blockEle.style.left = x + 'px';
        this.blockEle.style.top = y + 'px';
        this.stage.appendChild(this.blockEle);
        this.blockStyle = window.getComputedStyle(this.blockEle);
    }

    /**
     *  改变样式
     *  @param style css中定义的样式名（class）
     */
    changeStyle(style) {
        this.blockEle.className = style;
    }

    /** 在画布上删除方块，也就是删除自身 */
    removeSelf() {
        this.stage.removeChild(this.blockEle);
    }

    /** 向下移动 */
    moveDown() {
        this.blockEle.style.top = `${parseInt(this.blockStyle.top) + BLOCK_SIZE}px`;
    }
    /** 向左移动 */
    moveLeft() {
        this.blockEle.style.left = `${parseInt(this.blockStyle.left) - BLOCK_SIZE}px`;
    }
    /** 向右移动 */
    moveRight() {
        this.blockEle.style.left = `${parseInt(this.blockStyle.left) + BLOCK_SIZE}px`;
    }

    /**  
     * 判断这个方块能不能向各个方向移动 
     * @return canMove对象
     */
    canMove() {
        // 默认向四个方向都能移动
        let canMove = {
            up: true,
            down: true,
            left: true,
            right: true
        }
        // 不能向上移动了
        if (this.blockEle.offsetTop <= 0) {
            canMove.up = false;
        }
        // 不能向下移动了
        // 遍历所有已经固定的方块，如果存在一个方块 block，block的左偏移x和当前方块的左偏移相同，
        // 并且block的上偏移 - 方块宽度 = 当前方块的上偏移
        // 那么当前方块就不能往下移动了
        if (this.blockEle.offsetTop >= STAGE_STYLE.height - BLOCK_SIZE || ALL_INACTIVE_BLOCKS.some(bl => {
            return bl.blockEle.offsetLeft === this.blockEle.offsetLeft && bl.blockEle.offsetTop - this.blockEle.offsetTop === BLOCK_SIZE;
        })) {
            canMove.down = false;
        }
        // 不能向左移动了
        // 原理同上
        if (this.blockEle.offsetLeft <= 0 || ALL_INACTIVE_BLOCKS.some(bl => {
            return bl.blockEle.offsetTop === this.blockEle.offsetTop && this.blockEle.offsetLeft - bl.blockEle.offsetLeft === BLOCK_SIZE;
        })) {
            canMove.left = false;
        }
        // 不能向右移动了
        // 原理同上
        if (this.blockEle.offsetLeft >= STAGE_STYLE.width - BLOCK_SIZE || ALL_INACTIVE_BLOCKS.some(bl => {
            return bl.blockEle.offsetTop === this.blockEle.offsetTop && bl.blockEle.offsetLeft - this.blockEle.offsetLeft === BLOCK_SIZE;
        })) {
            canMove.right = false;
        }

        return canMove;
    }
}
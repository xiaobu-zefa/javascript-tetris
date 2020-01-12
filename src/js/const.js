/** 定义公共变量 */

// 定义按键
export const KEY_UP = 38;
export const KEY_DOWN = 40;
export const KEY_LEFT = 37;
export const KEY_RIGHT = 39;
export const KEY_SPACE = 32;
// 每行小方块数量
export const X_SUM = 12;
// 每列小方块数量
export const Y_SUM = 21;
// 每个小方块的宽和高（像素）
export const BLOCK_SIZE = 18;
// 画布的大小（像素）
export const STAGE_STYLE = { width: BLOCK_SIZE * X_SUM, height: BLOCK_SIZE * Y_SUM };
// 初始形状的起始位置（设置默认偏移量）
export const SHAPE_DEFAULT_OFFSET = { x: (X_SUM / 2 - 1) * BLOCK_SIZE, y: 0 };
// 级别（就是方块下落的速度）
export const LEVEL = [NaN, 800, 700, 600, 500, 400, 300, 200, 100];
// 保存所有可能的方块形状
export const SHAPES = [
    [[1, 0, 0], [1, 0, 0], [1, 1, 0]], // L形
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]], // L形
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]], // Z形
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]], // Z形
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]], // T形
    [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]], // 竖形
    [[1, 1, 0], [1, 1, 0], [0, 0, 0]]  // 大正方形
];
// 形状的所有状态
export const SHAPE_STATE = {
    pause: -1,
    active: 0,
    inactive: 1
};
// 存储所有已经固定方块
export const ALL_INACTIVE_BLOCKS = [];
// 画布
export const STAGE = document.querySelector('.stage');


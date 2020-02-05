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

// 展示区的大小
export const INFO_STYLE = { width: BLOCK_SIZE * 4, height: BLOCK_SIZE * 4 };

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


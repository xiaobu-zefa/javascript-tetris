import { Howl, Howler } from 'howler';
import { path } from 'path';

/** 游戏声音模块 */

// BGM1 游戏进行时的背景音乐
export const BGM1 = new Howl({
    src: ['/src/audio/bgm1.mp3'],
    loop: true,
});

// BGM2 游戏不进行时的背景音乐
export const BGM2 = new Howl({
    src: ['/src/audio/bgm2.mp3'],
    loop: true,
});

// 方块消除音效
export const DESTORY = new Howl({
    src: ['/src/audio/destroy.wav'],
    loop: false,
});

// 失败音效
export const LOST = new Howl({
    src: ['/src/audio/lost.wav'],
    loop: false,
});
// 急速下落音效
export const BOTTOM = new Howl({
    src: ['/src/audio/bottom.wav'],
    loop: false,
});
// 移动音效
export const BTN = new Howl({
    src: ['/src/audio/btn.wav'],
    loop: false,
});
// 旋转音效
export const SPIN = new Howl({
    src: ['/src/audio/spin.wav'],
    loop: false,
});
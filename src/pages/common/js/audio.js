import { Howl } from 'howler';
import bgm1 from '../../../static/audios/bgm1.ogg';
import bgm2 from '../../../static/audios/bgm2.ogg';
import spin from '../../../static/audios/spin.wav';
import btn from '../../../static/audios/btn.wav';
import bottom from '../../../static/audios/bottom.wav';
import destroy from '../../../static/audios/destroy.wav';
import lost from '../../../static/audios/lost.wav';


export const audio = {
    data: {
        // BGM1 游戏进行时的背景音乐
        BGM1: new Howl({
            src: [bgm1],
            loop: true,
        }),

        // BGM2 游戏进行时的背景音乐
        BGM2: new Howl({
            src: [bgm2],
            loop: true,
        }),

        // 方块消除音效
        DESTORY: new Howl({
            src: [destroy],
            loop: false,
        }),

        // 失败音效
        LOST: new Howl({
            src: [lost],
            loop: false,
        }),

        // 急速下落音效
        BOTTOM: new Howl({
            src: [bottom],
            loop: false,
        }),

        // 移动音效
        BTN: new Howl({
            src: [btn],
            loop: false,
        }),

        // 旋转音效
        SPIN: new Howl({
            src: [spin],
            loop: false,
        }),
    },

    // 关闭声音
    close() {
        for (let k in this.data) {
            this.data[k].volume(0.0);
        }
    },
    // 开启声音
    open() {
        for (let k in this.data) {
            this.data[k].volume(1.0);
        }
    }
};



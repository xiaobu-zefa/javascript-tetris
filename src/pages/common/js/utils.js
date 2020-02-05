import FastClick from 'fastclick';
import { SHAPES } from './const';

export default class Utils {
    /** 随机生成一个形状的数组 */
    static randomShape() {
        let num = Utils.randomNum(0, SHAPES.length - 1);
        return SHAPES[num];
    }
    /** 生成从minNum到maxNum的随机数 */
    static randomNum(minNum, maxNum) {
        let num = 0;
        switch (arguments.length) {
            case 1:
                num = parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                num = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                break;
        }
        return num;
    }
    /** 禁止ios缩放，双击和双指 */
    static banIOS() {
        document.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        });
        var lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            var now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        document.addEventListener('gesturestart', function (event) {
            event.preventDefault();
        });
        document.addEventListener('touchmove', function (e) {
            e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
        }, { passive: false }); //passive 参数不能省略，用来兼容ios和android
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function () {
                FastClick.attach(document.body);
            }, false);
        }
    }
}


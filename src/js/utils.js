import FastClick from 'fastclick';
/** 工具类，都是静态方法 */
export default class Utils {
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
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function () {
                FastClick.attach(document.body);
            }, false);
        }
    }
}


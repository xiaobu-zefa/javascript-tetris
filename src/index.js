import './index.less';
import './pages/common/less/boot.less';
import './pages/stage';
import './pages/gameinfo';
import utils from './pages/common/js/utils';
import { stage } from './pages/stage';
import { operation } from './pages/gameinfo';

utils.banIOS();

window.addEventListener('DOMContentLoaded', () => {
    stage.init();
    operation.init();
});
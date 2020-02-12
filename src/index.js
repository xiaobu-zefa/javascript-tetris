import './index.less';
import './pages/common/less/boot.less';
import './pages/stage';
import './pages/gameinfo';
import utils from './pages/common/js/utils';
import { stage } from './pages/stage';
import { next, score, level, operation } from './pages/gameinfo';
import Controller from './pages/controller';

utils.banIOS();

window.addEventListener('DOMContentLoaded', () => {
    stage.init(new Controller(stage));
    next.init();
    score.init();
    level.init();
    operation.init();
});


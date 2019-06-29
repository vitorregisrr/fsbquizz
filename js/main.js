let contentScroll;

(function () {
    'use strict';

    //Init Libs
    new WOW().init();
    contentScroll = new SimpleBar($('main')[0])

    window.dispatchEvent(new Event('resize'));

})();
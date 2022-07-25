$(document).ready( function(){
    setTimeout(function () {
        if ($('.navigation').data('scroll-to-active') === true) {
            var position;
            if ($('.navigation').find('li.active').parents('li').length > 0) {
                position = $(".navigation").find('li.active').parents('li').last().position();
                for (let i = 0; i < 3; i++) {
                    if (position === undefined) {
                        position = $(".navigation").find('li.active').parents('li').last().position();
                    }
                }
            }
            else {
                position = $(".navigation").find('li.active').position();
                for (let i = 0; i < 3; i++) {
                    if (position === undefined) {
                        position = $(".navigation").find('li.active').position();
                    }
                }
            }
            setTimeout(function () {
                if (position !== undefined) {
                    $('.sidebar-content.ps-container').animate({
                        scrollTop: position.top
                    }, 300)
                }
            }, 300)
        }
    }, 10)

});
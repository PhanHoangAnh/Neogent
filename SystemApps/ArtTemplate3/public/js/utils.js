"use strict";
// var $animation_elements = $('.animation-element');
// var $window = $(window);

// function check_if_in_view() {
//     var window_height = $window.height();
//     var window_top_position = $window.scrollTop();
//     var window_bottom_position = (window_top_position + window_height);


//     $.each($animation_elements, function() {
//         var $element = $(this);
//         var element_height = $element.outerHeight();
//         var element_top_position = $element.offset().top;
//         var element_bottom_position = (element_top_position + element_height);

//         //check to see if this current container is within viewport
//         if ((element_bottom_position >= window_top_position) &&
//             (element_top_position <= window_bottom_position)) {
//             $element.addClass('in-view');
//           $element.addClass('animated bounceInLeft');
//         } else {
//             $element.removeClass('in-view');
//             $element.removeClass('animated bounceInLeft');
//         }
//     });
// }
// $window.on('scroll resize', check_if_in_view);
// $window.trigger('scroll');

function movingImage(elem, fn) {
    var image = new Image(elem.width, elem.height);
    document.body.appendChild(image);
    image.style.position = "fixed";
    // var _x = elem.getBoundingClientRect().left ;
    // var _y = elem.getBoundingClientRect().top ;
    var _x = (window.innerWidth - elem.width)/2
    var _y = (window.innerHeight - elem.height)/2 ;
    image.style.left = _x + "px";
    image.style.top = _y + "px";
    image.src = elem.src;
    var lastFrame = +new Date;
    var timer = setInterval(function() {
        var now = +new Date;
        var deltaT = now - lastFrame;
        image.style.left = (_x = _x + 100 * deltaT / 80) + "px";
        image.style.top = (_y = _y - 30 * deltaT / 160) + "px";
        image.width = image.width * 0.9;
        image.height = image.height * 0.9;
        lastFrame = now;
        if (image.getBoundingClientRect().left > document.body.clientWidth) {
            clearInterval(timer);
            if (fn.constructor === Function) {
                fn(elem);
            }
            image.parentNode.removeChild(image);
        }
    }, 16);
}

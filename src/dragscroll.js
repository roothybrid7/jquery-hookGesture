/**
 * dragscroll.js - jQuery plugin for drag scroll.
 *
 * requires: jQuery-1.7.1.
 */

(function($) {
  'use strict';

  $.fn.extend({
    dragScroll: function() {
      var target = this;
      var selfSelector = $(this).selector;

      // Live event API.
      $(document).on('touchstart mousedown', selfSelector, function(e) {
      console.log(target);
        var x, y, touches = e.originalEvent.touches;
        if (touches) {
          x = touches[0].pageX;
          y = touches[0].pageY;
        } else {
          x = e.clientX;
          y = e.clientY;
        }

        $(target)
          .data('dragging', true)
          .data('x', x)
          .data('y', y)
          .data('scrollLeft', $(target).scrollLeft())
          .data('scrollTop', $(target).scrollTop());
      });

      $(document).on('touchmove mousemove', function(e) {
        if ($(target).data('dragging') === true) {
          var x, y, touches = e.originalEvent.changedTouches;
          if (touches) {
            x = touches[0].pageX;
            y = touches[0].pageY;
          } else {
            x = e.clientX;
            y = e.clientY;
          }
          // Scroll.
          $(target)
            .scrollLeft($(target).data('scrollLeft') + $(target).data('x') - x);
          $(target)
            .scrollTop($(target).data('scrollTop') + $(target).data('y') - y);

          return false;
        }
      }).on('touchend mouseup', function(e) {
        $(target).removeData();
      });

      // returns for method chains.
      return this;
    }
  });

  return $;
}(jQuery));

/*!
 * jquery.hookgesture.js - Gesture hook of jquery plugin.
 *
 * Copyright 2012, Satoshi Ohki.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * requires: jQuery.
 */

/*!
 * Core gesture:
 *
 * Basic actions.
 * User action|gesture   |description|
 * Change     |press     |duration > 1000ms
 * Open       |double tap|(embed)
 * Select     |tap       |(embed)
 *
 * Object-related actions.
 * User action|gesture       |description|
 * Adjest     |press and drag|
 * Bundle     |press and tap,|
 *            |then drag     |
 * Delete     |drag          |with object.
 * Duplicate  |tap           |
 * Move       |drag, flick   |
 * Scale down |pinch         |
 * Scale up   |spread        |
 *
 * Navigating actions.
 * User action|gesture      |description|
 * Adjest view|rotate       |
 * Adject zoom|pinch        |
 *
 * Flick(touchstart -> touchend <= 1000ms, > 50px[移動距離は設定値で変更])
 *  - moveendTime - lastmoveTime < 1000ms && move > 50px;(touchendで判定)
 *  - +1/-1(touchend)
 * Drag(move > 50px[移動距離は設定値で変更])
 *  - move > 50px;(touchmoveで判定)
 *  - +1/-1 * if > mixDistance(touchmove)
 *
 * 1. Ditect touch events and get distance.
 *  - Flick or Drag.
 * 2. callback(default: false).
 *  - touchstart[set position, timestamp]
 *    - onstart(set element.data and callback)
 *  - touchmove[set direction, distance]
 *    - onmove(set element.data direction, position, and callback)
 *  - touchend[check threshold]
 *    - onend(check timestamp, trigger flick and callback)
 *  - flick[trigger flickXXX and callback]
 *  - flick(up|left)[trigger scrollnext]
 *  - flick(down|right)[trigger scrollprev]
 */
(function($) {
  'use strict';

  var touchSupport = 'ontouchend' in document,
    // Get touchevents of Mobile or PC.
    events = {
      start: (touchSupport) ? 'touchstart' : 'mousedown',
      move: (touchSupport) ? 'touchmove' : 'mousemove',
      end: (touchSupport) ? 'touchend' : 'mouseup'
    };

  var methods = {
    init: function(options) {
      var target = null,
        selfSelector = $(this).selector,
        settings = $.extend(
          {},
          $.fn.hookGesture.defaults,
          $.fn.hookGesture.callbacks,
          options);
          console.log(this.length);

      return this.each(function() {
        var $this = $(this),
          data = $this.data('hookGesture');
          console.log(data);

        if (!data) {
          $this.data('hookGesture', settings);

          // TODO: Register event handler.
          $(document).on(events.start, selfSelector, function(e) {
            console.log(selfSelector, $this);
            initializeData($this, e);
            $this.trigger('hookgesture.start', e);
          });
          $(document).on(events.move, function(e) {
            var data = $this.data('hookGesture'),
              touching = data.touching;

            if (touching) {
              updateData($this, e);
              $this.trigger('hookgesture.move', e);
            }
          }).on(events.end, function(e) {
            var data = $this.data('hookGesture'),
              touching = data.touching;

            if (touching) {
              endTouch($this, e);
              $this.trigger('hookgesture.end', e);
            }
          });
        }
      });
    },
    destroy: function() {
      return this.each(function() {
        var $this = $(this),
          data = $this.data('hookGesture');

          $this.removeData('hookGesture');
      });
    }
  };

  $.fn.extend({
    hookGesture: function(method) {
      if (methods[method]) {
        return methods[method].apply(this, [].slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.hookgesture');
        return this;
      }
    }
  });

  function initializeData($obj, e) {
    console.log('initializeData');
    var data = $obj.data('hookGesture');
    data.touching = true;
    $obj.data('hookGesture', data);
  }

  function updateData($obj, e) {
    console.log('updateData');
  }

  function endTouch($obj, e) {
    console.log('endTouch');
  }

  $.fn.hookGesture.defaults = {
    touching: false,
    flickMinDistance: 50,
    scrollDirection: false, // 'x', 'y'
    startProp: {x: 0, y: 0, time: 0},
    moveProp: {
      lastPosition: {x: 0, y: 0},
      distance: {x: 0, y: 0},
      direction: {
        horizontal: 0,
        vertical: 0
      }
    },
    endProp: {
      duration: 0,
      direction: {
        horizontal: 0,
        vertical: 0
      }
    },
    debug: false
  };

  $.fn.hookGesture.callbacks = {
    start: false,
    move: false,
    end: false,
    scroll: false,
    scrollLeft: false,
    scrollRight: false,
    scrollUp: false,
    scrollDown: false,
    flick: false,
    flickLeft: false,
    flickRight: false,
    flickUp: false,
    flickDown: false
  };

  return $;
}(jQuery));

// TODO: LoggerFunction
// TODO: callback interface
// callback(event, data);
//    event: event object.
//    data: plugin data.
// TODO: drag: prev -> current scroll.
// TODO: flick: lastmove -> end scroll * const variable.


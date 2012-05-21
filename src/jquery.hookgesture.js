/*!
 * jquery.hookgesture.js - Gesture hook of jquery plugin.
 *
 * Copyright 2012, Satoshi Ohki.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * requires: jQuery.
 */

(function($, global) {
  'use strict';

  // jQuery plugin name.
  var pluginName = 'hookGesture';

  /**
   * Plugin constructor.
   * @param {Document} element A Dom element.
   * @param {Object} options A plugin options.
   * @constructor
   */
  function Plugin(element, options) {
    this._name = pluginName;
    this.element = element;
    this.options = options;
  }

  var methods = {
    destroy: function(element) {
      this.each(function() {
        var $this = $(this),
          data = $this.data('hookGesture');
          $this.removeData('hookGesture');
      });
      return this;
    }
  };
  $.extend(Plugin.prototype, methods);

  // bootstrap.
  $.fn[pluginName] = function(options) {
    var plugin = this.data(pluginName);
    if (typeof options === 'string' && methods[options]) {
      plugin && plugin[options].apply(this, [].slice.call(arguments, 1));
      return this;
    } else if (options && typeof options !== 'object') {
      // Error.
      $.error('Method ' + options + ' does not exist on jQuery.' + pluginName);
      return this;
    }

    // Initialize.
    var settings = $.extend(
      {},
      $.fn[pluginName].defaults,
      $.fn[pluginName].callbacks,
      options);

    if (!!!settings.live && this.length > 0) {
      this.each(function() { getPlugin(this, settings); });
      settings.live = false;
    } else {
      settings.live = true;
    }

    if (!!!settings.live) {
      console.log('BIND API!!');
      this
        .on('touchstart mousedown', onTouchStart)
        .on('touchmove mousemove', onTouchMove)
        .on('touchend mouseup', onTouchEnd);
    } else {
      console.log('LIVE API!!');
      var selfSelector = this.selector;
      $(document)
        .on('touchstart mousedown', selfSelector, onTouchStart)
        .on('touchmove mousemove', selfSelector, onTouchMove)
        .on('touchend mouseup', selfSelector, onTouchEnd);
    }

    $(document).on('touchmove mousemove', function(e) {
      $(selfSelector).each(function() {
        console.log('TOUCH MOVE');
        updateOnTouchMoving(this, e);
        $(this).trigger('hookgesture:move', e);
      });
    }).on('touchend mouseup', function(e) {
      $(selfSelector).each(function() {
        console.log('TOUCH END');
        endTouch(this, e);
        $(this).trigger('hookgesture:end', e);
      });
    });

    function onTouchStart(e) {
      console.log('TOUCH START');
      var target = e.currentTarget;
      plugin = getPlugin(target, settings);
      setUpOnTouchStart(target, e);
      $(target).trigger('hookgesture:start', e);
    };

    function onTouchMove(e) {
      console.log('TOUCH move');
      var target = e.currentTarget;
      updateOnTouchMoving(target, e);
      $(target).trigger('hookgesture:move', e);
      e.stopPropagation();
    };

    function onTouchEnd(e) {
      console.log('TOUCH end');
      var target = e.currentTarget;
      endTouch(target, e);
      $(target).trigger('hookgesture:end', e);
      e.stopPropagation();
    };

    return this;
  };

  /*!
   * Private functions.
   */

  /**
   * Get plugin instance.
   *
   * @param {Document} element A Dom element.
   * @param {Object} options A plugin options.
   * @return {*} A Plugin instance.
   */
  function getPlugin(element, options) {
    console.log('getPlugin');
    var plugin = $.data(element, pluginName);
    if (!!!plugin && options) {
      plugin = new Plugin(element, options);
      $.data(element, pluginName, plugin);
    }
    return plugin;
  }

  /**
   * Set up on touch start.
   *
   * @param {Document} element A dom element.
   * @param {Event} event A touchstart event object.
   */
  function setUpOnTouchStart(element, event) {
    console.log('setUpOnTouchStart');
    var plugin = getPlugin(element),
        options = plugin.options,
        x, y, touches = event.originalEvent && event.originalEvent.touches;

    // TODO: set start properties.
    plugin.touching = true;
    options.startProp = {
      x: (touches ? touches[0].pageX : event.clientX),
      y: (touches ? touches[0].pageY : event.clientY),
      scrollTop: $(element).scrollTop(),
      scrollLeft: $(element).scrollLeft(),
      time: event.timeStamp
    };
    options.lastChanged = event.timeStamp;
    options.moveProp.lastPosition = {
      x: options.startProp.x,
      y: options.startProp.y,
      scrollTop: options.startProp.scrollTop,
      scrollLeft: options.startProp.scrollLeft
    };
 }

  /**
   * Update properties on touch moving.
   *
   * @param {Document} element A dom element.
   * @param {Event} event A touchmove event object.
   */
  function updateOnTouchMoving(element, event) {
    console.log('updateOnTouchMoving');
    var plugin = getPlugin(element);
    if (plugin && plugin.touching) {
      var options = plugin.options,
          x, y,
          touches = event.originalEvent && event.originalEvent.changedTouches;

      options.lastChanged = event.timeStamp;
      options.moveProp.prevPosition = {
        x: options.moveProp.lastPosition.x,
        y: options.moveProp.lastPosition.y,
        scrollTop: options.moveProp.lastPosition.scrollTop,
        scrollLeft: options.moveProp.lastPosition.scrollLeft
      };
      options.moveProp.lastPosition = {
        x: (touches ? touches[0].pageX : event.clientX),
        y: (touches ? touches[0].pageY : event.clientY),
        scrollTop: $(element).scrollTop(),
        scrollLeft: $(element).scrollLeft()
      };
    }
  }

  /**
   * @param {Document} element A dom element.
   * @param {Event} event A touchend event object.
   */
  function endTouch(element, event) {
    console.log('endTouch');
    var plugin = getPlugin(element),
        options = plugin.options;
    // TODO: remove touch properties.
    plugin.touching = false;
    options.endProp.time = event.timeStamp;
  }

  // Plugin default options.
  $.fn.hookGesture.defaults = {
    live: false,
    flickMinDistance: 50,
    scrollDirection: false, // 'x', 'y'
    lastChanged: 0,
    startProp: {
      x: 0,
      y: 0,
      scrollTop: 0,
      scrollLeft: 0,
      time: 0
    },
    moveProp: {
      lastPosition: {
        x: 0,
        y: 0,
        scrollTop: 0,
        scrollLeft: 0
      },
      prevPosition: {
        x: 0,
        y: 0,
        scrollTop: 0,
        scrollLeft: 0
      },
      distance: {x: 0, y: 0},
      direction: {
        horizontal: 0,
        vertical: 0
      }
    },
    endProp: {
      time: 0,
      direction: {
        horizontal: 0,
        vertical: 0
      }
    },
    debug: false
  };

  $.fn.hookGesture.callbacks = {
    onStart: false,
    onMove: false,
    onEnd: false,
    onScroll: false,
    onScrollLeft: false,
    onScrollRight: false,
    onScrollUp: false,
    onScrollDown: false,
    onFlick: false,
    onFlickLeft: false,
    onFlickRight: false,
    onFlickUp: false,
    onFlickDown: false
  };

  return $;
}(jQuery, this));

// TODO: LoggerFunction
// TODO: callback interface
// callback(event, data);
//    event: event object.
//    data: plugin data.
// TODO: drag: prev -> current scroll.
// TODO: flick: lastmove -> end scroll * const variable.


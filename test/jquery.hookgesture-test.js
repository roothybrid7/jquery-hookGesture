'use strict';

buster.testCase('hookGesture', {
  setUp: function() {
    this.container = $('#container');
    buster.console.log('Setup');
  },
  tearDown: function() {
    this.container.hookGesture('destroy');
  },
  'context: attributes': {
    setUp: function() {
      this.defaultsExpected = {
        live: false,
        flickMinDistance: 50,
        scrollDirection: false,
        lastChanged: 0,
        debug: false
      };
    },
    'context: initialize without parameter': {
      setUp: function() {
        this.container.hookGesture();
      },
      'single': function() {
        var plugin = this.container.data('hookGesture');
        var actual = {
          live: plugin.options.live,
          flickMinDistance: plugin.options.flickMinDistance,
          scrollDirection: plugin.options.scrollDirection,
          lastChanged: plugin.options.lastChanged,
          debug: plugin.options.debug
        };
        assert.equals(this.defaultsExpected, actual);
      }
    },
    'context: initialize with parameter': {
      setUp: function() {
        this.initParams = {
          flickMinDistance: 30,
          scrollDirection: 'x',
          debug: true
        };
        this.container.hookGesture(this.initParams);
      },
      'single': function() {
        var plugin = this.container.data('hookGesture');
        var actual = {
          flickMinDistance: plugin.options.flickMinDistance,
          scrollDirection: plugin.options.scrollDirection,
          debug: plugin.options.debug
        };
        assert.equals(this.initParams, actual);
      },
      'twice call': function() {
        this.container.hookGesture();
        var plugin = this.container.data('hookGesture');
        var actual = {
          flickMinDistance: plugin.options.flickMinDistance,
          scrollDirection: plugin.options.scrollDirection,
          debug: plugin.options.debug
        };
        assert.equals(this.initParams, actual);
        refute.equals(this.defaultsExpected, actual);
      }
    },
    'context: initialize with live parameter': {
      setUp: function() {
        this.initParams = {
          live: true,
          flickMinDistance: 20,
          scrollDirection: 'y'
        };
        this.container.hookGesture(this.initParams);
      },
      'empty plugin': function() {
        var plugin = this.container.data('hookGesture');
        refute(plugin);
      }
    },
    'initialize with live api for undefined dom element': function() {
      var $dom = $('#undefDom');
      $dom.hookGesture();
      var plugin = $dom.data('hookGesture');
      refute(plugin);
    }
  },
  'context: touch events': {
    setUp: function() {
      this.container.hookGesture();
      this.touchstartEvent = jQuery.Event('touchstart');
      this.touchstartEvent.target = this.container[0];
      this.touchstartEvent.currentTarget = this.container[0];
      this.touchstartEvent.originalEvent = {
        touches: [{pageX: 10, pageY: 5}]
      };
    },
    tearDown: function() {
      this.touchstartEvent = null;
    },
    'set properties on touch start': function() {
      var plugin = this.container.data('hookGesture'),
          beforeTouching = plugin.touching;
      this.container.trigger(this.touchstartEvent);
      console.log(plugin.options);
      refute(beforeTouching);
      assert.equals(plugin.touching, true);
      var params = plugin.options;
      assert.equals(params.startProp.time, this.touchstartEvent.timeStamp);
      assert.equals(params.lastChanged, this.touchstartEvent.timeStamp);
    },
    'on touch move': {
      setUp: function() {
        this.container.trigger(this.touchstartEvent);
      },
      'change properties after touch start': function() {
        var deferred = when.defer();
        var plugin = this.container.data('hookGesture');

        var params = plugin.options,
            beforeMoveChanged = params.lastChanged,
            startX = params.moveProp.lastPosition.x,
            startY = params.moveProp.lastPosition.y,
            self = this;

        setTimeout(function() {
          var touchmoveEvent = jQuery.Event('touchmove');
          touchmoveEvent.target = this.container[0];
          touchmoveEvent.currentTarget = this.container[0];
          touchmoveEvent.originalEvent = {
            changedTouches: [{pageX: 30, pageY: 15}]
          };
          self.container.trigger(touchmoveEvent);
          var prevX = params.moveProp.prevPosition.x,
              prevY = params.moveProp.prevPosition.y,
              lastX = params.moveProp.lastPosition.x,
              lastY = params.moveProp.lastPosition.y,
              distanceX = params.moveProp.distance.x,
              distanceY = params.moveProp.distance.y,
              directionHorizontal = params.moveProp.direction.horizontal,
              directionVertical = params.moveProp.direction.vertical;
          assert.equals(plugin.touching, true);
          assert.equals(params.lastChanged, touchmoveEvent.timeStamp);
          assert.equals(prevX, startX);
          assert.equals(prevY, startY);
          assert(beforeMoveChanged <= params.lastChanged);
          refute.equals(lastX, prevX);
          refute.equals(lastY, prevY);
// TODO: get distance.
//          assert.equals(distanceX, lastX - prevX);
          deferred.resolver.resolve();
        }, 100);
        return deferred.promise;
      },
      'on touch end': {
        setUp: function() {
          this.touchmoveEvent = jQuery.Event('touchmove');
          this.touchmoveEvent.target = this.container[0];
          this.touchmoveEvent.currentTarget = this.container[0];
          this.touchmoveEvent.originalEvent = {
            changedTouches: [{pageX: 30, pageY: 15}]
          };
          this.container.trigger(this.touchmoveEvent);
        },
        'remove touch properties': function() {
          var deferred = when.defer(),
              plugin = this.container.data('hookGesture');

          var params = plugin.options,
              beforeMoveChanged = params.lastChanged,
              startX = params.moveProp.lastPosition.x,
              startY = params.moveProp.lastPosition.y,
              self = this;

          setTimeout(function() {
            var touchendEvent = jQuery.Event('touchend');
            touchendEvent.target = this.container[0];
            touchendEvent.currentTarget = this.container[0];
            touchendEvent.originalEvent = {
              changedTouches: [{pageX: 30, pageY: 15}]
            };
            self.container.trigger(touchendEvent);
            assert.equals(plugin.touching, false);
            assert(params.endProp.time >= params.lastChanged);
            deferred.resolver.resolve();
          }, 100);
          return deferred.promise;
        }
      }
    }
  }
});

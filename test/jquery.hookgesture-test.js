'use strict';

buster.testCase('hookGesture', {
  setUp: function() {
    this.container = $('#container');
    buster.console.log('Setup');
  },
  tearDown: function() {
    this.container.hookGesture('destroy');
  },
  '//context: attributes': {
    setUp: function() {
      this.defaultsExpected = {
        flickMinDistance: 50,
        scrollDirection: false,
        debug: false
      };
    },
    'context: initialize without parameter': {
      setUp: function() {
        this.container.hookGesture();
      },
      'single': function() {
        var data = this.container.data('hookGesture');
        var actual = {
          flickMinDistance: data.flickMinDistance,
          scrollDirection: data.scrollDirection,
          debug: data.debug
        };
        assert.equals(this.defaultsExpected, actual);
      },
      'nested': function() {
        var expected = {
          flickMinDistance: 50,
          scrollDirection: false,
          debug: false,
          startProp: {x: 0, y: 0, time: 0},
          endProp: {
            duration: 0,
            direction: {
              horizontal: 0,
              vertical: 0
            }
          }
        };
        var data = this.container.data('hookGesture');
        var actual = {
          flickMinDistance: data.flickMinDistance,
          scrollDirection: data.scrollDirection,
          debug: data.debug,
          startProp: data.startProp,
          endProp: data.endProp
        };
        assert.equals(expected, actual);
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
        var data = this.container.data('hookGesture');
        var actual = {
          flickMinDistance: data.flickMinDistance,
          scrollDirection: data.scrollDirection,
          debug: data.debug
        };
        assert.equals(this.initParams, actual);
      },
      'twice call': function() {
        this.container.hookGesture();
        var data = this.container.data('hookGesture');
        var actual = {
          flickMinDistance: data.flickMinDistance,
          scrollDirection: data.scrollDirection,
          debug: data.debug
        };
        buster.console.log(actual);
        assert.equals(this.initParams, actual);
        refute.equals(this.defaultsExpected, actual);
      }
    }
  },
  'context: touch events': {
    setUp: function() {
      this.container.hookGesture();
    },
    'touch start': function() {
      var data = this.container.data('hookGesture'),
        beforeTouching = data.touching;
      this.container.trigger('mousedown');
      assert.equals(beforeTouching, false);
      assert.equals(data.touching, true);
    }
  }
});

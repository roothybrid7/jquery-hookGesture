var config = exports; // Vanity

config['Browser tests'] = {
  environment: 'browser',
  rootPath: '../',
  libs: [
    'lib/jquery.js'
  ],
  sources: [
    'src/jquery.hookgesture.js'
  ],
  tests: [
    'test/jquery.hookgesture-test.js'
  ],
  resources: [{
    path: '/',
    file: 'fixtures/testbed.html',
    headers: {
      'Content-Type': 'text/html'
    }
  }]
};

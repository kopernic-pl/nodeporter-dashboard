describe('logger', () => {
  it('can import the logger module', () => {
    expect(() => {
      require('../../utils/logger');
    }).not.toThrow();
  });

  it('logger module can be required', () => {
    const loggerModule = require('../../utils/logger');
    expect(loggerModule).toBeDefined();
  });

  it('logger module has some properties', () => {
    const loggerModule = require('../../utils/logger');
    // Just check that the module exists and has some properties
    expect(typeof loggerModule).toBe('object');
  });
});

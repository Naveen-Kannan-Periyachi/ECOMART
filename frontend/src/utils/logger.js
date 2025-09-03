// Logger utility that respects environment settings
class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
  }

  log(message, ...args) {
    if (this.isDevelopment) {
      console.log(message, ...args);
    }
  }

  error(message, ...args) {
    if (this.isDevelopment) {
      console.error(message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(message, ...args);
    }
  }

  info(message, ...args) {
    if (this.isDevelopment) {
      console.info(message, ...args);
    }
  }

  debug(message, ...args) {
    if (this.isDevelopment) {
      console.debug(message, ...args);
    }
  }
}

const logger = new Logger();
export default logger;

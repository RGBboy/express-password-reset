var environment =  process.env.NODE_ENV || 'development';

var config = {
  development: {
    cookieSecret: '23vdh23llfk949038hckjd3',
    httpsPort: 8443,
    db: {
      url: 'mongodb://express-password-reset-dev:express-password-reset-dev@localhost/express-password-reset-dev'
    },
    mailer: {
      from: 'TestApplication@localhost',
      host: 'smtp.gmail.com', // hostname
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
      }
    }
  },
  test: {
    cookieSecret: '23vdh23llfk949038hckjd3',
    httpsPort: 8443,
    db: {
      url: 'mongodb://express-password-reset-test:express-password-reset-test@localhost/express-password-reset-test'
    },
    mailer: {
      from: 'TestApplication@localhost',
      host: 'localhost', // hostname
      secureConnection: true, // use SSL
      port: 8465, // test port for secure SMTP
      auth: {
        user: 'TestApplication',
        pass: 'TestApplication'
      }
    }
  }
};

exports = module.exports = config[environment];
'use strict'

const Trailpack = require('trailpack')
const lib = require('./lib')
const _ = require('lodash')
const SDC = require('statsd-client')
const joi = require('joi')
const config = require('./lib/config')
const Client = require('./lib/Client')
const TaskerUtils = require('./lib/Util.js')
const url = require('url')

module.exports = class StatsdTrailpack extends Trailpack {

  /**
   * TODO document method
   */
  validate() {
    this.app.config.statsd = _.defaultsDeep(this.app.config.statsd, config.defaults)
    return new Promise((resolve, reject) => {
      resolve(this.app.config.statsd)
      joi.validate(this.app.config.statsd, config.schema, (err, value) => {
        if (err) {
//          return reject('Statsd configuration: ', err)
        }

        return resolve(value)
      })
    })
  }

  /**
   * configure rabbitmq exchanges, queues, bindings and handlers
   */
  configure() {
    let statsdConfig = this.app.config.statsd
    if (Object.isFrozen(statsdConfig)) {
      statsdConfig = _.clone(statsdConfig);
    }

    // Attempt to parse the configuration
    if (!_.isEmpty(statsdConfig.uri)) {
      const parsedUrl = url.parse(statsdConfig.uri);

      const suffix = parsedUrl.query ? parsed.query.split( "&" )[ 0 ].split( "=" )[ 1 ] : null;
      statsdConfig = {
        ...statsdConfig,
        connection: {
          ...statsdConfig.connection,
          server: parsedUrl.hostname || '',
          port: parsedUrl.port || '',
          prefix: parsedUrl.pathname ? parsedUrl.pathname.slice(1) : '',
          suffix: suffix || '',
        }
      }
    }

    this.app.statsd = new Client(this.app, SDC, statsdConfig)
  }

  /**
   * Establish connection to the RabbitMQ exchange, listen for tasks.
   */
  initialize() {
    this.app.on('trails:ready', () => {
      return new Promise((resolve, reject) => {
        this.app.statsd.configure().then( () => {
          resolve(true)
        }).catch(err => resolve(false))
      })
    })
  }

  constructor(app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

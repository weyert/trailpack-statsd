'use strict'

const uuid = require('uuid')

module.exports = class Client  {

  constructor (app, statsd) {
    this.app = app
    this.statsd = statsd
  }

  configure () {
    const { connection, tags } = this.app.config.statsd
    return new Promise((resolve, reject) => {
      this.client = new this.statsd({
        host: connection.server || '',
        port: connection.port || 8125,
        prefix: connection.prefix || '',
        debug: connection.debug || false,
        tcp: false,
        tags: tags || {},
      })
    })
  }

  client() {
    return new SDC({
      host: connection.server || '',
      port: connection.port || 8125,
      prefix: connection.prefix || '',
      debug: connection.debug || false,
      tcp: false,
      tags: tags || {},
    })
  }


  increment(name, value) {
    return new Promise((resolve, reject) => {
      this.client.increment(name, value)
      resolve()
    })
  }

  decrement(name, value) {
    return new Promise((resolve, reject) => {
      this.client.decrement(name, value)
      resolve()
    })
  }

  counter(name, value) {
    return new Promise((resolve, reject) => {
      this.client.counter(name, value)
      resolve()
    })
  }


  setValue(name, value) {
    return new Promise((resolve, reject) => {
      this.client.set(name, value)
      resolve()
    })
  }

  guage(name, value, tags) {
    return new Promise((resolve, reject) => {
      this.client.guage(name, value, tags)
      resolve()
    })
  }

  guageDelta(name, value, tags) {
    return new Promise((resolve, reject) => {
      this.client.guageDelta(name, value, tags)
      resolve()
    })
  }

  raw(cmd) {
    return new Promise((resolve, reject) => {
      this.client.raw(cmd)
      resolve()
    })
  }

  shutdown() {
    return new Promise((resolve, reject) => {
      try {
        this.client.close()
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }
}

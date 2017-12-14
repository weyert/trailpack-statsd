const Config = module.exports
const joi = require('joi')

Config.schema = joi.object().keys({
  connection: joi.object().keys({
    server: joi.string(),
    port: joi.number(),
    uri: joi.string(),
    prefix: joi.string(),
    suffix: joi.string(),
    debug: joi.boolean(),
  }),
  tags: joi.object(),
}).unknown()

Config.defaults = {
  connection: {
    server: 'localhost',
    port: 8125,
    uri: '',
    prefix: '',
    suffix: '',
    debug: false,
  },
  tags: {}
}

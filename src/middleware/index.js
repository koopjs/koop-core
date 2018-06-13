/**
 * Middleware to trim whitespace from incoming string parameters
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function paramTrim(req, res, next) {
  Object.keys(req.query).map(param=>{
    req.query[param] = (typeof req.query[param] === 'string' || req.query[param] instanceof String) 
        ? req.query[param].trim() : req.query[param]
    })
  next()
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function paramParse(req, res, next) {
  Object.keys(req.query).map(param=>{
    req.query[param] = tryParse(req.query[param])
    })
  next()
}

function tryParse (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return json
  }
}

function coerceQuery (params) {
  Object.keys(params).forEach(param => {
    if (params[param] === 'false') params[param] = false
    else if (params[param] === 'true') params[param] = true
  })
  return params
}

module.exports = {
  paramTrim, paramParse
}

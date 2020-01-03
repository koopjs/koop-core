const _ = require('lodash')

class Spy extends Array {
  calls () { return this.length }

  call (index) {
    return new Call(...this[index])
  }

  add (args) {
    const clone = _.cloneDeep(args)
    this.push(Object.values(clone))
  }
}

class Call extends Array {
  args () {
    return this.length
  }

  arg (index) {
    return this[index]
  }
}

module.exports = Spy

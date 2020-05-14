// Create a mixin
const PlayMixin = superclass => class extends superclass {
  constructor (args) {
  	const { favouriteGame } = args
  	super(args)
  	this.favouriteGame = favouriteGame
  }

  play () {
    console.log(`${this.name} is playing ${this.favouriteGame}`)
  }
}

const FoodMixin = superclass => class extends superclass {
  constructor (args) {
  	const { genericFood } = args
  	super(args)
  	this.genericFood = genericFood
  }

  eat () {
    console.log(`${this.name} is eating ${this.genericFood}`)
  }

  poop () {
    console.log('Going to 💩')
  }
}

class Animal {
  constructor (args) {
    const { name } = args
    this.name = name
  }
}

class Dog extends FoodMixin(Animal) {
  constructor (...args) {
    super(...args)
  }

  bark () {
    console.log('Woff woff!')
  }

  haveLunch () {
    this.eat()
    this.poop()
  }
}

const jack = new Dog({ name: 'Jack', genericFood: 'lobster', favouriteGame: 'chess' })
jack.haveLunch()

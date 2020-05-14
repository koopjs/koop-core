class DefaultController {}

module.exports = function createController (ProviderController = DefaultController, model) {
  class Controller extends ProviderController {
    constructor (model) {
      super(model)
      this.model = model
    }
  }
  const controller = new Controller(model)
  const controllerEnumerables = Object.keys(ProviderController).reduce((acc, member) => {
    acc[member] = ProviderController[member]
    return acc
  }, {})
  Object.assign(controller, controllerEnumerables)
  controller.routes = controller.routes || []
  return controller
}

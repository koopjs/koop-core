const chalk = require('chalk')
const Table = require('easy-table')

module.exports = function (provider) {
  if (process.env.NODE_ENV === 'test') return

  // Print provider routes
  const table = new Table()

  provider.registeredProviderRoutes.forEach(route => {
    table.cell(chalk.cyan(`"${provider.namespace}" provider routes`), chalk.yellow(route.path))
    table.cell(chalk.cyan('Methods'), chalk.green(route.methods.join(', ').toUpperCase()))
    table.newRow()
  })
  console.log(`\n${table.toString()}`)

  provider.registeredOutputs.forEach(output => {
    const table = new Table()
    output.routes.forEach(route => {
      table.cell(chalk.cyan(`"${output.namespace}" output routes for the "${provider.namespace}" provider`), chalk.yellow(route.registeredPath))
      table.cell(chalk.cyan('Methods'), chalk.green(route.methods.join(', ').toUpperCase()))
      table.newRow()
    })
    console.log(`\n${table.toString()}`)
  })
}

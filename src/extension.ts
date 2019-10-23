import { commands, ExtensionContext, workspace, window } from 'vscode'
import Status from './commands/base/Status'
import Start from './commands/base/Start'
import Stop from './commands/base/Stop'
import OpenBrowser from './commands/project/OpenBrowser'

export async function activate(context: ExtensionContext) {
	// Base commands
	context.subscriptions.push(commands.registerCommand('docksal.status', () => { Status.run() }))
	context.subscriptions.push(commands.registerCommand('docksal.start.project', () => { Start.runProject() }))
	context.subscriptions.push(commands.registerCommand('docksal.start.vm', () => { Start.runVM() }))
	context.subscriptions.push(commands.registerCommand('docksal.stop.project', () => { Stop.stopProject() }))
	context.subscriptions.push(commands.registerCommand('docksal.stop.vm', () => { Stop.stopVM() }))

	// Project specific commands.
	context.subscriptions.push(commands.registerCommand('docksal.project.open', () => { OpenBrowser.run() }))
}

export function deactivate() {}
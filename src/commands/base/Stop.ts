import * as vscode from 'vscode'
import Common from '../../Common';
import Output from '../../utils/Output'

export default class Stop extends Common {

  /**
  * Stop the docksal project.
  */
  public static async stopProject() {
    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Docksal: Stopping a project',
        },
        () => this.runCommand({ command: 'fin', args: ['stop'] })
      )
      vscode.window.showInformationMessage('Docksal: Project has stopped!');
    } catch (error) {
      vscode.window.showErrorMessage(error.message)
      return false
    }
  }

  /**
  * Stop the docksal VM and all containers.
  */
  public static async stopVM() {
    let cmd = "fin system stop"
    let terminal = vscode.window.createTerminal('Docksal VM')
    terminal.sendText(cmd)
    terminal.show()
  }
}

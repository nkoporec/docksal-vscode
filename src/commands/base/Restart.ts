import * as vscode from 'vscode'
import Common from '../../Common';

export default class Restart extends Common {

  /**
  * Restart the docksal project.
  */
  public static async restartProject() {
    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Docksal: Restarting a project',
        },
        () => this.runCommand({ command: 'fin', args: ['restart'] })
      )
      vscode.window.showInformationMessage('Docksal: Project has restarted!');
    } catch (error) {
      vscode.window.showErrorMessage(error.message)
      return false
    }
  }
}

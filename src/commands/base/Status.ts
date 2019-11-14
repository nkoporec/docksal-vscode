import * as vscode from 'vscode'
import Common from '../../Common';

export default class Status extends Common {

  /**
  * Shows the docksal status and containers in terminal.
  */
  public static async run() {
    try {
      const status = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Docksal: Checking status',
        },
        () => this.runCommand({ command: 'fin', args: ['status'] })
      )

      let containers = status.toString().split("\n");
      let cliRunning = false;
      let dbRunning = false;
      let webRunning = false;
      const projectName = this.projectName();

      containers.forEach(function (item) {
        if (item.includes(`${projectName}_cli`) && item.includes('Up')) {
          cliRunning = true;
        }
        if (item.includes(`${projectName}_db`) && item.includes('Up')) {
          dbRunning = true;
        }
        if (item.includes(`${projectName}_web`) && item.includes('Up')) {
          webRunning = true;
        }
      });

      // If cli,web and db containers are running then the project is working.
      if (cliRunning && webRunning && dbRunning) {
        vscode.window.showInformationMessage('Docksal: Project is running!');
        return true;
      }

      vscode.window.showInformationMessage('Docksal: Project is not running!');
      return false;
    } catch (error) {
      vscode.window.showErrorMessage(error.message)
      return false
    }
  }
}

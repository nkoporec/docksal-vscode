import { workspace, window, Terminal } from 'vscode'
import Common from '../../Common';

export default class Status extends Common {

  /**
  * Shows the docksal status and containers in terminal.
  */
  public static async run() {
    const status = await this.runCommand({ command: 'fin', args: ['status'] });

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
      window.showInformationMessage('Docksal project is running!');
      return true;
    }

    window.showInformationMessage('Docksal project is not running!');
    return false;
  }
}

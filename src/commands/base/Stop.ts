import { workspace, window, Terminal } from 'vscode'
import Common from '../../Common';
import Output from '../../utils/Output'

export default class Stop extends Common {

  /**
  * Stop the docksal project.
  */
  public static async stopProject() {
    const command = await this.runCommand({ command: 'fin', args: ['stop'] });
    if (command) {
      window.showInformationMessage('Docksal has been stopped');
      return true;
    }

    window.showErrorMessage(
      `Docksal: Project failed to stop, please see the console output for more info.`
    )
    return false;
  }

  /**
  * Stop the docksal VM and all containers.
  */
  public static async stopVM() {
    let cmd = "fin system stop"
    let terminal = window.createTerminal('Docksal VM')
    terminal.sendText(cmd)
    terminal.show()
  }
}

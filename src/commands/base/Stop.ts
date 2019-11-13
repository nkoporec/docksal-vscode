import { workspace, window, Terminal } from 'vscode'
import Common from '../../Common';
import Output from '../../utils/Output'

export default class Stop extends Common {

  /**
  * Stop the docksal project.
  */
  public static async stopProject() {
    let cmd = "fin stop"

    this.execCmd(cmd, async (info) => {
      if (info.err) {
        Output.showConsole()
      } else {
        window.showInformationMessage('Docksal has been stopped');
      }
    })
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

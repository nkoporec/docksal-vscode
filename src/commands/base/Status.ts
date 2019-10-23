import { workspace, window, Terminal } from 'vscode'
import Common from '../../Common';

export default class Status extends Common {

  /**
  * Shows the docksal status and containers in terminal.
  */
  public static async run() {
    let cmd = 'fin status'
    let terminal = window.createTerminal('Docksal VM')
    terminal.sendText(cmd)
    terminal.show()
  }
}

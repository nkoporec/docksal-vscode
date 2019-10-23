import { workspace, window, Terminal } from 'vscode'
import Common from '../../Common';
const open = require('opn')

export default class OpenBrowser extends Common {

  /**
  * Open the project in the default browser.
  */
  public static async run() {
    let browser = this.getBrowser()

    try {
      await open(this.docksalUrl().toString(), { app: browser })
    }
    catch {
      window.showErrorMessage(
        `Opening browser failed. Please check if you have installed the browser ${browser} correctly!`
      )
    }
  }
}

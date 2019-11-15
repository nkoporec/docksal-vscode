import * as vscode from 'vscode'
import Common from '../../Common';
const open = require('opn')

export default class Mailhog extends Common {

  /**
  * Open the mailhog web ui.
  */
  public static async open() {
    // Check mailhog container.
    const mailHogContainer = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Docksal: Checking Mailhog status',
      },
      () => this.getContainerStatus('mail')
    )

    if (mailHogContainer == false) {
      vscode.window.showErrorMessage('Docksal: Mailhog container is not running!');
      return false;
    }

    // Open the interface.
    vscode.window.showInformationMessage('Docksal: Opening Mailhog interface');
    let browser = this.getBrowser()
    try {
      const docksalUrl = this.docksalUrl().toString().replace(/(^\w+:|^)\/\//, '');;
      const url = `http://mail.${docksalUrl}`
      await open(url, { app: browser })
    } catch {
      vscode.window.showErrorMessage(
        `Opening browser failed. Please check if you have installed the browser ${browser} correctly!`
      )
    }
  }
}

import * as vscode from 'vscode'
import Common from '../../Common';
const open = require('opn')

export default class PhpMyAdmin extends Common {

  /**
  * Open the phpmyadmin web ui.
  */
  public static async open() {
    // Check phpmyadmin container.
    const phpMyAdminContainer = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Docksal: Checking PhpMyAdmin status',
      },
      () => this.getContainerStatus('pma')
    )

    if (phpMyAdminContainer == false) {
      vscode.window.showErrorMessage('Docksal: PhpMyAdmin container is not running!');
      return false;
    }

    // Open the interface.
    vscode.window.showInformationMessage('Docksal: Opening PhpMyAdmin interface');
    let browser = this.getBrowser()
    try {
      const docksalUrl = this.docksalUrl().toString().replace(/(^\w+:|^)\/\//, '');;
      const url = `http://pma.${docksalUrl}`
      console.log(url);
      await open(url, { app: browser })
    } catch {
      vscode.window.showErrorMessage(
        `Opening browser failed. Please check if you have installed the browser ${browser} correctly!`
      )
    }
  }
}

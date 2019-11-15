import * as vscode from 'vscode'
import Common from '../../Common';
const open = require('opn')

export default class Varnish extends Common {

  /**
  * Open the varnish web ui.
  */
  public static async open() {
    // Check varnish container.
    const varnishContainer = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Docksal: Checking Varnish status',
      },
      () => this.getContainerStatus('varnish')
    )

    if (varnishContainer == false) {
      vscode.window.showErrorMessage('Docksal: Varnish container is not running!');
      return false;
    }

    // Open the interface.
    vscode.window.showInformationMessage('Docksal: Opening Varnish interface');
    let browser = this.getBrowser()
    try {
      const docksalUrl = this.docksalUrl().toString().replace(/(^\w+:|^)\/\//, '');;
      const url = `http://varnish.${docksalUrl}`
      await open(url, { app: browser })
    } catch {
      vscode.window.showErrorMessage(
        `Opening browser failed. Please check if you have installed the browser ${browser} correctly!`
      )
    }
  }
}

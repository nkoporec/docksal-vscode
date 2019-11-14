import Common from '../../Common';
import * as vscode from 'vscode';
import Output from '../../utils/Output'
const open = require('opn')

export default class Start extends Common {

  /**
  * Starts the docksal VM.
  */
  public static async runVM() {
    let dockerMode = this.dockerMode()

    if (dockerMode == 'vm') {
      const startProjectPick = await vscode.window.showQuickPick(
        [{ label: 'Yes' }, { label: 'No' }],
        {
          placeHolder: 'Start the project as well?',
          ignoreFocusOut: true,
        },
      )

      let cmd = ''
      if (startProjectPick) {
        switch (startProjectPick.label) {
          case 'Yes':
            cmd = 'fin system start && fin start && fin bash'
            break
          case 'No':
            cmd = 'fin system start'
            break
          default:
            throw new Error('[docksal] invalid choice')
        }
      }

      let terminal = vscode.window.createTerminal('Docksal VM')
      terminal.sendText(cmd)
      terminal.show()
    }
    else {
      vscode.window.showErrorMessage(
        `Configuration value is set to docker native, if you want to start VM then set the correct configuration value!`
      )
    }

  }

  /**
  * Starts the docksal project.
  */
  public static async runProject() {
    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Docksal: Starting a project',
        },
        () => this.runCommand({ command: 'fin', args: ['start'] })
      )

      // Open a URL.
      let browser = this.getBrowser()
      try {
        await open(this.docksalUrl().toString(), { app: browser })
      } catch {
        vscode.window.showErrorMessage(
          `Opening browser failed. Please check if you have installed the browser ${browser} correctly!`
        )
      }
      vscode.window.showInformationMessage('Docksal: Project has started!');
    } catch (error) {
      vscode.window.showErrorMessage(error.message)
      return false
    }
  }
}

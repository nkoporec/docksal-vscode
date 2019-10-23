import Common from '../../Common';
import { window } from 'vscode';
import Output from '../../utils/Output'
const open = require('opn')

export default class Start extends Common {

  /**
  * Starts the docksal VM.
  */
  public static async runVM() {
    let dockerMode = this.dockerMode()

    if (dockerMode == 'vm') {
      const startProjectPick = await window.showQuickPick(
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

      let terminal = window.createTerminal('Docksal VM')
      terminal.sendText(cmd)
      terminal.show()
    }
    else {
      window.showErrorMessage(
        `Configuration value is set to docker native, if you want to start VM then set the correct configuration value!`
      )
    }

  }

  /**
  * Starts the docksal project.
  */
  public static async runProject() {
    let cmd = "fin start"
    if (this.execCmd(cmd)) {
      window.showInformationMessage('Docksal has started');
      let browser = this.getBrowser()

      try {
        await open(this.docksalUrl().toString(), { app: browser })
      } catch {
        window.showErrorMessage(
          `Opening browser failed. Please check if you have installed the browser ${browser} correctly!`
        )
      }
    }
    else {
      Output.showConsole()
    }
  }
}

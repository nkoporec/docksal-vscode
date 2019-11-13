import { workspace, window, Terminal, TreeItem } from 'vscode'
import * as cp from 'child_process'
import Output from './utils/Output'
import * as fs from 'fs'
import * as path from 'path'

export default class Common {

  /**
  * Get the current workspace location.
  *
  * @returns string
  */
  public static workspacePath() {
    if (workspace.workspaceFolders) {
      return workspace.workspaceFolders[0].uri.fsPath
    }
    return ''
  }

  /**
  * Check if the workspace is a docksal project.
  */
  public static isWorkspaceValid() {
    let hasDocksalFolder = fs.existsSync(path.join(this.workspacePath(), '.docksal'))
    if (!hasDocksalFolder) {
      window.showInformationMessage('No docksal config folder found!');
    }
  }

  /**
  * Gets the URL of the docksal project from config, if no config is found then it
  * will generate the url automaticly out of the folder name.
  *
  * @returns string
  */
  protected static docksalUrl() {
    let config = workspace.getConfiguration("docksal")
    let docksalUrl = config.get<string>("url")

    if (!docksalUrl) {
      let workspace = this.workspacePath().split('/');
      var workspaceFolderName = workspace.pop() || workspace.pop();
      docksalUrl = `http://"${workspaceFolderName}".docksal`
    }

    return docksalUrl
  }

  /**
  * Gets the default browser out of config.
  *
  * @returns string
  */
  protected static getBrowser() {
    let config = workspace.getConfiguration("docksal")
    let browser = config.get<string>("browser")

    return browser
  }

  /**
  * Gets the docksal docker mode (VM or Native), only applies to Mac or Windows.
  *
  * @returns string
  */
  protected static dockerMode() {
    let config = workspace.getConfiguration("docksal")
    let mode = config.get<string>("mode")

    return mode
  }

  /**
  * Executes a docksal command.
  */
  protected static async execCmd(cmd: string, callback: (info: {
    err: Error | null
    stdout: string
    stderr: string
  }) => void) {
    // Check workspace.
    this.isWorkspaceValid()

    // Build command.
    let workspaceRoot = this.workspacePath()
    let command = process.platform == 'win32' ?
      // Windows command
      `cd /d "${workspaceRoot}" && ${cmd}` :
      // Unix command
      `cd "${workspaceRoot}" && ${cmd}`

    // Execute the cmd.
    cp.exec(command, async (err, stdout, stderr) => {
      if (err) {
        Output.error(err.message.trim())
        Output.showConsole()
      }
      await callback({
        err, stdout, stderr
      })
    })
  }
}

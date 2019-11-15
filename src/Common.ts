import { workspace, window, Terminal, TreeItem, ProgressLocation } from 'vscode'
import * as cp from 'child_process'
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
   * Get the docksal project name out of the project folder.
   *
   * @returns string
   */
  public static projectName() {
    let workspace = this.workspacePath().split('/');
    var workspaceFolderName = workspace.pop() || workspace.pop();

    return workspaceFolderName;
  }

  /**
   * Get the docksal container status
   *
   * @returns boolean
   */
  protected static async getContainerStatus(container: string) {
    const status = await this.runCommand({ command: 'fin', args: ['status'] });

    let containers = status.toString().split("\n");
    const projectName = this.projectName();
    let containerRunning = false;

    containers.forEach(function (item) {
      if (item.includes(`${projectName}_${container}`) && item.includes('Up')) {
        containerRunning = true;
      }
    });

    return containerRunning;
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
      var workspaceFolderName = this.projectName();
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
  protected static async runCommand({ command, args = []}: {command: string, args: string[]}): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = cp.spawn(command, args, { cwd: this.workspacePath() })
      let totalData = ``
      process.stdout.on('data', async dataBuffer => {
        const data = dataBuffer.toString()
        totalData += data
      })
      process.on('error', err => {
        reject(err)
      })
      process.on('exit', code => {
        if (code) {
          reject(new Error(`command exited with status ${code}`))
        } else {
          resolve(totalData.trim())
        }
      })
    })
  }
}

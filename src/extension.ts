import * as vscode from 'vscode';
import { createTestFolder, createTheTestFile, generateTestFileName, getFileContent, isTestFileExist, validateFileType } from './utils/helpers';
import { generateMessage } from './utils/messages';
import fetchData from './utils/requestHandler';


export function activate(context: vscode.ExtensionContext) {

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusBarItem.text = "$(beaker) Generate Tests";
  statusBarItem.tooltip = "Generate Unit Tests for the current file";
  statusBarItem.command = "unitTestGeneratorReact.generateUnitTests";
  statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  statusBarItem.show();

  // Add the button to the status bar
  context.subscriptions.push(statusBarItem);
	
	const disposable = vscode.commands.registerCommand('unitTestGeneratorReact.generateUnitTests', async () => {
    const activeTextEditor = vscode.window.activeTextEditor;
    statusBarItem.hide();
    if (activeTextEditor) {
      if (validateFileType(activeTextEditor)) {
        generateMessage("Writing the unit tests for  you! Please be patient.", 'info');
        if (!isTestFileExist(generateTestFileName(activeTextEditor))) {
          const fileContent = getFileContent(activeTextEditor);
          
          const prompt = "Using Jest and Enzyme, generate comprehensive unit tests for a React component. Test that all elements are rendering, function calls are accurately called, and events are appropriately handled. Test for the number of function calls and ensure that all possible scenarios are covered. Do not include snapshot testing and do not assume the presence of any elements that are not visible in the code. Please provide only the relevant test code as a response, without any natural language output or comments";
          const results = await fetchData(fileContent + prompt);
          if (results) {
            createTestFolder();
            createTheTestFile(activeTextEditor, results);
          }         
        } else {
          generateMessage("Test file already exist!", 'error');
        }
      } else {
        generateMessage("Cannot generate Unit tests for this file", 'error');
      }
    }
    statusBarItem.show();
  });
	context.subscriptions.push(disposable);
}

export function deactivate() {}

import * as vscode from "vscode";
const updateStatusBar = (statusBarItem: vscode.StatusBarItem ,type: 'default' | 'loading' = 'default') => {
  if(type === 'default') {
    statusBarItem.text = "$(beaker) Generate Tests";
    statusBarItem.tooltip = "Generate Unit Tests for the current file";
    statusBarItem.command = "unitTestGeneratorReact.generateUnitTests";
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  }
  else {
    statusBarItem.text = "$(sync~spin) Generating Tests";
    statusBarItem.tooltip = "Generating Unit Tests";
    statusBarItem.command = undefined;
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
  }
 
};

export default updateStatusBar;
import * as vscode from 'vscode';

export type Message = 'warning' | 'info' | 'error';

export const generateMessage = (message: string, type: Message = 'info'): void => {
  if (type === 'warning') vscode.window.showInformationMessage(message);
  if (type === 'error') vscode.window.showErrorMessage(message);
  if (type === 'info') vscode.window.showInformationMessage(message);
}
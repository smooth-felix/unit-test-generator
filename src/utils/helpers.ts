import * as vscode from 'vscode';
import { generateMessage } from './messages';
const fs = require('fs');
const path = require('path');

const vsCodeRoot = vscode.workspace.rootPath;
const testFolder = vsCodeRoot + '/__tests__';

// Check whether tests folder already exists
// If the folder does not exists create it
export const createTestFolder = (): void => {
  if (!fs.existsSync(testFolder)) {
    fs.mkdirSync(testFolder);
  }
};

export const getFileContent = (activeTextEditor : vscode.TextEditor) : string => {
  return activeTextEditor.document.getText();
};

export const generateTestFileName = (activeTextEditor : vscode.TextEditor) : string => {
  const filePath = activeTextEditor.document.uri.fsPath;
  const fileExtension = path.extname(filePath);
  const fileBaseName = path.basename(filePath, fileExtension);
  return `${testFolder}/${fileBaseName}.test${fileExtension}`;
};

export const isTestFileExist = (filePath: string) : boolean => {
  return fs.existsSync(filePath);
};

// Create the .test file
export const createTheTestFile = (activeTextEditor : vscode.TextEditor, content: string): void => {
  const testFilePath = generateTestFileName(activeTextEditor);
  if (!isTestFileExist(testFilePath)) {
    fs.writeFileSync(testFilePath, content);
    openFile(testFilePath);
  } else {
    generateMessage("Test file already exists!", 'error');
  }
};

const openFile = async (filePath: string) => {
  try {
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  } catch (error) {
    console.error(error);
  }
};

export const validateFileType = (activeTextEditor : vscode.TextEditor) : boolean => {
  const filePath = activeTextEditor.document.uri.fsPath;
  const regex = /^(?!.*test\.)(.+)\.(js|jsx|ts|tsx)$/;
  return regex.test(filePath);
};

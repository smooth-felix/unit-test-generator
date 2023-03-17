import * as vscode from 'vscode';
import { generateMessage } from './messages';
const fs = require('fs');
const path = require('path');

// const vsCodeRoot = vscode.workspace.rootPath;

// Check whether tests folder already exists
// If the folder does not exists create it
export const createTestFolder = (activeTextEditor : vscode.TextEditor): void => {
  const filePath = activeTextEditor.document.uri.fsPath;
  const testFolder = path.dirname(filePath) + '/__test__';
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
  const testFolder = path.dirname(filePath) + '/__test__';
  return `${testFolder}/${fileBaseName}.test${fileExtension}`;
};

export const isTestFileExist = (filePath: string) : boolean => {
  return fs.existsSync(filePath);
};

async function updateFileWithChunks(inputString: string, editor: vscode.TextEditor) {
  // Use a regular expression that preserves line breaks when splitting the input string into lines
  let lines = inputString.split(/\r\n|\n|\r/);
  let currentIndex = 0;

  const updateFile = async () => {
    if (!editor.document.isClosed && lines && currentIndex < lines.length) {
      const line = lines[currentIndex] + "\n"; // add a line break at the end of each line
      const startPosition = new vscode.Position(currentIndex, 0);
      const endPosition = new vscode.Position(currentIndex, line.length);
      const range = new vscode.Range(startPosition, endPosition);
      await editor.edit(editBuilder => {
        editBuilder.replace(range, line);
      });

      currentIndex++;
      setTimeout(updateFile, 200); // updates every second
    } else {
      try {
        await editor.document.save(); // save the document after all chunks are written
      } catch (error) {
        console.error('Error saving file:', error);
      }
    }
  };

  await updateFile();
}

const openFile = async (filePath: string) => {
  try {
    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);
    return editor;
  } catch (error) {
    console.error(error);
  }
};

// Create the .test file
export const createTheTestFile = async (activeTextEditor : vscode.TextEditor, content: string) => {
  const testFilePath = generateTestFileName(activeTextEditor);
  if (!isTestFileExist(testFilePath)) {
    fs.writeFileSync(testFilePath, "");
    const editor = await openFile(testFilePath);
    if(editor) {
      updateFileWithChunks(content, editor);
    }
  } else {
    generateMessage("Test file already exists!", 'error');
  }
};

export const validateFileType = (activeTextEditor : vscode.TextEditor) : boolean => {
  const filePath = activeTextEditor.document.uri.fsPath;
  const regex = /^(?!.*test\.)(.+)\.(js|jsx|ts|tsx)$/;
  return regex.test(filePath);
};

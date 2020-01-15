// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "autosettergetterjs" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand('nivlem.setget', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Run JS setter getter');
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage("Editor does not exist");
			return;
		}

		var text = editor.document.getText(editor.selection).replace(/(\r\n|\n|\r|{|})/gm, "").split(';');
		// vscode.window.showInformationMessage(`${text}`);

		for (var i = 0; i < text.length - 1; i++) {
			var tmp = text[i].split(" ").filter(function (el) {
				return el;
			});
			// vscode.window.showInformationMessage(`In loop${i}: ${tmp}`);
			
			text[i] = 
			`
			get ${tmp[1]}() {
			\treturn this._${tmp[1]};
			}
			set ${tmp[1]}(in_${tmp[1]}) {
			\tthis._${tmp[1]} = in_${tmp[1]};
			}
			`
		}

		editor.edit((edit) => {
			for (var i = 0; i < text.length-1; i++) {
				edit.insert(editor.selection.end, text[i]);
			}

		});

		vscode.commands.executeCommand('editor.action.formatSelection');
		// vscode.window.showInformationMessage(`In loop${i}: ${text}`);
		// vscode.window.showInformationMessage(`Selected text: ${text[0]}`);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
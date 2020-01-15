const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "autosettergetterjs" is now active!');

	let disposable = vscode.commands.registerCommand('nivlem.setget', function () {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage("Editor does not exist");
			return;
		}

		const start = () => {
			return vscode.commands.executeCommand('editor.action.formatSelection').then(run => {
				var text = editor.document.getText(editor.selection).replace(/(\r\n|\n|\r|{|})/gm, "").split(';');

				if (text.length - 1 < 1) vscode.window.showInformationMessage('No data selected');
				else vscode.window.showInformationMessage('Running JS setter getter');

				for (var i = 0; i < text.length - 1; i++) {
					var tmp = text[i].split(" ").filter(function (el) {
						return el;
					});

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
					for (var i = 0; i < text.length - 1; i++) {
						edit.insert(editor.selection.end, text[i]);
					}
				});
			}).then(end => {
				vscode.commands.executeCommand('editor.action.formatSelection');
			})
		}

		start();

	});



	context.subscriptions.push(disposable);
}

exports.activate = activate;


function deactivate() {
	console.log("Thanks for using my extension. Hope to see you again");
}

module.exports = {
	activate,
	deactivate
}
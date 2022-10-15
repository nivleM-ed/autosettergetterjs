const vscode = require('vscode');
const {
	reservedWords
} = require('./reservedWords');

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
				var text = editor.document.getText(editor.selection).replace(/(\r\n|\n|\r|{|})/gm, "").split(';').filter(function (el) {
					return el.trim() != '';
				});

				if (text.length - 1 < 1) vscode.window.showInformationMessage('No data selected');
				else vscode.window.showInformationMessage('Running JS setter getter');

				var editData = [];
				text = [...new Set(text)];
				text.forEach(item => {
					var tmp = item.split(" ").filter(function (el) {
						return !(el.trim() == '' || el.trim() == '=' || reservedWords.includes(el.trim()));
					});

					var variable = tmp[0];
					var innerVar = formatVariable(variable, 'inner');
					var functionVar = formatVariable(variable, 'function');
					var setterGetter =
						`
					get ${functionVar}() {
					\treturn this.${innerVar};
					}
					set ${functionVar}(in${innerVar}) {
					\tthis.${innerVar} = in${innerVar};
					}
					`;
					editData.push(setterGetter);
				});

				editor.edit((edit) => {
					editData.forEach(data => {
						edit.insert(editor.selection.end, data);
					});
				});
			}).then(end => {
				vscode.commands.executeCommand('editor.action.formatSelection');
			})
		}

		const formatVariable = ( /** @type {string} */ variable, /** @type {string} */ type) => {
			switch (type) {
				case 'inner':
					return '_' + variable.replace(/this.|_/g, '');
				case 'function':
					return variable.replace(/this.|_/g, '');
			}
		}

		start();

	});



	context.subscriptions.push(disposable);
}

function deactivate() {
	console.log("Thanks for using my extension. Hope to see you again");
}

module.exports = {
	activate,
	deactivate
}
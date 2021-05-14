import * as vscode from 'vscode';
import { Client } from './client';
import { Config, ConfigFields } from './config';

const client = new Client();

export function activate(context: vscode.ExtensionContext) {
	if (!Config.isActive()) {
		vscode.window.showErrorMessage('No area configured for redAlerts, configure in `redAlerts.area`')
	} else {
		client.init();
	}

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((event) => {
			console.log('redAlerts config changed');

			if (Config.isActive()) {
				if (event.affectsConfiguration(`${Config.CONFIG}.${ConfigFields.area}`)) {
					vscode.window.showInformationMessage(`redAlert extension is enabled for ${Config.getArea()}`);
				}
				client.restart();
			} else {
				client.stop();
			}
		}),
	);
}

export function deactivate() {
	client.stop();
}

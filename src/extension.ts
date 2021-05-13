import * as vscode from 'vscode';
import { Client } from './client';
import { Config } from './config';

export function activate(context: vscode.ExtensionContext) {
	const config = new Config();
	const client = new Client();

	if (!config.isActive()) {
		vscode.window.showErrorMessage('No area configured for redAlerts, configure in `redAlerts.area`')
		return;
	}

	vscode.window.showInformationMessage(`redAlert extension is enabled for ${config.getArea()}`);
	client.init();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((_) => {
			console.log('redAlerts config changed');
			client.restart();
		}),
	);
}

export function deactivate() { }

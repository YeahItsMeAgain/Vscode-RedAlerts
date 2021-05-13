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

	client.init();
}

export function deactivate() { }

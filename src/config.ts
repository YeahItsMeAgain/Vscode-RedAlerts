import * as vscode from 'vscode';
import { join } from 'path';

export enum ConfigFields {
    area = 'area',
    pollingInterval = 'pollingInterval'
};

export class Config {
    public static readonly CONFIG = 'redAlerts'
    public static readonly RED_ALERTS_API = 'https://redalert.me/alerts'
    public static readonly DEFAULT_INTERVAL = 10;

    constructor() { }

    public static getConfig() {
        return vscode.workspace.getConfiguration(Config.CONFIG);
    }

    public static isActive(config = Config.getConfig()) {
        return !!Config.getArea(config);
    }

    public static getRequestInterval(config = Config.getConfig()) {
        return config.get(ConfigFields.pollingInterval, Config.DEFAULT_INTERVAL);
    }

    public static getArea(config = Config.getConfig()) {
        const area = config.get(ConfigFields.area);
        return (typeof area === "string" && area) || "";
    }

    public static getAlertSound() {
        return join(__dirname, '..', 'assets', 'alert.wav');
    }
}
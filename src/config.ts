import * as vscode from 'vscode';
import { join } from 'path';

export enum ConfigFields {
    areas = 'areas',
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
        const areas = Config.getAreas(config);
        return areas.length && areas.every(area => !!area);
    }

    public static getRequestInterval(config = Config.getConfig()) {
        return config.get(ConfigFields.pollingInterval, Config.DEFAULT_INTERVAL);
    }

    public static getAreas(config = Config.getConfig()): string[] {
        const areas = config.get(ConfigFields.areas);
        return Array.isArray(areas) ? areas : [];
    }

    public static getAlertSound() {
        return join(__dirname, '..', 'assets', 'alert.wav');
    }
}
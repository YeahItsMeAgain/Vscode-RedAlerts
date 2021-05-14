import * as vscode from 'vscode';
import * as _ from 'lodash';
import { join } from 'path';

enum ConfigFields {
    area = 'area',
    pollingInterval = 'pollingInterval'
};

export class Config {
    private static readonly CONFIG = 'redAlerts'
    public static readonly RED_ALERTS_API = 'https://redalert.me/alerts'
    public static readonly DEFAULT_INTERVAL = 10;

    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = Config.getConfig();
    }

    public static getConfig() {
        return vscode.workspace.getConfiguration(Config.CONFIG);
    }

    public isActive() {
        return _.isString(this.config.get(ConfigFields.area)) && !_.isEmpty(this.config.get(ConfigFields.area));
    }

    public static getRequestInterval(config = Config.getConfig()) {
        return config.get(ConfigFields.pollingInterval, Config.DEFAULT_INTERVAL);
    }

    public getArea() {
        return Config.getArea(this.config);
    }

    public static getArea(config = Config.getConfig()) {
        return _.toString(config.get(ConfigFields.area));
    }

    public static getAlertSound() {
        return join(__dirname, '..', 'assets', 'alert.wav');
    }
}
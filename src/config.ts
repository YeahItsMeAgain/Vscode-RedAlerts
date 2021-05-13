import * as vscode from 'vscode';
import * as _ from 'lodash';

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
        this.config = vscode.workspace.getConfiguration(Config.CONFIG);
    }

    public isActive() {
        return _.isString(this.config.get(ConfigFields.area)) && !_.isEmpty(this.config.get(ConfigFields.area));
    }

    public static getRequestInterval(config = new Config()) {
        return config.config.get(ConfigFields.pollingInterval, Config.DEFAULT_INTERVAL);
    }

    public static getArea(config = new Config()) {
        return config.config.get(ConfigFields.area);
    }
}
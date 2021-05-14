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

    constructor() { }

    public static getConfig() {
        return vscode.workspace.getConfiguration(Config.CONFIG);
    }

    public static isActive(config = Config.getConfig()) {
        return _.isString(config.get(ConfigFields.area)) && !_.isEmpty(config.get(ConfigFields.area));
    }

    public static getRequestInterval(config = Config.getConfig()) {
        return config.get(ConfigFields.pollingInterval, Config.DEFAULT_INTERVAL);
    }

    public static getArea(config = Config.getConfig()) {
        return _.toString(config.get(ConfigFields.area));
    }

    public static getAlertSound() {
        return join(__dirname, '..', 'assets', 'alert.wav');
    }
}
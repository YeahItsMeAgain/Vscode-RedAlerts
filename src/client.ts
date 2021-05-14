import axios from 'axios';
import _ = require('lodash');
import * as vscode from 'vscode';
import { Config } from "./config";
import { Player } from './player';

const areaFilter = (area: string, userArea: string) => {
    if (userArea.indexOf(' -') === -1) {
        const lastAreaChar = area.indexOf(' -');
        if (lastAreaChar !== -1) {
            area = area.substr(0, lastAreaChar);
        }
    }
    return area === userArea;
}
export class Client {
    private interval = Config.DEFAULT_INTERVAL;
    private requestLoop: { (): void; (): Promise<never>; } | undefined;
    private isActive = false;
    private lastId = 0;
    private area = '';
    private isInit = false;

    constructor() {
        this.refreshConfig()
    }

    private refreshConfig() {
        this.interval = Config.getRequestInterval();
        this.area = Config.getArea();
    }

    public init() {
        this.start();
        this.requestLoop = async () => {
            while (true) {
                await new Promise(resolve => setTimeout(resolve, this.interval));
                if (!this.isActive) {
                    continue;
                }

                let data = [];
                try {
                    data = (await axios.get<{ id: number; area: string; }[]>(Config.RED_ALERTS_API)).data;
                    if (!_.isArray(data)) {
                        continue;
                    }

                    const lastId = this.lastId;
                    const currentId = data[0].id;
                    data = data.filter(record =>
                        record.id > this.lastId && areaFilter(record.area, this.area)
                    );

                    this.lastId = currentId;
                    if (!lastId) {
                        continue;
                    }
                    data.forEach(async record => {
                        vscode.window.showErrorMessage(`צבע אדום ב${record.area}`)
                        await Player.play(Config.getAlertSound())
                    });
                } catch (error) {
                    vscode.window.showErrorMessage(error);
                }
            }
        }
        this.run();
        vscode.window.showInformationMessage(`redAlert extension is enabled for ${this.area}`);
        this.isInit = true;
    }


    public run() {
        if (this.requestLoop) {
            this.requestLoop();
        }
    }

    public stop() {
        this.isActive = false;
    }

    public start() {
        this.isActive = true;
    }

    public restart() {
        this.refreshConfig();

        if (!this.isInit) {
            this.init();
        } else {
            this.stop();
            this.start();
        }
    }
}

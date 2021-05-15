import axios from 'axios';
import * as vscode from 'vscode';
import { AsyncInterval } from './asyncInterval';
import { Config } from "./config";
import { areaFilter } from './utils';

const sound = require("sound-play");
export class Client {
    private interval = Config.DEFAULT_INTERVAL;
    private requestLoop: AsyncInterval | undefined;
    private previousId = 0;
    private areas = [""];
    private isInit = false;

    constructor() { }

    private refreshConfig() {
        this.interval = Config.getRequestInterval();
        this.areas = Config.getAreas();
    }

    public init() {
        this.refreshConfig()
        this.requestLoop = new AsyncInterval(this.requestLoopFn.bind(this), this.interval);
        this.start();
        this.isInit = true;
    }

    private async requestLoopFn() {
        try {
            const { data } = await axios.get<{ id: number; area: string; }[]>(Config.RED_ALERTS_API);
            if (!Array.isArray(data) || !data.length) {
                return;
            }

            const previousId = this.previousId;
            this.previousId = data[0].id;
            if (!previousId) {
                return;
            }

            data.filter(record => record.id > previousId && areaFilter(record.area, this.areas))
                .forEach(record => {
                    vscode.window.showErrorMessage(`צבע אדום ב${record.area}`)
                    sound.play(Config.getAlertSound());
                });
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
    }

    public start() {
        this.requestLoop?.start()
        vscode.window.showInformationMessage(`redAlert extension is enabled for ${this.areas}`);
    }

    public async stop() {
        if (this.requestLoop) {
            this.requestLoop.stop();
        }
        vscode.window.showInformationMessage('redAlert extension is disabled');
    }

    public restart() {
        this.refreshConfig();

        if (!this.isInit) {
            this.init();
        } else {
            this.requestLoop?.restart(this.interval);
        }
    }
}

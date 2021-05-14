import axios from 'axios';
import * as vscode from 'vscode';
import { Config } from "./config";
import { asyncSleep, extractArea } from './utils';

const sound = require("sound-play");

const areaFilter = (area: string, userAreas: string[]) => {
    for (const userArea of userAreas) {
        if (userArea.indexOf(' -') === -1) {
            area = extractArea(area);
        }
        if (area === userArea) {
            return true;
        }
    }
    return false;
}

export class Client {
    private interval = Config.DEFAULT_INTERVAL;
    private requestLoop: { (): void; (): Promise<never>; } | undefined;
    private isActive = false;
    private previousId = 0;
    private areas = [""];
    private isInit = false;

    constructor() {
        this.refreshConfig()
    }

    private refreshConfig() {
        this.interval = Config.getRequestInterval();
        this.areas = Config.getAreas();
    }

    public init() {
        this.start();
        this.requestLoop = async () => {
            while (true) {
                await asyncSleep(this.interval);
                if (!this.isActive) {
                    continue;
                }

                try {
                    const { data } = await axios.get<{ id: number; area: string; }[]>(Config.RED_ALERTS_API);
                    if (!Array.isArray(data) || !data.length) {
                        continue;
                    }

                    const previousId = this.previousId;
                    this.previousId = data[0].id;
                    if (!previousId) {
                        continue;
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
        }
        this.run();
        vscode.window.showInformationMessage(`redAlert extension is enabled for ${this.areas}`);
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

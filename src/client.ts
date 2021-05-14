import axios from 'axios';
import * as vscode from 'vscode';
import { Config } from "./config";
import { asyncSleep } from './utils';

const sound = require("sound-play");

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
    private previousId = 0;
    private area = "";
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

                    data.filter(record => record.id > previousId && areaFilter(record.area, this.area))
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

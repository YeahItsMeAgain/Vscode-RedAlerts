import axios from 'axios';
import _ = require('lodash');
import * as vscode from 'vscode';
import { Config } from "./config";

export class Client {
    private interval = Config.getRequestInterval();
    private requestLoop: { (): void; (): Promise<never>; } | undefined;
    private isActive = false;
    private lastId = 0;
    private area = Config.getArea();

    constructor() {
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
                        record.id > this.lastId && record.area === this.area
                    );

                    this.lastId = currentId;
                    if (!lastId) {
                        continue;
                    }
                    data.forEach(record => {
                        vscode.window.showErrorMessage(`צבע אדום ב ${record.area}`)
                    });
                } catch (error) {
                    vscode.window.showErrorMessage(error.response.data);
                }
            }
        }
        this.run();
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
}

import axios from 'axios';
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
        this.isActive = true;
        this.requestLoop = async () => {
            while (true) {
                await new Promise(resolve => setTimeout(resolve, this.interval));
                if (!this.isActive) {
                    continue;
                }

                let data = [];
                try {
                    data = (await axios.get<{ id: number; area: string; }[]>(Config.RED_ALERTS_API)).data
                        .filter(record =>
                            record.id > this.lastId && record.area === this.area
                        );

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
}

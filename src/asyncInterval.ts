export class AsyncInterval {
    private callback: Function;
    private delay: number;
    private isRunning: boolean;
    private currentTimer: NodeJS.Timeout | undefined;

    constructor(callback: Function, delay: number) {
        this.callback = callback;
        this.delay = delay;
        this.isRunning = false;
    }

    public setDelay(delay: number) {
        this.delay = delay;
    }

    public start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.run();
        }
    }

    public stop() {
        if (this.currentTimer) {
            clearTimeout(this.currentTimer);
        }
        this.isRunning = false;
    }

    public restart(delay: number) {
        this.delay = delay;
        this.stop();
        this.start();
    }

    private async run() {
        await this.callback();

        if (!this.isRunning) {
            return;
        }

        this.currentTimer = setTimeout(() => {
            this.run();
        }, this.delay);
    }
}
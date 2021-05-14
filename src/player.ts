// this is partly taken from 'https://github.com/mattogodoy/hacker-sounds/blob/HEAD/src/player.ts'

import cp = require('child_process');
import { join } from 'path';
const player = require('play-sound')();

const _isWindows = process.platform === 'win32';
const _playerWindowsPath = join(__dirname, '..', 'assets', 'sounder.exe');

export class Player {
    constructor(){}

    static async play(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (_isWindows) {
                cp.execFile(_playerWindowsPath, [filePath]);
                resolve();
            } else {
                player.play(filePath, (err: any) => {
                    if (err) {
                        console.error("Error playing sound:", filePath, " - Description:", err);
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    }
};

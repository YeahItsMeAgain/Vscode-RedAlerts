export async function asyncSleep(seconds: number) {
    await new Promise(resolve => setTimeout(resolve, seconds));
}

export function extractArea(area: string) {
    const lastAreaChar = area.indexOf(' -');
    if (lastAreaChar !== -1) {
        area = area.substr(0, lastAreaChar);
    }
    return area;
}
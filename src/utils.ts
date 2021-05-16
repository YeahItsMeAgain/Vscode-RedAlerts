function extractArea(removeUnderscore: boolean, area: string) {
    const lastAreaChar = area.indexOf(' -');
    if (!removeUnderscore || lastAreaChar === -1) {
        return area;
    }

    return area.substr(0, lastAreaChar);
}

export function areaFilter(area: string, userAreas: string[]) {
    for (const userArea of userAreas) {
        if (extractArea(userArea.includes(' -'), area) === userArea) {
            return true;
        }
    }
    return false;
}
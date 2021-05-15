function extractArea(area: string) {
    const lastAreaChar = area.indexOf(' -');
    if (lastAreaChar !== -1) {
        area = area.substr(0, lastAreaChar);
    }
    return area;
}

export function areaFilter(area: string, userAreas: string[]) {
    for (const userArea of userAreas) {
        if (userArea.includes(' -')) {
            area = extractArea(area);
        }
        if (area === userArea) {
            return true;
        }
    }
    return false;
}
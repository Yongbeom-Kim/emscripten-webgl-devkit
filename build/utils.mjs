
export function replacePlaceholders(str, entryFileName) {
    return str.replaceAll("[name]", entryFileName);
}

export function getNameFromPath(path) {
    return path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
}

export function getDirFromPath(path) {
    return path.substring(0, path.lastIndexOf("/"))
}
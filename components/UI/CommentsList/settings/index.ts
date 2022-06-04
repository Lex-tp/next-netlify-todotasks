export function overflowFileName(fileName: string) {
    const originalFileName = fileName.slice(fileName.indexOf('.') + 1, fileName.lastIndexOf('.'));
    const extFileName = fileName.slice(fileName.lastIndexOf('.'));
    return originalFileName.length > 18 ? sliceFileName(originalFileName).concat(extFileName):originalFileName.concat(extFileName);
}

function sliceFileName (originalFileName:string) {
    return originalFileName.slice(0, 20);
}
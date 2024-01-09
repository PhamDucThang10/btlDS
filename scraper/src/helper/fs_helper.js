import fs from "fs";

export const saveDataAsString = (path, data) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const saveDataAsJson = (path, data) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 4));
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const saveToCsv = (path, data) => {
    try {
        const csvHeader = ',' + Object.keys(data[0]).join(',') + '\n';
        const csvData = 
            data
                .map((obj, idx) => 
                    idx + ',' + Object.values(obj).map(val => typeof val === 'string' && val.includes(',') ? `"${val.replace(/\\n|\\r|\\r\\n|[\n\r]/g, '')}"` : val).join(','))
                .join('\n');
        
        const csvFile = csvHeader + csvData;

        fs.writeFileSync(path, csvFile);
        console.log(`Save successed to ${path}`);
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const saveConcatToCsv = (path, obj, id) => {
    try {
        const csvData = 
            id + ',' + Object.values(obj).map(val => typeof val === 'string' ? `"${val.replace(/\\n|\\r|\\r\\n|[\n\r]/g, '')}"` : val).join(',') + '\n';

        fs.appendFileSync(path, csvData);
        console.log(`Save successed to ${path}`);
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}
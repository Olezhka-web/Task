// 1 way
const fs = require('fs').promises;
const path = require('path');

startTask(5, __dirname);

async function startTask(nestingCountOfFolders, currentFolderPath, numberCurrentNestingFolder = 1) {
    const newCurrentFolderPath = path.join(currentFolderPath, `folder${numberCurrentNestingFolder}`);

    if (numberCurrentNestingFolder <= nestingCountOfFolders) {
        const { folderPath, filePath } = await createFolderWithFile(newCurrentFolderPath, numberCurrentNestingFolder);

        if (numberCurrentNestingFolder !== 1) {
            await overwriteFileData(path.join(folderPath, '..', 'info.json'), path.join(folderPath, '..'));
        }

        if (numberCurrentNestingFolder === nestingCountOfFolders) {
            await overwriteFileData(filePath, folderPath);
        }

        numberCurrentNestingFolder++;

        return startTask(nestingCountOfFolders, folderPath, numberCurrentNestingFolder);
    }

    console.log('Successfully Created!');
}

async function overwriteFileData(filePath, folderPath) {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    const countOfFolders = files.filter(file => file.isDirectory()).length;

    const data = JSON.stringify({
        path: filePath,
        countOfFolders,
        countOfFiles: files.length - countOfFolders
    });

    await fs.writeFile(filePath, data);
}

async function createFolderWithFile(folderPath) {
    await fs.mkdir(folderPath, { recursive: true });

    const filePath = path.join(folderPath, 'info.json');

    await fs.writeFile(filePath, '');

    return { folderPath, filePath };
}


// 2 way
const fs = require('fs').promises;
const path = require('path');

const nestingCountOfFolders = 2;
let countOfCurrentFolder = 1;

let pathOfFolders = __dirname;

while (countOfCurrentFolder <= nestingCountOfFolders) {
    pathOfFolders = path.join(pathOfFolders, `folder${countOfCurrentFolder}`);
    countOfCurrentFolder++;
}

countOfCurrentFolder = 1;

startTask();

async function startTask() {
    await fs.mkdir(pathOfFolders, { recursive: true });

    await readFolderAndAddFiles(path.join(__dirname, `folder${countOfCurrentFolder}`));
}

async function readFolderAndAddFiles(pathFolder) {
    const filePath = path.join(pathFolder, 'info.json');

    await fs.writeFile(filePath, '');

    const files = await fs.readdir(pathFolder, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            await readFolderAndAddFiles(path.join(pathFolder, file.name));
        }
    }

    const countOfFolders = files.filter(file => file.isDirectory()).length;

    const data = JSON.stringify({
        path: filePath,
        countOfFolders,
        countOfFiles: files.length - countOfFolders
    });

    await fs.writeFile(filePath, data);
}

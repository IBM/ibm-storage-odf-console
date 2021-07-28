const path = require("path");
const common = require("./common.js");

const localPath = path.join(__dirname, "./../");

function processFile(fileName) {
  const publicName = "public.json";
  if (fileName.includes(publicName)) {
    console.log(`Deleting ${fileName} with matching public namespace.`);
    common.deleteFile(fileName);
  }
}

function processLocalesFolder(filePath) {
  if (common.isDirectory(filePath)) {
    common.parseFolder(filePath, processFile);
  }
}

function iterateThroughLocalesFolder(filePath) {
  common.parseFolder(filePath, processLocalesFolder);
}

common.findLocalesFolder(localPath, iterateThroughLocalesFolder);

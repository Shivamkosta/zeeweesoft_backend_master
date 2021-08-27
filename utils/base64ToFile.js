const path = require("path");
const fs = require("fs");
const fileType = require("file-type");
const services = require("./services.js");

async function base64ToFileUrl(base64, userId, folderName) {
  const buffer = new Buffer.from(base64, "base64");
  const extention = await fileType.fromBuffer(buffer);
  const filePath = path.resolve(`./public/media/${userId}`);
  const fileName = `${userId}-${Date.now()}.${extention.ext}`;

  const localPath = `${filePath}/${folderName}`;
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath, { recursive: true });
  }

  fs.writeFileSync(`${localPath}/${fileName}`, buffer, "utf8");

  const url = `${services.serverIP}/media/${userId}/${folderName}/${fileName}`;
  return url;
}

module.exports = base64ToFileUrl;

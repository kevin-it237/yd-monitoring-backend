const UUID = require("uuid-v4");

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
*/

module.exports = function uploadImageToStorage(file, bucket) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${Date.now()}_${file.originalname}`;

        let fileUpload = bucket.file(newFileName);

        let uuid = UUID();

        const blobStream = fileUpload.createWriteStream({
            uploadType: "media",
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: uuid
                }
            }
        });

        blobStream.on('error', (error) => {
            reject(error);
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${uuid}`;
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}
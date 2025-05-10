const { default: axios } = require("axios");
const fs = require("fs");

const handleFileUpload = async (file) => {
    try {
        const fileStream = fs.createReadStream(file.path);
        const uniqueFilename = `${Date.now()}-${file.filename}-${file.originalname}`;
        let storageZone = 'tacirstoremainimgstoragezone';
        const response = await axios.put(
            `https://storage.bunnycdn.com/${storageZone}/${uniqueFilename}`,
            fileStream,
            {
                headers: {
                    AccessKey: "b9ec2f3d-fd17-4aba-a04cbb4a0db3-267b-4250",
                },
            }
        );

        if (response.data) {
            return `https://tacirstorestoragepullzone.b-cdn.net/${uniqueFilename}`;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Axios Hatası:", error.response?.status, error.response?.statusText || error.message);
        return false;
    }
};

module.exports = { handleFileUpload };

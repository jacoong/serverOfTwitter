// uploadConfig.js

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomID = uuidv4();
            const ext = path.extname(file.originalname);
            const filename = randomID + ext;
            console.log(filename);
            done(null, filename);
        },
        destination(req, file, done) {
            console.log(file);
            done(null, path.join(__dirname, "public/profileImg"));
        },
    }),

    limits: { fileSize: 1024 * 1024  },

});

export default upload;

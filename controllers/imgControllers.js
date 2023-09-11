const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const { db } = require("../firebase");
const upload = multer({ storage });

//add new file
exports.addFile = async (req, res) => {
  try {
    upload.single("image")(req, res, async err => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file" });
      }

      const image = req.file;

      const data = {
        name: image.originalname,
        imageURL: image.path,
      };

      const response = await db.collection("AllFiles").add(data);

      res.send("File added successfully");
    });
  } catch (error) {
    next(error);
  }
};
//update files
exports.updateFiles = async (req, res) => {
  const fileId = req.params.id;
  try {
    upload.single("image")(req, res, async err => {
      // Assuming the uploaded file is stored
      const fileData = req.file;

      if (!fileData) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileDoc = await db.collection("AllFiles").doc(fileId).get();

      if (!fileDoc.exists) {
        res
          .status(404)
          .json({ message: "  File that you want to update it  not found" });
        return;
      }

      // Update the file data in the database
      await db
        .collection("AllFiles")
        .doc(fileId)
        .update({ imageURL: fileData.path, name: fileData.originalname });

      res.json({ message: "File updated successfully" });
    });
  } catch (error) {
    next(error);
  }
};
//get All files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await db.collection("AllFiles").get();
    let allFiles = [];

    files.forEach(doc => {
      allFiles.push();
      allFiles.push(doc.data());
    });

    res.json(allFiles);
  } catch (error) {
    next(error);
  }
};
//get getSingleFile
exports.getSingleFile = async (req, res) => {
  const fileId = req.params.id;

  const fileRef = db.collection("AllFiles").doc(fileId);
  const fileSnapshot = await fileRef.get();

  if (!fileSnapshot.exists) {
    return res.status(404).send("File not found");
  }

  const file = fileSnapshot.data();
  res.send(file);
};
//delete file
exports.deletefile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileDoc = await db.collection("AllFiles").doc(fileId).get();

    if (!fileDoc.exists) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    const fileData = fileDoc.data();
    await db.collection("AllFiles").doc(fileId).delete();

    res.json("delete file");
  } catch (error) {
    next(error);
  }
};

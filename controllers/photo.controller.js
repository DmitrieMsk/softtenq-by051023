const db = require("../models");
const User = db.user;
const UserLinksPhoto = db.user_links_photo;
const stream = require('stream')
const path = require('path')
const {google} = require('googleapis')

const KEYFILEPATH = path.join(__dirname + "/../credentials.json")
const SCOPES = ['https://www.googleapis.com/auth/drive']
const folderID = ['1vb8-adjrLWlsXnsb2odFlqOTDWHW-v_I']
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
})



const uploadFile = async (req, res, fileObject, userId, isProfilePicture) => {
    const bufferStream = new stream.PassThrough()
    bufferStream.end(fileObject.buffer)
    console.log(isProfilePicture)
    const {data} = await google.drive({
        version: 'v3',
        auth
    }).files.create({
        media:{
            mimeType: fileObject.mimetype,
            body: bufferStream
        },
        requestBody: {
            name: fileObject.originalname,
            parents: folderID
        },
        fields: "id,name"
    });
    console.log(data.id)
    console.log(`uploaded file ${fileObject.originalname}`)

    if(isProfilePicture){
        profilePicture(req, res, data.id)
    } else {
        image(req, res, data.id)
    }
}

exports.uploadAvatar = async (req, res) => {
    try{
        const type = "image"
        const {body, files} = req
        let file = files[0]
        if(file.mimetype.substring(0,5) == type){
            await uploadFile(req, res, file, req.params["userId"], true)
            res.status(200).send("Submitted")
        } else {
            throw("Wrong file type")
        }
    } catch (e) {
        console.log(e.message)
        res.status(415).send(e.message)
    }
}

exports.uploadFiles = async (req, res) => {
    try{
        console.log(req.body);
        console.log(req.files);
        const {body, files} = req
        for ( let f = 0; f<files.length; f += 1) {
            await uploadFile(files[f],1)
        }
        console.log(body);
        res.status(200).send("Form submitted")
    } catch (e) {
        console.log(e.message)
        res.send(e.message)
    }
}

exports.uploadPhotos = async (req, res) => {
    try{
        const type = "image"
        const {body, files} = req
        for ( let f = 0; f<files.length; f += 1) {
            let file = files[f]
            if(file.mimetype.substring(0,5) == type){
                await uploadFile(req, res, file, req.params["userId"], false)
            }
            
        }
        console.log(body);
        res.status(200).send("Submitted")
    } catch (e) {
        console.log(e.message)
        res.send(e.message)
    }
}

exports.image = (req, res, photoLink) => {
    UserLinksPhoto.create({
      user_id: req.params["userId"],
      googledrive_id: photoLink
    })
      .catch(err => {
        console.log(err.message)
      });
}
 exports.profilePicture = async (req, res, photoLink) => {
    try{
      User.findOne({
        where: {
          id: req.params["userId"]
        }
      }).then(user => {
        console.log(user)
        user.profilePicture = photoLink
        user.save()
        res.status(200).send()
      })
    } catch {
      res.status(500).send()
    }
  }

exports.getAvatarLink = (req, res) => {
try{
    User.findOne({
    where: {
        id: req.params["userId"]
    }
    }).then(user => {
    _link = user.profilePicture
    console.log(_link)
    res.status(200).send(_link)
    })
} catch {
    res.status(500).send()
}
}
exports.getPhotos = (req, res) => {
try{
    let photosArray = []
    UserLinksPhoto.findAll({
    where: {
        user_id: req.params["userId"]
    }
    }).then(photos => {
    photos.forEach((photo) => {
        let photoJson = {
        id: photo.id,
        userId: photo.user_id,
        link: photo.googledrive_id
        }
        photosArray.push(photoJson)
    })
    res.status(200).send(photosArray);
    })
} catch{
    res.status(500).send()
}
}
exports.deletePhoto = (req, res) => {
let _fileId = ""
try{
    UserLinksPhoto.findOne({
    where: {
        user_id: req.params["userId"],
        id: req.params["photoId"]
    }}).then(photo => {
        if(photo === undefined || photo === null) {
        res.status(500).send("Failed to find the photo")
        return
        }
        _fileId = photo.googledrive_id
        photo.destroy();
        const drive = google.drive({ version: 'v3', auth }); // Authenticating drive API
        console.log(KEYFILEPATH)
        console.log(_fileId)
    // Deleting the image from Drive
    drive.files
    .delete({
        fileId: _fileId,
    })
    .then(
        async function (response) {
        res.status(204).json({ status: 'success' });
        return;
        },
        function (err) {
        return res
            .status(400)
            .json({ errors: [{ msg: 'Deletion Failed for some reason' }] });
            return;
        }
    );
    })
    } catch(e){
    res.status(500).send(e.message)
}
}
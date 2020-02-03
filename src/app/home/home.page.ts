import { Component } from '@angular/core';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from "@ionic-native/file/ngx"
import { FilePath } from '@ionic-native/file-path/ngx';

import { Base64 } from '@ionic-native/base64/ngx';
// import { normalizeURL} from '@ionic-angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  fileUrl: any = null;
  respData: any;
isCroped: boolean = false;
  constructor(private imagePicker: ImagePicker,
    private crop: Crop, private base64: Base64,private transfer: FileTransfer, private filePath: FilePath) { }

  cropUpload() {
    this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
      for (let i = 0; i < results.length; i++) {
        alert('Image URI: ' + results[i]);
        this.crop.crop(results[i], { quality: 100 })
          .then(
            newImage => {
              // alert('new image path is: ' + newImage);
              const fileTransfer: FileTransferObject = this.transfer.create();
              const uploadOpts: FileUploadOptions = {
                 fileKey: 'file',
                 fileName: newImage.substr(newImage.lastIndexOf('/') + 1)
              };
              // this.fileUrl = newImage.split("?")[0];
              // alert(newImage.split("?")[0])
              // this.filePath.resolveNativePath(newImage.split("?")[0])
              //   .then(filePath => {
              //     this.fileUrl = filePath;
              //     alert(this.fileUrl);
              //     this.isCroped = true;
              //   })
              //   .catch(err => alert(err));
              // this.base64.encodeFile(newImage).then((base64File: string) => {
              //   alert(base64File);
              //   this.fileUrl = base64File;
              //   this.isCroped = true;
              // }, (err) => {
              //   alert(JSON.stringify(err));
              // });
              fileTransfer.upload(newImage, 'http://192.168.0.101:3000/api/upload', uploadOpts)
               .then((data) => {
                 alert(data);
                 this.respData = JSON.parse(data.response);
                 alert(this.respData);
                 this.fileUrl = this.respData.fileUrl;
                 this.isCroped = true;
               }, (err) => {
                 alert(JSON.stringify(err));
               });
            },
            error => console.error('Error cropping image', error)
          );
      }
    }, (err) => { console.log(err); });
  }
}

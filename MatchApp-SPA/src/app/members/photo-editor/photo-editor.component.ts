import { environment } from './../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/photo';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  //@Output() getMemberPhotoChange = new EventEmitter<string>();

  currentMain: Photo;

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;

  baseUrl = environment.apiUrl;



  constructor(private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    //to get over the CORS error
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    //to add the photo to the UI immediately after adding it
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        }
        this.photos.push(photo);
        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    }
  }

  setMainPhoto(photo: Photo) {
    //console.log(x);
    return this.userService.setMain(this.authService.decodedToken.nameid, photo.id).subscribe(res => {
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;

      photo.isMain = true;

      this.alertify.success("Photo set to Main!");

      //this.authService.currentUser.photoUrl = photo.url;
      //this.authService.photoUrl.subscribe()
      //this.getMemberPhotoChange.emit(photo.url);

      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }

  deletePhoto(photo: Photo) {
    this.alertify.confirm("Are you sure you want to delete this photo?", () => {
      this.userService.deletePhoto(this.authService.currentUser.id, photo.id).subscribe(res => {
        const index = this.photos.indexOf(photo);
        //const index = this.photos.findIndex(p=>p.id = photo.id);//
        this.photos.splice(index, 1);
        this.alertify.success('Photo Deleted!');
      }, error => {
        this.alertify.error(error);
      });
    });

  }

}
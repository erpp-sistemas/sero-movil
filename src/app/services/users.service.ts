import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { S3Service } from './s3.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrlUserVerify = 'http://localhost:3000/users/';

  constructor(
    private http: HttpClient,
    private s3Service: S3Service
  ) { }

  async userVerify(username: any, idplaza: any) {
    return new Promise<any>((resolve, reject) => {

      this.http.get(`${this.apiUrlUserVerify}${username}/${idplaza}`).subscribe(data => {
        resolve(data)
      })

    }).catch(error => console.log("Error" + error));
  }


  getUrlFoto(url_foto: string) {
    return this.http.get(url_foto, { responseType: 'blob' })
  }


  uploadPhotoUser(base64: any, username: string, fecha: string) {
    return new Promise((resolve) => {
      let fechaArr = fecha.split('.')
      let fechaFormat = fechaArr[0]
      let usernameArr = username.split('@')
      let usernameFormat = usernameArr[0]
      let photoName = `${usernameFormat}-${fechaFormat}`
      this.s3Service.uploadPhotoUserChecador(base64, photoName).then(response => {
        if (response) {
          let url = this.s3Service.getURLPresignadedPhotoUser(photoName)
          resolve({
            "estatus": true,
            "urlPhoto": url
          })
        } else {
          resolve({
            "estatus": false,
            "url": ''
          })
        }
      }).catch(error => console.log(error))
    })
  }



}

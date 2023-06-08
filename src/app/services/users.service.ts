import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrlUserVerify = 'http://localhost:3000/users/';

  constructor(
    private http: HttpClient
  ) { }

  userVerify(username, idplaza) {
    return new Promise((resolve, reject) => {

      this.http.get(`${this.apiUrlUserVerify}${username}/${idplaza}`).subscribe(data => {
        resolve(data)
      })

    }).catch(error => console.log("Error" + error));
  }


  getUrlFoto(id_usuario: number) {
    return this.http.get('https://scontent.fmex28-1.fna.fbcdn.net/v/t1.18169-9/21743117_1812963972077655_9068768826820206722_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=174925&_nc_ohc=WAOqPX7YOIgAX_b7S43&_nc_ht=scontent.fmex28-1.fna&oh=00_AfDd40V_iV57NpQq1SPvq7J9aDWjEGFCHmDG7iNpjfP-Kw&oe=64A8B8D0',{responseType: 'blob'})
  }

}

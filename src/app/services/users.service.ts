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
    return new Promise( (resolve, reject) => {

      this.http.get(`${this.apiUrlUserVerify}${username}/${idplaza}`).subscribe( data => {
        resolve(data)
      })

    }).catch( error => console.log("Error" +  error));
  }


}

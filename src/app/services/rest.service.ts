import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  apiObtenerDatosMovil = 'http://localhost:3000/padron'


  constructor(
    private http: HttpClient
  ) { }

  deleteInfo() {
    // implementar la logica
    console.log("Borrando información");
  }

  obtenerListadoCuentas() {
    return this.http.get(this.apiObtenerDatosMovil);
  }



}

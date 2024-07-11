import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLiteObject } from "@ionic-native/sqlite/ngx";
import { MessagesService } from './messages.service';
import { LoadingController } from '@ionic/angular';
import { Proceso } from '../interfaces/Procesos';
import { UsuarioAyuda } from '../interfaces/UsuarioAyuda';
import { DblocalService } from './dblocal.service';
import { DataGeneral, Form } from '../interfaces';
import {
  apiObtenerDatos, apiRegistroRecorrido, apiObtenerCuentasDistancia,
  apiObtenerEmpleados, apiObtenerFotosHistoricas, apiObtenerPagosHistoricos, apiRegistroEncuestaPresidente,
  apiRegistroAsistencia, apiObtenerGestores, apiObtenerProcesosPlaza, apiRegistroBotonPanico,
  apiObtenerAccionesHistoricas, apiRegistroPorcentajePila, apiObtenerCatalogoTareas, apiRegisterEncuesta,
  apiObtenerAsistencia,
  urlGetForms,
  urlGetLastPositionGestor
} from '../api'


@Injectable({
  providedIn: 'root'
})
export class RestService {

  db: SQLiteObject = null;
  loading: any;


  constructor(
    private http: HttpClient,
    private message: MessagesService,
    private loadingCtrl: LoadingController,
    private dblocal: DblocalService
  ) { }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      console.log("Base interna igual a null");
      this.db = db;
    }
  }

  /**
   * Hace la peticion al servidor de la informacion de las cuentas dependiendo de la plaza y el servicio
   * @param idAspUser 
   * @param idPlaza 
   * @param idPlazaServicio 
   * @returns Promise
   */
  obtenerDatosSql(id_usuario: number, id_plaza: number, id_plaza_servicio: number) {
    return new Promise((resolve, reject) => {
      this.http.get(`${apiObtenerDatos} ${id_usuario}, ${id_plaza}, ${id_plaza_servicio}`)
        .subscribe((data: DataGeneral[]) => resolve(data), error => {
          console.error(error);
          reject(error)
        })
    })
  }


  async guardarSQl(lat: number, lng: number, idasp: number, fecha: string) {
    let sqlString = `${idasp},${lat},${lng},'${fecha}'`;
    this.recorridoSync(sqlString, 0);
    return Promise.resolve("Executed query");
  }


  async recorridoSync(query: string, id: number) {
    return new Promise(resolve => {
      this.http.post(apiRegistroRecorrido + " " + query, null).subscribe(
        async data => {
          await this.updateRecorridoSync(id);
          resolve(data);
        },
        err => {
          this.message.showToast(
            "Sin trackeo de rutas por falta de red!!!!"
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }

  updateRecorridoSync(id: number) {
    let sql = "UPDATE recorrido SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }


  /**
   * Metodo para obtener las cuentas ordenadas de menor a mayor con base en la distancia de la ubicacion actual
   * @param idAspUser 
   * @param idPlaza 
   * @param idPlazaServicio 
   * @param latitud 
   * @param longitud 
   * @returns Promise
   */
  obtenerCuentasDistancias(id_usuario: number, id_plaza: number, id_plaza_servicio: number, latitud: number, longitud: number) {
    try {
      return new Promise(resolve => {
        this.http.post(apiObtenerCuentasDistancia + " '" + id_usuario + "', " + id_plaza + ", " + id_plaza_servicio + ", " + latitud + ", " + longitud, null)
          .subscribe(data => resolve(data), err => console.log(err));
      })
    } catch {
      console.error("No se pudo obtener la informaciòn");
    }
  }

  /**
   * Metodo para obtener los empleados que son los que se veran en la seccion del directorio
   * @returns Promise
   */
  obtenerInformacionEmpleados() {
    try {
      return new Promise((resolve, reject) => {
        this.http.get(apiObtenerEmpleados).subscribe(data => {
          resolve(data)
        }, err => reject(err));
      })
    } catch (error) {
      console.log('No se pudo obtener la informacion');
    }
  }



  /**
   * Metodo para obtener las fotos historicas
   * @param id_plaza 
   * @param account 
   * @returns Promise
   */
  async getPhotosHistory(id_plaza, account) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(apiObtenerFotosHistoricas + " " + id_plaza + " , " + "'" + account + "'").subscribe(data => {
          resolve(data);
        })
      } catch (error) {
        console.log(error);
        reject("Hubo un problema al traer las fotos historicas")
      }
    })
  }

  /**
 * Metodo para obtener los pagos historicos
 * @param id_plaza 
 * @param account 
 * @returns Promise
 */
  async getPagosHistoryByCuenta(id_plaza, account) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(apiObtenerPagosHistoricos + " " + id_plaza + " , " + "'" + account + "'").subscribe(data => {
          resolve(data);
        })
      } catch (error) {
        console.log(error);
        reject("Hubo un problema al traer las fotos historicas")
      }
    })
  }


  registroChecador(parametros: string) {
    console.log(parametros);
    return new Promise(resolve => {
      this.http.post(apiRegistroAsistencia + " " + parametros, null).subscribe(data => {
        resolve(data)
      }, err => {
        this.message.showAlert("No se realizo el registro, verifique con sistemas");
      }
      )
    })

  }

  obtenerGestoresPlaza(idPlaza: string) {
    return new Promise(resolve => {
      this.http.get(`${apiObtenerGestores} ${idPlaza}`).subscribe(data => {
        resolve(data)
      }, err => {
        this.message.showAlert("No se obtuvieron los usuarios");
      })
    })
  }

  /**
   * Obtiene los procesos por plaza
   * @param id_plaza 
   * @returns 
   */
  obtenerProcesosByIdPlaza(id_plaza: number) {
    return new Promise<Proceso[]>(resolve => {
      this.http.get(`${apiObtenerProcesosPlaza} ${id_plaza}`).subscribe((data: Proceso[]) => {
        resolve(data)
      }, err => {
        this.message.showAlert("No se pudieron obtener los procesos de la plaza " + err);
      })
    })
  }


  /**
   * Inserta el registro de boton de panico asi como obtiene los gestores mas cercanos
   * @param data 
   * @returns 
   */
  registroBotonPanico(data: any) {
    return new Promise<UsuarioAyuda[]>((resolve, reject) => {
      try {
        const { id_usuario, fecha_captura, latitud, longitud } = data;
        const url = `${apiRegistroBotonPanico} ${id_usuario}, '${fecha_captura}', ${latitud}, ${longitud}`
        this.http.get(url).subscribe((data: any) => {
          resolve(data);
        })
      } catch (error) {
        reject(error)
      }
    })
  }



  async getActionsHistory(id_plaza: number, account: string) {
    return new Promise((resolve, reject) => {
      try {
        let url = `${apiObtenerAccionesHistoricas} ${id_plaza}, '${account}'`;
        console.log(url);
        this.http.get(url).subscribe((data: any) => {
          resolve(data)
        })
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }


  async registerPorcentajePila(id_usuario: number, porcentaje: number, fecha: any) {
    return new Promise((resolve, reject) => {
      try {
        let url = `${apiRegistroPorcentajePila} ${id_usuario}, ${porcentaje}, '${fecha}'`
        this.http.post(url, null).subscribe(message => {
          resolve("Insertado el porcentaje de la pila")
        })
      } catch (error) {
        console.log(error)
      }
    })
  }

  async getCatTareas() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(apiObtenerCatalogoTareas).subscribe(data => {
          resolve(data)
        })
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }


  async getDataSQL(api: string) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(api).subscribe(data => {
          resolve(data)
        })
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  sendOneRegisterEncuesta(data: any) {
    return new Promise<string>((resolve) => {
      const url = `${apiRegisterEncuesta} '${JSON.stringify(data)}'`
      this.http.post(url, null).subscribe(async () => {
        const fecha = this.getCurrentDate()
        await this.dblocal.insertContadorRegisterEncuesta(fecha)
        resolve("Registro enviado con éxito")
      }, error => {
        console.log(error)
        resolve("No se pudo enviar")
      })
    })
  }

  getCurrentDate() {
    const today = new Date();
    let currentDate: any
    // Formatear la fecha como una cadena (puedes ajustar el formato según tus necesidades)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    currentDate = today.toLocaleDateString('es-ES', options);
    return currentDate
  }


  sendRenuenteEncuesta() {
    return new Promise<string>((resolve) => {
      const url = `${apiRegisterEncuesta} ''`
      this.http.post(url, null).subscribe(async () => {
        const fecha = this.getCurrentDate()
        await this.dblocal.insertContadorRegisterEncuesta(fecha)
        resolve("Registro enviado con éxito")
      }, error => {
        console.log(error)
        resolve("No se pudo enviar")
      })
    })
  }


  async getAsistencias(id_usuario: number) {
    return new Promise((resolve, reject) => {
      let url = `${apiObtenerAsistencia} ${id_usuario}`
      this.http.get(url).subscribe(data => {
        resolve(data)
      }, error => {
        reject(error)
      })
    })
  }

  getTablesSQL() {
    let id_app = 1 // la 4 es ser0 siempre sera la misma
    return new Promise<Form[]>((resolve, reject) => {

      try {
        this.http.get(urlGetForms + ' ' + id_app).subscribe((data: Form[]) => {
          resolve(data)
        })
      } catch (error) {
        console.error(error)
        reject(error)
      }

    })
  }

  getLastPositionGestor() {
    return new Promise<any[]>((resolve, reject) => {
      try {
        this.http.get(urlGetLastPositionGestor).subscribe( (positions_gestores: any[]) => {
          resolve(positions_gestores)
        })
      } catch (error) {
          console.log(error);
          reject(error)
      }
    })
  }

}


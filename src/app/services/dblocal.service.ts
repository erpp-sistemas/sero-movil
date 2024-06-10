import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { EncuestaGeneral, UserPlacesServices } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DblocalService {

  db: SQLiteObject = null;

  constructor() { }

  setDatabase(db: SQLiteObject) {
    console.log(db);
    if (this.db === null) {
      console.log("Base interna igual a null");
      this.db = db;
    }
  }


  async insertDataEncuestas(data: EncuestaGeneral) {
    const query = 'INSERT INTO encuesta_general (id_encuesta, id_pregunta, name_encuesta, name_pregunta, posibles_respuestas, id_plaza, icono_app_movil, id_sub_pregunta, name_sub_pregunta, sub_pregunta_posibles_respuestas) VALUES (?,?,?,?,?,?,?,?,?,?)'
    return this.db.executeSql(query, [
      data.id_encuesta,
      data.id_pregunta,
      data.name_encuesta,
      data.name_pregunta,
      data.posibles_respuestas,
      data.id_plaza,
      data.icono_app_movil,
      data.id_sub_pregunta,
      data.name_sub_pregunta,
      data.sub_pregunta_posibles_respuestas
    ])
  }

  async deleteDataEncuestas() {
    const query = 'DELETE FROM encuesta_general'
    return this.db.executeSql(query, [])
  }

  async getDataEncuestas() {
    const query = 'SELECT * FROM encuesta_general'
    const data = []
    try {
      const response = await this.db.executeSql(query, [])
      for (let i = 0; i < response.rows.length; i++) {
        data.push(response.rows.item(i))
      }
      return Promise.resolve(data)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }


  /**
 * Metodo que borra los datos de la tabla de serviciosPlazaUser
 * @returns db execute
 */
  deleteServicios() {
    let sql = 'DELETE FROM serviciosPlazaUser';
    return this.db.executeSql(sql, []);
  }


  /**
 * Metodo que inserta los datos obtenidos del sql en la tabla serviciosPlazaUser
 * @param data 
 * @returns db execute
 */
  insertarServiciosSQL(data: UserPlacesServices) {
    console.log("Tratando de insertar los servicios obtenidos");
    let sql = 'INSERT INTO serviciosPlazaUser (nombre, ape_pat, ape_mat, foto, plaza, servicio, id_plaza, id_servicio, icono_app_movil) VALUES (?,?,?,?,?,?,?,?,?)'
    return this.db.executeSql(sql, [
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno,
      data.foto,
      data.plaza,
      data.servicio,
      data.id_plaza,
      data.id_servicio,
      data.icono_app_movil
    ]);
  }


  /**
 * Obtiene el id_plaza y la plaza unicos
 * @returns Promise
 */
  async obtenerPlazasSQL() {
    let plazas = [];
    try {
      let sql = "SELECT DISTINCT id_plaza, plaza FROM serviciosPlazaUser"
      const response = await this.db.executeSql(sql, []);
      for (let i = 0; i < response.rows.length; i++) {
        plazas.push(response.rows.item(i));
      }

      return Promise.resolve(plazas);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async insertRegisterEncuestaGeneral(data: any, fecha: string) {

    return new Promise(async (resolve, reject) => {
      const query = 'INSERT INTO register_encuesta_general (data_json, fecha) VALUES (?,?)';
      try {
        await this.db.executeSql(query, [
          JSON.stringify(data),
          fecha
        ])
        resolve("No se pudo enviar la encuesta pero fue guardada correctamente")
      } catch (error) {
        console.error(error)
        reject("No se pudo guardar la encuesta")
      }
    })

  }

  async getRegistroEncuestasLocal() {
    return new Promise<any[]>(async (resolve, reject) => {
      try {
        let query = 'SELECT * FROM register_encuesta_general'
        let encuestas_locales = []
        const response = await this.db.executeSql(query, [])
        for (let i = 0; i < response.rows.length; i++) {
          encuestas_locales.push(response.rows.item(i))
        }
        resolve(encuestas_locales)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  async deleteRegistroEncuestaLocal(id: number) {
    return new Promise( async (resolve, reject) => {
      try {
        let query = 'DELETE FROM register_encuesta_general WHERE id = ?'
        await this.db.executeSql(query, [id])
        resolve("Se elimino correctamente la encuesta")
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }


  async insertContadorRegisterEncuesta(fecha: string) {
    return new Promise( async (resolve, reject) => {
      try {
        let query = 'INSERT INTO contador_register_encuesta_general (subida, fecha) VALUES(?,?)'
        await this.db.executeSql(query, ['subida', fecha])
        resolve("Contador actualizado")
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  async getContadorRegisterEncuesta(fecha: string) {
    return new Promise( async (resolve, reject) => {
      try {
        let query = 'SELECT COUNT(*) AS total FROM contador_register_encuesta_general WHERE fecha = ?'
        let encuestas_enviadas = []
        const response = await this.db.executeSql(query, [fecha])
        for (let i = 0; i < response.rows.length; i++) {
          encuestas_enviadas.push(response.rows.item(i))
        }
        resolve(encuestas_enviadas)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }


}

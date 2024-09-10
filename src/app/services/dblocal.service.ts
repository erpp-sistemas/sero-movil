import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DataGeneral, EncuestaGeneral, Form, Gestor, ServicioPublico, UserPlacesServices } from '../interfaces';
import { Proceso } from '../interfaces/Procesos';

@Injectable({
  providedIn: 'root'
})
export class DblocalService {

  db: SQLiteObject = null;

  constructor(
  ) { }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
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
    let sql = 'INSERT INTO serviciosPlazaUser (nombre, ape_pat, ape_mat, foto, plaza, servicio, id_plaza, id_servicio, icono_app_movil, id_rol) VALUES (?,?,?,?,?,?,?,?,?,?)'
    return this.db.executeSql(sql, [
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno,
      data.foto,
      data.plaza,
      data.servicio,
      data.id_plaza,
      data.id_servicio,
      data.icono_app_movil,
      data.id_rol
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

  async insertRegisterFormDynamic(data: any, fecha: string) {
    return new Promise(async (resolve, reject) => {
      const query = 'INSERT INTO register_form_dynamic (data_json, fecha) VALUES (?,?)';
      try {
        await this.db.executeSql(query, [
          JSON.stringify(data),
          fecha
        ])
        resolve("No se pudo enviar el registro pero fue guardada correctamente")
      } catch (error) {
        console.error(error)
        reject("No se pudo guardar el registro")
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
    return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => {
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

  /**
   * Metodo que inserta los servicios publicos obtenidos de la api
   * @param data 
   * @returns Promise
   */
  insertarServicioPublicoSQL(data: ServicioPublico) {
    let sql = 'INSERT INTO listaServiciosPublicos (id_plaza, nombre_plaza, id_servicio_publico, nombre_servicio_publico) VALUES (?,?,?,?)';
    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombre,
      data.id_servicio_publico,
      data.nombre_servicio_publico
    ]);
  }


  /**
 * Metodo que borra los registros de la tabla gestores que son los empleados por plaza a la que pertenece el usuario logueado
 * @returns Promise
 */
  deleteGestores() {
    let sql = 'DELETE FROM gestores';
    return this.db.executeSql(sql, []);
  }

  /**
  * Metodo que inserta los registros de los empleados por plaza 
  * @param data 
  * @returns Promise
  */
  insertaGestor(data: Gestor) {
    let sql = 'INSERT INTO gestores (id_plaza, id_usuario, nombre, apellido_paterno, apellido_materno, foto) VALUES (?,?,?,?,?,?)';
    return this.db.executeSql(sql, [
      data.id_plaza,
      data.id_usuario,
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno,
      data.foto
    ]);
  }

  /**
 * Metodo que borra los registros de la tabla listaServiciosPublicos que son todos los servicios publicos con su respectiva plaza
 * @returns Promise
 */
  deleteServiciosPublicos() {
    let sql = 'DELETE FROM listaServiciosPublicos';
    return this.db.executeSql(sql, []);
  }

  /**
  * Metodo que obtiene los servicios de la tabla local
  * @param idPlaza
  * @returns 
  */
  async mostrarServicios(id_plaza: number) {
    let sql = "SELECT * FROM serviciosPlazaUser where id_plaza = ?"
    return this.db.executeSql(sql, [id_plaza]).then(response => {
      let servicios = [];
      for (let index = 0; index < response.rows.length; index++) {
        servicios.push(response.rows.item(index));
      }
      return Promise.resolve(servicios);
    }).catch(error => Promise.reject(error));
  }

  async mostrarServiciosAll() {
    let sql = "SELECT DISTINCT servicio, id_servicio, icono_app_movil FROM serviciosPlazaUser"
    return this.db.executeSql(sql, []).then(response => {
      let servicios = [];
      for (let index = 0; index < response.rows.length; index++) {
        servicios.push(response.rows.item(index));
      }
      console.log(servicios);
      return Promise.resolve(servicios);
    }).catch(error => Promise.reject(error));
  }

  /**
 * Metodo que obtiene los registros de la tabla interna listaServiciosPublicos
 * @param id_plaza Promise
 * @returns 
 */
  async mostrarServiciosPublicos(id_plaza: number) {
    let sql = "SELECT * FROM listaServiciosPublicos WHERE id_plaza = ?";
    return this.db.executeSql(sql, [id_plaza]).then(response => {
      let serviciosPublicos = [];
      for (let index = 0; index < response.rows.length; index++) {
        serviciosPublicos.push(response.rows.item(index));
      }
      return Promise.resolve(serviciosPublicos);
    }).catch(error => Promise.reject(error));

  }

  /**
   * Metodo que obtiene los registros de la tabla interna gestores
   * @param id_plaza 
   * @returns Promise
   */
  async getGestores() {
    let sql = `SELECT * FROM gestores ORDER BY nombre`;
    return this.db.executeSql(sql, []).then(response => {
      let gestores = [];
      for (let i = 0; i < response.rows.length; i++) {
        gestores.push(response.rows.item(i));
      }
      return Promise.resolve(gestores)
    }).catch(error => Promise.reject(error));
  }


  /**
 * Borra la informacion de la tabla sero_principal cada que se descarga informacion dependiendo del servicio y la plaza
 * @returns Promise
 */
  deleteTable(id_plaza: number, id_servicio_plaza: number) {
    let sql = "DELETE FROM sero_principal where id_plaza = ? and id_servicio_plaza = ?";
    return this.db.executeSql(sql, [id_plaza, id_servicio_plaza]);
  }



  /**
   * Guarda la informacion descargada en la tabla sero_principal
   * @param data // informacion descargada
   * @param id_plaza  // id de la plaza (demo 1, demo 2)
   * @param idServicioPlaza  // servicio (agua, predio)
   * @returns 
   */
  guardarInfoSQL(data: DataGeneral, id_plaza: number, idServicioPlaza: number) {

    let sql = `INSERT INTO sero_principal (id_plaza, id_servicio_plaza, cuenta, clave_catastral, propietario, calle, num_int, num_ext, colonia, poblacion, codigo_postal, total, fecha_ultimo_pago, serie_medidor, tipo_servicio,  telefono_casa, telefono_celular, correo_electronico, superficie_terreno_h, superficie_construccion_h, valor_terreno_h, valor_construccion_h, valor_catastral_h, tarea_asignada, latitud, longitud, nombre_tarea_asignada, id_proceso, proceso_gestion, url_aplicacion_movil, icono_proceso, domicilio_verificado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    return this.db.executeSql(sql, [
      id_plaza,
      idServicioPlaza,
      data.cuenta,
      data.clave_catastral,
      data.propietario,
      data.calle,
      data.num_int,
      data.num_ext,
      data.colonia,
      data.poblacion,
      data.codigo_postal,
      data.total,
      data.fecha_ultimo_pago,
      data.serie_medidor,
      data.tipo_servicio,
      data.telefono_casa,
      data.telefono_celular,
      data.correo_electronico,
      data.superficie_terreno_h,
      data.superficie_construccion_h,
      data.valor_terreno_h,
      data.valor_construccion_h,
      data.valor_catastral_h,
      data.tarea_asignada,
      data.latitud,
      data.longitud,
      data.nombreTareaAsignada,
      data.id_proceso,
      data.proceso_gestion,
      data.url_aplicacion_movil,
      data.icono_proceso,
      data.domicilio_verificado
    ])
  }

  /**
   * Actualiza el campo descargado a true dependiendo de la plaza y el servicio
   * @param id_plaza 
   * @param id_servicio 
   * @returns Promise
   */
  actualizaServicioEstatus(id_plaza: number, id_servicio: number) {
    let sql = "UPDATE serviciosPlazaUser set descargado = true where id_plaza = ? and id_servicio = ?"
    return this.db.executeSql(sql, [id_plaza, id_servicio]);
  }


  /**
 * Metodo que obtiene la foto del usuario de la base interna SQlite
 * @returns Promise
 */
  async obtenerFotoUserSQL() {
    let foto = [];
    try {
      let sql = "SELECT DISTINCT foto FROM serviciosPlazaUser";
      const response = await this.db.executeSql(sql, []);
      for (let i = 0; i < response.rows.length; i++) {
        foto.push(response.rows.item(i));
      }
      return Promise.resolve(foto);
    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
 * Metodo que borrara toda la informacion si es que es otro usuario el que se logueo 
 */
  async deleteInfo() {
    let sqlDeleteSeroPrincipal = 'DELETE FROM sero_principal'
    let sqlDeleteCartaInvitacion = 'DELETE FROM gestionCartaInvitacion'
    let sqlDeleteLegal = 'DELETE FROM gestionLegal'
    let sqlDeleteInspeccion = 'DELETE FROM gestionInspeccion'
    let sqlDeleteServiciosPublicos = 'DELETE FROM serviciosPublicos'
    let sqlDeleteFotos = 'DELETE FROM capturaFotos'
    let sqlDeleteFotosServiciosPublicos = 'DELETE FROM capturaFotosServicios'

    await this.db.executeSql(sqlDeleteSeroPrincipal, []);
    await this.db.executeSql(sqlDeleteCartaInvitacion, []);
    await this.db.executeSql(sqlDeleteLegal, []);
    await this.db.executeSql(sqlDeleteInspeccion, []);
    await this.db.executeSql(sqlDeleteServiciosPublicos, []);
    await this.db.executeSql(sqlDeleteFotos, []);
    await this.db.executeSql(sqlDeleteFotosServiciosPublicos, []);
  }


  /**
 * Metodo que carga la lista de cuentas a gestionar 
 * @returns Promise 
 */
  async cargarListadoCuentas(id_plaza: number, id_servicio_plaza: number) {
    let sql = `SELECT cuenta, propietario, calle || ' ' || colonia as direccion, total, id_proceso, proceso_gestion, url_aplicacion_movil, icono_proceso, latitud, longitud, domicilio_verificado, gestionada FROM sero_principal WHERE id_plaza = ? AND id_servicio_plaza = ? AND propietario NOT NULL`;
    return this.db.executeSql(sql, [id_plaza, id_servicio_plaza]).then(response => {
      let arrayCuentas = [];
      for (let index = 0; index < response.rows.length; index++) {
        arrayCuentas.push(response.rows.item(index));
      }
      return Promise.resolve(arrayCuentas);
    }).catch(error => Promise.reject(error));

  }


  /**
 * Metodo que obtiene las cuentas totales de la plaza y del servicio seleccionado
 * @param id_plaza 
 * @param idServicioPlaza 
 * @returns Promise
 */
  async getTotalAccounts(id_plaza: number, id_servicio_plaza: number) {
    let sql = "SELECT COUNT(*) as total FROM sero_principal where id_plaza = ? and id_servicio_plaza = ?";
    try {
      const response = await this.db.executeSql(sql, [id_plaza, id_servicio_plaza]);
      let result = response.rows.item(0).total;
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
   * Metodo que obtiene las cuentas gestionadas de la plaza y del servicio seleccionado
   * @param id_plaza 
   * @param idServicioPlaza 
   * @returns Promise
   */
  async getGestionadas(id_plaza: number, id_servicio_plaza: number) {
    let sql = 'SELECT COUNT(*) as total_gestionadas FROM sero_principal where id_plaza = ? and id_servicio_plaza = ? and gestionada = 1';
    try {
      const response = await this.db.executeSql(sql, [id_plaza, id_servicio_plaza]);
      let result = response.rows.item(0).total_gestionadas;

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
   * Metodo que obtiene las cuentas de la tabla sero_principal para cargarlas al mapa
   * @returns query sqlite
   */
  async getDataVisitPosition(id_plaza: number, id_servicio_plaza: number) {
    // Carga las posiciones
    let sql = 'SELECT gestionada, cuenta, latitud, longitud, propietario, total, id_proceso, proceso_gestion, url_aplicacion_movil, icono_proceso FROM sero_principal where id_plaza = ? and id_servicio_plaza = ? and latitud > 0 and gestionada = 0';
    return this.db.executeSql(sql, [id_plaza, id_servicio_plaza]).then(response => {
      let posiciones = [];

      for (let index = 0; index < response.rows.length; index++) {
        posiciones.push(response.rows.item(index));
      }

      return Promise.resolve(posiciones);

    }).catch(error => Promise.reject(error));
  }


  /**
   * Metodo que recibe un arreglo de cuentas con distancia de la posicion actual y luego regresa un filtrado de esas cuentas de las que no esten gestionadas
   * @param id_plaza 
   * @param id_servicio_plaza 
   * @param data 
   * @returns Promise
   */
  getDataVisitPositionDistance(id_plaza: number, id_servicio_plaza: number, data: any) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT gestionada, cuenta, latitud, longitud, propietario, total FROM sero_principal where id_plaza = ? and id_servicio_plaza = ? and latitud > 0 and gestionada = 0';

      this.db.executeSql(sql, [id_plaza, id_servicio_plaza]).then(response => {

        let result = [];
        let cuentasMostrar = []

        for (let i = 0; i < response.rows.length; i++) {
          result.push(response.rows.item(i));
        }

        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].cuenta == result[i].cuenta) {
              cuentasMostrar.push(data[j]);
            }
          }

        }
        resolve(cuentasMostrar);
      }).catch(err => reject(err));
    })
  }


  /**
   * Metodo que obtiene la informacion de una cuenta de la tabla agua para cargarla la mapa
   * @param accountNumber 
   * @returns 
   */
  async getDataVisitPositionByAccount(accountNumber: string) {
    let sql =
      "SELECT gestionada, cuenta, latitud, longitud FROM sero_principal where latitud > 0 and cuenta = ?";
    return this.db
      .executeSql(sql, [accountNumber])
      .then(response => {
        let res = [];

        for (let index = 0; index < response.rows.length; index++) {
          res.push(response.rows.item(index));
        }
        console.log(res);
        return Promise.resolve(res);
      })
      .catch(error => Promise.reject(error));
  }


  /**
 * Metodo que trae la informacion de las cuentas de sero_principal lo manda a traer los formularios de
 * gestion para obtener datos de la cuenta seleccionada
 * @param account 
 * @returns Promise
 */
  async getInfoAccount(account: string) {
    let sql = "SELECT * from sero_principal where cuenta = ?";
    return this.db
      .executeSql(sql, [account])
      .then(response => {
        let posiciones = [];

        for (let index = 0; index < response.rows.length; index++) {
          posiciones.push(response.rows.item(index));
        }

        return Promise.resolve(posiciones);
      })
      .catch(error => Promise.reject(error));
  }


  saveLocation(lat: number, lng: number, idAspuser: number, fecha: string) {
    let sql = "INSERT INTO recorrido (latitud,longitud,idAspUser,fechaCaptura) values(?,?,?,?)";
    return this.db.executeSql(sql, [lat, lng, idAspuser, fecha]);

  }


  /**
 * Inserta los procesos en la tabla interna
 * @param proceso 
 * @returns 
 */
  async insertProcessTable(proceso: Proceso) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = 'INSERT INTO proceso(id_plaza, nombre_plaza, id_proceso, nombre_proceso, imagen, url_aplicacion_movil) VALUES (?,?,?,?,?,?)';
        await this.db.executeSql(sql, [
          proceso.id_plaza,
          proceso.nombre_plaza,
          proceso.id_proceso,
          proceso.nombre_proceso,
          proceso.imagen,
          proceso.url_aplicacion_movil
        ]);
        resolve(true);
      } catch (error) {
        console.log(error);
        reject("No se pudieron almacenar los procesos de la plaza")
      }
    })
  }


  /**
   * Verifica si ya hay procesos de la plaza en la tabla interna
   * @param id_plaza 
   * @returns 
   */
  async processPlazaExists(id_plaza: number) {
    let sql = 'SELECT * FROM proceso WHERE id_plaza = ?';
    const response = await this.db.executeSql(sql, [id_plaza]);
    if (response.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Elimina los procesos de la plaza
   * @param id_plaza 
   */
  async deleteProcessByIdPlaza(id_plaza: number) {
    let sql = 'DELETE FROM proceso WHERE id_plaza = ?'
    try {
      await this.db.executeSql(sql, [id_plaza]);
      console.log("Se borraron los procesos de la plaza");
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * Obtiene los procesos de la plaza en la tabla interna
   * @param id_plaza 
   * @returns 
   */
  async getProcessLocalByIdPlaza(id_plaza: number) {
    return new Promise<Proceso[]>(async (resolve, reject) => {
      try {
        let sql = 'SELECT * FROM proceso WHERE id_plaza = ?';
        let process: Proceso[] = [];
        const response = await this.db.executeSql(sql, [id_plaza]);
        if (response.rows.length > 0) {
          for (let i = 0; i < response.rows.length; i++) {
            process.push(response.rows.item(i));
          }
        }
        resolve(process);
      } catch (error) {
        reject(error);
      }
    })
  }


  async getGestionesLocalByIdServicio(id_servicio: number, nombre_tabla: string) {
    return new Promise<any[]>(async (resolve, reject) => {
      try {
        let gestiones = [];
        let sql = ` SELECT *, '${nombre_tabla}' as proceso FROM ${nombre_tabla} WHERE cargado = 0 AND id_servicio_plaza = ?`;
        const gestionesCarta = await this.db.executeSql(sql, [id_servicio]);
        for (let i = 0; i < gestionesCarta.rows.length; i++) {
          gestiones.push(gestionesCarta.rows.item(i));
        }
        resolve(gestiones);
      } catch (error) {
        console.log(error)
        reject(error);
      }
    })
  }


  async insertCatTareaLocal(data: any) {
    let sql = 'INSERT INTO cat_tarea (id_tarea, nombre_tarea, id_proceso) VALUES (?,?,?)'
    try {
      return this.db.executeSql(sql, [data.id_tarea, data.nombre, data.id_proceso])
    } catch (error) {
      console.error("No se pudo insertar la tarea en la tabla local")
    }
  }

  async getCatTareasLocal(id_proceso: number) {
    let sql = 'SELECT * FROM cat_tarea WHERE id_proceso = ?'
    try {
      let data = []
      const result = await this.db.executeSql(sql, [id_proceso])
      for (let i = 0; i < result.rows.length; i++) {
        data.push(result.rows.item(i))
      }
      return Promise.resolve(data)
    } catch (error) {
      console.error("No se pudo obtener la informacion del catalogo de tareas ", error)
      return Promise.reject(error)
    }
  }

  async createTableLocal(data: Form[]) {
    let name_table = data[0].nombre_form
    const verify_table_exists = await this.verifyTableExists(name_table)

    if (!verify_table_exists) {
      let sql = `CREATE TABLE IF NOT EXISTS ${name_table} (id INTEGER PRIMARY KEY AUTOINCREMENT, cargado INTEGER NOT NULL DEFAULT 0, data_json TEXT)`
      try {
        await this.db.executeSql(sql, [])
        return Promise.resolve("Tables created")
      } catch (error) {
        console.error(error)
        return Promise.reject("Error, tables not created")
      }
    }
  }

  async verifyTableExists(table_name: string) {
    return new Promise(async (resolve, reject) => {
      let query = `SELECT name FROM sqlite_master WHERE type='table'`
      let tables = []
      try {
        const data = await this.db.executeSql(query, [])
        for (let i = 0; i < data.rows.length; i++) {
          tables.push(data.rows.item(i));
        }
        const find_table = tables.find(table => {
          return table.name === table_name
        })

        if (find_table) {
          resolve(true)
          return
        } else {
          resolve(false)
          return
        }
      } catch (error) {
        console.error("No se pudo mostrar la lista de las tablas ", error)
        reject(error)
      }
    })
  }


}

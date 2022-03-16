import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLiteObject } from "@ionic-native/sqlite/ngx";
import { File } from "@ionic-native/file/ngx";
import { MessagesService } from './messages.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';
import { Base64 } from "@ionic-native/base64/ngx";
import { S3Service } from './s3.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  db: SQLiteObject = null;
  loading: any;

  // api para obtener las cuentas
  apiObtenerDatos = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_cuentas";
  apiObtenerPlazasUsuario = "http://172.24.24.24/andro/seroMovil.aspx?query=sp_obtener_plazas_usuario";
  apiObtenerInspectoresAgua = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_NombresGestoresInspeccion";
  apiRegistroInspeccion = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_inspeccion";
  apiRegistroInspeccionAntenas = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_inspeccion_antenas";
  apiRegistroCartaInvitacion = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_carta_invitacion";
  apiRegistroLegal = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_legal";
  apiRegistroServiciosPublicos = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_servicios_publicos";
  apiRegistroFotos = "http://201.163.165.20/seroMovil.aspx?query=sp_savePhotosSero";
  apiRegistroFotosServicios = "http://201.163.165.20/seroMovil.aspx?query=sp_savePhotosSeroServicios";
  apiRegistroRecorrido = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_recorrido";
  apiObtenerCuentasDistancia = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_cuentas_distancia";
  apiObtenerEmpleados = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_empleados";
  apiObtenerFotosHistoricas = "http://201.163.165.20/seroMovil.aspx?query=sp_get_Photos_History";
  apiRegistroEncuestaPresidente = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_encuesta";
  apiRegistroAsistencia = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_asistencia"


  constructor(
    private http: HttpClient,
    private file: File,
    private message: MessagesService,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private base64: Base64,
    private s3Service: S3Service
  ) { }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
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
   * Metodo que borra los registros de la tabla listaServiciosPublicos que son todos los servicios publicos con su respectiva plaza
   * @returns Promise
   */
  deleteServiciosPublicos() {
    let sql = 'DELETE FROM listaServiciosPublicos';
    return this.db.executeSql(sql, []);
  }

  /**
   * Metodo que borra los registros de la tabla empleadosPlaza que son los empleados por plaza a la que pertenece el usuario logueado
   * @returns Promise
   */
  deleteEmpleadosPlaza() {
    let sql = 'DELETE FROM empleadosPlaza';
    return this.db.executeSql(sql, []);
  }

  /**
   * Metodo que inserta los datos obtenidos del sql en la tabla serviciosPlazaUser
   * @param data 
   * @returns db execute
   */
  insertarServiciosSQL(data) {
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
   * Metodo que inserta los servicios publicos obtenidos de la api
   * @param data 
   * @returns Promise
   */
  insertarServicioPublicoSQL(data) {
    let sql = 'INSERT INTO listaServiciosPublicos (id_plaza, nombre_plaza, id_servicio_publico, nombre_servicio_publico) VALUES (?,?,?,?)';
    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombre,
      data.id_servicio_publico,
      data.nombre_servicio_publico
    ]);
  }

  /**
   * Metodo que inserta los registros de los empleados por plaza 
   * @param data 
   * @returns Promise
   */
  insertaEmpleadosPlaza(data) {
    let sql = 'INSERT INTO empleadosPlaza (id_plaza, idAspUser, nombre_empleado, apellido_paterno_empleado, apellido_materno_empleado) VALUES (?,?,?,?,?)';
    return this.db.executeSql(sql, [
      data.id_plaza,
      data.id_usuario,
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno
    ]);
  }

  async mostrarServicios(idPlaza) {

    let sql = "SELECT * FROM serviciosPlazaUser where id_plaza = ?"

    return this.db.executeSql(sql, [idPlaza]).then(response => {
      let servicios = [];
      for (let index = 0; index < response.rows.length; index++) {
        servicios.push(response.rows.item(index));
      }

      return Promise.resolve(servicios);
    }).catch(error => Promise.reject(error));

  }

  async mostrarServiciosAll() {
    console.log('Traer los servicios');
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
  async mostrarServiciosPublicos(id_plaza) {
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
   * Metodo que obtiene los registros de la tabla interna empleadosServicios
   * @param id_plaza 
   * @returns Promise
   */
  async mostrarEmpleadosPlaza(id_plaza) {
    let sql = "SELECT * FROM empleadosPlaza WHERE id_plaza = ?";
    return this.db.executeSql(sql, [id_plaza]).then(response => {
      let empleados = [];
      for (let i = 0; i < response.rows.length; i++) {
        empleados.push(response.rows.item(i));
      }
      return Promise.resolve(empleados)
    }).catch(error => Promise.reject(error));
  }




  /**
   * Borra la informacion de la tabla sero_principal cada que se descarga informacion dependiendo del servicio y la plaza
   * @returns Promise
   */
  deleteTable(id_plaza, id_servicio_plaza) {
    let sql = "DELETE FROM sero_principal where id_plaza = ? and id_servicio_plaza = ?";
    return this.db.executeSql(sql, [id_plaza, id_servicio_plaza]);
  }

  /**
   * Hace la peticion al servidor de la informacion de las cuentas dependiendo de la plaza y el servicio
   * @param idAspUser 
   * @param idPlaza 
   * @param idPlazaServicio 
   * @returns Promise
   */
  obtenerDatosSql(idAspUser, idPlaza, idPlazaServicio) {
    try {
      return new Promise(resolve => {

        this.http.post(this.apiObtenerDatos + " '" + idAspUser + "', " + idPlaza + ", " + idPlazaServicio, null)
          .subscribe(data => {
            resolve(data);
          }, err => console.log(err));
      })
    } catch {
      console.log("No se pudo obtener la información");
    }
  }



  /**
   * Guarda la informacion descargada en la tabla sero_principal
   * @param data // informacion descargada
   * @param id_plaza  // id de la plaza (demo 1, demo 2)
   * @param idServicioPlaza  // servicio (agua, predio)
   * @returns 
   */
  guardarInfoSQL(data, id_plaza, idServicioPlaza) {

    let sql = `INSERT INTO sero_principal (id_plaza, id_servicio_plaza, cuenta, clave_catastral, propietario, calle, num_int, num_ext, colonia, poblacion, codigo_postal, total, fecha_ultimo_pago, serie_medidor, tipo_servicio,  telefono_casa, telefono_celular, correo_electronico, superficie_terreno_h, superficie_construccion_h, valor_terreno_h, valor_construccion_h, valor_catastral_h, tarea_asignada, latitud, longitud) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

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
      data.longitud
    ])


  }


  /**
   * Actualiza el campo descargado a true dependiendo de la plaza y el servicio
   * @param id_plaza 
   * @param id_servicio 
   * @returns Promise
   */
  actualizaServicioEstatus(id_plaza, id_servicio) {
    let sql = "UPDATE serviciosPlazaUser set descargado = true where id_plaza = ? and id_servicio = ?"
    return this.db.executeSql(sql, [id_plaza, id_servicio]);
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


  async obtenerPlazas() {
    // En este metodo traigo del storage el nombre de las plazas y sus ids del firebase
    // tambien se pueden obtener de la abla serviciosPlazaUser
    let plazas = [];
    let idPlazas = [];
    let numeroPlazas = await this.storage.get('NumeroPlazas');
    console.log("Numero de plazas: ", numeroPlazas);
    for (let i = 0; i < numeroPlazas; i++) {
      let temp = await this.storage.get(`nombre${i + 1}`);
      //console.log(`nombre${i+1}`)
      plazas.push(temp);
      //console.log("Temp: ", temp);
      temp = null;
    }

    console.log(plazas);

    for (let i = 0; i < numeroPlazas; i++) {
      let temp2 = await this.storage.get(`idPlaza${i + 1}`);
      //console.log(`idPlaza${i+1}`)
      idPlazas.push(temp2);
      //console.log("Temp2: ", temp2);
      temp2 = null;
    }
    // le ponemos al id_plaza el primer valor del arreglo id_plazas que sera el que aparecera por defecto
    console.log(idPlazas);

    return {
      plazas,
      idPlazas
    }
  }


  guardarInfoSQLPredio(data, id_plaza) {
    let sql = `INSERT INTO predio (id_plaza, cuenta, clave_catastral, propietario, calle, num_int, num_ext, colonia, poblacion, codigo_postal, total, fecha_ultimo_pago, serie_medidor, tipo_servicio,  telefono_casa, telefono_celular, correo_electronico, superficie_terreno_h, superficie_construccion_h, valor_terreno_h, valor_construccion_h, valor_catastral_h, tarea_asignada, latitud, longitud) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    return this.db.executeSql(sql, [
      id_plaza,
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
      data.longitud
    ])
  }

  /**
   * Metodo que inserta la informacion obtenida de sp_Pozos en la tabla interna pozos_conagua
   * @param data 
   * @returns 
   */
  guardarInfoSqlPozos(data) {
    //console.log("data a insertar ", data)
    let sql = "INSERT INTO pozos_conagua (folio, numero_titulo, titular, representante_legal, rfc, domicilio, municipio, uso_agua, vol_ext_anu, vol_con_anu , profundidad, latitud, longitud) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      data.folio,
      data.numero_titulo,
      data.titular,
      data.representante_legal,
      data.rfc,
      data.domicilio,
      data.municipio,
      data.uso_agua,
      data.vol_ext_anu,
      data.vol_con_anu,
      data.profundidad,
      data.latitud,
      data.longitud
    ])
  }

  /**
   * Metodo que devuelve del sql las plazas a las que pertenece el usuario
   * solo con internet
   * @param idUser 
   * @returns Promise data de las plazas del usuario
   */
  getPlazasUsuario(idUser) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(`${this.apiObtenerPlazasUsuario}, '${idUser}'`).subscribe(data => {
          console.log("Plazas del usuario ", data);
          resolve(data)
        })
      } catch (error) {
        reject(error);
      }
    })
  }


  /**
   * Metodo que borrara toda la informacion si es que es otro usuario el que se logueo 
   */
  deleteInfo() {
    // implementar la logica
    console.log("Borrando información");
  }


  /**
   * Metodo que carga la lista de cuentas a gestionar 
   * @returns Promise 
   */
  cargarListadoCuentas(id_plaza, idServicioPlaza) {
    console.log("Cargando el listado de cuentas de la plaza " + id_plaza + " del servicio " + idServicioPlaza);
    // let sql = `SELECT cuenta, propietario, calle || ' numero_ext: ' || num_ext || ' numero_int: ' || num_int || ' ' || colonia as direccion, total, latitud, longitud, gestionada FROM sero_principal WHERE id_plaza = ? and id_servicio_plaza = ? and propietario NOT NULL`;
    let sql = `SELECT cuenta, propietario, calle || ' ' || colonia as direccion, total, latitud, longitud, gestionada FROM sero_principal WHERE id_plaza = ? AND id_servicio_plaza = ? AND propietario NOT NULL`;

    return this.db.executeSql(sql, [id_plaza, idServicioPlaza]).then(response => {
      let arrayCuentas = [];
      console.log(response);
      for (let index = 0; index < response.rows.length; index++) {
        arrayCuentas.push(response.rows.item(index));
      }
      console.log(arrayCuentas);

      return Promise.resolve(arrayCuentas);

    }).catch(error => Promise.reject(error));

  }

  /**
   * Metodo que obtiene las cuentas totales de la plaza y del servicio seleccionado
   * @param id_plaza 
   * @param idServicioPlaza 
   * @returns Promise
   */
  async getTotalAccounts(id_plaza, idServicioPlaza) {
    let sql = "SELECT COUNT(*) as total FROM sero_principal where id_plaza = ? and id_servicio_plaza = ?";
    try {
      const response = await this.db.executeSql(sql, [id_plaza, idServicioPlaza]);
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
  async getGestionadas(id_plaza, idServicioPlaza) {
    console.log("Obteniendo el total de gestionadas");
    let sql = 'SELECT COUNT(*) as total_gestionadas FROM sero_principal where id_plaza = ? and id_servicio_plaza = ? and gestionada = 1';
    try {
      const response = await this.db.executeSql(sql, [id_plaza, idServicioPlaza]);
      let result = response.rows.item(0).total_gestionadas;

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
   * Metodo que obtiene las cuentas de la tabla pozos_conagua para cargarlas al mapa
   * @returns Promise sqlite
   */
  // getDataVisitPositionPozos() {
  //   let sql = 'SELECT folio, numero_titulo, titular, representante_legal, rfc, domicilio, municipio, uso_agua, vol_ext_anu, vol_con_anu, profundidad, latitud, longitud FROM pozos_conagua';
  //   return this.db.executeSql(sql, []).then(response => {
  //     console.log(response);
  //     let posiciones = [];
  //     for (let index = 0; index < response.rows.length; index++) {
  //       posiciones.push(response.rows.item(index));
  //     }

  //     return Promise.resolve(posiciones)
  //   }).catch(error => Promise.reject(error));
  // }

  /**
   * Metodo que obtiene las cuentas de la tabla sero_principal para cargarlas al mapa
   * @returns query sqlite
   */
  getDataVisitPosition(id_plaza, id_servicio_plaza) {
    // Carga las posiciones
    let sql = 'SELECT gestionada, cuenta, latitud, longitud, propietario, total FROM sero_principal where id_plaza = ? and id_servicio_plaza = ? and latitud > 0 and gestionada = 0';
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
  getDataVisitPositionDistance(id_plaza, id_servicio_plaza, data) {

    return new Promise((resolve, reject) => {
      let sql = 'SELECT gestionada, cuenta, latitud, longitud, propietario, total FROM sero_principal where id_plaza = ? and id_servicio_plaza = ? and latitud > 0 and gestionada = 0';

      this.db.executeSql(sql, [id_plaza, id_servicio_plaza]).then(response => {

        let result = [];
        let cuentasMostrar = []

        for (let i = 0; i < response.rows.length; i++) {
          result.push(response.rows.item(i));
        }
        
        console.log(result);

        // result es el resultado de la consulta a sero_principal

        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].cuenta == result[i].cuenta) {
              cuentasMostrar.push(data[j]);
            }
          }

        }
        
        console.log(cuentasMostrar);
        resolve(cuentasMostrar);


      }).catch(err => reject(err));
    })


  }


  /**
   * Metodo que obtiene la informacion de una cuenta de la tabla agua para cargarla la mapa
   * @param accountNumber 
   * @returns 
   */
  getDataVisitPositionByAccount(accountNumber: string) {
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


  getDataVisitPositionPredio(id_plaza) {
    // Carga las posiciones
    let sql = 'SELECT gestionada, cuenta, latitud, longitud, propietario, total FROM predio where id_plaza = ? and latitud > 0 and gestionada = 0';
    return this.db.executeSql(sql, [id_plaza]).then(response => {
      let posiciones = [];

      for (let index = 0; index < response.rows.length; index++) {
        posiciones.push(response.rows.item(index));
      }

      return Promise.resolve(posiciones);

    }).catch(error => Promise.reject(error));
  }

  getDataVisitPositionByAccountPredio(accountNumber: string) {
    let sql =
      "SELECT gestionada, cuenta, latitud, longitud FROM predio where latitud > 0 and cuenta = ?";
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
   * Metodo que trae el total de las gestiones realizadas por servicio
   * @param idServicioPlaza 
   * @returns Promise
   */
  async getTotalGestionadas(idServicioPlaza) {
    console.log('Obteniendo el total de las gestionadas');
    let sql =
      "SELECT COUNT(a.account) AS total FROM (SELECT account FROM gestionCartaInvitacion where id_servicio_plaza = ? and cargado = 0 UNION SELECT account FROM gestionInspeccion WHERE id_servicio_plaza = ? and cargado = 0 UNION SELECT account FROM gestionLegal WHERE id_servicio_plaza = ? and cargado = 0 UNION SELECT account FROM gestionInspeccionAntenas) a";
    try {
      const response = await this.db.executeSql(sql, [idServicioPlaza, idServicioPlaza, idServicioPlaza]);
      let result = response.rows.item(0).total;
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Metodo que obtiene el total de los registros de capturaFotos donde cargado = 0
   * @returns Promise
   */
  async getTotalFotosAcciones() {
    console.log("Obteniendo el total de las fotos de las acciones");
    let sql = "SELECT count(*) AS total from capturaFotos WHERE cargado = 0 ";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Metodo que obtiene el total de registros de capturaFotosServicios donde cargado = 0
   * @returns Promise
   */
  async getTotalFotosServicios() {
    console.log("Obteniendo el total de las fotos de las acciones");
    let sql = "SELECT count(*) AS total from capturaFotosServicios WHERE cargado = 0 ";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Metodo que trae las gestiones realizadas por servicio
   * @param idServicioPlaza 
   * @returns Promise
   */
  getAccountsGestiones(idServicioPlaza) {
    console.log(idServicioPlaza);
    let sql =
      `SELECT account, fechaCaptura, 'Inspección' as rol, nombre_plaza FROM gestionInspeccion WHERE cargado = 0 AND id_servicio_plaza = ?
    UNION ALL SELECT account, fecha_captura, 'Carta invitación' as rol, nombre_plaza FROM gestionCartaInvitacion WHERE cargado = 0 AND id_servicio_plaza = ? UNION ALL SELECT account, fecha_captura, 'Legal' as rol, nombre_plaza FROM gestionLegal WHERE cargado = 0 AND id_servicio_plaza = ? UNION ALL SELECT account, fechaCaptura, 'Inspección Antenas' as rol, nombre_plaza FROM gestionInspeccionAntenas WHERE cargado = 0 AND id_servicio_plaza = ? `;
    return this.db.executeSql(sql, [idServicioPlaza, idServicioPlaza, idServicioPlaza, idServicioPlaza]).then(response => {
      let accounts = [];
      for (let i = 0; i < response.rows.length; i++) {
        accounts.push(response.rows.item(i));
      }
      return Promise.resolve(accounts);
    }).catch(error => Promise.reject(error));
  }


  saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo, idServicioPlaza) {
    let sql =
      "INSERT INTO capturaFotos(id_plaza,nombre_plaza, imagenLocal,cuenta,fecha,rutaBase64,idAspuser,idTarea,tipo, id_servicio_plaza) values(?,?,?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      id_plaza,
      nombrePlaza,
      image,
      accountNumber,
      fecha,
      rutaBase64,
      idAspuser,
      idTarea,
      tipo,
      idServicioPlaza
    ]);
  }

  saveImageServicios(id_plaza, idAspUser, image, fecha, rutaBase64, tipo, idServicio, nombrePlaza) {
    let sql =
      "INSERT INTO capturaFotosServicios(id_plaza, nombre_plaza, idAspUser, idServicio, imagenLocal,fecha,rutaBase64,tipo) values(?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      id_plaza,
      nombrePlaza,
      idAspUser,
      idServicio,
      image,
      fecha,
      rutaBase64,
      tipo
    ]);
  }

  /**
   * Metodo que trae la informacion de las cuentas de sero_principal lo manda a traer los formularios de
   * gestion para obtener datos de la cuenta seleccionada
   * @param account 
   * @returns Promise
   */
  getInfoAccount(account) {
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

  

  getNombreInspectores(idPlaza) {
    return this.http.get<any>(this.apiObtenerInspectoresAgua + ' ' + idPlaza);
  }

  async getImageLocal(img) {
    let sql = "SELECT * FROM CapturaFotos where cargado = 0 and imagenLocal = ?"
    return this.db.executeSql(sql, [img])
      .then(response => {
        let arrayImage = [];
        arrayImage.push(response.rows.item(0));
        console.log(arrayImage);
        this.deletePhoto(arrayImage[0].id, arrayImage[0].rutaBase64);
        return Promise.resolve(arrayImage);
      })
      .catch(error => Promise.reject(error));

  }

  async getImageLocalServicios(img) {
    let sql = "SELECT * FROM CapturaFotosServicios where cargado = 0 and imagenLocal = ?"
    return this.db.executeSql(sql, [img])
      .then(response => {
        let arrayImage = [];
        arrayImage.push(response.rows.item(0));
        console.log(arrayImage);
        this.deletePhotoServicios(arrayImage[0].id, arrayImage[0].rutaBase64);
        return Promise.resolve(arrayImage);
      })
      .catch(error => Promise.reject(error));

  }

  deletePhoto(id, url) {
    this.db.executeSql("delete from  capturaFotos where id = ?", [id]);
    this.deletePhotoFile(url);
    return;
  }

  deletePhotoServicios(id, url) {
    this.db.executeSql("delete from  capturaFotosServicios where id = ?", [id]);
    this.deletePhotoFile(url);
    return;
  }

  async deletePhotoFile(url) {
    var uno = url.split("cache/");
    let first = uno[0] + "cache/";
    let second = uno[1];
    console.log(first, second);
    this.file
      .removeFile(first, second)
      .then(res => {
        console.log("Se borro");
        console.log(res);
      })
      .catch(err => {
        console.log("No borro");
        console.log(err);
      });
  }

  /**
   * Metodo que inserta la informacion capturada en servicios publicos
   * @param data 
   * @returns Promise (insert into serviciosPublicos)
   */
  gestionServiciosPublicos(data) {
    let sql = 'INSERT INTO serviciosPublicos ( id_plaza, nombre_plaza, idAspUser, idServicio, observacion, fechaCaptura, latitud, longitud)' +
      'VALUES (?,?,?,?,?,?,?,?)';

    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.idAspUser,
      data.idServicio,
      //data.idServicio2,
      data.observacion,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
    ]);
  }

  gestionEncuesta(data) {
    let sql = 'INSERT INTO encuesta (idPlaza, account, conocePresidente, promesaCamp, cualPromesa, gestionPresidente, idServicioImpuesto, idServicioPlaza, fechaCaptura) VALUES (?,?,?,?,?,?,?,?,?)';

    return this.db.executeSql(sql, [
      data.idPlaza,
      data.account,
      data.conocePresidente,
      data.promesaCamp,
      data.cualPromesa,
      data.gestionPresidente,
      data.idServicioImpuesto,
      data.idServicioPlaza,
      data.fechaCaptura
    ]);
  }

  /**
   * Metodo que inserta la informacion capturada en carta invitacion
   * @param data 
   * @returns Promise (insert into gestionCartaINvitacion) 
   */
  gestionCartaInvitacion(data) {
    this.updateAccountGestionada(data.id);

    let sql = "INSERT INTO gestionCartaInvitacion(id_plaza, nombre_plaza, account, persona_atiende, id_tipo_servicio, numero_niveles, color_fachada, color_puerta, referencia, tipo_predio, entre_calle1, entre_calle2, observaciones, idAspUser, id_tarea, fecha_captura, latitud, longitud, id_servicio_plaza) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.account,
      data.persona_atiende,
      //data.id_motivo_no_pago, // No se estan utilizando va a estar en app de encuesta
      //data.otro_motivo_no_pago, // No se estan utilizando va a estar en app de encuesta
      //data.id_trabajo_actual, // No se estan utilizando va a estar en app de encuesta
      //data.id_gasto_impuesto, // No se estan utilizando va a estar en app de encuesta
      data.id_tipo_servicio,
      data.numero_niveles,
      data.colorFachada,
      data.colorPuerta,
      data.referencia,
      data.id_tipo_predio,
      data.entre_calle1,
      data.entre_calle2,
      data.observaciones,
      data.idAspUser,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
      data.idServicioPlaza
    ])
  }


  /**
   * Metodo que inserta en gestionInspeccion la informacion capturada
   * @param data 
   * @returns Promise (insert gestionInspeccion)
   */
  gestionInspeccion(data) {

    this.updateAccountGestionada(data.id);

    let sql = 'INSERT INTO gestionInspeccion (id_plaza, nombre_plaza, account, personaAtiende, idPuesto, otroPuesto, idTipoServicio, numeroNiveles, colorFachada, colorPuerta, referencia, idTipoPredio, entreCalle1, entreCalle2, hallazgoNinguna, hallazgoNegaronAcceso, hallazgoMedidorDescompuesto, hallazgoDiferenciaDiametro, hallazgoTomaClandestina, hallazgoDerivacionClandestina, hallazgoDrenajeClandestino, hallazgoCambioGiro, hallazgoFaltaDocumentacion, idAspUser, inspector2, inspector3, inspector4, observacion, idTarea, fechaCaptura, latitud, longitud, id_servicio_plaza)' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.account,
      data.personaAtiende,
      data.idPuesto,
      data.otroPuesto,
      data.idTipoServicio,
      data.numeroNiveles,
      data.colorFachada,
      data.colorPuerta,
      data.referencia,
      data.idTipoPredio,
      data.entreCalle1,
      data.entrecalle2,
      data.hallazgoNinguna,
      data.hallazgoNegaronAcceso,
      data.hallazgoMedidorDescompuesto,
      data.hallazgoDiferenciaDiametro,
      data.hallazgoTomaClandestina,
      data.hallazgoDerivacionClandestina,
      data.hallazgoDrenajeClandestino,
      data.hallazgoCambioGiro,
      data.hallazgoFaltaDocumentacion,
      data.idAspUser,
      data.inspector2,
      data.inspector3,
      data.inspector4,
      data.observacion,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
      data.idServicioPlaza
    ]);
  }

  /**
 * Metodo que inserta en gestionInspeccionAntenas la informacion capturada
 * @param data 
 * @returns Promise (insert gestionInspeccion)
 */
  gestionInspeccionAntenas(data) {

    this.updateAccountGestionada(data.id);

    let sql = 'INSERT INTO gestionInspeccionAntenas (id_plaza, nombre_plaza, account, propietario, personaAtiende, idPuesto, otroPuesto, usoSuelo, idTipoAntena, otroTipoAntena, idDetalleAntena, otroDetalleAntena, idTipoComunicacion, otroTipoComunicacion,numeroNiveles, colorFachada, colorPuerta, referencia, idTipoPredio, entreCalle1, entreCalle2, hallazgoNinguna, hallazgoNegaronAcceso, hallazgoCambioUsoSuelo, hallazgoRefrendoUsoSuelo, hallazgoRezago, idAspUser, idTarea, fechaCaptura, latitud, longitud,id_servicio_plaza)' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.account,
      data.propietario,
      data.personaAtiende,
      data.idPuesto,
      data.otroPuesto,
      data.usoSuelo,
      data.idTipoAntena,
      data.otroTipoAntena,
      data.idDetalleAntena,
      data.otroDetalleAntena,
      data.idTipoComunicacion,
      data.otroTipoComunicacion,
      data.numeroNiveles,
      data.colorFachada,
      data.colorPuerta,
      data.referencia,
      data.idTipoPredio,
      data.entreCalle1,
      data.entreCalle2,
      data.hallazgoNinguna,
      data.hallazgoNegaronAcceso,
      data.hallazgoCambioUsoSuelo,
      data.hallazgoRefrendoUsoSuelo,
      data.hallazgoRezago,
      data.idAspUser,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
      data.idServicioPlaza
    ]);
  }


  /**
   * Merodo que inserta en la tabla gestionLegal la informacion capturada
   * @param data 
   * @returns Promise
   */
  gestionLegal(data) {

    this.updateAccountGestionada(data.id);

    let sql = "INSERT INTO gestionLegal (id_plaza, nombre_plaza, account, persona_atiende, id_puesto, otro_puesto, id_motivo_no_pago, otro_motivo, id_tipo_servicio, numero_niveles, color_fachada, color_puerta, referencia, id_tipo_predio, entre_calle1, entre_calle2, observaciones, idAspUser, id_tarea, fecha_captura, latitud, longitud, id_servicio_plaza) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    console.log("Insertando");
    console.log(data);
    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.account,
      data.personaAtiende,
      data.idPuesto,
      data.otroPuesto,
      data.idMotivoNoPago,
      data.otroMotivo,
      data.idTipoServicio,
      data.numeroNiveles,
      data.colorFachada,
      data.colorPuerta,
      data.referencia,
      data.idTipoPredio,
      data.entreCalle1,
      data.entreCalle2,
      data.observaciones,
      data.idAspUser,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
      data.idServicioPlaza
    ])

  }

  /**
   * 
   * @param id Metodo que actualiza el campo gestionada en 1
   * @returns executeSql
   */
  updateAccountGestionada(id) {
    let sql = 'UPDATE sero_principal SET gestionada = 1 WHERE id = ?';
    return this.db.executeSql(sql, [id]);
  }

  /**
   * Metodo que trae los servicios gestionados con el campo cargado = 0 de la tabla serviciosPublicos
   * @returns Promise con los servicios gestionados
   */
  getAccountsGestionesServicios() {
    let sql = `SELECT nombre_plaza as plaza, fechaCaptura, 'Servicio público' as rol FROM serviciosPublicos WHERE cargado = 0`;
    return this.db.executeSql(sql, []).then(response => {
      let accounts = [];
      for (let i = 0; i < response.rows.length; i++) {
        accounts.push(response.rows.item(i));
      }
      return Promise.resolve(accounts);
    }).catch(error => Promise.reject(error));
  }

  async getTotalGestionesServicios() {
    let sql = "SELECT COUNT(*) AS total FROM serviciosPublicos"
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async sendServiciosPublicos() {
    console.log("Entrando a enviar la informacion de servicios publicos");
    try {
      let arrayServicios = [];
      let sql = "SELECT * FROM serviciosPublicos where cargado = 0";
      const result = await this.db.executeSql(sql, []);

      for (let i = 0; i < result.rows.length; i++) {
        arrayServicios.push(result.rows.item(i));
      }
      if (arrayServicios.length == 0) {
        this.message.showToast("Sin registros de carta servicios públicos por enviar");
      } else {
        this.avanceServicios = 0;
        this.envioGestionesServicios(arrayServicios);
      }
    } catch (error) {

    }
  }

  avanceServicios = 0;

  envioGestionesServicios(arrayServicios) {
    console.log("envioGestionesServiciosPublicos");
    console.log(this.avanceGestionesCarta);

    if (this.avanceServicios === arrayServicios.length) {
      this.message.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesServicios(this.avanceServicios, arrayServicios).then(resp => {
        if (resp) {
          this.avanceServicios++;
          this.envioGestionesServicios(arrayServicios);
        } else {
          this.envioGestionesServicios(arrayServicios);
        }
      })
    }
  }

  sendGestionesServicios(i, arrayServicios) {
    return new Promise(async resolve => {

      console.log(arrayServicios);

      let id_plaza = arrayServicios[i].id_plaza;
      let idAspUser = arrayServicios[i].idAspUser;
      let idServicio = arrayServicios[i].idServicio;
      //let idServicio2 = arrayServicios[i].idServicio2;
      let observacion = arrayServicios[i].observacion;
      let fechaCaptura = arrayServicios[i].fechaCaptura;
      let latitud = arrayServicios[i].latitud;
      let longitud = arrayServicios[i].longitud;
      let id = arrayServicios[i].id

      let sql = `${id_plaza},'${idAspUser}',${idServicio},'${observacion}','${fechaCaptura}',${latitud},${longitud} `
      console.log(sql);
      await this.enviarSQLServicios(sql, id)
      resolve('Execute Query successfully');

    })
  }



  //////******************************************************************** */

  // Metodos para enviar gestiones de una en una

  /**
   * Metodo que envia una sola gestion del modulo de carta invitacion del servicio correspondiente
   * @param idServicioPlaza 
   * @param account 
   * @returns 
   */
  async sendCartaByIdServicioAccount(idServicioPlaza, account) {
    console.log("Entrando a enviar la informacion de la cuenta");
    try {
      let arrayCuentaCarta = [];
      let sql = 'SELECT * FROM gestionCartaInvitacion WHERE cargado = 0 AND id_servicio_plaza = ? and account = ?';

      const result = await this.db.executeSql(sql, [idServicioPlaza, account]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentaCarta.push(result.rows.item(i));
      }

      if (arrayCuentaCarta.length == 0) {
        this.message.showAlert("No se puede enviar la gestión, no se guardo correctamente");
      } else {
        let id_plaza = arrayCuentaCarta[0].id_plaza;
        let account = arrayCuentaCarta[0].account;
        let persona_atiende = arrayCuentaCarta[0].persona_atiende;
        let id_tipo_servicio = arrayCuentaCarta[0].id_tipo_servicio;
        let numero_niveles = arrayCuentaCarta[0].numero_niveles;
        let color_fachada = arrayCuentaCarta[0].color_fachada;
        let color_puerta = arrayCuentaCarta[0].color_puerta;
        let referencia = arrayCuentaCarta[0].referencia;
        let id_tipo_predio = arrayCuentaCarta[0].tipo_predio;
        let entre_calle1 = arrayCuentaCarta[0].entre_calle1;
        let entre_calle2 = arrayCuentaCarta[0].entre_calle2;
        let observaciones = arrayCuentaCarta[0].observaciones;
        let idAspUser = arrayCuentaCarta[0].idAspUser;
        let idTarea = arrayCuentaCarta[0].id_tarea;
        let fechaCaptura = arrayCuentaCarta[0].fecha_captura;
        let latitud = arrayCuentaCarta[0].latitud;
        let longitud = arrayCuentaCarta[0].longitud;
        let idServicioPaza = arrayCuentaCarta[0].id_servicio_plaza;
        let id = arrayCuentaCarta[0].id;

        let sql = `${id_plaza},'${account}','${persona_atiende}',${id_tipo_servicio},${numero_niveles},'${color_fachada}','${color_puerta}','${referencia}',${id_tipo_predio},'${entre_calle1}','${entre_calle2}','${observaciones}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPaza} `
        console.log(sql);
        await this.enviarSQLCartaInvitacion(sql, id)

        this.message.showAlert("Envío de la gestión correctamente");

        return Promise.resolve("Success");

      }

    } catch (error) {
      return Promise.reject("Error");
    }
  }

  /**
   * Metodo que envia una sola gestion del modulo de legal del servicio correspondiente
   * @param idServicioPlaza 
   * @param account 
   * @returns Promise
   */
  async sendLegalByIdServicioAccount(idServicioPlaza, account) {
    console.log("Entrando a enviar la informacion de la cuenta");
    try {
      let arrayCuentaLegal = [];
      let sql = 'SELECT * FROM gestionLegal WHERE cargado = 0 AND id_servicio_plaza = ? and account = ?';

      const result = await this.db.executeSql(sql, [idServicioPlaza, account]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentaLegal.push(result.rows.item(i));
      }

      if (arrayCuentaLegal.length == 0) {
        this.message.showAlert("No se puede enviar la gestión, no se guardo correctamente");
      } else {
        let id_plaza = arrayCuentaLegal[0].id_plaza
        let account = arrayCuentaLegal[0].account;
        let personaTiende = arrayCuentaLegal[0].persona_atiende;
        let idPuesto = arrayCuentaLegal[0].id_puesto;
        let otroPuesto = arrayCuentaLegal[0].otro_puesto;
        let idMotivoNoPago = arrayCuentaLegal[0].id_motivo_no_pago;
        let otroMotivo = arrayCuentaLegal[0].otro_motivo;
        let idTipoServicio = arrayCuentaLegal[0].id_tipo_servicio;
        let numeroNiveles = arrayCuentaLegal[0].numero_niveles;
        let colorFachada = arrayCuentaLegal[0].color_fachada;
        let colorPuerta = arrayCuentaLegal[0].color_puerta;
        let referencia = arrayCuentaLegal[0].referencia;
        let idTipoPredio = arrayCuentaLegal[0].id_tipo_predio;
        let entreCalle1 = arrayCuentaLegal[0].entre_calle1;
        let entreCalle2 = arrayCuentaLegal[0].entre_calle2;
        let observaciones = arrayCuentaLegal[0].observaciones;
        let idAspUser = arrayCuentaLegal[0].idAspUser;
        let idTarea = arrayCuentaLegal[0].id_tarea;
        let fechaCaptura = arrayCuentaLegal[0].fecha_captura;
        let latitud = arrayCuentaLegal[0].latitud;
        let longitud = arrayCuentaLegal[0].longitud;
        let idServicioPlaza = arrayCuentaLegal[0].id_servicio_plaza
        let id = arrayCuentaLegal[0].id;

        let sql = `${id_plaza},'${account}','${personaTiende}',${idPuesto},'${otroPuesto}',${idMotivoNoPago},'${otroMotivo}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}','${observaciones}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza} `
        console.log(sql);
        await this.enviarSQLGestionLegal(sql, id)

        this.message.showAlert("Envío de la gestión correctamente");

        return Promise.resolve("Success");

      }

    } catch (error) {
      return Promise.reject("Error");
    }
  }

  /**
   * Metodo que envia una sola gestion del modulo de inspeccion del servicio correspondiente
   * @param idServicioPlaza 
   * @param account 
   * @returns Promise
   */
  async sendInspeccionByIdServicioAccount(idServicioPlaza, account) {
    console.log("Entrando a enviar la informacion de la cuenta");
    try {
      let arrayCuentaInspeccion = [];
      let sql = 'SELECT * FROM gestionInspeccion WHERE cargado = 0 AND id_servicio_plaza = ? and account = ?';

      const result = await this.db.executeSql(sql, [idServicioPlaza, account]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentaInspeccion.push(result.rows.item(i));
      }

      if (arrayCuentaInspeccion.length == 0) {
        this.message.showAlert("No se puede enviar la gestión, no se guardo correctamente");
      } else {
        let id_plaza = arrayCuentaInspeccion[0].id_plaza;
        let account = arrayCuentaInspeccion[0].account;
        let personaAtiende = arrayCuentaInspeccion[0].personaAtiende;
        let idPuesto = arrayCuentaInspeccion[0].idPuesto;
        let otroPuesto = arrayCuentaInspeccion[0].otroPuesto;
        let idTipoServicio = arrayCuentaInspeccion[0].idTipoServicio;
        let numeroNiveles = arrayCuentaInspeccion[0].numeroNiveles;
        let colorFachada = arrayCuentaInspeccion[0].colorFachada;
        let colorPuerta = arrayCuentaInspeccion[0].colorPuerta;
        let referencia = arrayCuentaInspeccion[0].referencia;
        let idTipoPredio = arrayCuentaInspeccion[0].idTipoPredio;
        let entreCalle1 = arrayCuentaInspeccion[0].entreCalle1;
        let entreCalle2 = arrayCuentaInspeccion[0].entreCalle2;
        let hallazgoNinguna = arrayCuentaInspeccion[0].hallazgoNinguna;
        let hallazgoNegaronAcceso = arrayCuentaInspeccion[0].hallazgoNegaronAcceso;
        let hallazgoMedidorDescompuesto = arrayCuentaInspeccion[0].hallazgoMedidorDescompuesto;
        let hallazgoDiferenciaDiametro = arrayCuentaInspeccion[0].hallazgoDiferenciaDiametro;
        let hallazgoTomaClandestina = arrayCuentaInspeccion[0].hallazgoTomaClandestina;
        let hallazgoDerivacionClandestina = arrayCuentaInspeccion[0].hallazgoDerivacionClandestina;
        let hallazgoDrenajeClandestino = arrayCuentaInspeccion[0].hallazgoDrenajeClandestino;
        let hallazgoCambioGiro = arrayCuentaInspeccion[0].hallazgoCambioGiro;
        let hallazgoFaltaDocumentacion = arrayCuentaInspeccion[0].hallazgoFaltaDocumentacion;
        let idAspUser = arrayCuentaInspeccion[0].idAspUser;
        let inspector2 = arrayCuentaInspeccion[0].inspector2;
        let inspector3 = arrayCuentaInspeccion[0].inspector3;
        let inspector4 = arrayCuentaInspeccion[0].inspector4;
        let observacion = arrayCuentaInspeccion[0].observacion;
        let idTarea = arrayCuentaInspeccion[0].idTarea;
        let fechaCaptura = arrayCuentaInspeccion[0].fechaCaptura;
        let latitud = arrayCuentaInspeccion[0].latitud;
        let longitud = arrayCuentaInspeccion[0].longitud;
        let idServicioPlaza = arrayCuentaInspeccion[0].id_servicio_plaza;
        let id = arrayCuentaInspeccion[0].id;

        let sql = `${id_plaza},'${account}','${personaAtiende}',${idPuesto},'${otroPuesto}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}',${hallazgoNinguna},${hallazgoNegaronAcceso},${hallazgoMedidorDescompuesto},${hallazgoDiferenciaDiametro},${hallazgoTomaClandestina},${hallazgoDerivacionClandestina},${hallazgoDrenajeClandestino},${hallazgoCambioGiro},${hallazgoFaltaDocumentacion},'${idAspUser}','${inspector2}','${inspector3}','${inspector4}','${observacion}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza}`;
        console.log(sql);
        await this.enviarSQLInspeccion(sql, id)

        this.message.showAlert("Envío de la gestión correctamente");

        return Promise.resolve("Success");

      }

    } catch (error) {
      return Promise.reject("Error");
    }
  }



  /**
   * Metodo que envia una sola gestion del modulo de inspeccion antenas del servicio correspondiente
   * @param idServicioPlaza 
   * @param account 
   * @returns Promise
   */
  async sendInspeccionAntenasByIdServicioAccount(idServicioPlaza, account) {
    console.log("Entrando a enviar la informacion de la cuenta");
    try {
      let arrayCuentaInspeccionAntenas = [];
      let sql = 'SELECT * FROM gestionInspeccionAntenas WHERE cargado = 0 AND id_servicio_plaza = ? and account = ?';

      const result = await this.db.executeSql(sql, [idServicioPlaza, account]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentaInspeccionAntenas.push(result.rows.item(i));
      }

      if (arrayCuentaInspeccionAntenas.length == 0) {
        this.message.showAlert("No se puede enviar la gestión, no se guardo correctamente");
      } else {
        let id_plaza = arrayCuentaInspeccionAntenas[0].id_plaza
        let account = arrayCuentaInspeccionAntenas[0].account;
        let propietario = arrayCuentaInspeccionAntenas[0].propietario;
        let personaAtiende = arrayCuentaInspeccionAntenas[0].personaAtiende;
        let idPuesto = arrayCuentaInspeccionAntenas[0].idPuesto;
        let otroPuesto = arrayCuentaInspeccionAntenas[0].otroPuesto;
        let usoSuelo = arrayCuentaInspeccionAntenas[0].usoSuelo;
        let idTipoAntena = arrayCuentaInspeccionAntenas[0].idTipoAntena;
        let otroTipoAntena = arrayCuentaInspeccionAntenas[0].otroTipoAntena;
        let idDetalleAntena = arrayCuentaInspeccionAntenas[0].idDetalleAntena;
        let otroDetalleAntena = arrayCuentaInspeccionAntenas[0].otroDetalleAntena;
        let idTipoComunicacion = arrayCuentaInspeccionAntenas[0].idTipoComunicacion;
        let otroTipoComunicacion = arrayCuentaInspeccionAntenas[0].otroTipoComunicacion;
        let numeroNiveles = arrayCuentaInspeccionAntenas[0].numeroNiveles;
        let colorFachada = arrayCuentaInspeccionAntenas[0].colorFachada;
        let colorPuerta = arrayCuentaInspeccionAntenas[0].colorPuerta;
        let referencia = arrayCuentaInspeccionAntenas[0].referencia;
        let idTipoPredio = arrayCuentaInspeccionAntenas[0].idTipoPredio;
        let entreCalle1 = arrayCuentaInspeccionAntenas[0].entreCalle1;
        let entreCalle2 = arrayCuentaInspeccionAntenas[0].entreCalle2;
        let hallazgoNinguna = arrayCuentaInspeccionAntenas[0].hallazgoNinguna;
        let hallazgoNegaronAcceso = arrayCuentaInspeccionAntenas[0].hallazgoNegaronAcceso;
        let hallazgoCambioUsoSuelo = arrayCuentaInspeccionAntenas[0].hallazgoCambioUsoSuelo;
        let hallazgoRefrendoUsoSuelo = arrayCuentaInspeccionAntenas[0].hallazgoRefrendoUsoSuelo;
        let hallazgoRezago = arrayCuentaInspeccionAntenas[0].hallazgoRezago;
        let idAspUser = arrayCuentaInspeccionAntenas[0].idAspUser;
        let idTarea = arrayCuentaInspeccionAntenas[0].idTarea;
        let fechaCaptura = arrayCuentaInspeccionAntenas[0].fechaCaptura;
        let latitud = arrayCuentaInspeccionAntenas[0].latitud;
        let longitud = arrayCuentaInspeccionAntenas[0].longitud;
        let id_servicio_plaza = arrayCuentaInspeccionAntenas[0].id_servicio_plaza;
        let id = arrayCuentaInspeccionAntenas[0].id;

        let sql = `${id_plaza},'${account}','${propietario}','${personaAtiende}',${idPuesto},'${otroPuesto}','${usoSuelo}',${idTipoAntena},'${otroTipoAntena}',${idDetalleAntena},'${otroDetalleAntena}',${idTipoComunicacion},'${otroTipoComunicacion}',${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}',${hallazgoNinguna},${hallazgoNegaronAcceso},${hallazgoCambioUsoSuelo},${hallazgoRefrendoUsoSuelo},${hallazgoRezago},'${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${id_servicio_plaza}`;

        console.log(sql);
        await this.enviarSQLInspeccionAntenas(sql, id)

        this.message.showAlert("Envío de la gestión correctamente");

        return Promise.resolve("Success");

      }

    } catch (error) {
      return Promise.reject("Error");
    }
  }

  /**
 * Metodo que elimina una gestion de la cuenta y de la tabla pasadas por parametro
 * @param table 
 * @param account 
 * @returns Promise 
 */
  async deleteAccountGestionGeneral(table, account) {
    let sql = `DELETE FROM ${table} WHERE account = ?`;
    console.log(sql);
    let sql0 = `SELECT * FROM ${table} WHERE account = ?`;
    let arrayDelete = [];

    const result0 = await this.db.executeSql(sql0, [account]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayDelete.push(result0.rows.item(i));
    }
    console.log(arrayDelete);
    if (arrayDelete.length == 0) {
      this.message.showAlert("No se pudo eliminar la gestión, no se guardo correctamente");
    } else {
      await this.updateGestionadaDelete(account);
      console.log("borrando la cuenta " + account);
      return this.db.executeSql(sql, [account]);
    }

  }

  /**
   * Metodo que actualiza el campo gestionada a 0 de la tabla sero_principal de la cuenta pasada por parametro
   * @param cuenta 
   * @returns Promise
   */
  updateGestionadaDelete(cuenta) {
    let sql = 'UPDATE sero_principal SET gestionada = 0 where cuenta = ?';
    return this.db.executeSql(sql, [cuenta]);
  }


  ///////////////////************************************************************************* */

  // Metodos para el envio de gestiones por servicio o todas

  /**
  * Metodo que inicia el envio de gestiones del modulo de inspeccion antenas del servicio correspondiente
  * @param idServicioPlaza 
  * @returns Promise
  */
  async sendInspeccionAntenasByIdServicio(idServicioPlaza) {
    console.log("Entrando a enviar la informacion del servicio " + idServicioPlaza);
    try {
      let arrayCuentasInspeccionAntenas = [];
      let sql = 'SELECT * FROM gestionInspeccionAntenas WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [idServicioPlaza]);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasInspeccionAntenas.push(result.rows.item(i));
      }
      console.log(arrayCuentasInspeccionAntenas);

      if (arrayCuentasInspeccionAntenas.length == 0) {
        this.message.showToast("Sin registros de inspeccion por enviar");
      } else {
        this.avanceGestionesInspeccionAntenas = 0;
        this.envioGestionesInspeccionAntenas(arrayCuentasInspeccionAntenas);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Metodo que inicia el envio de todas las gestiones del modulo de inspeccion antenas
   * @returns Promise
   */
  async sendInspeccionAntenas() {
    console.log("Entrando a enviar la informacion");
    try {
      let arrayCuentasInspeccionAntenas = [];
      let sql = 'SELECT * FROM gestionInspeccionAntenas WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasInspeccionAntenas.push(result.rows.item(i));
      }
      console.log(arrayCuentasInspeccionAntenas);

      if (arrayCuentasInspeccionAntenas.length == 0) {
        this.message.showToast("Sin registros de inspeccion por enviar");
      } else {
        this.avanceGestionesInspeccionAntenas = 0;
        this.envioGestionesInspeccionAntenas(arrayCuentasInspeccionAntenas);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  avanceGestionesInspeccionAntenas = 0;

  /**
* Segundo metodo para el envio de registros de inspeccion antenas
* @param arrayGestionesInspeccionAntenas
*/
  envioGestionesInspeccionAntenas(arrayGestionesInspeccionAntenas) {
    console.log("envioGestionesInspeccionAntenas");
    console.log(this.avanceGestionesInspeccionAntenas);

    if (this.avanceGestionesInspeccionAntenas === arrayGestionesInspeccionAntenas.length) {
      this.message.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesInspeccionAntenas(this.avanceGestionesInspeccionAntenas, arrayGestionesInspeccionAntenas).then(resp => {
        if (resp) {
          this.avanceGestionesInspeccionAntenas++;
          this.envioGestionesInspeccionAntenas(arrayGestionesInspeccionAntenas);
        } else {
          this.envioGestionesInspeccionAntenas(arrayGestionesInspeccionAntenas);
        }
      })
    }
  }

  /**
 * Tercer metodo que envia los registros de inspeccion antenas
 * @param i 
 * @param arrayGestionesInspeccionAntenas
 * @returns 
 */
  async sendGestionesInspeccionAntenas(i, arrayGestionesInspeccionAntenas) {
    //let idPlaza = await this.storage.get("IdPlaza");
    return new Promise(async (resolve) => {

      let id_plaza = arrayGestionesInspeccionAntenas[i].id_plaza
      let account = arrayGestionesInspeccionAntenas[i].account;
      let propietario = arrayGestionesInspeccionAntenas[i].propietario;
      let personaAtiende = arrayGestionesInspeccionAntenas[i].personaAtiende;
      let idPuesto = arrayGestionesInspeccionAntenas[i].idPuesto;
      let otroPuesto = arrayGestionesInspeccionAntenas[i].otroPuesto;
      let usoSuelo = arrayGestionesInspeccionAntenas[i].usoSuelo;
      let idTipoAntena = arrayGestionesInspeccionAntenas[i].idTipoAntena;
      let otroTipoAntena = arrayGestionesInspeccionAntenas[i].otroTipoAntena;
      let idDetalleAntena = arrayGestionesInspeccionAntenas[i].idDetalleAntena;
      let otroDetalleAntena = arrayGestionesInspeccionAntenas[i].otroDetalleAntena;
      let idTipoComunicacion = arrayGestionesInspeccionAntenas[i].idTipoComunicacion;
      let otroTipoComunicacion = arrayGestionesInspeccionAntenas[i].otroTipoComunicacion;
      let numeroNiveles = arrayGestionesInspeccionAntenas[i].numeroNiveles;
      let colorFachada = arrayGestionesInspeccionAntenas[i].colorFachada;
      let colorPuerta = arrayGestionesInspeccionAntenas[i].colorPuerta;
      let referencia = arrayGestionesInspeccionAntenas[i].referencia;
      let idTipoPredio = arrayGestionesInspeccionAntenas[i].idTipoPredio;
      let entreCalle1 = arrayGestionesInspeccionAntenas[i].entreCalle1;
      let entreCalle2 = arrayGestionesInspeccionAntenas[i].entreCalle2;
      let hallazgoNinguna = arrayGestionesInspeccionAntenas[i].hallazgoNinguna;
      let hallazgoNegaronAcceso = arrayGestionesInspeccionAntenas[i].hallazgoNegaronAcceso;
      let hallazgoCambioUsoSuelo = arrayGestionesInspeccionAntenas[i].hallazgoCambioUsoSuelo;
      let hallazgoRefrendoUsoSuelo = arrayGestionesInspeccionAntenas[i].hallazgoRefrendoUsoSuelo;
      let hallazgoRezago = arrayGestionesInspeccionAntenas[i].hallazgoRezago;
      let idAspUser = arrayGestionesInspeccionAntenas[i].idAspUser;
      let idTarea = arrayGestionesInspeccionAntenas[i].idTarea;
      let fechaCaptura = arrayGestionesInspeccionAntenas[i].fechaCaptura;
      let latitud = arrayGestionesInspeccionAntenas[i].latitud;
      let longitud = arrayGestionesInspeccionAntenas[i].longitud;
      let id_servicio_plaza = arrayGestionesInspeccionAntenas[i].id_servicio_plaza;
      let id = arrayGestionesInspeccionAntenas[i].id;

      let sql = `${id_plaza},'${account}','${propietario}','${personaAtiende}',${idPuesto},'${otroPuesto}','${usoSuelo}',${idTipoAntena},'${otroTipoAntena}',${idDetalleAntena},'${otroDetalleAntena}',${idTipoComunicacion},'${otroTipoComunicacion}',${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}',${hallazgoNinguna},${hallazgoNegaronAcceso},${hallazgoCambioUsoSuelo},${hallazgoRefrendoUsoSuelo},${hallazgoRezago},'${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${id_servicio_plaza}`;
      console.log(sql);
      await this.enviarSQLInspeccionAntenas(sql, id)
      resolve('Execute Query successfully');
    })
  }


  /**
* Cuarto y ultimo metodo que envia los registros de inspeccion antenas
* @param query 
* @param id 
* @returns 
*/
  async enviarSQLInspeccionAntenas(query, id) {
    return new Promise(resolve => {
      // cambiar apiObtenerInspectoresAgua por el api que envia la informacion
      console.log("Enviando...");
      console.log(this.apiRegistroInspeccionAntenas + " " + query)
      this.http.post(this.apiRegistroInspeccionAntenas + " " + query, null).subscribe(
        async data => {
          await this.actualizarIdInspeccionAntenas(id);
          console.log(data);
          resolve(data);
        },
        err => {
          this.message.showAlert(
            "No se pudo enviar la información, verifica tu red " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }


  /**
   * Metodo que inicia el envio de gestiones del modulo de inspeccion del servicio correspondiente
   * @param idServicioPlaza 
   * @returns Promise
   */
  async sendInspeccionByIdServicio(idServicioPlaza) {
    console.log("Entrando a enviar la informacion del servicio " + idServicioPlaza);
    try {
      let arrayCuentasInspeccion = [];
      let sql = 'SELECT * FROM gestionInspeccion WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [idServicioPlaza]);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasInspeccion.push(result.rows.item(i));
      }
      console.log(arrayCuentasInspeccion);

      if (arrayCuentasInspeccion.length == 0) {
        this.message.showToast("Sin registros de inspeccion por enviar");
      } else {
        this.avanceGestionesInspeccion = 0;
        this.envioGestionesInspeccion(arrayCuentasInspeccion);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
   * Metodo que inicia el envio de todas las gestiones del modulo de inspeccion
   * @returns Promise
   */
  async sendInspeccion() {
    console.log("Entrando a enviar la informacion");
    try {
      let arrayCuentasInspeccion = [];
      let sql = 'SELECT * FROM gestionInspeccion WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasInspeccion.push(result.rows.item(i));
      }
      console.log(arrayCuentasInspeccion);

      if (arrayCuentasInspeccion.length == 0) {
        this.message.showToast("Sin registros de inspeccion por enviar");
      } else {
        this.avanceGestionesInspeccion = 0;
        this.envioGestionesInspeccion(arrayCuentasInspeccion);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  avanceGestionesInspeccion = 0

  /**
   * Segundo metodo para el envio de registros de inspeccion
   * @param arrayGestionesInspeccion 
   */
  envioGestionesInspeccion(arrayGestionesInspeccion) {
    console.log("envioGestionesInspeccionAgua");
    console.log(this.avanceGestionesInspeccion);

    if (this.avanceGestionesInspeccion === arrayGestionesInspeccion.length) {
      this.message.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesInspeccion(this.avanceGestionesInspeccion, arrayGestionesInspeccion).then(resp => {
        if (resp) {
          this.avanceGestionesInspeccion++;
          this.envioGestionesInspeccion(arrayGestionesInspeccion);
        } else {
          this.envioGestionesInspeccion(arrayGestionesInspeccion);
        }
      })
    }
  }

  /**
   * Tercer metodo que envia los registros de inspeccion
   * @param i 
   * @param arrayGestionesInspeccionAgua 
   * @returns 
   */
  async sendGestionesInspeccion(i, arrayGestionesInspeccionAgua) {
    //let idPlaza = await this.storage.get("IdPlaza");
    return new Promise(async (resolve) => {
      let id_plaza = arrayGestionesInspeccionAgua[i].id_plaza;
      let account = arrayGestionesInspeccionAgua[i].account;
      let personaAtiende = arrayGestionesInspeccionAgua[i].personaAtiende;
      //let numeroContacto = arrayGestionesInspeccionAgua[i].numeroContacto; // Lo quitaron en la junta
      let idPuesto = arrayGestionesInspeccionAgua[i].idPuesto;
      let otroPuesto = arrayGestionesInspeccionAgua[i].otroPuesto;
      //let idMotivoNoPago = arrayGestionesInspeccionAgua[i].idMotivoNoPago; // lo quito Alejandro
      //let otroMotivo = arrayGestionesInspeccionAgua[i].otroMotivo; // Lo quito Alejandro
      let idTipoServicio = arrayGestionesInspeccionAgua[i].idTipoServicio;
      let numeroNiveles = arrayGestionesInspeccionAgua[i].numeroNiveles;
      let colorFachada = arrayGestionesInspeccionAgua[i].colorFachada;
      let colorPuerta = arrayGestionesInspeccionAgua[i].colorPuerta;
      let referencia = arrayGestionesInspeccionAgua[i].referencia;
      let idTipoPredio = arrayGestionesInspeccionAgua[i].idTipoPredio;
      let entreCalle1 = arrayGestionesInspeccionAgua[i].entreCalle1;
      let entreCalle2 = arrayGestionesInspeccionAgua[i].entreCalle2;
      let hallazgoNinguna = arrayGestionesInspeccionAgua[i].hallazgoNinguna;
      let hallazgoNegaronAcceso = arrayGestionesInspeccionAgua[i].hallazgoNegaronAcceso;
      let hallazgoMedidorDescompuesto = arrayGestionesInspeccionAgua[i].hallazgoMedidorDescompuesto;
      let hallazgoDiferenciaDiametro = arrayGestionesInspeccionAgua[i].hallazgoDiferenciaDiametro;
      let hallazgoTomaClandestina = arrayGestionesInspeccionAgua[i].hallazgoTomaClandestina;
      let hallazgoDerivacionClandestina = arrayGestionesInspeccionAgua[i].hallazgoDerivacionClandestina;
      let hallazgoDrenajeClandestino = arrayGestionesInspeccionAgua[i].hallazgoDrenajeClandestino;
      let hallazgoCambioGiro = arrayGestionesInspeccionAgua[i].hallazgoCambioGiro;
      let hallazgoFaltaDocumentacion = arrayGestionesInspeccionAgua[i].hallazgoFaltaDocumentacion;
      let idAspUser = arrayGestionesInspeccionAgua[i].idAspUser;
      let inspector2 = arrayGestionesInspeccionAgua[i].inspector2;
      let inspector3 = arrayGestionesInspeccionAgua[i].inspector3;
      let inspector4 = arrayGestionesInspeccionAgua[i].inspector4;
      let observacion = arrayGestionesInspeccionAgua[i].observacion;
      let idTarea = arrayGestionesInspeccionAgua[i].idTarea;
      let fechaCaptura = arrayGestionesInspeccionAgua[i].fechaCaptura;
      let latitud = arrayGestionesInspeccionAgua[i].latitud;
      let longitud = arrayGestionesInspeccionAgua[i].longitud;
      let idServicioPlaza = arrayGestionesInspeccionAgua[i].id_servicio_plaza;
      let id = arrayGestionesInspeccionAgua[i].id;

      let sql = `${id_plaza},'${account}','${personaAtiende}',${idPuesto},'${otroPuesto}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}',${hallazgoNinguna},${hallazgoNegaronAcceso},${hallazgoMedidorDescompuesto},${hallazgoDiferenciaDiametro},${hallazgoTomaClandestina},${hallazgoDerivacionClandestina},${hallazgoDrenajeClandestino},${hallazgoCambioGiro},${hallazgoFaltaDocumentacion},'${idAspUser}','${inspector2}','${inspector3}','${inspector4}','${observacion}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza}`;
      console.log(sql);
      await this.enviarSQLInspeccion(sql, id)
      resolve('Execute Query successfully');
    })
  }

  /**
   * Cuarto y ultimo metodo que envia los registros de inspeccion
   * @param query 
   * @param id 
   * @returns 
   */
  async enviarSQLInspeccion(query, id) {
    return new Promise(resolve => {
      // cambiar apiObtenerInspectoresAgua por el api que envia la informacion
      console.log("Enviando...");
      console.log(this.apiRegistroInspeccion + " " + query)
      this.http.post(this.apiRegistroInspeccion + " " + query, null).subscribe(
        async data => {
          await this.actualizarIdInspeccion(id);
          console.log(data);
          resolve(data);
        },
        err => {
          this.message.showAlert(
            "No se pudo enviar la información, verifica tu red " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }


  /**
   * Metodo que inicia el envio de gestiones del modulo de carta invitacion del servicio correspondiente
   * @param idServicioPlaza 
   * @returns Promise
   */
  async sendCartaInvitacionByIdServicio(idServicioPlaza) {
    console.log("Entrando a enviar la informacion de cartas invitacion del servicio " + idServicioPlaza);
    try {
      let arrayCuentasCarta = [];
      let sql = 'SELECT * FROM gestionCartaInvitacion WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [idServicioPlaza]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasCarta.push(result.rows.item(i));
      }
      console.log(arrayCuentasCarta);

      if (arrayCuentasCarta.length == 0) {
        this.message.showToast("Sin registros de carta invitación por enviar");
      } else {
        this.avanceGestionesCarta = 0;
        this.envioGestionesCarta(arrayCuentasCarta);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
   * Metodo que inicia el envio de todas las gestiones del modulo de carta invitacion
   * @returns Promise
   */
  async sendCartaInvitacion() {
    console.log("Entrando a enviar la informacion de cartas invitacion");
    try {
      let arrayCuentasCarta = [];
      let sql = 'SELECT * FROM gestionCartaInvitacion WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasCarta.push(result.rows.item(i));
      }
      console.log(arrayCuentasCarta);

      if (arrayCuentasCarta.length == 0) {
        this.message.showToast("Sin registros de carta invitación por enviar");
      } else {
        this.avanceGestionesCarta = 0;
        this.envioGestionesCarta(arrayCuentasCarta);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  avanceGestionesCarta = 0;

  /**
   * Segundo metodo para el envio de gestiones del modulo de cartas invitacion
   * @param arrayCuentasCarta 
   */
  envioGestionesCarta(arrayCuentasCarta) {
    console.log("envioGestionesCarta");
    console.log(this.avanceGestionesCarta);

    if (this.avanceGestionesCarta === arrayCuentasCarta.length) {
      this.message.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesCarta(this.avanceGestionesCarta, arrayCuentasCarta).then(resp => {
        if (resp) {
          this.avanceGestionesCarta++;
          this.envioGestionesCarta(arrayCuentasCarta);
        } else {
          this.envioGestionesCarta(arrayCuentasCarta);
        }
      })
    }
  }

  /**
   * 
   * @param i Tercer metodo para el envio de las gestiones del modulo de cartas invitacion
   * @param arrayGestionesCarta 
   * @returns 
   */
  async sendGestionesCarta(i, arrayGestionesCarta) {
    return new Promise(async (resolve, reject) => {

      console.log(arrayGestionesCarta);

      let id_plaza = arrayGestionesCarta[i].id_plaza;
      let account = arrayGestionesCarta[i].account;
      let persona_atiende = arrayGestionesCarta[i].persona_atiende;
      let id_tipo_servicio = arrayGestionesCarta[i].id_tipo_servicio;
      let numero_niveles = arrayGestionesCarta[i].numero_niveles;
      let color_fachada = arrayGestionesCarta[i].color_fachada;
      let color_puerta = arrayGestionesCarta[i].color_puerta;
      let referencia = arrayGestionesCarta[i].referencia;
      let id_tipo_predio = arrayGestionesCarta[i].tipo_predio;
      let entre_calle1 = arrayGestionesCarta[i].entre_calle1;
      let entre_calle2 = arrayGestionesCarta[i].entre_calle2;
      let observaciones = arrayGestionesCarta[i].observaciones;
      let idAspUser = arrayGestionesCarta[i].idAspUser;
      let idTarea = arrayGestionesCarta[i].id_tarea;
      let fechaCaptura = arrayGestionesCarta[i].fecha_captura;
      let latitud = arrayGestionesCarta[i].latitud;
      let longitud = arrayGestionesCarta[i].longitud;
      let idServicioPaza = arrayGestionesCarta[i].id_servicio_plaza;
      let id = arrayGestionesCarta[i].id;

      let sql = `${id_plaza},'${account}','${persona_atiende}',${id_tipo_servicio},${numero_niveles},'${color_fachada}','${color_puerta}','${referencia}',${id_tipo_predio},'${entre_calle1}','${entre_calle2}','${observaciones}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPaza} `
      console.log(sql);
      await this.enviarSQLCartaInvitacion(sql, id)
      resolve('Execute Query successfully');

    })
  }

  /**
   * Cuarto y ultimo metodo para el envio gestiones del modulo de cartas invitacion
   * @param query 
   * @param id 
   * @returns Promise
   */
  enviarSQLCartaInvitacion(query, id) {
    return new Promise(resolve => {

      console.log("Enviando carta invitacion...");
      console.log(this.apiRegistroCartaInvitacion + " " + query);
      this.http.post(this.apiRegistroCartaInvitacion + " " + query, null).subscribe(async data => {
        await this.actualizarIdCartaInvitacion(id);
        console.log(data);
        resolve(data);
      }, err => {
        this.message.showAlert(
          "No se pudo enviar la información, verifica tu red " + err
        );
        this.loadingCtrl.dismiss();
        console.log(err);
      }
      )
    })
  }

  /**
   * Metodo que inica el envio de gestiones del modulo de legal del servicio correspondiente
   * @param idServicioPlaza 
   * @returns Promise
   */
  async sendLegalByIdServicio(idServicioPlaza) {
    console.log("Entrando a enviar la informacion legal del servicio " + idServicioPlaza);
    try {
      let arrayCuentasLegal = [];
      let sql = 'SELECT * FROM gestionLegal WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [idServicioPlaza]);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasLegal.push(result.rows.item(i));
      }
      console.log(arrayCuentasLegal);

      if (arrayCuentasLegal.length == 0) {
        this.message.showToast("Sin registros legales para enviar");
      } else {
        this.avanceGestionesLegal = 0;
        this.envioGestionesLegal(arrayCuentasLegal);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * 
   * @returns Metodo que inicia el envio de todas las gestiones del modulo de gestion legal
   */
  async sendLegal() {
    console.log("Entrando a enviar la informacion de legal");
    try {
      let arrayCuentasLegal = [];
      let sql = 'SELECT * FROM gestionLegal WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasLegal.push(result.rows.item(i));
      }
      console.log(arrayCuentasLegal);

      if (arrayCuentasLegal.length == 0) {
        this.message.showToast("Sin registros legales para enviar");
      } else {
        this.avanceGestionesLegal = 0;
        this.envioGestionesLegal(arrayCuentasLegal);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  avanceGestionesLegal = 0


  /**
   * Segundo metodo para el envio de gestiones del modulo gestion legal
   * @param arrayGestionesLegal 
   */
  envioGestionesLegal(arrayGestionesLegal) {
    console.log("envioGestionesLegal");
    console.log(this.avanceGestionesLegal);

    if (this.avanceGestionesLegal === arrayGestionesLegal.length) {
      this.message.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesLegal(this.avanceGestionesLegal, arrayGestionesLegal).then(resp => {
        if (resp) {
          this.avanceGestionesLegal++;
          this.envioGestionesLegal(arrayGestionesLegal);
        } else {
          this.envioGestionesLegal(arrayGestionesLegal);
        }
      })
    }
  }

  /**
   * Tercer metodo para el envio de gestiones del modulo de gestion legal
   * @param i 
   * @param arrayGestionesLegal 
   * @returns Promise
   */
  sendGestionesLegal(i, arrayGestionesLegal) {
    return new Promise(async (resolve, reject) => {
      console.log(arrayGestionesLegal);

      let id_plaza = arrayGestionesLegal[i].id_plaza
      let account = arrayGestionesLegal[i].account;
      let personaTiende = arrayGestionesLegal[i].persona_atiende;
      //let numeroContacto = arrayGestionesLegal[i].numero_contacto;
      let idPuesto = arrayGestionesLegal[i].id_puesto;
      let otroPuesto = arrayGestionesLegal[i].otro_puesto;
      let idMotivoNoPago = arrayGestionesLegal[i].id_motivo_no_pago;
      let otroMotivo = arrayGestionesLegal[i].otro_motivo;
      let idTipoServicio = arrayGestionesLegal[i].id_tipo_servicio;
      let numeroNiveles = arrayGestionesLegal[i].numero_niveles;
      let colorFachada = arrayGestionesLegal[i].color_fachada;
      let colorPuerta = arrayGestionesLegal[i].color_puerta;
      let referencia = arrayGestionesLegal[i].referencia;
      let idTipoPredio = arrayGestionesLegal[i].id_tipo_predio;
      let entreCalle1 = arrayGestionesLegal[i].entre_calle1;
      let entreCalle2 = arrayGestionesLegal[i].entre_calle2;
      let observaciones = arrayGestionesLegal[i].observaciones;
      let idAspUser = arrayGestionesLegal[i].idAspUser;
      let idTarea = arrayGestionesLegal[i].id_tarea;
      let fechaCaptura = arrayGestionesLegal[i].fecha_captura;
      let latitud = arrayGestionesLegal[i].latitud; let longitud = arrayGestionesLegal[i].longitud;
      let idServicioPlaza = arrayGestionesLegal[i].id_servicio_plaza
      let id = arrayGestionesLegal[i].id;

      let sql = `${id_plaza},'${account}','${personaTiende}',${idPuesto},'${otroPuesto}',${idMotivoNoPago},'${otroMotivo}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}','${observaciones}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza} `
      console.log(sql);
      await this.enviarSQLGestionLegal(sql, id)
      resolve('Execute Query successfully');

    })
  }

  /**
   * Cuarto y ultimo metodo para el envio de gestiones del modulo de gestion legal
   * @param query 
   * @param id 
   * @returns 
   */
  enviarSQLGestionLegal(query, id) {
    return new Promise(resolve => {

      console.log("Enviando legal ...");
      console.log(this.apiRegistroLegal + " " + query);
      this.http.post(this.apiRegistroLegal + " " + query, null).subscribe(async data => {
        await this.actualizarIdLegal(id);
        console.log(data);
        resolve(data);
      }, err => {
        this.message.showAlert(
          "No se pudo enviar la información, verifica tu red " + err
        );
        this.loadingCtrl.dismiss();
        console.log(err);
      }
      )
    })
  }

  /////////////////************************************************************************************************* */

  // Metodos para el envio de servicios publicos

  enviarSQLServicios(query, id) {
    return new Promise(resolve => {

      console.log("Enviando servicios públicos");
      console.log(this.apiRegistroServiciosPublicos + " " + query);
      this.http.post(this.apiRegistroServiciosPublicos + " " + query, null).subscribe(async data => {
        await this.actualizarServiciosPublicos(id);
        console.log(data);
        resolve(data);
      }, err => {
        this.message.showAlert(
          "No se pudo enviar la información, verifica tu red " + err
        );
        this.loadingCtrl.dismiss();
        console.log(err);
      }
      )
    })
  }

  //////////////////////////////////********************************** */

  // Metodos para actualizar el campo cargado de los modulos de gestion que significara que ya se sincronizaron dichas cuentas


  /**
   * Metodo que actualiza el campo cargado a 1 de la tabla de inspeccion
   * @param id 
   * @returns Promise
   */
  actualizarIdInspeccion(id) {
    let sql = "UPDATE gestionInspeccion SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  /**
 * Metodo que actualiza el campo cargado a 1 de la tabla de inspeccion antenas
 * @param id 
 * @returns Promise
 */
  actualizarIdInspeccionAntenas(id) {
    let sql = "UPDATE gestionInspeccionAntenas SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  /**
   * Metodo que actualiza el campo cargado a 1 de la tabla carta invitacion
   * @param id 
   * @returns 
   */
  actualizarIdCartaInvitacion(id) {
    let sql = "UPDATE gestionCartaInvitacion SET cargado = 1 where id = ?"
    return this.db.executeSql(sql, [id]);
  }

  /**
 * Metodo que actualiza el campo cargado a 1 de la tabla legal
 * @param id 
 * @returns 
 */
  actualizarIdLegal(id) {
    let sql = "UPDATE gestionLegal SET cargado = 1 where id = ?"
    return this.db.executeSql(sql, [id]);
  }

  /**
   * 
   * @param id Metodo que actualiza el campo cargado a 1 de la tabla de serviciosPublicos
   * @returns 
   */
  actualizarServiciosPublicos(id) {
    let sql = "UPDATE serviciosPublicos SET cargado = 1 where id = ? ";
    return this.db.executeSql(sql, [id]);
  }

  ////////////////////************************************************************** */


  // metodos para las fotos

  async getImagesLocal() {
    let sql = "SELECT * FROM capturaFotos where cargado = 0 order by fecha desc";

    return this.db.executeSql(sql, []).then(response => {
      let arrayFotos = [];

      for (let i = 0; i < response.rows.length; i++) {
        arrayFotos.push(response.rows.item(i));
      }
      console.log(arrayFotos);
      return Promise.resolve(arrayFotos);
    }).catch(error => Promise.reject(error))
  }

  async getImagesLocalServicios() {
    let sql = "SELECT * FROM capturaFotosServicios WHERE cargado = 0 order by fecha desc";

    return this.db.executeSql(sql, []).then(response => {
      let arrayFotosServicios = [];

      for (let i = 0; i < response.rows.length; i++) {
        arrayFotosServicios.push(response.rows.item(i));
      }
      console.log(arrayFotosServicios);
      return Promise.resolve(arrayFotosServicios);
    }).catch(error => Promise.reject(error));
  }

  async uploadPhotosServicios() {
    console.log("Mandar fotos servicios");
    let arrayImagesServicios = [];
    let sql = "SELECT * FROM capturaFotosServicios where cargado = 0 limit 20"
    let response = await this.db.executeSql(sql, []);
    for (let i = 0; i < response.rows.length; i++) {
      arrayImagesServicios.push(response.rows.item(i));
    }

    console.log(arrayImagesServicios);

    if (arrayImagesServicios.length == 0) {
      this.message.showAlert("Sin fotos para sincronizar");
    } else {
      this.loading = await this.loadingCtrl.create({
        message: 'Enviando fotos servicios...',
        spinner: 'dots'
      });

      await this.loading.present();

      this.avanceImagesServicios = 0;
      this.envioFotosServicios(arrayImagesServicios);
    }
  }

  avanceImagesServicios = 0;

  envioFotosServicios(arrayImagesServicios) {
    if (this.avanceImagesServicios === arrayImagesServicios.length) {
      this.loading.dismiss();
      this.message.showAlert("Fotos enviadas con exito!!!!");
    } else {
      this.sendImageServicios(this.avanceImagesServicios, arrayImagesServicios).then(respEnvio => {
        if (respEnvio) {
          this.avanceImagesServicios++;
          this.envioFotosServicios(arrayImagesServicios);
        } else {
          this.envioFotosServicios(arrayImagesServicios);
        }
      })
    }
  }

  sendImageServicios(i, arrayImagesServicios) {
    return new Promise(async (resolve) => {
      await this.base64.encodeFile(arrayImagesServicios[i].rutaBase64).then(async (base64File: string) => {
        let aleatorio = Math.floor((Math.random() * (100 - 1)) + 1);
        let imageName = "servicio-" + aleatorio + "-" + arrayImagesServicios[i].idServicio + arrayImagesServicios[i].fecha;
        let imagen64 = base64File.split(",");
        let imagenString = imagen64[1];
        // imagen string es el que manda al s3 y el nombre que en este caso es el imageName
        let idServicio = arrayImagesServicios[i].idServicio;
        if (idServicio == null) { idServicio = 0; }
        this.uploadPhotoS3V1Servicios(arrayImagesServicios[i].idAspUser, idServicio, arrayImagesServicios[i].fecha, arrayImagesServicios[i].tipo, imagenString, imageName, arrayImagesServicios[i].id, arrayImagesServicios[i].rutaBase64, i + 1, arrayImagesServicios[i].id_plaza).then(respImagen => {
          resolve(respImagen);
        });
      },
        err => {
          console.log(err);
          resolve(false);
        }
      );
    });
  }


  async uploadPhotos() {
    let arrayImages = [];
    let sql = "SELECT * FROM capturaFotos where cargado = 0 limit 20";
    let response = await this.db.executeSql(sql, []);

    for (let i = 0; i < response.rows.length; i++) {
      arrayImages.push(response.rows.item(i));
    }

    if (arrayImages.length == 0) {
      this.message.showAlert("Sin fotos para sincronizar");
    } else {
      this.loading = await this.loadingCtrl.create({
        message: 'Enviando fotos...',
        spinner: 'dots'
      });

      await this.loading.present();

      this.avanceImages = 0;
      this.envioFotos(arrayImages);
    }

  }

  avanceImages = 0;

  envioFotos(arrayImages) {
    if (this.avanceImages === arrayImages.length) {
      this.loading.dismiss();
      this.message.showAlert("Fotos enviadas con exito!!!!");
    } else {
      this.sendImage(this.avanceImages, arrayImages).then(respEnvio => {
        if (respEnvio) {
          this.avanceImages++;
          this.envioFotos(arrayImages);
        } else {
          this.envioFotos(arrayImages);
        }
      })
    }
  }

  async sendImage(i, arrayImages) {
    return new Promise(async (resolve) => {
      await this.base64.encodeFile(arrayImages[i].rutaBase64).then(async (base64File: string) => {
        let imageName = arrayImages[i].cuenta + arrayImages[i].fecha;
        let imagen64 = base64File.split(",");
        let imagenString = imagen64[1];
        // imagen string es el que manda al s3 y el nombre que en este caso es el imageName
        let idTarea = arrayImages[i].idTarea;
        if (idTarea == null) { idTarea = 0; }
        this.uploadPhotoS3V1(arrayImages[i].cuenta, arrayImages[i].idAspUser, idTarea, arrayImages[i].fecha, arrayImages[i].tipo, imagenString, imageName, arrayImages[i].id, arrayImages[i].rutaBase64, i + 1, arrayImages[i].id_plaza, arrayImages[i].id_servicio_plaza).then(respImagen => {
          resolve(respImagen);
        });
      },
        err => {
          console.log(err);
          resolve(false);
        }
      );
    });
  }


  async uploadPhotoS3V1(cuenta, idAspuser, idTarea, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza, id_plaza_servicio) {
    return new Promise(async (resolve) => {
      try {
        this.s3Service.uploadS3(base64File, imageName).then(async uploadResponse => {
          if (uploadResponse) {
            let UrlOriginal: any;
            UrlOriginal = this.s3Service.getURLPresignaded(imageName);
            console.log('La url::::::')
            console.log(UrlOriginal)
            await this.saveSqlServer(cuenta, idAspuser, imageName, idTarea, fecha, tipo, id, UrlOriginal, ruta, cont, id_plaza, id_plaza_servicio);
            resolve(true);
          }
          else {
            this.uploadPhotoS3V1(cuenta, idAspuser, idTarea, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza, id_plaza_servicio);
          }
        });
      } catch (err_1) {
        alert(err_1)
        console.log(err_1);
        resolve(false);
      }
    });
  }

  async uploadPhotoS3V1Servicios(idAspuser, idServicio, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza) {
    return new Promise(async (resolve) => {
      try {
        this.s3Service.uploadS3(base64File, imageName).then(async uploadResponse => {
          if (uploadResponse) {
            let UrlOriginal: any;
            UrlOriginal = this.s3Service.getURLPresignaded(imageName);
            console.log('La url::::::')
            console.log(UrlOriginal)
            await this.saveSqlServerServicios(idAspuser, imageName, idServicio, fecha, tipo, id, UrlOriginal, ruta, cont, id_plaza);
            resolve(true);
          }
          else {
            this.uploadPhotoS3V1Servicios(idAspuser, idServicio, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza);
          }
        });
      } catch (err_1) {
        alert(err_1)
        console.log(err_1);
        resolve(false);
      }
    });
  }



  async saveSqlServer(cuenta, idAspuser, imageName, idTarea, fecha, tipo, id, url, ruta, cont, id_plaza, id_plaza_servicio) {
    console.log("id_plaza " + id_plaza);
    let a = url.split("&");
    let b = a[0];
    let b1 = b.split(":");
    let b2 = b1[0];
    let b3 = b1[1];
    let c = a[1];
    let d = a[2];
    console.log('La url partida')
    console.log(b2, b3, c, d)
    let idPlaza = id_plaza
    let strinSql0 = `'${cuenta}','${idAspuser}','${imageName}',${idTarea},'${fecha}','${tipo}',${id_plaza_servicio},${idPlaza},'${b2}','${b3}','${c}','${d}'`;

    return new Promise(resolve => {
      // cambiar api
      console.log(this.apiRegistroFotos + " " + strinSql0);
      this.http.post(this.apiRegistroFotos + " " + strinSql0, null).subscribe(
        async data => {
          this.message.showToast(data[0].mensaje + ' ' + cont)
          await this.updateLoadedItem(id);
          console.log('registroCargado al sql')
          //   await this.deletePhotoFile(ruta);
          //  console.log('se borro la foto')
          resolve(data);
        },
        err => {
          this.message.showAlert(
            "Existe un error con la red, verifica y vuelve a intentar :( " + err
          );
          console.log(err);
        }
      );
    });
  }


  async saveSqlServerServicios(idAspuser, imageName, idServicio, fecha, tipo, id, url, ruta, cont, id_plaza) {
    console.log("id_plaza " + id_plaza);
    let a = url.split("&");
    let b = a[0];
    let b1 = b.split(":");
    let b2 = b1[0];
    let b3 = b1[1];
    let c = a[1];
    let d = a[2];
    console.log('La url partida')
    console.log(b2, b3, c, d)
    let idPlaza = id_plaza
    let strinSql0 = `'${idAspuser}','${imageName}',${idServicio},'${fecha}','${tipo}',${idPlaza},'${b2}','${b3}','${c}','${d}'`;

    return new Promise(resolve => {
      // cambiar api
      this.http.post(this.apiRegistroFotosServicios + " " + strinSql0, null).subscribe(
        async data => {
          this.message.showToast(data[0].mensaje + ' ' + cont)
          await this.updateLoadedItemServicios(id);
          console.log('registroCargado al sql')
          //   await this.deletePhotoFile(ruta);
          //  console.log('se borro la foto')
          resolve(data);
        },
        err => {
          this.message.showAlert(
            "Existe un error con la red, verifica y vuelve a intentar :( " + err
          );
          console.log(err);
        }
      );
    });
  }


  updateLoadedItem(id) {
    let sql = "UPDATE capturaFotos SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateLoadedItemServicios(id) {
    let sql = "UPDATE capturaFotosServicios SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  async uploadPhoto(id) {
    return new Promise(async (resolve) => {
      let arrayImages = [];
      let sql = "SELECT * FROM capturaFotos where cargado = 0 and id = ?";
      let response = await this.db.executeSql(sql, [id]);
      for (let i = 0; i < response.rows.length; i++) {
        arrayImages.push(response.rows.item(i));
      }
      await this.base64.encodeFile(arrayImages[0].rutaBase64).then(async (base64File: string) => {
        let imageName = arrayImages[0].cuenta + arrayImages[0].fecha;
        let imagen64 = base64File.split(",");
        let imagenString = imagen64[1];
        let idTarea = arrayImages[0].idTarea;
        if (idTarea == null) { idTarea = 0; }
        // await this.uploadPhotoS3V1(item.cuenta,item.idAspUser, idTarea, item.fecha,item.tipo, imagenString,imageName, item.id,item.rutaBase64);
        try {
          this.s3Service.uploadS3(imagenString, imageName).then(async uploadResponse => {
            if (uploadResponse) {
              let UrlOriginal: any;
              UrlOriginal = this.s3Service.getURLPresignaded(imageName);
              console.log('La url::::::')
              console.log(UrlOriginal)
              await this.saveSqlServer(arrayImages[0].cuenta, arrayImages[0].idAspUser, imageName, idTarea, arrayImages[0].fecha, arrayImages[0].tipo, arrayImages[0].id, UrlOriginal, arrayImages[0].ruta, 1, arrayImages[0].id_plaza, arrayImages[0].id_servicio_plaza);
              resolve(true);
            }
            else {
              this.uploadPhoto(id);
            }
          });

        } catch (err_1) {
          alert(err_1)
          console.log(err_1);
          resolve(false);
        }


      },
        err => {
          alert(err)
          console.log(err);
        }
      );

    });
  }


  // obtenerNombrePlazaId(id_plaza) {
  //   console.log('Traer el nombre de la plaza ' + id_plaza);
  //   let sql = "SELECT * FROM serviciosPlazaUser where id_plaza = ?"

  //   return this.db.executeSql(sql, [id_plaza]).then(response => {
  //     let data = [];
  //     for (let index = 0; index < response.rows.length; index++) {
  //       data.push(response.rows.item(index));
  //     }
  //     console.log(data);
  //     return Promise.resolve(data);
  //   }).catch(error => Promise.reject(error));
  // }


  //////////////////////////////******************************************* */

  // Metodos para el registro del recorrido de los gestores

  saveLocation(lat, lng, idAspuser, fecha) {

    let sql = "INSERT INTO recorrido (latitud,longitud,idAspUser,fechaCaptura) values(?,?,?,?)";
    return this.db.executeSql(sql, [lat, lng, idAspuser, fecha]);

  }

  async guardarSQl(lat, lng, idasp, fecha) {

    let sqlString = `${idasp},${lat},${lng},'${fecha}'`;

    this.recorridoSync(sqlString, 0);

    return Promise.resolve("Executed query");

  }

  async recorridoSync(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiRegistroRecorrido + " " + query, null).subscribe(
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

  updateRecorridoSync(id) {
    let sql = "UPDATE recorrido SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }


  ////////////////////////********************************************************************* */

  /**
   * Metodo para obtener las cuentas ordenadas de menor a mayor con base en la distancia de la ubicacion actual
   * @param idAspUser 
   * @param idPlaza 
   * @param idPlazaServicio 
   * @param latitud 
   * @param longitud 
   * @returns Promise
   */
  obtenerCuentasDistancias(idAspUser, idPlaza, idPlazaServicio, latitud, longitud) {
    console.log("latitud rest ", latitud);
    console.log("longitud rest", longitud);
    try {
      return new Promise(resolve => {
        console.log(this.apiObtenerCuentasDistancia + " '" + idAspUser + "', " + idPlaza + ", " + idPlazaServicio + ", " + latitud + ", " + longitud);
        this.http.post(this.apiObtenerCuentasDistancia + " '" + idAspUser + "', " + idPlaza + ", " + idPlazaServicio + ", " + latitud + ", " + longitud, null)
          .subscribe(data => {
            resolve(data);
          }, err => console.log(err));
      })
    } catch {
      console.log("No se pudo obtener la informaciòn");
    }
  }

  /**
   * Metodo para obtener los empleados que son los que se veran en la seccion del directorio
   * @returns Promise
   */
  obtenerInformacionEmpleados() {
    try {
      return new Promise((resolve, reject) => {
        this.http.get(this.apiObtenerEmpleados).subscribe(data => {
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
        this.http.get(this.apiObtenerFotosHistoricas + " " + id_plaza + " , " + "'" + account + "'").subscribe(data => {
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
      console.log(this.apiRegistroAsistencia + " " + parametros)
      this.http.post(this.apiRegistroAsistencia + " " + parametros, null).subscribe( data => {
        resolve(data)
      }, err => {
        this.message.showAlert("No se realizo el registro, verifique con sistemas");
      }
      )
    })

  }


}

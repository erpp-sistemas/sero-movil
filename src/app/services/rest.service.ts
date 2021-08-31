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

  // api para obtener las cuentas del agua
  apiObtenerDatos = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_cuentas";
  apiObtenerDatosAgua = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_cuentas_agua"
  apiObtenerDatosPredio = "http://201.163.165.20/seroMovil.aspx?query=sp_obtener_cuentas_predio"
  apiObtenerPlazasUsuario = "http://172.24.24.24/andro/seroMovil.aspx?query=sp_obtener_plazas_usuario";
  apiObtenerInspectoresAgua = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_NombresGestoresInspeccion";
  apiRegistroInspeccionAgua = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_inspeccion_agua";
  apiRegistroInspeccionPredio = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_inspeccion_predio";
  apiRegistroCartaInvitacion = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_carta_invitacion"
  apiRegistroServiciosPublicos = "http://201.163.165.20/seroMovil.aspx?query=sp_registro_servicios_publicos"
  apiRegistroFotos = "http://201.163.165.20/seroMovil.aspx?query=sp_savePhotosSero";
  apiRegistroFotosServicios = "http://201.163.165.20/seroMovil.aspx?query=sp_savePhotosSeroServicios";
  apiObtenerDatosPozos = "";

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
   * Metodo que inserta los datos obtenidos del sql en la tabla serviciosPlazaUser
   * @param data 
   * @returns db execute
   */
  insertarServiciosSQL(data) {
    console.log("Tratando de insertar los servicios obtenidos");
    let sql = 'INSERT INTO serviciosPlazaUser (nombre, ape_pat, ape_mat, plaza, servicio, id_plaza, id_servicio, icono_app_movil) VALUES (?,?,?,?,?,?,?,?)'
    return this.db.executeSql(sql, [
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno,
      data.plaza,
      data.servicio,
      data.id_plaza,
      data.id_servicio,
      data.icono_app_movil
    ]);
  }

  async mostrarServicios(idPlaza) {
    console.log('Traer los servicios de la plaza ' + idPlaza);
    let sql = "SELECT * FROM serviciosPlazaUser where id_plaza = ?"

    return this.db.executeSql(sql, [idPlaza]).then(response => {
      let servicios = [];
      for (let index = 0; index < response.rows.length; index++) {
        servicios.push(response.rows.item(index));
      }
      console.log(servicios);
      return Promise.resolve(servicios);
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
    console.log("idAspUser: ", idAspUser);
    console.log("idPlaza: ", idPlaza);
    console.log("tipo:", idPlazaServicio);
    try {
      return new Promise(resolve => {

        this.http.post(this.apiObtenerDatos + " '" + idAspUser + "', " + idPlaza + ", " + idPlazaServicio, null)
          .subscribe(data => {
            console.log("Datos traidos del SQL");
            console.log(data);
            resolve(data);
          }, err => console.log(err));
      })
    } catch {
      console.log("No se pudo obtener la informaciòn");
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
      console.log(plazas);
      return Promise.resolve(plazas);
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
    let sql = `SELECT cuenta, propietario, calle || ' numero_ext: ' || num_ext || ' numero_int: ' || num_int || ' ' || colonia as direccion, total, latitud, longitud, gestionada FROM sero_principal WHERE id_plaza = ? and id_servicio_plaza = ? and propietario NOT NULL`;

    return this.db.executeSql(sql, [id_plaza, idServicioPlaza]).then(response => {
      let arrayCuentas = [];

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
    } catch( error ) {
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
  getDataVisitPositionPozos() {
    let sql = 'SELECT folio, numero_titulo, titular, representante_legal, rfc, domicilio, municipio, uso_agua, vol_ext_anu, vol_con_anu, profundidad, latitud, longitud FROM pozos_conagua';
    return this.db.executeSql(sql, []).then(response => {
      console.log(response);
      let posiciones = [];
      for (let index = 0; index < response.rows.length; index++) {
        posiciones.push(response.rows.item(index));
      }

      return Promise.resolve(posiciones)
    }).catch(error => Promise.reject(error));
  }

  /**
   * Metodo que obtiene las cuentas de la tabla agua para cargarlas al mapa
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


  saveImage(id_plaza, nombrePlaza, image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo, idServicioPlaza) {
    let sql =
      "INSERT INTO capturaFotos(id_plaza,nombre_plaza, imagenLocal,cuenta,fecha,rutaBase64,idAspuser,idTarea,tipo, idServicio) values(?,?,?,?,?,?,?,?,?,?)";
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

  getInfoAccountAgua(account) {
    let sql = "SELECT * from agua where cuenta = ?";
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

  getInfoAccountPredio(account) {
    let sql = "SELECT * from predio where cuenta = ?";
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
    let sql = 'INSERT INTO serviciosPublicos ( id_plaza, nombre_plaza, idAspUser, idServicio, idServicio2, observacion, fechaCaptura, latitud, longitud)' +
      'VALUES (?,?,?,?,?,?,?,?,?)';

    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.idAspUser,
      data.idServicio,
      data.idServicio2,
      data.observacion,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
    ]);
  }

  /**
   * Metodo que inserta la informacion capturada en carta invitacion
   * @param data 
   * @returns Promise (insert into gestionCartaINvitacion) 
   */
  gestionCartaInvitacion(data) {
    this.updateAccountGestionada(data.id);

    let sql = "INSERT INTO gestionCartaInvitacion(id_plaza, nombre_plaza, account, persona_atiende, numero_contacto, id_motivo_no_pago, id_trabajo_admin, id_gasto_impuesto, id_tipo_servicio, numero_niveles, color_fachada, color_puerta, referencia, tipo_predio, entre_calle1, entre_calle2, observaciones, idAspUser, id_tarea, fecha_captura, latitud, longitud, idServicio) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.account,
      data.persona_atiende,
      data.numero_contacto,
      data.id_motivo_no_pago,
      data.id_trabajo_actual,
      data.id_gasto_impuesto,
      data.id_tipo_servicio,
      data.numero_niveles,
      data.color_fachada,
      data.color_puerta,
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
      data.idServicio
    ])
  }


  /**
   * Metodo que inserta en gestionInspeccion la informacion capturada
   * @param data 
   * @returns Promise (insert gestionInspeccion)
   */
  gestionInspeccionAgua(data) {

    this.updateAccountGestionada(data.id);

    let sql = 'INSERT INTO gestionInspeccion (id_plaza, nombre_plaza, account, personaAtiende, numeroContacto, puesto, idMotivoNoPago, otroMotivo, idTipoServicio, numeroNiveles, colorFachada, colorPuerta, referencia, idTipoPredio, entreCalle1, entreCalle2, hallazgoNinguna, hallazgoMedidorDescompuesto, hallazgoDiferenciaDiametro, hallazgoTomaClandestina, hallazgoDerivacionClandestina, hallazgoDrenajeClandestino, hallazgoCambioGiro, hallazgoFaltaDocumentacion, idAspUser, inspector2, inspector3, inspector4, observacion, idTarea, fechaCaptura, latitud, longitud, idServicio)' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    return this.db.executeSql(sql, [
      data.id_plaza,
      data.nombrePlaza,
      data.account,
      data.personaAtiende,
      data.numeroContacto,
      data.puesto,
      data.idMotivoNoPago,
      data.otroMotivo,
      data.idTipoServicio,
      data.numeroNiveles,
      data.colorFachada,
      data.colorPuerta,
      data.referencia,
      data.idTipoPredio,
      data.entreCalle1,
      data.entrecalle2,
      data.hallazgoNinguna,
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
      data.idServicio
    ]);
  }


  /**
   * 
   * @param id Metodo que actualiza el campo gestionada en 1 de la tabla agua
   * @returns executeSql
   */
  updateAccountGestionada(id) {
    let sql = 'UPDATE agua SET gestionada = 1 WHERE id = ?';
    return this.db.executeSql(sql, [id]);
  }

  /**
   * Metodo que actualiza el campo gestionada de la tabla predio 
   * @param id 
   * @returns executeSql 
   */
  updateAccountGestionadaPredio(id) {
    let sql = 'UPDATE predio SET gestionada = 1 WHERE id = ?';
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

  /**
   * Metodo que trae todas las cuentas gestionadas con el campo cargado = 0 de las tablas de inspeccion, carta y demas de agua
   * @returns Promise con las cuentas gestionadas de agua
   */
  getAccountsGestionesAgua() {
    let sql = `SELECT account, fechaCaptura, 'Inspección agua' as rol, nombre_plaza FROM gestionInspeccion WHERE cargado = 0
    UNION ALL SELECT account, fecha_captura, 'Carta invitación' as rol, nombre_plaza FROM gestionCartaInvitacion WHERE cargado = 0`;
    return this.db.executeSql(sql, []).then(response => {
      let accounts = [];
      for (let i = 0; i < response.rows.length; i++) {
        accounts.push(response.rows.item(i));
      }
      return Promise.resolve(accounts);
    }).catch(error => Promise.reject(error));
  }

  /**
   * Metodo que trae las cuentas gestionadas con el campo cargado = 0de las tablas de inspeccion, carta y demas de predio
   * @returns Promise con las cuentas gestionadas de predio
   */
  getAccountsGestionesPredio() {
    let sql = `SELECT account, fechaCaptura, 'Inspección agua' as rol, nombre_plaza FROM gestionInspeccion WHERE cargado = 0
    UNION ALL SELECT account, fecha_captura, 'Inspección predio' as rol, nombre_plaza FROM gestionCartaInvitacion WHERE cargado = 0`;
    return this.db.executeSql(sql, []).then(response => {
      let accounts = [];
      for (let i = 0; i < response.rows.length; i++) {
        accounts.push(response.rows.item(i));
      }
      return Promise.resolve(accounts);
    }).catch(error => Promise.reject(error));
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
      let idServicio2 = arrayServicios[i].idServicio2;
      let observacion = arrayServicios[i].observacion;
      let fechaCaptura = arrayServicios[i].fechaCaptura;
      let latitud = arrayServicios[i].latitud;
      let longitud = arrayServicios[i].longitud;
      let id = arrayServicios[i].id

      let sql = `${id_plaza},'${idAspUser}',${idServicio},${idServicio2},'${observacion}','${fechaCaptura}',${latitud},${longitud} `
      console.log(sql);
      await this.enviarSQLServicios(sql, id)
      resolve('Execute Query successfully');

    })
  }

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

  async sendGestionesCarta(i, arrayGestionesCarta) {
    return new Promise(async (resolve, reject) => {

      console.log(arrayGestionesCarta);

      let id_plaza = arrayGestionesCarta[i].id_plaza;
      let account = arrayGestionesCarta[i].account;
      let persona_atiende = arrayGestionesCarta[i].persona_atiende;
      let numero_contacto = arrayGestionesCarta[i].numero_contacto;
      let id_motivo_no_pago = arrayGestionesCarta[i].id_motivo_no_pago;
      let id_trabajo_actual = arrayGestionesCarta[i].id_trabajo_admin;
      let id_gasto_impuesto = arrayGestionesCarta[i].id_gasto_impuesto;
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
      let id = arrayGestionesCarta[i].id;

      let sql = `${id_plaza},'${account}','${persona_atiende}','${numero_contacto}',${id_motivo_no_pago},${id_trabajo_actual},${id_gasto_impuesto},${id_tipo_servicio},${numero_niveles},'${color_fachada}','${color_puerta}','${referencia}',${id_tipo_predio},'${entre_calle1}','${entre_calle2}','${observaciones}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud} `
      console.log("IdMotivoNoPago " + id_motivo_no_pago);
      console.log("IdTipoPredio " + id_tipo_predio);
      console.log(sql);
      await this.enviarSQLCartaInvitacion(sql, id)
      resolve('Execute Query successfully');

    })
  }


  /**
   * Metodo que inicia el envio de los registros de inspeccion
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
      let numeroContacto = arrayGestionesInspeccionAgua[i].numeroContacto;
      let puesto = arrayGestionesInspeccionAgua[i].puesto;
      let idMotivoNoPago = arrayGestionesInspeccionAgua[i].idMotivoNoPago;
      let otroMotivo = arrayGestionesInspeccionAgua[i].otroMotivo;
      let idTipoServicio = arrayGestionesInspeccionAgua[i].idTipoServicio;
      let numeroNiveles = arrayGestionesInspeccionAgua[i].numeroNiveles;
      let colorFachada = arrayGestionesInspeccionAgua[i].colorFachada;
      let colorPuerta = arrayGestionesInspeccionAgua[i].colorPuerta;
      let referencia = arrayGestionesInspeccionAgua[i].referencia;
      let idTipoPredio = arrayGestionesInspeccionAgua[i].idTipoPredio;
      let entreCalle1 = arrayGestionesInspeccionAgua[i].entreCalle1;
      let entreCalle2 = arrayGestionesInspeccionAgua[i].entreCalle2;
      let hallazgoNinguna = arrayGestionesInspeccionAgua[i].hallazgoNinguna;
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
      let id = arrayGestionesInspeccionAgua[i].id;

      let sql = `${id_plaza},'${account}','${personaAtiende}','${numeroContacto}','${puesto}',${idMotivoNoPago},'${otroMotivo}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}',${hallazgoNinguna},${hallazgoMedidorDescompuesto},${hallazgoDiferenciaDiametro},${hallazgoTomaClandestina},${hallazgoDerivacionClandestina},${hallazgoDrenajeClandestino},${hallazgoCambioGiro},${hallazgoFaltaDocumentacion},'${idAspUser}','${inspector2}','${inspector3}','${inspector4}','${observacion}',${idTarea},'${fechaCaptura}',${latitud},${longitud}`;
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
      console.log(this.apiRegistroInspeccionAgua + " " + query)
      this.http.post(this.apiRegistroInspeccionAgua + " " + query, null).subscribe(
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


  /**
   * Metodo que actualiza el campo cargado a 1 de la tabla de inspeccion
   * @param id 
   * @returns Promise
   */
  actualizarIdInspeccion(id) {
    let sql = "UPDATE gestionInspeccion SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  actualizarIdCartaInvitacion(id) {
    let sql = "UPDATE gestionCartaInvitacion SET cargado = 1 where id = ?"
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
    let arrayImagesServicios = [];
    let sql = "SELECT * FROM capturaFotosServicios where cargado = limit 20"
    let response = await this.db.executeSql(sql, []);
    for (let i = 0; i > response.rows.length; i++) {
      arrayImagesServicios.push(response.rows.item(i));
    }

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
    if (this.avanceImages === arrayImagesServicios.length) {
      this.loading.dismiss();
      this.message.showAlert("Fotos enviadas con exito!!!!");
    } else {
      this.sendImage(this.avanceImages, arrayImagesServicios).then(respEnvio => {
        if (respEnvio) {
          this.avanceImagesServicios++;
          this.envioFotos(arrayImagesServicios);
        } else {
          this.envioFotos(arrayImagesServicios);
        }
      })
    }
  }

  sendImageServicios(i, arrayImagesServicios) {
    return new Promise(async (resolve) => {
      await this.base64.encodeFile(arrayImagesServicios[i].rutaBase64).then(async (base64File: string) => {
        let aleatorio = Math.floor((Math.random() * (100 - 1)) + 1);
        let imageName = "servicio-" + aleatorio + "-" + arrayImagesServicios[i].idServio + arrayImagesServicios[i].fecha;
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
        this.uploadPhotoS3V1(arrayImages[i].cuenta, arrayImages[i].idAspUser, idTarea, arrayImages[i].fecha, arrayImages[i].tipo, imagenString, imageName, arrayImages[i].id, arrayImages[i].rutaBase64, i + 1, arrayImages[i].id_plaza).then(respImagen => {
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


  async uploadPhotoS3V1(cuenta, idAspuser, idTarea, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza) {
    return new Promise(async (resolve) => {
      try {
        this.s3Service.uploadS3(base64File, imageName).then(async uploadResponse => {
          if (uploadResponse) {
            let UrlOriginal: any;
            UrlOriginal = this.s3Service.getURLPresignaded(imageName);
            console.log('La url::::::')
            console.log(UrlOriginal)
            await this.saveSqlServer(cuenta, idAspuser, imageName, idTarea, fecha, tipo, id, UrlOriginal, ruta, cont, id_plaza);
            resolve(true);
          }
          else {
            this.uploadPhotoS3V1(cuenta, idAspuser, idTarea, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza);
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



  async saveSqlServer(cuenta, idAspuser, imageName, idTarea, fecha, tipo, id, url, ruta, cont, id_plaza) {
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
    let strinSql0 = `'${cuenta}','${idAspuser}','${imageName}',${idTarea},'${fecha}','${tipo}',${idPlaza},'${b2}','${b3}','${c}','${d}'`;

    return new Promise(resolve => {
      // cambiar api
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


  updateLoadedItem(id) {
    let sql = "UPDATE capturaFotos SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }


  obtenerPlazaId(id_plaza) {
    console.log('Traer el nombre de la plaza ' + id_plaza);
    let sql = "SELECT * FROM serviciosPlazaUser where id_plaza = ?"

    return this.db.executeSql(sql, [id_plaza]).then(response => {
      let data = [];
      for (let index = 0; index < response.rows.length; index++) {
        data.push(response.rows.item(index));
      }
      console.log(data);
      return Promise.resolve(data);
    }).catch(error => Promise.reject(error));
  }

}

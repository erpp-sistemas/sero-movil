import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLiteObject } from "@ionic-native/sqlite/ngx";
import { File } from "@ionic-native/file/ngx";
import { MessagesService } from './messages.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  db: SQLiteObject = null;


  apiObtenerDatosMovil = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_obtenerCuentasMovil";
  apiObtenerDatosPozos = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_Pozos";
  apiObtenerInspectoresAgua = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_NombresGestoresInspeccion"

  constructor(
    private http: HttpClient,
    private file: File,
    private message: MessagesService,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) { }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  deleteTableAgua() {
    let sqlDelete = "DELETE from agua";
    this.db.executeSql(sqlDelete, []);
  }


  deleteTablePozos() {
    let sqlDeletePozos = "DELETE FROM pozos_conagua"
    this.db.executeSql(sqlDeletePozos, []);
  }

  deleteTablePredio() {
    let sqlDeletePredio = 'DELETE FROM predio'
  }


  /**
   * Metodo que trae la informacion del sql del stored procedure ObtenerDatosMovil de agua
   * @param idAspUser 
   * @param idPlaza 
   * @returns promise data
   */
  obtenerDatosSqlAgua(idAspUser, idPlaza) {
    // lanzar el api para obtener los datos del sql
    try {
      return new Promise(resolve => {

        this.http.post(this.apiObtenerDatosMovil + " '" + idAspUser + "', " + idPlaza, null)
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
   * Metodo que trae la informacion del stored procedure ObtenerDatosMovil de predio
   * @param idAspUser 
   * @param idPlaza 
   * @returns Promise
   */
  obtenerDatosSqlPredio(idAspUser, idPlaza) {
    // lanzar el api para obtener los datos del sql
    try {
      return new Promise(resolve => {

        this.http.post(this.apiObtenerDatosMovil + " '" + idAspUser + "', " + idPlaza, null)
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
   * Metodo que trae la informacion del stored sp_Pozos
   * @param idPlaza 
   * @returns 
   */
  obtenerDatosPozos(idPlaza) {
    // lanzar el api para obtener los datos del sql
    try {
      return new Promise(resolve => {

        this.http.post(this.apiObtenerDatosPozos + ' ' + idPlaza, null)
          .subscribe(data => {
            console.log("Datos traidos del SQL para pozos");
            console.log(data);
            resolve(data);
          }, err => console.log(err));
      })
    } catch {
      console.log("No se pudo obtener la informaciòn");
    }
  }

  /**
   * Metodo que inserta a la tabla agua la informaciòn que trajo del SQL
   * @param data 
   * @returns Ejecuciòn del insert into agua
   */
  guardarInfoSQLAgua(data) {

    let sql = `INSERT INTO agua(cuenta, adeudo, SupTerrenoH, SupConstruccionH, ValorTerrenoH, ValorConstruccionH, ValorCatastralH, tareaAsignada, ultimo_pago, nombre_propietario, telefono_propietario, celular_propietario, correo_electronico_propietario, calle_predio, num_interior_predio, num_exterior_predio, cp_predio, colonia_predio, entre_calle1_predio, entre_calle2_predio, manzana_predio, lote_predio, poblacion_predio, calle_notificacion, num_interior_notificacion, num_exterior_notificacion, cp_notificacion, colonia_notificacion, entre_calle1_notificacion, entre_calle2_notificacion, manzana_notificacion, lote_notificacion, referencia_predio, referencia_notificacion, id_tarea, latitud, longitud, tipoServicio, clave_catastral, numero_medidor, tipo_servicio) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

    return this.db.executeSql(sql, [
      data.cuenta,
      data.adeudo,
      data.SupTerrenoH,
      data.SupConstruccionH,
      data.ValorTerrenoH,
      data.ValorConstruccionH,
      data.ValorCatastralH,
      data.tareaAsignada,
      data.ultimo_pago,
      data.nombre_propietario,
      data.telefono_propietario,
      data.celular_propietario,
      data.correo_electronico_propietario,
      data.calle_predio,
      data.num_interior_predio,
      data.num_exterior_predio,
      data.cp_predio,
      data.colonia_predio,
      data.entre_calle1_predio,
      data.entre_calle2_predio,
      data.manzana_predio,
      data.lote_predio,
      data.poblacion_predio,
      data.calle_notificacion,
      data.num_interior_notificacion,
      data.num_exterior_notificacion,
      data.cp_notificacion,
      data.colonia_notificacion,
      data.entre_calle1_notificacion,
      data.entre_calle2_notificacion,
      data.manzana_notificacion,
      data.lote_notificacion,
      data.referencia_predio,
      data.referencia_notificacion,
      data.id_tarea,
      data.latitud,
      data.longitud,
      data.tipoServicio,
      data.clave_catastral,
      data.numMedidor,
      data.tipoServicio,
    ])

  }

  guardarInfoSQLPredio(data) {
    let sql = `INSERT INTO predio (cuenta, adeudo, SupTerrenoH, SupConstruccionH, ValorTerrenoH, ValorConstruccionH, ValorCatastralH, tareaAsignada, ultimo_pago, nombre_propietario, telefono_propietario, celular_propietario, correo_electronico_propietario, calle_predio, num_interior_predio, num_exterior_predio, cp_predio, colonia_predio, entre_calle1_predio, entre_calle2_predio, manzana_predio, lote_predio, poblacion_predio, calle_notificacion, num_interior_notificacion, num_exterior_notificacion, cp_notificacion, colonia_notificacion, entre_calle1_notificacion, entre_calle2_notificacion, manzana_notificacion, lote_notificacion, referencia_predio, referencia_notificacion, id_tarea, latitud, longitud, tipoServicio, clave_catastral, numero_medidor, tipo_servicio) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

    return this.db.executeSql(sql, [
      data.cuenta,
      data.adeudo,
      data.SupTerrenoH,
      data.SupConstruccionH,
      data.ValorTerrenoH,
      data.ValorConstruccionH,
      data.ValorCatastralH,
      data.tareaAsignada,
      data.ultimo_pago,
      data.nombre_propietario,
      data.telefono_propietario,
      data.celular_propietario,
      data.correo_electronico_propietario,
      data.calle_predio,
      data.num_interior_predio,
      data.num_exterior_predio,
      data.cp_predio,
      data.colonia_predio,
      data.entre_calle1_predio,
      data.entre_calle2_predio,
      data.manzana_predio,
      data.lote_predio,
      data.poblacion_predio,
      data.calle_notificacion,
      data.num_interior_notificacion,
      data.num_exterior_notificacion,
      data.cp_notificacion,
      data.colonia_notificacion,
      data.entre_calle1_notificacion,
      data.entre_calle2_notificacion,
      data.manzana_notificacion,
      data.lote_notificacion,
      data.referencia_predio,
      data.referencia_notificacion,
      data.id_tarea,
      data.latitud,
      data.longitud,
      data.tipoServicio,
      data.clave_catastral,
      data.numMedidor,
      data.tipoServicio,
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
   * Metodo que borrara toda la informacion si es que es otro usuario el que se logueo 
   */
  deleteInfo() {
    // implementar la logica
    console.log("Borrando información");
  }

  obtenerListadoCuentas() {
    return this.http.get(this.apiObtenerDatosMovil);
  }

  /**
   * Metodo que carga la lista de cuentas de agua a gestionar 
   * @returns Promise 
   */
  cargarListadoCuentasAgua() {
    let sql = `SELECT cuenta, nombre_propietario, calle_predio ||  ' mz: ' || manzana_predio || ' lote: ' || lote_predio || ' ' || colonia_predio as direccion,  adeudo, latitud, longitud, gestionada FROM agua WHERE nombre_propietario NOT NULL`;

    return this.db.executeSql(sql, []).then(response => {
      let arrayCuentas = [];

      for (let index = 0; index < response.rows.length; index++) {
        arrayCuentas.push(response.rows.item(index));
      }

      return Promise.resolve(arrayCuentas);

    }).catch(error => Promise.reject(error));

  }

  cargarListadoCuentasPredio() {
    let sql = `SELECT cuenta, nombre_propietario, calle_predio ||  ' mz: ' || manzana_predio || ' lote: ' || lote_predio || ' ' || colonia_predio as direccion,  adeudo, latitud, longitud, gestionada FROM predio WHERE nombre_propietario NOT NULL LIMIT 20`;

    return this.db.executeSql(sql, []).then(response => {
      let arrayCuentas = [];

      for (let i = 0; i < response.rows.length; i++) {
        arrayCuentas.push(response.rows.item(i));
      }

      return Promise.resolve(arrayCuentas);

    }).catch(error => Promise.reject(error));

  }

  cargarListadoCuentasAntenas() {
    let sql = `SELECT cuenta, nombre_propietario, calle_predio ||  ' mz: ' || manzana_predio || ' lote: ' || lote_predio || ' ' || colonia_predio as direccion,  adeudo, latitud, longitud, gestionada FROM antenas WHERE nombre_propietario NOT NULL LIMIT 20`;

    return this.db.executeSql(sql, []).then(response => {
      let arrayCuentas = [];

      for (let i = 0; i < response.rows.length; i++) {
        arrayCuentas.push(response.rows.item(i));
      }

      return Promise.resolve(arrayCuentas);

    }).catch(error => Promise.reject(error));

  }

  cargarListadoCuentasPozos() {
    let sql = `SELECT cuenta, nombre_propietario, calle_predio ||  ' mz: ' || manzana_predio || ' lote: ' || lote_predio || ' ' || colonia_predio as direccion,  adeudo, latitud, longitud, gestionada FROM pozos WHERE nombre_propietario NOT NULL LIMIT 20`;

    return this.db.executeSql(sql, []).then(response => {
      let arrayCuentas = [];

      for (let i = 0; i < response.rows.length; i++) {
        arrayCuentas.push(response.rows.item(i));
      }

      return Promise.resolve(arrayCuentas);

    }).catch(error => Promise.reject(error));

  }



  /**
   * Metodo que obtiene el total de las cuentas insertadas en la tabla agua
   * @returns Promise
   */
  async getTotalAccountsAgua() {
    let sql = 'SELECT COUNT(*) as total FROM agua';
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Metodo que obtiene el total de las cuentas insertadas en la tabla predio
   * @returns Promise 
   */
  async getTotalAccountsPredio() {
    let sql = 'SELECT COUNT(*) as total FROM predio';
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;
      console.log("Total predio: " +  result);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTotalAccountsAntenas() {
    let sql = 'SELECT COUNT(*) as total FROM antenas';
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTotalAccountsPozos() {
    let sql = 'SELECT COUNT(*) as total FROM pozos';
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Metodo que obtiene el total de cuentas gestionadas de la tabla agua
   * @returns Promise
   */
  async getGestionadasAgua() {
    let sql = 'SELECT COUNT(*) as total_gestionadas FROM agua WHERE gestionada = 1';
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total_gestionadas;

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getGestionadasPredio() {
    let sql = 'SELECT COUNT(*) as total_gestionadas FROM predio WHERE gestionada = 1';
    try {
      const response = await this.db.executeSql(sql, []);
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
  getDataVisitPosition() {
    // Carga las posiciones
    let sql = 'SELECT gestionada, cuenta, latitud, longitud, nombre_propietario, adeudo FROM agua where latitud > 0 and gestionada = 0';
    return this.db.executeSql(sql, []).then(response => {
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
      "SELECT gestionada, cuenta, latitud, longitud FROM agua where latitud > 0 and cuenta = ?";
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


  saveImage(image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo) {
    let sql =
      "INSERT INTO capturaFotosPredio(imagenLocal,cuenta,fecha,rutaBase64,idAspuser,idTarea,tipo) values(?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      image,
      accountNumber,
      fecha,
      rutaBase64,
      idAspuser,
      idTarea,
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

  deletePhoto(id, url) {
    this.db.executeSql("delete from  capturaFotos where id = ?", [id]);
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
   * Metodo que inserta en gestionInspeccionAgua la informacion capturada
   * @param data 
   * @returns Promise (insert gestionInspeccionAgua)
   */
  gestionInspeccionAgua(data) {

    this.updateAccountGestionada(data.id);

    let sql = 'INSERT INTO gestionInspeccionAgua ( account, clave, ordenInspeccion, numeroMedidor, pozoConagua, idTipoServicio, idHallazgo, otroHallazgo, idAspUser, inspector2, inspector3, inspector4, idTarea, fechaCaptura, latitud, longitud)' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    return this.db.executeSql(sql, [
      data.account,
      data.clave,
      data.ordenInspeccion,
      data.numeroMedidor,
      data.pozoConagua,
      data.idTipoServicio,
      data.idHallazgo,
      data.otroHallazgo,
      data.idAspUser,
      data.inspector2,
      data.inspector3,
      data.inspector4,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud
    ]);
  }

  gestionInspeccionPredio(data) {

    this.updateAccountGestionadaPredio(data.id);
    let sql =
      "INSERT INTO gestionInspeccionPredio(account, claveCatastral, nombreContribuyente, direccion, orden, usoSuelo, observaciones, avaluo, idAspUser, inspector2, inspector3, inspector4, idTarea,  fechaCaptura, latitud, longitud)" +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    return this.db.executeSql(sql, [
      data.account,
      data.claveCatastral,
      data.nombreContribuyente,
      data.direccion,
      data.orden,
      data.usoSuelo,
      data.observaciones,
      data.avaluo,
      data.idAspUser,
      data.inspector2,
      data.inspector3,
      data.inspector4,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud
    ]);
  }


  updateAccountGestionada(id) {
    let sql = 'UPDATE agua SET gestionada = 1 WHERE id = ?';
    return this.db.executeSql(sql, [id]);
  }

  updateAccountGestionadaPredio(id) {
    let sql = 'UPDATE predio SET gestionada = 1 WHERE id = ?';
    return this.db.executeSql(sql, [id]);
  }

  getAccountsGestionesAgua() {
    let sql = `SELECT account, fechaCaptura, 'Inspección agua' as rol FROM gestionInspeccionAgua WHERE cargado = 0`;
    return this.db.executeSql(sql, []).then(response => {
      let accounts = [];
      for (let i = 0; i < response.rows.length; i++) {
        accounts.push(response.rows.item(i));
      }
      return Promise.resolve(accounts);
    }).catch(error => Promise.reject(error));
  }

  getAccountsGestionesPredio() {
    let sql = `SELECT account, fechaCaptura, 'Inspección predio' as rol FROM gestionInspeccionPredio WHERE cargado = 0`;
    return this.db.executeSql(sql, []).then(response => {
      let accounts = [];
      for (let i = 0; i < response.rows.length; i++) {
        accounts.push(response.rows.item(i));
      }
      return Promise.resolve(accounts);
    }).catch(error => Promise.reject(error));
  }

  async sendAguaInspeccionAgua() {
    try {
      let arrayCuentasInspeccion = [];
      let sql = 'SELECT * FROM gestionInspeccionAgua WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasInspeccion.push(result.rows.item(i));
      }
      console.log(arrayCuentasInspeccion);

      if (arrayCuentasInspeccion.length == 0) {
        this.message.showAlert('Sin registros');
      } else {
        this.avanceGestionesInspeccionAgua = 0;

      }

    } catch (error) {

    }
  }

  avanceGestionesInspeccionAgua = 0

  envioGestionesInspeccionAgua(arrayGestionesInspeccionAgua) {
    console.log("envioGestionesInspeccionAgua");
    console.log(this.avanceGestionesInspeccionAgua);

    if (this.avanceGestionesInspeccionAgua === arrayGestionesInspeccionAgua.length) {
      this.message.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesInspeccionAgua(this.avanceGestionesInspeccionAgua, arrayGestionesInspeccionAgua).then(resp => {
        if (resp) {
          this.avanceGestionesInspeccionAgua++;
          this.envioGestionesInspeccionAgua(arrayGestionesInspeccionAgua);
        } else {
          this.envioGestionesInspeccionAgua(arrayGestionesInspeccionAgua);
        }
      })
    }
  }


  async sendGestionesInspeccionAgua(i, arrayGestionesInspeccionAgua) {
    let idPlaza = await this.storage.get("IdPlaza");
    return new Promise(async (resolve) => {
      let account = arrayGestionesInspeccionAgua[i].account;
      let cuenta = arrayGestionesInspeccionAgua[i].cuenta;
      let clave = arrayGestionesInspeccionAgua[i].clave;
      let ordenInspeccion = arrayGestionesInspeccionAgua[i].ordenInspeccion;
      let numeroMedidor = arrayGestionesInspeccionAgua[i].numeroMedidor;
      let idTipoServicio = arrayGestionesInspeccionAgua[i].idTipoServicio;
      let pozoConagua = arrayGestionesInspeccionAgua[i].pozoConagua;
      let idHallazgo = arrayGestionesInspeccionAgua[i].idHallazgo;
      let otroHallazgo = arrayGestionesInspeccionAgua[i].otroHallazgo;
      let idAspUser = arrayGestionesInspeccionAgua[i].idAspUser;
      let inspector2 = arrayGestionesInspeccionAgua[i].inspector2;
      let inspector3 = arrayGestionesInspeccionAgua[i].inspector3;
      let inspector4 = arrayGestionesInspeccionAgua[i].inspector4;
      let idTarea = arrayGestionesInspeccionAgua[i].idTarea;
      let fechaCaptura = arrayGestionesInspeccionAgua[i].fechaCaptura;
      let latitud = arrayGestionesInspeccionAgua[i].latitud;
      let longitud = arrayGestionesInspeccionAgua[i].longitud;
      let id = arrayGestionesInspeccionAgua[i].id;

      let sql = `'${account}','${cuenta}','${clave}','${ordenInspeccion}','${numeroMedidor}',${idTipoServicio},'${pozoConagua}',${idHallazgo},'${otroHallazgo}','${idAspUser}','${inspector2}','${inspector3}','${inspector4}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idPlaza}`;
      console.log("idplaza", idPlaza);
      console.log(sql);
      await this.enviarSQLInspeccionAgua(sql, id)
      resolve('Execute Query successfully');
    })
  }

  async enviarSQLInspeccionAgua(query, id) {
    return new Promise(resolve => {
      // cambiar apiObtenerInspectoresAgua por el api que envia la informacion
      this.http.post(this.apiObtenerInspectoresAgua + " " + query, null).subscribe(
        async data => {
          await this.actualizarIdInspeccionAgua(id);
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

  actualizarIdInspeccionAgua(id) {
    let sql = "UPDATE gestionInspeccionAgua SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

}

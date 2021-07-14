import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLiteObject } from "@ionic-native/sqlite/ngx";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  db: SQLiteObject = null;


  apiObtenerDatosMovil = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_obtenerCuentasMovil";
  apiObtenerDatosPozos = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_Pozos";

  constructor(
    private http: HttpClient
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


  /**
   * Metodo que trae la informacion del sql del stored procedure ObtenerDatosMovil
   * @param idAspUser 
   * @param idPlaza 
   * @returns promise data
   */
  obtenerDatosSqlAgua(idAspUser, idPlaza) {
    // lanzar el api para obtener los datos del sql
    try{
      return new Promise( resolve => {
        
        this.http.post(this.apiObtenerDatosMovil + " '" + idAspUser + "', " + idPlaza, null)
        .subscribe( data => {
          console.log("Datos traidos del SQL");
          console.log(data);
          resolve(data);
        }, err => console.log(err));
      })
    } catch{
      console.log("No se pudo obtener la informaciòn");
    }

  }

  /**
   * Metodo que trae la informacion del stored sp_Pozos
   * @param idPlaza 
   * @returns 
   */
  obtenerDatosPozos( idPlaza ) {
    // lanzar el api para obtener los datos del sql
    try{
      return new Promise( resolve => {
        
        this.http.post(this.apiObtenerDatosPozos + ' ' + idPlaza, null)
        .subscribe( data => {
          console.log("Datos traidos del SQL para pozos");
          console.log(data);
          resolve(data);
        }, err => console.log(err));
      })
    } catch{
      console.log("No se pudo obtener la informaciòn");
    }
  }

  /**
   * Metodo que inserta a la tabla agua la informaciòn que trajo del SQL
   * @param data 
   * @returns Ejecuciòn del insert into agua
   */
  guardarInfoSQLAgua( data ) {

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

  /**
   * Metodo que inserta la informacion obtenida de sp_Pozos en la tabla interna pozos_conagua
   * @param data 
   * @returns 
   */
  guardarInfoSqlPozos( data ) {
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
   * Metodo que carga la lista de cuentas a gestionar para mostrarlas en el tab de cuentas
   */
  cargarListadoCuentasAgua() {
    let sql = `SELECT cuenta, nombre_propietario, calle_predio ||  ' mz: ' || manzana_predio || ' lote: ' || lote_predio || ' ' || colonia_predio as direccion,  adeudo, latitud, longitud FROM agua WHERE nombre_propietario NOT NULL LIMIT 20 `;

    return this.db.executeSql(sql, []).then( response => {
      let arrayCuentas = [];

      for(let index = 0; index < response.rows.length; index++) {
        arrayCuentas.push(response.rows.item(index));
      }

      return Promise.resolve(arrayCuentas);

    }).catch( error => Promise.reject(error));

  }

  cargarListadoCuentasPredio() {
    let sql = `SELECT cuenta, nombre_propietario, calle_predio ||  ' mz: ' || manzana_predio || ' lote: ' || lote_predio || ' ' || colonia_predio as direccion,  adeudo, latitud, longitud FROM predio WHERE nombre_propietario NOT NULL LIMIT 20`;

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
    try{
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0);

      return Promise.resolve(result);
    }catch( error ){
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
      let result = response.rows.item(0);
      return Promise.resolve(result);
    } catch( error ) {
      return Promise.reject(error);
    }
  }

  /**
   * Metodo que obtiene el total de cuentas gestionadas de la tabla agua
   * @returns Promise
   */
  async getGestionadasAgua() {
    let sql = 'SELECT COUNT(*) as total_gestionadas FROM agua WHERE gestionada = 1';
    try{
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0);

      return Promise.resolve(result);
    }catch( error ){
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
      for(let index = 0; index < response.rows.length; index ++) {
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
    return this.db.executeSql(sql, []).then( response => {
      let posiciones = [];

      for (let index = 0; index < response.rows.length; index ++) {
        posiciones.push(response.rows.item(index));
      }

      return Promise.resolve(posiciones);

    }).catch( error => Promise.reject(error));
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




}

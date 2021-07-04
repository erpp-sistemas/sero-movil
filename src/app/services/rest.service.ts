import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLiteObject } from "@ionic-native/sqlite/ngx";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  db: SQLiteObject = null;


  apiObtenerDatosMovil = "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_obtenerCuentasMovil";


  constructor(
    private http: HttpClient
  ) { }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  deleteContribuyente() {
    let sqlDelete = "DELETE from contribuyente";
    this.db.executeSql(sqlDelete, []);
  }


  /**
   * Metodo que trae la informacion del sql del stored procedure ObtenerDatosMovil
   * @param idAspUser 
   * @param idPlaza 
   * @returns promise data
   */
  obtenerDatosSql(idAspUser, idPlaza) {
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
   * Metodo que inserta a la tabla contribuyente la informaciòn que trajo del SQL
   * @param data 
   * @returns Ejecuciòn del insert into contribuyente
   */
  guardarInfoSQLContribuyente( data ) {

    let sql = `INSERT INTO contribuyente(cuenta, adeudo, SupTerrenoH, SupConstruccionH, ValorTerrenoH, ValorConstruccionH, ValorCatastralH, tareaAsignada, ultimo_pago, nombre_propietario, telefono_propietario, celular_propietario, correo_electronico_propietario, calle_predio, num_interior_predio, num_exterior_predio, cp_predio, colonia_predio, entre_calle1_predio, entre_calle2_predio, manzana_predio, lote_predio, poblacion_predio, calle_notificacion, num_interior_notificacion, num_exterior_notificacion, cp_notificacion, colonia_notificacion, entre_calle1_notificacion, entre_calle2_notificacion, manzana_notificacion, lote_notificacion, referencia_predio, referencia_notificacion, id_tarea, latitud, longitud, tipoServicio, clave_catastral, numero_medidor, tipo_servicio) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)` 

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

  deleteInfo() {
    // implementar la logica
    console.log("Borrando información");
  }

  obtenerListadoCuentas() {
    return this.http.get(this.apiObtenerDatosMovil);
  }

  cargarListadoCuentas() {
    let sql = `SELECT cuenta, nombre_propietario, calle_predio ||  ' mz: ' || manzana_predio || ' lote: ' || lote_predio || ' ' || colonia_predio as direccion,  adeudo, latitud, longitud FROM contribuyente WHERE nombre_propietario NOT NULL LIMIT 20 `;

    return this.db.executeSql(sql, []).then( response => {
      let arrayCuentas = [];

      for(let index = 0; index < response.rows.length; index++) {
        arrayCuentas.push(response.rows.item(index));
      }

      return Promise.resolve(arrayCuentas);

    }).catch( error => Promise.reject(error));

  }

  async getTotalAccounts() {
    let sql = 'SELECT COUNT(*) as total FROM contribuyente';
    try{
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0);

      return Promise.resolve(result);
    }catch( error ){
      return Promise.reject(error);
    }
  }

  async getGestionadas() {
    let sql = 'SELECT COUNT(*) as total_gestionadas FROM contribuyente WHERE gestionada = 1';
    try{
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0);

      return Promise.resolve(result);
    }catch( error ){
      return Promise.reject(error);
    }
  }


  getDataVisitPosition() {
    // Carga las posiciones
    let sql = 'SELECT gestionada, cuenta, latitud, longitud, nombre_propietario, adeudo FROM contribuyente where latitud > 0 and gestionada = 0';
    return this.db.executeSql(sql, []).then( response => {
      console.log(response);
      let posiciones = [];

      for (let index = 0; index < response.rows.length; index ++) {
        posiciones.push(response.rows.item(index));
      }

      return Promise.resolve(posiciones);

    }).catch( error => Promise.reject(error));
  }

  getDataVisitPositionByAccount(accountNumber: string) {
    let sql =
      "SELECT gestionada, cuenta, latitud, longitud FROM contribuyente where latitud > 0 and cuenta = ?";
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

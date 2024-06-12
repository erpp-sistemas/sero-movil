import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { MessagesService } from './messages.service';
import { apiRegistroCartaInvitacion, apiRegistroCortes, apiRegistroInspeccion, apiRegistroLegal, apiRegistroServiciosPublicos } from '../api'
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  db: SQLiteObject = null;

  constructor(
    private message: MessagesService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
  ) { }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }


  /**
 * Metodo que trae las gestiones realizadas por servicio
 * @param idServicioPlaza 
 * @returns Promise
 */
  async getAccountsGestiones(id_servicio_plaza: number) {
    let sql =
      `SELECT account, fechaCaptura, 'Inspección' as rol, nombre_plaza FROM gestionInspeccion WHERE cargado = 0 AND id_servicio_plaza = ?
    UNION ALL SELECT account, fecha_captura, 'Carta invitación' as rol, nombre_plaza FROM gestionCartaInvitacion WHERE cargado = 0 AND id_servicio_plaza = ? UNION ALL SELECT account, fecha_captura, 'Legal' as rol, nombre_plaza FROM gestionLegal WHERE cargado = 0 AND id_servicio_plaza = ?  UNION ALL SELECT account, fecha_captura, 'Cortes' as rol, nombre_plaza FROM gestionCortes WHERE cargado = 0 AND id_servicio_plaza = ? `;
    return this.db.executeSql(sql, [id_servicio_plaza, id_servicio_plaza, id_servicio_plaza, id_servicio_plaza]).then(response => {
      let accounts = [];
      for (let i = 0; i < response.rows.length; i++) {
        accounts.push(response.rows.item(i));
      }
      return Promise.resolve(accounts);
    }).catch(error => Promise.reject(error));
  }


  /**
  * Metodo que inserta la informacion capturada en servicios publicos
  * @param data 
  * @returns Promise (insert into serviciosPublicos)
  */
  gestionServiciosPublicos(data: any) {
    let sql = 'INSERT INTO serviciosPublicos ( id_plaza, nombre_plaza, idAspUser, idServicio, obervacion, fechaCaptura, latitud, longitud)' +
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


  /**
  * Metodo que inserta la informacion capturada en carta invitacion
  * @param data 
  * @returns Promise (insert into gestionCartaINvitacion) 
  */
  gestionCartaInvitacion(data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = "INSERT INTO gestionCartaInvitacion(id_plaza, nombre_plaza, account, persona_atiende, id_tipo_servicio, numero_niveles, color_fachada, color_puerta, referencia, tipo_predio, entre_calle1, entre_calle2, observaciones, lectura_medidor, giro, idAspUser, id_tarea, fecha_captura, latitud, longitud, id_servicio_plaza, id_estatus_predio, id_tipo_gestion, id_tiempo_suministro_agua, lunes, martes, miercoles, jueves, viernes, sabado, domingo, coloco_sello, id_motivo_no_pago, otro_motivo_no_pago, domicilio_verificado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

        await this.db.executeSql(sql, [
          data.id_plaza,
          data.nombrePlaza,
          data.account,
          data.persona_atiende,
          data.id_tipo_servicio,
          data.numero_niveles,
          data.colorFachada,
          data.colorPuerta,
          data.referencia,
          data.id_tipo_predio,
          data.entre_calle1,
          data.entre_calle2,
          data.observaciones,
          data.lectura_medidor,
          data.giro,
          data.idAspUser,
          data.idTarea,
          data.fechaCaptura,
          data.latitud,
          data.longitud,
          data.idServicioPlaza,
          data.idEstatusPredio,
          data.idTipoGestion,
          data.idTiempoSuministroAgua,
          data.lunes,
          data.martes,
          data.miercoles,
          data.jueves,
          data.viernes,
          data.sabado,
          data.domingo,
          data.colocoSello,
          data.idMotivoNoPago,
          data.otroMotivoNoPago,
          data.domicilio_verificado
        ])

        this.updateAccountGestionada(data.id);
        resolve("Gestión guardada correctamente en el dispositivo")

      } catch (error) {
        console.log(error);
        reject("Error no se pudo guardar la gestión en el dispositivo, verifica con soporte técnico")
      }

    })
  }


  /**
 * Metodo que inserta la informacion capturada en cortes
 * @param data 
 * @returns Promise (insert into gestionCortes) 
 */
  gestionCortes(data: any) {
    this.updateAccountGestionada(data.id);
    let sql = "INSERT INTO gestionCortes(id_plaza, nombre_plaza, account, persona_atiende, id_tipo_servicio, numero_niveles, color_fachada, color_puerta, referencia, tipo_predio, entre_calle1, entre_calle2, observaciones, lectura_medidor, giro, idAspUser, id_tarea, fecha_captura, latitud, longitud, id_servicio_plaza, id_estatus_predio, id_tipo_gestion, id_tiempo_suministro_agua, lunes, martes, miercoles, jueves, viernes, sabado, domingo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

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
      data.lectura_medidor,
      data.giro,
      data.idAspUser,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
      data.idServicioPlaza,
      data.idEstatusPredio,
      data.idTipoGestion,
      data.idTiempoSuministroAgua,
      data.lunes,
      data.martes,
      data.miercoles,
      data.jueves,
      data.viernes,
      data.sabado,
      data.domingo
    ])
  }



  /**
   * Metodo que inserta en gestionInspeccion la informacion capturada
   * @param data 
   * @returns Promise (insert gestionInspeccion)
   */
  gestionInspeccion(data: any) {

    this.updateAccountGestionada(data.id);

    let sql = 'INSERT INTO gestionInspeccion (id_plaza, nombre_plaza, account, personaAtiende, idPuesto, otroPuesto, idTipoServicio, numeroNiveles, colorFachada, colorPuerta, referencia, idTipoPredio, entreCalle1, entreCalle2, hallazgoNinguna, hallazgoNegaronAcceso, hallazgoMedidorDescompuesto, hallazgoDiferenciaDiametro, hallazgoTomaClandestina, hallazgoDerivacionClandestina, hallazgoDrenajeClandestino, hallazgoCambioGiro, hallazgoFaltaDocumentacion, idAspUser, inspector2, inspector3, inspector4, observacion, lectura_medidor, giro, idTarea, fechaCaptura, latitud, longitud, id_servicio_plaza)' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

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
      data.lectura_medidor,
      data.giro,
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
  gestionLegal(data: any) {

    this.updateAccountGestionada(data.id);

    let sql = "INSERT INTO gestionLegal (id_plaza, nombre_plaza, account, persona_atiende, id_puesto, otro_puesto, id_motivo_no_pago, otro_motivo, id_tipo_servicio, numero_niveles, color_fachada, color_puerta, referencia, id_tipo_predio, entre_calle1, entre_calle2, observaciones, lectura_medidor, giro, idAspUser, id_tarea, fecha_captura, latitud, longitud, id_servicio_plaza, id_estatus_predio) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

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
      data.lectura_medidor,
      data.giro,
      data.idAspUser,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
      data.idServicioPlaza,
      data.idEstatusPredio
    ])

  }

  /**
 * 
 * @param id Metodo que actualiza el campo gestionada en 1
 * @returns executeSql
 */
  updateAccountGestionada(id: number) {
    let sql = 'UPDATE sero_principal SET gestionada = 1 WHERE id = ?';
    return this.db.executeSql(sql, [id]);
  }


  /**
  * Metodo que trae los servicios gestionados con el campo cargado = 0 de la tabla serviciosPublicos
  * @returns Promise con los servicios gestionados
  */
  async getAccountsGestionesServicios() {
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

  //* METODOS PARA ENVIAR GESTIONES DE UNA EN UNA


  /**
   * Metodo que envia una sola gestion del modulo de carta invitacion del servicio correspondiente
   * @param idServicioPlaza 
   * @param account 
   * @returns 
   */
  async sendCartaByIdServicioAccount(idServicioPlaza, account) {
    try {
      let arrayCuentaCarta = [];
      let sql = 'SELECT * FROM gestionCartaInvitacion WHERE cargado = 0 AND id_servicio_plaza = ? and account = ?';

      const result = await this.db.executeSql(sql, [idServicioPlaza, account]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentaCarta.push(result.rows.item(i));
      }

      //console.log(arrayCuentaCarta);

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
        let lectura_medidor = arrayCuentaCarta[0].lectura_medidor;
        let giro = arrayCuentaCarta[0].giro;
        let idAspUser = arrayCuentaCarta[0].idAspUser;
        let idTarea = arrayCuentaCarta[0].id_tarea;
        let fechaCaptura = arrayCuentaCarta[0].fecha_captura;
        let latitud = arrayCuentaCarta[0].latitud;
        let longitud = arrayCuentaCarta[0].longitud;
        let idServicioPaza = arrayCuentaCarta[0].id_servicio_plaza;
        let idEstatusPredio = arrayCuentaCarta[0].id_estatus_predio;
        let idTipoGestion = arrayCuentaCarta[0].id_tipo_gestion;
        let idTiempoSuministroAgua = arrayCuentaCarta[0].id_tiempo_suministro_agua;
        let lunes = arrayCuentaCarta[0].lunes;
        let martes = arrayCuentaCarta[0].martes;
        let miercoles = arrayCuentaCarta[0].miercoles;
        let jueves = arrayCuentaCarta[0].jueves;
        let viernes = arrayCuentaCarta[0].viernes;
        let sabado = arrayCuentaCarta[0].sabado;
        let domingo = arrayCuentaCarta[0].domingo;
        let colocoSello = arrayCuentaCarta[0].coloco_sello;
        let idMotivoNoPago = arrayCuentaCarta[0].id_motivo_no_pago;
        let otroMotivoNoPago = arrayCuentaCarta[0].otro_motivo_no_pago;
        let domicilio_verificado = arrayCuentaCarta[0].domicilio_verificado;

        let id = arrayCuentaCarta[0].id;

        let sql = `${id_plaza},'${account}','${persona_atiende}',${id_tipo_servicio},${numero_niveles},'${color_fachada}','${color_puerta}','${referencia}',${id_tipo_predio},'${entre_calle1}','${entre_calle2}','${observaciones}','${lectura_medidor}','${giro}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPaza}, ${idEstatusPredio}, ${idTipoGestion}, '${idTiempoSuministroAgua}', '${lunes}', '${martes}', '${miercoles}', '${jueves}', '${viernes}', '${sabado}', '${domingo}', ${colocoSello}, ${idMotivoNoPago}, '${otroMotivoNoPago}', ${domicilio_verificado}`
        //console.log(sql);
        await this.enviarSQLCartaInvitacion(sql, id)

        this.message.showAlert("Envío de la gestión correctamente");

        return Promise.resolve("Success");

      }

    } catch (error) {
      return Promise.reject("Error");
    }
  }


  /**
  * Metodo que envia una sola gestion del modulo de cortes del servicio correspondiente
  * @param idServicioPlaza 
  * @param account 
  * @returns 
  */
  async sendCortesByIdServicioAccount(idServicioPlaza, account) {
    try {
      let arrayCuentaCortes = [];
      let sql = 'SELECT * FROM gestionCortes WHERE cargado = 0 AND id_servicio_plaza = ? and account = ?';

      const result = await this.db.executeSql(sql, [idServicioPlaza, account]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentaCortes.push(result.rows.item(i));
      }
      console.log(arrayCuentaCortes);
      if (arrayCuentaCortes.length == 0) {
        this.message.showAlert("No se puede enviar la gestión, no se guardo correctamente");
      } else {
        let id_plaza = arrayCuentaCortes[0].id_plaza;
        let account = arrayCuentaCortes[0].account;
        let persona_atiende = arrayCuentaCortes[0].persona_atiende;
        let id_tipo_servicio = arrayCuentaCortes[0].id_tipo_servicio;
        let numero_niveles = arrayCuentaCortes[0].numero_niveles;
        let color_fachada = arrayCuentaCortes[0].color_fachada;
        let color_puerta = arrayCuentaCortes[0].color_puerta;
        let referencia = arrayCuentaCortes[0].referencia;
        let id_tipo_predio = arrayCuentaCortes[0].tipo_predio;
        let entre_calle1 = arrayCuentaCortes[0].entre_calle1;
        let entre_calle2 = arrayCuentaCortes[0].entre_calle2;
        let observaciones = arrayCuentaCortes[0].observaciones;
        let lectura_medidor = arrayCuentaCortes[0].lectura_medidor;
        let giro = arrayCuentaCortes[0].giro;
        let idAspUser = arrayCuentaCortes[0].idAspUser;
        let idTarea = arrayCuentaCortes[0].id_tarea;
        let fechaCaptura = arrayCuentaCortes[0].fecha_captura;
        let latitud = arrayCuentaCortes[0].latitud;
        let longitud = arrayCuentaCortes[0].longitud;
        let idServicioPaza = arrayCuentaCortes[0].id_servicio_plaza;
        let idEstatusPredio = arrayCuentaCortes[0].id_estatus_predio;
        let idTipoGestion = arrayCuentaCortes[0].id_tipo_gestion;
        let idTiempoSuministroAgua = arrayCuentaCortes[0].id_tiempo_suministro_agua;
        let lunes = arrayCuentaCortes[0].lunes;
        let martes = arrayCuentaCortes[0].martes;
        let miercoles = arrayCuentaCortes[0].miercoles;
        let jueves = arrayCuentaCortes[0].jueves;
        let viernes = arrayCuentaCortes[0].viernes;
        let sabado = arrayCuentaCortes[0].sabado;
        let domingo = arrayCuentaCortes[0].domingo;

        let id = arrayCuentaCortes[0].id;

        let sql = `${id_plaza},'${account}','${persona_atiende}',${id_tipo_servicio},${numero_niveles},'${color_fachada}','${color_puerta}','${referencia}',${id_tipo_predio},'${entre_calle1}','${entre_calle2}','${observaciones}','${lectura_medidor}','${giro}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPaza}, ${idEstatusPredio}, ${idTipoGestion}, '${idTiempoSuministroAgua}', '${lunes}', '${martes}', '${miercoles}', '${jueves}', '${viernes}', '${sabado}', '${domingo}'`
        console.log(sql);
        await this.enviarSQLCortes(sql, id)

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
        let lectura_medidor = arrayCuentaLegal[0].lectura_medidor;
        let giro = arrayCuentaLegal[0].giro;
        let idAspUser = arrayCuentaLegal[0].idAspUser;
        let idTarea = arrayCuentaLegal[0].id_tarea;
        let fechaCaptura = arrayCuentaLegal[0].fecha_captura;
        let latitud = arrayCuentaLegal[0].latitud;
        let longitud = arrayCuentaLegal[0].longitud;
        let idServicioPlaza = arrayCuentaLegal[0].id_servicio_plaza
        let id_estatus_predio = arrayCuentaLegal[0].id_estatus_predio
        let id = arrayCuentaLegal[0].id;

        let sql = `${id_plaza},'${account}','${personaTiende}',${idPuesto},'${otroPuesto}',${idMotivoNoPago},'${otroMotivo}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}','${observaciones}','${lectura_medidor}','${giro}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza}, ${id_estatus_predio} `
        //console.log(sql);
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
        let lectura_medidor = arrayCuentaInspeccion[0].lectura_medidor;
        let giro = arrayCuentaInspeccion[0].giro;
        let idTarea = arrayCuentaInspeccion[0].idTarea;
        let fechaCaptura = arrayCuentaInspeccion[0].fechaCaptura;
        let latitud = arrayCuentaInspeccion[0].latitud;
        let longitud = arrayCuentaInspeccion[0].longitud;
        let idServicioPlaza = arrayCuentaInspeccion[0].id_servicio_plaza;
        let id = arrayCuentaInspeccion[0].id;

        let sql = `${id_plaza},'${account}','${personaAtiende}',${idPuesto},'${otroPuesto}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}',${hallazgoNinguna},${hallazgoNegaronAcceso},${hallazgoMedidorDescompuesto},${hallazgoDiferenciaDiametro},${hallazgoTomaClandestina},${hallazgoDerivacionClandestina},${hallazgoDrenajeClandestino},${hallazgoCambioGiro},${hallazgoFaltaDocumentacion},'${idAspUser}','${inspector2}','${inspector3}','${inspector4}','${observacion}','${lectura_medidor}','${giro}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza}`;
        console.log(sql);
        await this.enviarSQLInspeccion(sql, id)

        this.message.showAlert("Envío de la gestión correctamente");

        return Promise.resolve("Success");

      }

    } catch (error) {
      return Promise.reject("Error");
    }
  }

  //* *************************************************************************


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




  //* METODOS QUE ENVIAN GESTIONES POR SERVICIO O TODAS


  async sendInspeccionByIdServicio(id_servicio_plaza: number) {
    try {
      let array_cuentas = [];
      let sql = 'SELECT * FROM gestionInspeccion WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [id_servicio_plaza]);
      for (let i = 0; i < result.rows.length; i++) {
        array_cuentas.push(result.rows.item(i));
      }
      if (array_cuentas.length == 0) {
        this.message.showToast("Sin registros de inspeccion por enviar");
      } else {
        this.avanceGestionesInspeccion = 0;
        this.envioGestionesInspeccion(array_cuentas);
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
    try {
      let arrayCuentasInspeccion = [];
      let sql = 'SELECT * FROM gestionInspeccion WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasInspeccion.push(result.rows.item(i));
      }
      // console.log(arrayCuentasInspeccion);

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
  envioGestionesInspeccion(arrayGestionesInspeccion: any[]) {
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
  async sendGestionesInspeccion(i: number, arrayGestionesInspeccionAgua: any[]) {
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
      let lectura_medidor = arrayGestionesInspeccionAgua[i].lectura_medidor;
      let giro = arrayGestionesInspeccionAgua[i].giro;
      let idTarea = arrayGestionesInspeccionAgua[i].idTarea;
      let fechaCaptura = arrayGestionesInspeccionAgua[i].fechaCaptura;
      let latitud = arrayGestionesInspeccionAgua[i].latitud;
      let longitud = arrayGestionesInspeccionAgua[i].longitud;
      let idServicioPlaza = arrayGestionesInspeccionAgua[i].id_servicio_plaza;
      let id = arrayGestionesInspeccionAgua[i].id;

      let sql = `${id_plaza},'${account}','${personaAtiende}',${idPuesto},'${otroPuesto}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}',${hallazgoNinguna},${hallazgoNegaronAcceso},${hallazgoMedidorDescompuesto},${hallazgoDiferenciaDiametro},${hallazgoTomaClandestina},${hallazgoDerivacionClandestina},${hallazgoDrenajeClandestino},${hallazgoCambioGiro},${hallazgoFaltaDocumentacion},'${idAspUser}','${inspector2}','${inspector3}','${inspector4}','${observacion}','${lectura_medidor}','${giro}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza}`;
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
  async enviarSQLInspeccion(query: string, id: number) {
    return new Promise(resolve => {
      this.http.post(apiRegistroInspeccion + " " + query, null).subscribe(
        async data => {
          await this.actualizarIdInspeccion(id);
          resolve(data);
        }, err => {
          this.message.showAlert(
            "No se pudo enviar la información..."
          );
          console.error(err);
          this.loadingCtrl.dismiss();
        }
      );
    });
  }


  /**
* Metodo que inicia el envio de gestiones del modulo de carta invitacion del servicio correspondiente
* @param idServicioPlaza 
* @returns Promise
* 
*/
  async sendCartaInvitacionByIdServicio(id_servicio_plaza: number) {
    // console.log("Entrando a enviar la informacion de cartas invitacion del servicio " + idServicioPlaza);
    try {
      let arrayCuentasCarta = [];
      let sql = 'SELECT * FROM gestionCartaInvitacion WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [id_servicio_plaza]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasCarta.push(result.rows.item(i));
      }

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
    try {
      let arrayCuentasCarta = [];
      let sql = 'SELECT * FROM gestionCartaInvitacion WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasCarta.push(result.rows.item(i));
      }

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
  envioGestionesCarta(arrayCuentasCarta: any[]) {
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
  async sendGestionesCarta(i: number, arrayGestionesCarta: any[]) {
    return new Promise(async (resolve) => {

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
      let lectura_medidor = arrayGestionesCarta[i].lectura_medidor;
      let giro = arrayGestionesCarta[i].giro;
      let idAspUser = arrayGestionesCarta[i].idAspUser;
      let idTarea = arrayGestionesCarta[i].id_tarea;
      let fechaCaptura = arrayGestionesCarta[i].fecha_captura;
      let latitud = arrayGestionesCarta[i].latitud;
      let longitud = arrayGestionesCarta[i].longitud;
      let idServicioPaza = arrayGestionesCarta[i].id_servicio_plaza;
      let idEstatusPredio = arrayGestionesCarta[i].id_estatus_predio;
      let idTipoGestion = arrayGestionesCarta[i].id_tipo_gestion;
      let idTiempoSuministroAgua = arrayGestionesCarta[i].id_tiempo_suministro_agua;
      let lunes = arrayGestionesCarta[i].lunes;
      let martes = arrayGestionesCarta[i].martes;
      let miercoles = arrayGestionesCarta[i].miercoles;
      let jueves = arrayGestionesCarta[i].jueves;
      let viernes = arrayGestionesCarta[i].viernes;
      let sabado = arrayGestionesCarta[i].sabado;
      let domingo = arrayGestionesCarta[i].domingo;
      let colocoSello = arrayGestionesCarta[i].coloco_sello;
      let idMotivoNoPago = arrayGestionesCarta[i].id_motivo_no_pago;
      let otroMotivoNoPago = arrayGestionesCarta[i].otro_motivo_no_pago;
      let domicilio_verificado = arrayGestionesCarta[i].domicilio_verificado;
      let id = arrayGestionesCarta[i].id;

      let sql = `${id_plaza},'${account}','${persona_atiende}',${id_tipo_servicio},${numero_niveles},'${color_fachada}','${color_puerta}','${referencia}',${id_tipo_predio},'${entre_calle1}','${entre_calle2}','${observaciones}','${lectura_medidor}','${giro}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPaza},${idEstatusPredio}, ${idTipoGestion}, '${idTiempoSuministroAgua}', '${lunes}', '${martes}', '${miercoles}', '${jueves}', '${viernes}', '${sabado}', '${domingo}', ${colocoSello} ${idMotivoNoPago}, '${otroMotivoNoPago}', ${domicilio_verificado}`
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
  enviarSQLCartaInvitacion(query: string, id: number) {
    return new Promise(resolve => {
      this.http.post(apiRegistroCartaInvitacion + " " + query, null).subscribe(async data => {
        await this.actualizarIdCartaInvitacion(id);
        resolve(data);
      }, err => {
        this.message.showAlert("No se pudo enviar la información... ");
        console.error(err);
        this.loadingCtrl.dismiss();
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
    try {
      let arrayCuentasLegal = [];
      let sql = 'SELECT * FROM gestionLegal WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [idServicioPlaza]);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasLegal.push(result.rows.item(i));
      }
      
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
    try {
      let arrayCuentasLegal = [];
      let sql = 'SELECT * FROM gestionLegal WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasLegal.push(result.rows.item(i));
      }
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
  envioGestionesLegal(arrayGestionesLegal: any[]) {
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
  sendGestionesLegal(i: number, arrayGestionesLegal: any[]) {
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
      let lectura_medidor = arrayGestionesLegal[i].lectura_medidor;
      let giro = arrayGestionesLegal[i].giro;
      let idAspUser = arrayGestionesLegal[i].idAspUser;
      let idTarea = arrayGestionesLegal[i].id_tarea;
      let fechaCaptura = arrayGestionesLegal[i].fecha_captura;
      let latitud = arrayGestionesLegal[i].latitud; let longitud = arrayGestionesLegal[i].longitud;
      let idServicioPlaza = arrayGestionesLegal[i].id_servicio_plaza
      let id_estatus_predio = arrayGestionesLegal[i].id_estatus_predio
      let id = arrayGestionesLegal[i].id;

      let sql = `${id_plaza},'${account}','${personaTiende}',${idPuesto},'${otroPuesto}',${idMotivoNoPago},'${otroMotivo}',${idTipoServicio},${numeroNiveles},'${colorFachada}','${colorPuerta}','${referencia}',${idTipoPredio},'${entreCalle1}','${entreCalle2}','${observaciones}','${lectura_medidor}','${giro}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPlaza}, ${id_estatus_predio} `
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
  enviarSQLGestionLegal(query: string, id: number) {
    return new Promise(resolve => {
      this.http.post(apiRegistroLegal + " " + query, null).subscribe(async data => {
        await this.actualizarIdLegal(id);
        console.log(data);
        resolve(data);
      }, err => {
        this.message.showAlert(
          "No se pudo enviar la información..."
        );
        this.loadingCtrl.dismiss();
        console.log(err);
      }
      )
    })
  }


  /**
* Metodo que inicia el envio de gestiones del modulo de cortes del servicio correspondiente
* @param idServicioPlaza 
* @returns Promise
* 
*/
  async sendCortesByIdServicio(id_servicio_plaza: number) {
    try {
      let arrayCuentasCortes = [];
      let sql = 'SELECT * FROM gestionCortes WHERE cargado = 0 AND id_servicio_plaza = ?';
      const result = await this.db.executeSql(sql, [id_servicio_plaza]);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasCortes.push(result.rows.item(i));
      }
      if (arrayCuentasCortes.length === 0) {
        this.message.showToast('Sin registros de restriccioón por enviar');
      } else {
        this.avanceGestionesCortes = 0;
        this.envioGestionesCortes(arrayCuentasCortes);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }


  /**
 * Metodo que inicia el envio de todas las gestiones del modulo de cortes
 * @returns Promise
 */
  async sendCortes() {
    try {
      let arrayCuentasCortes = [];
      let sql = 'SELECT * FROM gestionCortes WHERE cargado = 0';
      const result = await this.db.executeSql(sql, []);
      for (let i = 0; i < result.rows.length; i++) {
        arrayCuentasCortes.push(result.rows.item(i));
      }
      if (arrayCuentasCortes.length === 0) {
        this.message.showToast("Sin registros de cortes por enviar");
      } else {
        this.avanceGestionesCortes = 0;
        this.envioGestionesCortes(arrayCuentasCortes);
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  avanceGestionesCortes = 0;


  /**
 * Segundo metodo para el envio de gestiones del modulo de cortes
 * @param arrayCuentasCarta 
 */
  envioGestionesCortes(arrayCuentasCortes: any[]) {
    console.log("envioGestionesCortes");
    console.log(this.avanceGestionesCortes);
    if (this.avanceGestionesCortes === arrayCuentasCortes.length) {
      this.message.showToastLarge('Sincronización de sus gestiones correctas');
    } else {
      this.sendGestionesCortes(this.avanceGestionesCortes, arrayCuentasCortes).then(resp => {
        if (resp) {
          this.avanceGestionesCortes++;
          this.envioGestionesCortes(arrayCuentasCortes);
        } else {
          this.envioGestionesCortes(arrayCuentasCortes);
        }
      })
    }
  }


  /**
  * 
  * @param i Tercer metodo para el envio de las gestiones del modulo de cortes
  * @param arrayGestionesCarta 
  * @returns 
  */
  async sendGestionesCortes(i: number, arrayGestionesCortes: any[]) {
    return new Promise(async (resolve) => {
      let id_plaza = arrayGestionesCortes[i].id_plaza;
      let account = arrayGestionesCortes[i].account;
      let persona_atiende = arrayGestionesCortes[i].persona_atiende;
      let id_tipo_servicio = arrayGestionesCortes[i].id_tipo_servicio;
      let numero_niveles = arrayGestionesCortes[i].numero_niveles;
      let color_fachada = arrayGestionesCortes[i].color_fachada;
      let color_puerta = arrayGestionesCortes[i].color_puerta;
      let referencia = arrayGestionesCortes[i].referencia;
      let id_tipo_predio = arrayGestionesCortes[i].tipo_predio;
      let entre_calle1 = arrayGestionesCortes[i].entre_calle1;
      let entre_calle2 = arrayGestionesCortes[i].entre_calle2;
      let observaciones = arrayGestionesCortes[i].observaciones;
      let lectura_medidor = arrayGestionesCortes[i].lectura_medidor;
      let giro = arrayGestionesCortes[i].giro;
      let idAspUser = arrayGestionesCortes[i].idAspUser;
      let idTarea = arrayGestionesCortes[i].id_tarea;
      let fechaCaptura = arrayGestionesCortes[i].fecha_captura;
      let latitud = arrayGestionesCortes[i].latitud;
      let longitud = arrayGestionesCortes[i].longitud;
      let idServicioPaza = arrayGestionesCortes[i].id_servicio_plaza;
      let idEstatusPredio = arrayGestionesCortes[i].id_estatus_predio;
      let idTipoGestion = arrayGestionesCortes[i].id_tipo_gestion;
      let idTiempoSuministroAgua = arrayGestionesCortes[i].id_tiempo_suministro_agua;
      let lunes = arrayGestionesCortes[i].lunes;
      let martes = arrayGestionesCortes[i].martes;
      let miercoles = arrayGestionesCortes[i].miercoles;
      let jueves = arrayGestionesCortes[i].jueves;
      let viernes = arrayGestionesCortes[i].viernes;
      let sabado = arrayGestionesCortes[i].sabado;
      let domingo = arrayGestionesCortes[i].domingo;
      let id = arrayGestionesCortes[i].id;

      let sql = `${id_plaza},'${account}','${persona_atiende}',${id_tipo_servicio},${numero_niveles},'${color_fachada}','${color_puerta}','${referencia}',${id_tipo_predio},'${entre_calle1}','${entre_calle2}','${observaciones}','${lectura_medidor}','${giro}','${idAspUser}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idServicioPaza},${idEstatusPredio}, ${idTipoGestion}, '${idTiempoSuministroAgua}', '${lunes}', '${martes}', '${miercoles}', '${jueves}', '${viernes}', '${sabado}', '${domingo}' `
      console.log(sql);
      await this.enviarSQLCortes(sql, id)
      resolve('Execute Query successfully');

    })
  }

  /**
* Cuarto y ultimo metodo para el envio gestiones del modulo de cortes
* @param query 
* @param id 
* @returns Promise
*/
  enviarSQLCortes(query: string, id: number) {
    return new Promise(resolve => {
      this.http.post(apiRegistroCortes + " " + query, null).subscribe(async data => {
        await this.actualizarIdCortes(id);
        resolve(data);
      }, err => {
        this.message.showAlert("No se pudo enviar la información...");
        console.error(err);
        this.loadingCtrl.dismiss();
      }
      )
    })
  }


  async sendServiciosPublicos() {
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

  envioGestionesServicios(arrayServicios: any[]) {
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

  sendGestionesServicios(i: number, arrayServicios: any[]) {
    return new Promise(async resolve => {
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
      await this.enviarSQLServicios(sql, id)
      resolve('Execute Query successfully');

    })
  }

  enviarSQLServicios(query: string, id: number) {
    return new Promise(resolve => {
      this.http.post(apiRegistroServiciosPublicos + " " + query, null).subscribe(async data => {
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


  // ********************************************************************************


  /**
   * Metodo que actualiza el campo cargado a 1 de la tabla de inspeccion
   * @param id 
   * @returns Promise
   */
  actualizarIdInspeccion(id: number) {
    let sql = "UPDATE gestionInspeccion SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }


  /**
   * Metodo que actualiza el campo cargado a 1 de la tabla carta invitacion
   * @param id 
   * @returns 
   */
  actualizarIdCartaInvitacion(id: number) {
    let sql = "UPDATE gestionCartaInvitacion SET cargado = 1 where id = ?"
    return this.db.executeSql(sql, [id]);
  }

  actualizarIdCortes(id: number) {
    let sql = 'UPDATE gestionCortes SET cargado = 1 where id = ?';
    return this.db.executeSql(sql, [id]);
  }

  /**
   * Metodo que actualiza el campo cargado a 1 de la tabla encuesta
   * @param id 
   * @returns 
   */
  actualizarIdEncuesta(id: number) {
    let sql = "UPDATE encuesta SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  /**
 * Metodo que actualiza el campo cargado a 1 de la tabla legal
 * @param id 
 * @returns 
 */
  actualizarIdLegal(id: number) {
    let sql = "UPDATE gestionLegal SET cargado = 1 where id = ?"
    return this.db.executeSql(sql, [id]);
  }

  /**
   * 
   * @param id Metodo que actualiza el campo cargado a 1 de la tabla de serviciosPublicos
   * @returns 
   */
  actualizarServiciosPublicos(id: number) {
    let sql = "UPDATE serviciosPublicos SET cargado = 1 where id = ? ";
    return this.db.executeSql(sql, [id]);
  }


}

import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { File } from "@ionic-native/file/ngx";
import { S3Service } from './s3.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { MessagesService } from './messages.service';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { apiRegistroFotos, apiRegistroFotosServicios } from '../api'


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  db: SQLiteObject = null;
  loading: any

  constructor(
    private file: File,
    private s3Service: S3Service,
    private base64: Base64,
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
  * Metodo que obtiene el total de los registros de capturaFotos donde cargado = 0
  * @returns Promise
  */
  async getTotalFotosAcciones() {
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
    let sql = "SELECT count(*) AS total from capturaFotosServicios WHERE cargado = 0 ";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }


  saveImage(id_plaza: number, nombrePlaza: string, image: string, accountNumber: any, fecha: string, rutaBase64: string, id_usuario: number, id_tarea: number, tipo: string, id_servicio_plaza: number) {
    let sql =
      "INSERT INTO capturaFotos(id_plaza, nombre_plaza, imagenLocal, cuenta, fecha, rutaBase64, idAspuser, idTarea, tipo, id_servicio_plaza) values(?,?,?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      id_plaza,
      nombrePlaza,
      image,
      accountNumber,
      fecha,
      rutaBase64,
      id_usuario,
      id_tarea,
      tipo,
      id_servicio_plaza
    ]);
  }

  saveImageServicios(id_plaza: number, id_usuario: number, image: string, fecha: string, rutaBase64: string, tipo: string, id_servicio: number, nombrePlaza: string) {
    let sql =
      "INSERT INTO capturaFotosServicios(id_plaza, nombre_plaza, idAspUser, idServicio, imagenLocal, fecha,rutaBase64, tipo) values(?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      id_plaza,
      nombrePlaza,
      id_usuario,
      id_servicio,
      image,
      fecha,
      rutaBase64,
      tipo
    ]);
  }

  async getImageLocal(img) {
    let sql = "SELECT * FROM CapturaFotos where cargado = 0 and imagenLocal = ?"
    return this.db.executeSql(sql, [img])
      .then(response => {
        let arrayImage = [];
        arrayImage.push(response.rows.item(0));
        this.deletePhoto(arrayImage[0].id, arrayImage[0].rutaBase64);
        return Promise.resolve(arrayImage);
      })
      .catch(error => Promise.reject(error));

  }

  deletePhoto(id: number, url: string) {
    this.db.executeSql("delete from  capturaFotos where id = ?", [id]);
    this.deletePhotoFile(url);
    return;
  }

  async deletePhotoFile(url: string) {
    var uno = url.split("cache/");
    let first = uno[0] + "cache/";
    let second = uno[1];
    this.file
      .removeFile(first, second)
      .then(res => {
      })
      .catch(err => {
        console.log("No borro");
        console.log(err);
      });
  }

  async getImageLocalServicios(img) {
    let sql = "SELECT * FROM CapturaFotosServicios where cargado = 0 and imagenLocal = ?"
    return this.db.executeSql(sql, [img])
      .then(response => {
        let arrayImage = [];
        arrayImage.push(response.rows.item(0));
        this.deletePhotoServicios(arrayImage[0].id, arrayImage[0].rutaBase64);
        return Promise.resolve(arrayImage);
      })
      .catch(error => Promise.reject(error));

  }


  deletePhotoServicios(id, url) {
    this.db.executeSql("delete from  capturaFotosServicios where id = ?", [id]);
    this.deletePhotoFile(url);
    return;
  }



  //* METODOS PARA EL ENVIO DE LAS FOTOS

  async getImagesLocal() {
    let sql = "SELECT * FROM capturaFotos where cargado = 0 order by fecha desc";
    return this.db.executeSql(sql, []).then(response => {
      let arrayFotos = [];
      for (let i = 0; i < response.rows.length; i++) {
        arrayFotos.push(response.rows.item(i));
      }
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
      return Promise.resolve(arrayFotosServicios);
    }).catch(error => Promise.reject(error));
  }

  async uploadPhotosServicios() {
    let arrayImagesServicios = [];
    let sql = "SELECT * FROM capturaFotosServicios where cargado = 0 limit 20"
    let response = await this.db.executeSql(sql, []);
    for (let i = 0; i < response.rows.length; i++) {
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

  envioFotosServicios(arrayImagesServicios: any[]) {
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

  sendImageServicios(i: number, arrayImagesServicios: any[]) {
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

  envioFotos(arrayImages: any[]) {
    if (this.avanceImages === arrayImages.length) {
      this.loading.dismiss();
      this.message.showAlert("Fotos enviadas con exito!!!!");
    } else {
      this.sendImage(this.avanceImages, arrayImages).then((respEnvio: any) => {
        if (respEnvio.status) {
          this.avanceImages++;
          this.envioFotos(arrayImages);
        } else if (respEnvio.status === false && respEnvio.message === 'foto rota') {
          this.message.showToastLarge(`La foto de la cuenta ${arrayImages[this.avanceImages].cuenta} ya no se encuentra en el dispositivo`)
          this.avanceImages++;
          this.envioFotos(arrayImages);
        } else {
          this.envioFotos(arrayImages);
        }
      })
    }
  }

  async sendImage(i: number, arrayImages: any[]) {
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


  async uploadPhotoS3V1(cuenta: string, id_usuario: number, id_tarea: number, fecha: string, tipo: string, base64File: string, imageName: string, id: number, ruta: string, cont: any, id_plaza: number, id_plaza_servicio: number) {
    return new Promise(async (resolve) => {
      try {
        if (base64File) {
          this.s3Service.uploadS3(base64File, imageName).then(async uploadResponse => {
            if (uploadResponse) {
              let UrlOriginal = this.s3Service.getURLPresignaded(imageName);
              await this.saveSqlServer(cuenta, id_usuario, imageName, id_tarea, fecha, tipo, id, UrlOriginal, ruta, cont, id_plaza, id_plaza_servicio);
              resolve({status: true, message: 'foto correcta'});
            }
            else {
              this.uploadPhotoS3V1(cuenta, id_usuario, id_tarea, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza, id_plaza_servicio);
            }
          });
        } else {
          resolve({ status: false, message: "foto rota" })
        }
      } catch (err_1) {
        alert(err_1)
        console.log(err_1);
        resolve(false);
      }
    });
  }

  async uploadPhotoS3V1Servicios(id_usuario: number, id_plaza_servicio: number, fecha: string, tipo: string, base64File: string, imageName: string, id: number, ruta: string, cont: any, id_plaza: number) {
    return new Promise(async (resolve) => {
      try {
        if (base64File) {
          this.s3Service.uploadS3(base64File, imageName).then(async uploadResponse => {
            if (uploadResponse) {
              let UrlOriginal: any;
              UrlOriginal = this.s3Service.getURLPresignaded(imageName);
              await this.saveSqlServerServicios(id_usuario, imageName, id_plaza_servicio, fecha, tipo, id, UrlOriginal, ruta, cont, id_plaza);
              resolve(true);
            }
            else {
              this.uploadPhotoS3V1Servicios(id_usuario, id_plaza_servicio, fecha, tipo, base64File, imageName, id, ruta, cont, id_plaza);
            }
          });
        } else {
          resolve(false)
        }
      } catch (err_1) {
        alert(err_1)
        console.log(err_1);
        resolve(false);
      }
    });
  }


  async saveSqlServer(cuenta: string, id_usuario: number, imageName: string, id_tarea: number, fecha: string, tipo: string, id: any, url: any, ruta: string, cont: any, id_plaza: number, id_plaza_servicio: number) {
    let data_photo = {
      account: cuenta,
      id_usuario: id_usuario,
      image_name: imageName,
      id_tarea: id_tarea,
      fecha: fecha,
      tipo: tipo,
      id_servicio: id_plaza_servicio,
      id_plaza: id_plaza,
      url_photo: url,
    }
    return new Promise(resolve => {
      this.http.post(apiRegistroFotos, data_photo).subscribe(
        async data => {
          this.message.showToast(data[0].mensaje + ' ' + cont)
          await this.updateLoadedItem(id);
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


  async saveSqlServerServicios(id_usuario: number, imageName: string, id_servicio: number, fecha: string, tipo: string, id: number, url: string, ruta: string, cont: any, id_plaza: number) {
  
    let data_photo = {
      id_usuario: id_usuario,
      image_name: imageName,
      id_servicio: id_servicio,
      fecha: fecha,
      tipo: tipo,
      id_plaza: id_plaza,
      url_photo: url,
    }

    return new Promise(resolve => {
      this.http.post(apiRegistroFotosServicios, data_photo).subscribe(
        async data => {
          this.message.showToast(data[0].mensaje + ' ' + cont)
          await this.updateLoadedItemServicios(id);
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


  updateLoadedItem(id: number) {
    let sql = "UPDATE capturaFotos SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateLoadedItemServicios(id: number) {
    let sql = "UPDATE capturaFotosServicios SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  async uploadPhoto(id: number) {
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
        try {
          if (imagenString) {
            this.s3Service.uploadS3(imagenString, imageName).then(async uploadResponse => {
              if (uploadResponse) {
                let UrlOriginal = this.s3Service.getURLPresignaded(imageName);
                await this.saveSqlServer(arrayImages[0].cuenta, arrayImages[0].idAspUser, imageName, idTarea, arrayImages[0].fecha, arrayImages[0].tipo, arrayImages[0].id, UrlOriginal, arrayImages[0].ruta, 1, arrayImages[0].id_plaza, arrayImages[0].id_servicio_plaza);
                resolve(true);
              }
              else {
                this.uploadPhoto(id);
              }
            });
          } else {
            resolve(false)
          }

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



}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { IonSlides, LoadingController, ModalController, Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;
  @ViewChild('passwordEyeRegister', { static: true }) passwordEye;

  email: string = '';
  password: string = '';
  nombre: string = '';
  idplaza: string = ''
  idChecador: string = ''
  usuario: string = ''
  plaza: string = ''
  idAspUser: string = ''
  rol: string = ''
  data: any;
  passwordTypeInput = 'password';
  iconpassword = 'eye-off';
  loading: any;
  usuarioVerificado: boolean = false;
  avatarSeleccionado: any;
  sectores: any;


  avatarSlide = {
    slidesPerView: 3.5
  };

  constructor(
    private loadingController: LoadingController,
    private auth: AuthService,
    private router: Router,
    private usuarioService: UsersService,
    private mensaje: MessagesService,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });
  }

  ngOnInit() {

  }


  ionViewDidEnter() {

  }

  async login() {

    this.loading = await this.loadingController.create({
      message: 'Iniciando sesión',
      spinner: 'dots'
    });

    await this.loading.present();

    this.auth.loginFirebase(this.email, this.password).then(user => {

      // Se ha iniciado sesión de forma exitosa, se quita el loading
      this.loading.dismiss();

      // Se navega hacia el perfil
      this.modalCtrl.dismiss();
      //this.router.navigateByUrl("/home/tab1");

    }).catch(error => {
      this.mensaje.showAlert("Credenciales incorrectas, favor de verificar");
      this.loading.dismiss();
    })

  }

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordEye.el.setFocus();
  }



  /**
   * Metodo que verifica que el usuario ya este en la base de datos de Erpp para poder crearlo en Erpp móvil
   */
  // async verificarUsuario() {

  //   if (this.email == '' || this.idplaza == '') {
  //     this.mensaje.showAlert("Rellena todos los campos solicitados!!!");
  //   } else {

  //     try {
  //       this.data = await this.usuarioService.userVerify(this.email, this.idplaza);
  //       this.nombre = this.data[0].nombre
  //       this.usuario = this.data[0].usuario
  //       this.plaza = this.data[0].plaza
  //       this.idChecador = this.data[0].idUser
  //       this.idAspUser = this.data[0].idAspUser
  //       this.rol = this.data[0].rol
  //       this.usuarioVerificado = true;

  //       this.mensaje.showAlert("Usuario verificado, pulsa el boton Crear usuario");

  //     } catch (error) {
  //       this.mensaje.showAlert("Usuario no verificado!!! checar administración de usuarios");
  //     }


  //   }
  // }

  /**
   * Metodo que crea el usuario y guarda los datos en firestore
   */
  // crearUsuario() {

  //   if(this.avatarSeleccionado == null) {
  //     console.log("No se eligio avatar");
  //     this.avatarSeleccionado = {
  //       img: 'av-1.png',
  //     seleccionado: true
  //     }
  //   }


  //   let idaspuser = this.data[0].idaspuser;
  //   let idrol = this.data[0].idrol;
  //   let nombre = this.data[0].nombre;
  //   let user = this.data[0].usuario;
  //   let rol = this.data[0].rol;
  //   let idplaza = this.idplaza;
  //   let password = this.password;
  //   let plaza = this.data[0].plaza;
  //   let idUserChecador = this.data[0].idUser
  //   let imgAvatar = this.avatarSeleccionado.img

  //   this.auth.register(user, password, nombre, idplaza, idrol, idaspuser, rol, plaza, idUserChecador, imgAvatar).then( user => {   
  //     // mensaje de registro exitoso
  //     this.mensaje.showAlert("Registro de usuario exitoso");
  //     // verificar como se comporta este metodo si no funciona entonces implementar un router dirigiendo a login
  //     this.mostrarLogin();
  //   })

  // }




}

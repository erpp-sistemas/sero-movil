import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { ModalController, ToastController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  modal: any;


  constructor(
    private afauth: AngularFireAuth,
    public router: Router,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.afauth.authState.pipe(map(auth => {
      if (auth == null || auth == undefined) {
        console.log("Mandar a login ");
        this.showToast('Inicia sesión iniciar actividades');
        // volver el login un modal
        // this.router.navigate(['/login']);
        this.llamarLogin();
      } else {
        console.log("No mandar a login");
        return true;
      }
    }))

  }


  async llamarLogin() {

    this.modal = await this.modalCtrl.create({
      component: LoginPage
    });

    this.modal.present()

    this.modal.onDidDismiss().then(data => {
      this.router.navigate(['home/tab1']);
    })

  }



  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top'
    });

    toast.present();
  }

}

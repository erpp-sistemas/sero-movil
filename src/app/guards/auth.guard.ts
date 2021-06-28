import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router'
import { ToastController} from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private afauth:AngularFireAuth, 
    public router: Router,
    public toastCtrl: ToastController 
  ){

  } 

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return this.afauth.authState.pipe( map( auth => {
        if( auth == null || auth == undefined ) {
          console.log("Mandar a login ");
          this.showToast('Inicia sesión iniciar actividades');
          this.router.navigate(['/login']);
        } else {
          console.log("No mandar a login");
          return true;
        }
      }))

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

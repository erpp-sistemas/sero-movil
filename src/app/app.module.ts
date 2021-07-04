import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// firebase
import { firebaseConfig } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// ionic storage
import { IonicStorageModule } from "@ionic/storage";

//http
import { HttpClientModule } from '@angular/common/http';

//geolocation, geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';


// google maps
import { GoogleMaps } from '@ionic-native/google-maps/ngx';

// inAppBrowser
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

// splasscreen, statusbar, androidpermissions
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from "@ionic-native/status-bar/ngx";
//import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

// sqlite
import { SQLite } from "@ionic-native/sqlite/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    Geolocation,
    NativeGeocoder,
    InAppBrowser,
    GoogleMaps,
    SplashScreen,
    StatusBar,
   // AndroidPermissions,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';

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

// camara
import { Camera } from "@ionic-native/camera/ngx";

// file
import { File } from "@ionic-native/file/ngx";

// s3
import { S3Service } from "../app/services/s3.service";
import { SystemVariableService } from "../app/services/system-variable";

// webview
import { WebView } from "@ionic-native/ionic-webview/ngx";

import { StreamingMedia } from '@ionic-native/streaming-media/ngx';

// NativeStorage 
import { NativeStorage } from '@ionic-native/native-storage/ngx';

// Email
import { EmailComposer } from '@ionic-native/email-composer/ngx';

// base64
import { Base64 } from "@ionic-native/base64/ngx";

// Scanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'

// BackGroundGeolocation
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";

// import { SMS } from '@ionic-native/sms/ngx';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';

// Permissions
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

// App version
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx'

// One signal
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';


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
    ComponentsModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    Geolocation,
    NativeGeocoder,
    InAppBrowser,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    Camera,
    WebView,
    File,
    S3Service,
    SystemVariableService,
   // AndroidPermissions,
    SQLite,
    NativeStorage,
    StreamingMedia,
    EmailComposer,
    Base64,
    BarcodeScanner,
    BackgroundGeolocation,
    AndroidPermissions,
    SMS,
    AppVersion,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

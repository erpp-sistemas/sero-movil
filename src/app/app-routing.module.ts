import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoLoginGuard } from './guards/no-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'streetview',
    loadChildren: () => import('./streetview/streetview.module').then( m => m.StreetviewPageModule)
  },
  {
    path: 'gestion-page',
    loadChildren: () => import('./gestion-page/gestion-page.module').then( m => m.GestionPagePageModule)
  },
  {
    path: 'checador',
    loadChildren: () => import('./checador/checador.module').then( m => m.ChecadorPageModule)
  },
  {
    path: 'gestion-inspeccion-agua',
    loadChildren: () => import('./gestion-inspeccion-agua/gestion-inspeccion-agua.module').then( m => m.GestionInspeccionAguaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

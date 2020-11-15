
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './pages/options/options.component';
import { PopupComponent } from './pages/popup/popup.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PopupComponent
  },
  {
    path: 'popup',
    pathMatch: 'full',
    component: PopupComponent
  },
  {
    path: 'options',
    pathMatch: 'full',
    component: OptionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

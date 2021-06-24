import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {

    path: '',
    children:[
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'auth',
        component: AuthComponent
      },
      {
        path: '**',
        redirectTo: '404'
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }

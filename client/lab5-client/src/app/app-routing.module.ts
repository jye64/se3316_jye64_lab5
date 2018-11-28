import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignupComponent} from "./signup/signup.component";
import { LandingComponent} from "./landing/landing.component";
import {PrivacyComponent} from "./privacy/privacy.component";
import {DmcaComponent} from "./dmca/dmca.component";
import {HomeComponent} from "./home/home.component";
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'landing'},
  {path:'login',component:LoginComponent},
  {path:'signUp', component: SignupComponent},
  {path:'landing', component:LandingComponent},
  {path:'privacy',component:PrivacyComponent},
  {path:'dmca',component:DmcaComponent},
  {path:'home',component:HomeComponent},
  {path:'admin',component:AdminComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      routes,
      {enableTracing:true} //<-- debugging purpose only
    )

  ],
  exports: [RouterModule],
  declarations:[]
})

export class AppRoutingModule { }


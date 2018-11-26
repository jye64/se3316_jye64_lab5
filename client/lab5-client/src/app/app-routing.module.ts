import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignupComponent} from "./signup/signup.component";

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'signUp', component: SignupComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)

  ],
  exports: [RouterModule],
  declarations:[]
})

export class AppRoutingModule { }

export const approutingComponent = [SignupComponent,LoginComponent];

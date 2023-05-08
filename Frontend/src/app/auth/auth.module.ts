import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ApiServiceService } from '../services/api-service.service';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, ForgetPasswordComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
  providers: [ApiServiceService],
})
export class AuthModule {}

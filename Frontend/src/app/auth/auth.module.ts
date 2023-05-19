import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ApiServiceService } from '../services/api-service.service';
import { MailregisterComponent } from './mailregister/mailregister.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, ForgetPasswordComponent, MailregisterComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
  providers: [ApiServiceService],
})
export class AuthModule {}

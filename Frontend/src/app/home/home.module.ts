import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    NavbarComponent,
    DashbordComponent,
    CreateGroupComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HomeModule { }

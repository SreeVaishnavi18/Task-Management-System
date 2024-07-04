import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
//import { TaskComponent } from './components/task/task.component';
import { TaskCreateComponent } from './components/task-create/task-create.component';
import { TaskReadComponent } from './components/task-read/task-read.component';
import { TaskUpdateComponent } from './components/task-update/task-update.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { TaskAssignComponent } from './components/task-assign/task-assign.component';
import { AdminLandingComponent } from './components/admin-landing/admin-landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { TaskReadComponent } from './components/task/task-read/task-read.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TaskCreateComponent,
    TaskReadComponent,
    TaskUpdateComponent,
    TaskViewComponent,
    TaskAssignComponent,
    AdminLandingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

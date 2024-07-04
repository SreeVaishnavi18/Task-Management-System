import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page route
  { path: 'login', component: LoginComponent }, // Login page route
  { path: 'register', component: RegisterComponent }, // Register page route
  /*{ path: 'tasks', component: TaskComponent, children: [
    { path: 'create', component: TaskCreateComponent },
    { path: 'read', component: TaskReadComponent }
  ]}*/
  {path: 'create', component: TaskCreateComponent},
  {path:'read',component:TaskReadComponent},
  {path:'update/:id',component:TaskUpdateComponent},
  {path:'viewassign',component:TaskViewComponent},
  {path:'assign',component:TaskAssignComponent},
  {path:'adminlanding',component:AdminLandingComponent}


  //{path: 'tasks/read', component: TaskReadComponent}


  // Redirect any other route to home (or handle as needed)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

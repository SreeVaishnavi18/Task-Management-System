import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
//import { AuthService } from '../../services/auth.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {
  title: string = '';
  des: string = '';
  stat: string = '';
  due_date: string ='';
  errorMessage: any;

  constructor(private apiService: TaskService, private router: Router) {}

  ngOnInit(): void {}


  logout(): void {
    this.apiService.logout().subscribe(
      response => {
        console.log('Logout successful', response);

        this.router.navigateByUrl('login');
        alert('Logout successful'); 
        this.router.navigate(['/login']); 
      },
      error => {
        console.error('Logout failed', error);
        alert('Error creating task: ' + error.message);
      }
    );
  }

  onSubmit(): void {
    const formattedDate = `${this.due_date.slice(8, 10)}-${this.due_date.slice(5, 7)}-${this.due_date.slice(0, 4)}`;

    const movieData = {
      title: this.title,
      description: this.des,
      status: this.stat,
      due_date: formattedDate
    };

    this.apiService.AddTaskView(movieData)
      .subscribe(
        response => {
          console.log(response);
          alert('Task created successfully');
          this.router.navigate(['/read']); 
        },
        error => {
          console.error(error);
          if (error.status === 403) {
            alert('Only admins can create tasks');
          } else {
            this.errorMessage = error.error.message; 
          } 
        }
      );
  }
}
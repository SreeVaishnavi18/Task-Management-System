/*import { Component } from '@angular/core';

@Component({
  selector: 'app-task-read',
  templateUrl: './task-read.component.html',
  styleUrls: ['./task-read.component.css']
})
export class TaskReadComponent {

}*/

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-read',
  templateUrl: './task-read.component.html', 
  styleUrls: ['./task-read.component.css'], 
  
})
export class TaskReadComponent implements OnInit {
  tasks: any[] = [];
  errorMessage: string = '';
  //isAdmin: boolean = false;


  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  


  fetchTasks(): void {
    this.taskService.TaskListView().subscribe(
      (data: any) => {
        this.tasks = data.tasks;
      },
      error => {
        console.error(error);
        if (error.status === 403) {
          alert('Only admins can read tasks'); 
        } 
        else{
          this.errorMessage = error.error.message;

        }
      }
    );
  }

  deleteTask(task_id: string): void {
    this.taskService.DeleteTask(task_id).subscribe(
      response => {
        console.log(response);
        alert('Task deleted successfully');
        // Remove the deleted task from the tasks array
        this.tasks = this.tasks.filter(t => t._id !== task_id);
      },
      error => {
        console.error(error);
        alert('Error creating task: ' + error.message);
        this.errorMessage = error.error.message;
      }
    );
  }

  editTask(task_id: string): void {
    this.router.navigate(['/update', task_id]); // Navigate to update/:id route
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Task {
  _id: string;
  title: string;
  description: string;
 
}
interface FilteredTask {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  assigned_at: string;
}

interface User {
  id: string;
  username: string;
  
  
}

@Component({
  selector: 'app-task-assign',
  templateUrl: './task-assign.component.html',
  styleUrls: ['./task-assign.component.css']
})
export class TaskAssignComponent implements OnInit {
  assignForm: FormGroup;
  errorMessage: string = '';
  tasks: Task[] = [];
  users: User[] = []; 
  filteredTasks: FilteredTask[] = [];

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.assignForm = this.fb.group({
      task_id: ['', Validators.required],
      user_id: ['', Validators.required],
      status: ['assigned', Validators.required],
      due_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchTasks();
    this.fetchUsers();
    
  }

  fetchTasks(): void {
    this.taskService.TaskListView().subscribe(
      (data: { tasks: Task[] }) => {
        this.tasks = data.tasks;
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        if (error.status === 403) {
          alert('Only admins can read tasks');
        } else {
          this.errorMessage = error.error.message;
        }
      }
    );
  }

  fetchUsers(): void {
    this.taskService.UserListView().subscribe(
      (response) => {
        this.users = response['users']; // Assuming response format {'users': [{...}, {...}, ...]}
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle errors as needed
        this.errorMessage = 'Failed to fetch users.';
      }
    );
  }

  filterTasksByAssignedUser(userId: string): void {
    if (!userId) {
      this.filteredTasks = [];
      return;
    }

    this.taskService.FilterTasksByAssignedUserView(userId).subscribe(
      (response) => {
        this.filteredTasks = response.tasks;
      },
      (error) => {
        console.error('Error fetching filtered tasks:', error);
        this.errorMessage = 'Failed to fetch filtered tasks.';
      }
    );
  }

  onUserChange(event: any): void {
    const userId = event.target.value;
    this.filterTasksByAssignedUser(userId);
  }

  onUserInput(event: any): void {
    const userId = event.target.value;
    this.filterTasksByAssignedUser(userId);
  }


  
  


 /* fetchUsers(): void {
    this.taskService.UserListView().subscribe(
      (data: {users: User[]}) => {
        this.users = data.users;
      },
      (error) => {
        console.error('Error fetching users:', error);
        if (error.status === 403) {
          alert('Only admins can read users'); // Adjust error handling as needed
        } else {
          this.errorMessage = error.error.message; // Display error message from backend
        }
      }
    );
  }

  fetchUsers(): void {
    this.taskService.UserListView().subscribe(
      (data: any) => {
        this.users = data.users;
      },
      (error) => {
        console.error('Error fetching users:', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please login again.';
        } else {
          this.errorMessage = 'Failed to fetch users.';
        }
      }
    );
  }*/
  


   

  onSubmit(): void {
    if (this.assignForm.valid) {
      const { task_id, user_id, status, due_date } = this.assignForm.value;
      this.taskService.AssignTaskView(task_id, user_id, status, due_date)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Failed to assign task:', error);
            this.errorMessage = error.error.message || 'Failed to assign task';
            return throwError(error);
          })
        )
        .subscribe({
          next: (response: any) => {
            console.log('Task assigned successfully', response);
            alert('Task is assigned successfully to the user');
            this.errorMessage = 'Task assigned successfully';
            this.router.navigate(['/layout']); // Navigate to another page after successful assignment
          },
          error: (error) => {
            console.error('Error assigning task:', error);
            if (error.status === 403) {
              alert('Only admins can assign tasks');
            } else {
              this.errorMessage = error.error.message;
              alert('Error in assigning the task: ' + error.message);
            }
          }
        });
    }
  }
}

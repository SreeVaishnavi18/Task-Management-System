/*import { Component,OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service'; // Adjust path as per your project structure
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  fileForm: FormGroup;
  tasks: any[] = [];

  constructor(private fb: FormBuilder, private apiService: TaskService) {
    this.fileForm = this.fb.group({
      file: [null]
    });
  }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.apiService.ViewAssignedTasksView().subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileForm.patchValue({ file: file });
    }
  }

  onSubmit(taskId: string): void {
    const fileData = this.fileForm.get('file')?.value;

    if (fileData) {
      const formData = new FormData();
      formData.append('file', fileData);

      this.apiService.uploadFile(taskId, fileData).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          this.fetchTasks(); // Refresh tasks after successful upload
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.error('File data is null or undefined.');
    }
  }

}*/

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@app/services/auth.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


interface Task {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  assigned_at: string;
}

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  tasks: Task[] = [];
  searchQuery: string = '';
  filterStatus: string = '';
  filterDeadline: string = '';
  filterAssignedUser: string = '';

  
  


  constructor(private taskService: TaskService,private http:HttpClient,private router: Router, 
    private route: ActivatedRoute) {
  
  }

  ngOnInit(): void {
    this.loadTasks();
    
  }

  loadTasks(): void {
    this.taskService.ViewAssignedTasksView().subscribe(
      (response: any) => {
        this.tasks = response.assigned_tasks;
      },
      (error: any) => {
        console.error('Failed to load tasks:', error);
      }
    );
  }


  updateTaskStatus(taskId: string, status: string) {
    const body = { status: status };
    this.http.post<any>(`http://localhost:8000/api/updatestatus/${taskId}/`, body, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Failed to update task status:', error);
          return throwError(error);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Task status updated successfully', response);
          alert('Status updated successfully'); 
          this.loadTasks();  
        },
        error: (error) => {
          alert('Error updating status: ' + error.message); 
          console.error('Error updating task status:', error);
        }
      });
  }

  searchTasks(): void {
    if (this.searchQuery.trim() === '') {
      this.loadTasks();  
    } else {
      this.taskService.SearchTasksView(this.searchQuery).subscribe(
        (response: any) => {
          this.tasks = response.tasks;
        },
        (error: any) => {
          console.error('Failed to search tasks:', error);
        }
      );
    }
  }
  logout(): void {
    this.taskService.logout().subscribe(
      response => {
        console.log('Logout successful', response);
        alert('Logged out  successfully'); 
        this.router.navigateByUrl('login'); // Redirect to login page after logout
      },
      error => {
        console.error('Logout failed', error);
      }
    );
  }


  filterPendingTasks(): void {
    this.taskService.FilterTasksByStatusView('pending').subscribe(
        (response) => {
          this.tasks = response.tasks;
        },
        (error) => {
          console.error('Error filtering pending tasks:', error);
        }
      );
    }
  
    filterCompletedTasks(): void {
      this.taskService.FilterTasksByStatusView('completed').subscribe(
        (response) => {
          this.tasks = response.tasks;
        },
        (error) => {
          console.error('Error filtering completed tasks:', error);
        }
      );
    }
  

  filterTasksByDeadline(): void {
    if (this.filterDeadline.trim() === '') {
      return;
    }

    this.taskService.FilterTasksByDeadlineView(this.filterDeadline).subscribe(
      (response: any) => {
        this.tasks = response.tasks;
      },
      (error: any) => {
        console.error('Failed to filter tasks by deadline:', error);
      }
    );
  }

  filterTasksByAssignedUser(): void {
    if (this.filterAssignedUser.trim() === '') {
      return;
    }

    this.taskService.FilterTasksByAssignedUserView(this.filterAssignedUser).subscribe(
      (response: any) => {
        this.tasks = response.tasks;
      },
      (error: any) => {
        console.error('Failed to filter tasks by assigned user:', error);
      }
    );
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterDeadline = '';
    this.filterAssignedUser = '';
    this.loadTasks();  // Reload tasks to clear filters
  }
}



  /*filterTasksByStatus(status: string): void {
    this.taskService.FilterTasksByStatusView(status).subscribe(
      (response: any) => {
        this.tasks = response.tasks;
      },
      (error: any) => {
        console.error(`Failed to filter tasks by status ${status}:`, error);
      }
    );
  }*/


  /*searchTasks(): void {
    const query = this.searchForm.get('query')?.value;
    if (query) {
      this.taskService.SearchTasksView(query).subscribe(
        (response: any) => {
          this.tasks = response.tasks;
          if (this.tasks.length === 0) {
            console.log('No search results');
          }
        },
        (error: any) => {
          console.error('Search failed:', error);
          this.tasks = [];  // Clear tasks if search fails
        }
      );
    } else {
      this.loadTasks();  // Load all tasks if no search query
    }
  }*/

  






  
  





  
  


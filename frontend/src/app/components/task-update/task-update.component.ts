import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service'; 
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'translateY(-50px)', opacity: 0 }),
        animate('0.5s ease-in')
      ])
    ])
  ]
})
export class TaskUpdateComponent implements OnInit {
  task_id: string = '';
  title: string = '';
  description: string = '';
  status: string = 'pending';
  due_date: string = '';
  errorMessage: string = '';
  successMessage: string = '';  
  //animate: boolean = false;

  //isAdmin: boolean = false;


  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.task_id = this.route.snapshot.paramMap.get('id') || '';
    this.getTaskDetails();
    /*setTimeout(() => {
      this.animate = true;
    }, 100); 
    //this.checkAdmin();*/

  }

  getTaskDetails(): void {
    this.taskService.getTaskById(this.task_id).subscribe(
      (data: any) => {
        this.title = data.title;
        this.description = data.description;
        this.status = data.status;
        this.due_date = data.due_date;
      },
      error => {
        console.error('Error fetching task:', error);
        this.errorMessage = error.error.message;
      }
    );
  }

  logout(): void {
    this.taskService.logout().subscribe(
      response => {
        console.log('Logout successful', response);

        this.router.navigateByUrl('login');
        alert('Logout successful'); // Alert message for successful logout
        this.router.navigate(['/login']); // Redirect to login page after logout
      },
      error => {
        console.error('Logout failed', error);
        alert('Error creating task: ' + error.message);
      }
    );
  }



  


  
  onSubmit(): void {

   
    
    const updatedData = {
      title: this.title,
      description: this.description,
      status: this.status,
      due_date: this.due_date,
    };

    this.taskService.TaskDetailView(this.task_id, updatedData).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.successMessage = 'TASK IS UPDATED SUCCESSFULLY';
        this.router.navigate(['/tasks']);
      },
      (error) => {
        console.error('Error updating task:', error);
        if (error.status === 403) {
          alert('Only admins can update the tasks'); // Show alert if non-admin attempts to create task
        }
        else{
          this.errorMessage = 'Failed to update task';
          this.errorMessage = error.error.message;

        }
      }
    );
  }
}
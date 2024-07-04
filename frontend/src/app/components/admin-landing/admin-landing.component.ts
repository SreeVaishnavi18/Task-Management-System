import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/services/task.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent {

  constructor(private taskService: TaskService,private http:HttpClient, private router: Router, // Inject Router
    private route: ActivatedRoute ) {
  
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.taskService.logout().subscribe(
      response => {
        console.log('Logout successful', response);
        this.router.navigateByUrl('login'); // Redirect to login page after logout
      },
      error => {
        console.error('Logout failed', error);
      }
    );
  }






}

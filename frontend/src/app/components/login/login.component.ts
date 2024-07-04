/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '@app/services/task.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/*export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService,private taskservice: TaskService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          alert('Successfully logged in');
          console.log('Login successful', res);
          // Optionally, redirect to the home page or dashboard
        },
        error: (err) => {
          alert('Please check your credentials.Failed to login ')
          this.errorMessage = 'Failed to login';
          console.error('Login error', err);
        }
      });
    }
  }
}*/

/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.taskService.LoginView(email, password)
      .subscribe(
        response => {
          console.log(response);
          // Optionally, handle successful login response (e.g., store token, navigate)
          this.router.navigateByUrl('/crud');
        },
        error => {
          console.error(error);
          this.errorMessage = error.error.message;
        }
      );
  }
}
*/
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';//import { TaskService } from '../.service';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //standalone: true,
  //imports: [FormsModule,CommonModule]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: TaskService,private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.apiService.LoginView(this.username, this.password)
      .subscribe(
        (response:any) => {
          localStorage.setItem('jwt', response.token);  // Store the JWT token
          console.log('Login successful:', response);
          alert('Login successful');
          
          if (response.username === 'admin') {
            this.router.navigateByUrl('adminlanding');
          } else {
            this.router.navigateByUrl('viewassign');
          } // Handle success response
          // Optionally, redirect or update UI based on successful login
        },
        error => {
          console.error(error);  // Handle error response
          this.errorMessage = error.error.message;  // Display error message
        }
      );
  }
}

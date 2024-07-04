// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  register(user: any): Observable<any> {
    const registerUrl = `${this.apiUrl}register/`;
    return this.http.post<any>(registerUrl, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  login(credentials: any): Observable<any> {
    const loginUrl = `${this.apiUrl}login/`;
    return this.http.post<any>(loginUrl, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token); 
        }),
        catchError(this.handleError)
      );
  }

  

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Server-side error
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }
}


/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    const loginUrl = `${this.apiUrl}auth/login/`;
    return this.http.post<any>(loginUrl, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError('An error occurred. Please try again later.');
  }
}*/

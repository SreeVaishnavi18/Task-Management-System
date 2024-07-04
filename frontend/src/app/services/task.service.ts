import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api';  

  constructor(private http: HttpClient,private authService: AuthService) {}

  LoginView(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, { username, password }, { withCredentials: true });
  }

  AddTaskView(taskData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add/`, taskData, { withCredentials: true });
  }

  TaskListView(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/read/`, { withCredentials: true });
  }

  TaskDetailView(task_id: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${task_id}/`, updatedData, { withCredentials: true });
  }

  DeleteTask(task_id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${task_id}/`, { withCredentials: true });
  }
  getTaskById(task_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_object/${task_id}/`, { withCredentials: true });

  }
  

  ViewAssignedTasksView(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/viewassign/`, { withCredentials: true });
  }


  UpdateTaskStatusView(task_id: string, status: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updatestatus/${task_id}/`, { status }, { withCredentials: true });
  }

  SearchTasksView(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/?query=${query}`, { withCredentials: true });
  }
  FilterTasksByStatusView(status: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filterbystatus/?status=${encodeURIComponent(status)}`, { withCredentials: true });
  }

  FilterTasksByDeadlineView(deadline: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filter/?deadline=${encodeURIComponent(deadline)}`, { withCredentials: true });
  }

  FilterTasksByAssignedUserView(assignedUserId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filterbyuser/?assigned_user_id=${assignedUserId}`, { withCredentials: true });
  }

  AssignTaskView(task_id: string, user_id: string, status: string, due_date: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign/`, { task_id, user_id, status, due_date }, { withCredentials: true });
  }

  UserListView(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userss/`); 
  }
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {}, { withCredentials: true });
  }
  FilterTasksByAssignedUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filterbyuser/?assigned_user_id=${userId}`);
  }
}


import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { User } from '../_models/User';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get(this.baseUrl + 'users', this.requestOptions())
      .pipe(catchError(this.handleError)) as Observable<User[]>;
  }

  getUser(id: number): Observable<User> {
    return this.http.get(this.baseUrl + 'users/' + id)
    .pipe(catchError(this.handleError)) as Observable<User>;
  }

  requestOptions() {
    return {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };
  }
  private handleError(errorResponse: HttpErrorResponse) {
    const applicationError = errorResponse.headers.get('Application-Error');
    if (applicationError) {
      return throwError(applicationError);
    }
    const serverError = errorResponse.error.errors;
    if (serverError) {
      let modelStateError = '';
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateError += serverError[key] + '\n';
        }
      }
      return throwError(modelStateError || 'Server Error');
    }
  }
}

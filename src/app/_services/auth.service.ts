import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http
      .post(this.baseUrl + 'login', model, this.requestOptions())
      .pipe(
        map(response => {
          const user: User = response as User;
          if (user) {
            localStorage.setItem('token', user.tokenString);
            this.userToken = user.tokenString;
            this.decodedToken = this.jwtHelper.decodeToken(this.userToken);
          }
        }),
        catchError(this.handleError)
      );
  }

  reigster(model: any) {
    return this.http.post(
      this.baseUrl + 'register',
      model,
      this.requestOptions()
    ).pipe(catchError(this.handleError));
  }

  requestOptions() {
    return {
      headers: new HttpHeaders({ 'Content-type': 'application/json' })
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

  loggedIn() {
    return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
  }
}
export class User {
  tokenString: any;
}

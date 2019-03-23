import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/User';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Photo } from '../_models/Photo';
@Injectable({
  providedIn: 'root'
})


export class AuthService {
  photoUrl = new BehaviorSubject<string>('');
  baseUrl = environment.apiUrl + 'auth/';
  userToken: any;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  private userBehaviorSubject = new BehaviorSubject<User>(
    JSON.parse(localStorage.getItem('user')) as User
  );
  currentUserObservable: Observable<User> = this.userBehaviorSubject.asObservable();
  currentUser: User;
  constructor(private http: HttpClient) {}

  changeCurrentUser(user: User) {
    this.userBehaviorSubject.next(user);
    this.changePhotosForCurrentUser(user.photos);
  }
  changePhotosForCurrentUser(photos: Photo[]) {
    this.currentUser.photos = photos;
    this.currentUser.mainPhotoUrl = this.currentUser.photos.find(
      p => p.isMain === true
    ).url;
    this.userBehaviorSubject.next(this.currentUser);
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  login(model: any) {
    return this.http
      .post(this.baseUrl + 'login', model, this.requestOptions())
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem('token', response.tokenString);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.userToken = response.tokenString;
            const user = response.user as User;
            this.changeCurrentUser(user);
          this.changePhotosForCurrentUser(user.photos);
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

    if (serverError !== undefined) {
      let modelStateError = '';
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateError += serverError[key] + '\n';
        }
      }
      return throwError(modelStateError || 'Server Error');
    }
    return throwError('error');
  }

  loggedIn() {
    return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
  }
}

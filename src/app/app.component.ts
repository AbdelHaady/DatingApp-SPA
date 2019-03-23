import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { User } from './_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  title = 'DatingAppSPA';

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')) as User;
    this.authService.decodedToken = this.authService.jwtHelper.decodeToken(localStorage.getItem('token'));
    if (user) {
      this.authService.changeCurrentUser(this.authService.initialUser(user));
      this.authService.currentUserObservable.subscribe(u => this.authService.currentUser = u);
    }
  }

}

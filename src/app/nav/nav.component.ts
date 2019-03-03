import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authService: AuthService, private alertifyService: AlertifyService) {}

  ngOnInit() {}

  loggedIn() {
    return this.authService.loggedIn();
  }

  login() {
    this.authService.login(this.model).subscribe(
      data => {
        this.alertifyService.success('logged in successfuly');
      },
      error => {
        this.alertifyService.error(error);
      }
    );
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
  }
}

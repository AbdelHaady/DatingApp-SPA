import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(private auth: AuthService) {}

  ngOnInit() {}

  loggedIn(){
    return !!localStorage.getItem('token');
  }

  login() {
    this.auth.login(this.model).subscribe(
      data => {
        console.log('logged in successfuly');
      },
      error => {
        console.log(error);
      }
    );
  }

  logout(){
    this.auth.userToken = null;
    localStorage.removeItem('token');
    console.log('logged out');
  }
}

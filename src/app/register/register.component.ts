import { Component, OnInit, Input, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { EventEmitter } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};

  @Input() valuesFromHome: any;

  @Output() cancelRegister = new EventEmitter();
  constructor(private authService: AuthService, private alertifyService: AlertifyService) {}

  ngOnInit() {}

  register() {
    this.authService.reigster(this.model).subscribe(
      () => {
        this.alertifyService.success('registered successfully');
      },
      error => {
        this.alertifyService.error(error);
      }
    );
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}

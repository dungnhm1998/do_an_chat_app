import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group(
    {
      email: ['', Validators.required],
      password: ['', Validators.required]
    }
  );
  email;
  password;
  receiverId;

  constructor(private fb: FormBuilder, private _service: DataService, private router: Router) { }

  ngOnInit() {

  }

  onSubmit() {
    //truy cap den cac truong trong form
    // debugger
    this.email = this.loginForm.value.email;
    this.password = this.loginForm.value.password;
    //goi den api login tren server:
    let data = {};
    data['email'] = this.email;
    data['password'] = this.password;
    // debugger
    this._service.login(data).subscribe(
      (response) => {
        console.log(response)
        // localStorage.setItem('token', response['token']);
        this.router.navigate(['/dashboard']);
      }
      ,
      err => {
        alert("dang nhap khong thanh cong")
      }
    );
  }

  accessDashboard(){
    this._service.dashboard(this.receiverId);
  }

  // accessPublicInfo() {
  //   this._service.checkIsLogin(etItem('token')).subscribe(
  //     (data: Object) => {
  //       //in ra ket qua dang nhap
  //       console.log(data)
  //     }
  //     ,
  //     err => {
  //       alert("truy cap khong thanh cong")
  //     }
  //   );
  // }
}

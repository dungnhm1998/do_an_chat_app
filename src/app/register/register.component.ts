import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      account: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    }
  );
  
  constructor(private fb: FormBuilder, private _service: DataService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    //truy cap den cac truong trong form
    var infoUser={
      "userID":"",
      "email":this.registerForm.value.email,
      "account":this.registerForm.value.account,
      "password":this.registerForm.value.password,
      "userName":this.registerForm.value.username
    }
    
    //goi den api login tren server:
    this._service.registerUser(infoUser).subscribe(
      (data: Object) => {
        alert("dang ky thanh cong")
        //in ra ket qua dang nhap
        this.router.navigate(['/login']);
      }
      ,
      err => {
        alert("dang ky khong thanh cong")
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private fb: FormBuilder, private _service: DataService, private router: Router) { }

  response: Object = {};
  receiverId: string;
  userInfo: Object;
  userId: string;
  contactList : Object[] = [];
  chatHistory: Object[] = [];
  // chat = {
  //   chatHistory: [],
  //   receiverId: '',
  //   receiverType: ''
  // }
  searchText;

  ngOnInit() {
    this._service.dashboard(this.receiverId).subscribe(
      (res) => {
        this.response = res;
        this.contactList = res['contactList'];
        this.userInfo = this.response["userInfo"];
        this.userId =  this.userInfo['userId']
        localStorage.setItem(this.userId, JSON.stringify(this.response));
      }
    );
  }

  onclick() {
    console.log("response = ", this.response);
    console.log("okok", this.contactList);
  }

  onClickUser(receiverId) {
    this._service.dashboard(receiverId).subscribe(
      (res) => {
        // console.log(res)
        this.response = res;
        this.contactList = res['contactList'];
        this.userInfo = this.response["userInfo"];
        this.chatHistory = this.response["chatHistory"];
        this.receiverId = receiverId
        localStorage.setItem(this.userId, JSON.stringify(this.response));
      }
      ,
      err => {
        alert("data not found")
      }
    );
  }

  onSubmit() {
    this._service.dashboard(this.receiverId).subscribe(
      (response) => {
        // console.log(response)
        this.chatHistory = response['chatHistory']
        // this.router.navigate(['/chat']);
      }
      ,
      err => {
        alert("data not found")
      }
    );
  }

  onSearch(search){
    this._service.searchBar(this.receiverId, this.searchText).subscribe(
      (response) => {
        console.log(response)
        // this.router.navigate(['/chat']);
      }
      ,
      err => {
        alert("data not found")
      }
    );
  }

}

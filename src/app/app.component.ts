import { Component } from '@angular/core';

import {FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DoAn';
  loginForm = this.fb.group({
    username: [' '], password: [' ']
  });

  constructor(private fb:
    FormBuilder) { }

  
}


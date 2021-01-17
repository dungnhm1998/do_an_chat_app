import { Component, OnInit } from '@angular/core';
import { DataService, User, Chat, Group } from '../data.service';
import { Observable } from 'rxjs';
// import { ConsoleReporter } from 'jasmine';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  users = [];
  groups = [];
  chat = {
    chatDetail: [],
    receiverID: '',
    receiverType: ''
  }
  activeUsers = []
  userID;
  searchText;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    //check login
    // this.dataService.checkIsLogin(localStorage.getItem('token')).subscribe(
    //   (data: Object) => {
    //     //in ra ket qua dang nhap
    //     this.userID = data['user']
    //     this.getAllUser()
    //     this.getAllGroupsByUserID(this.userID)
        this.registerSocket(this.userID)
        this.dataService.broadcastWhenHasAnyLogin()
    //     this.dataService.onAnyoneLogin().subscribe(data => {
    //       this.activeUsers = data
    //       console.log(this.activeUsers)
    //       console.log(this.activeUsers[this.users[0].userID])
    //     })
    //   }
    //   ,
    //   err => {
    //     alert("truy cap khong thanh cong")
    //   }
    // );
  }

  onClickTest(){
      console.log("xxx",JSON.parse(localStorage.getItem("dashboardResponse")));
      
  }

  registerSocket(id) {
    this.dataService.register_socket(id)
  }

  registerRoom(roomID) {
    this.dataService.register_room(roomID)
  }

  getAllUser() {
    this.dataService.getAllUser()
      .subscribe((data: Array<User>) => {
        this.users = data
        console.log(this.users)
      })
  }

  getAllGroupsByUserId(id) {
    this.dataService.getAllGroupsByUserId(id)
      .subscribe((data: Array<Group>) => {
        this.groups = data
        //đăng ký room
        for (var i = 0; i < data.length; i++) {
          this.registerRoom(data[i]['groupID'])
        }
      })
  }

  onClick(sender, receiver, type) {
    var param = {
      "ID1": sender,
      "ID2": receiver,
      "type": type
    }
    this.chat['receiverID'] = param['ID2']
    this.chat['receiverType'] = param['type']

    this.dataService.getInfoChat(param)
      .subscribe((data: Array<Chat>) => {
        this.chat['chatDetail'] = data
      })

    this.dataService.getInfoUser(param['ID2'],param['type'])
      .subscribe((data: Object) => {
        this.chat['infoReceiver'] = data
        console.log(this.chat['infoReceiver'])
      })
  }

}

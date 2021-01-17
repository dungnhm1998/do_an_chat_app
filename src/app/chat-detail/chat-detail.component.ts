import { Component, OnInit, Input } from '@angular/core';
import { DataService, Chat } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css']
})
export class ChatDetailComponent implements OnInit {
  @Input() chatDetailCom: any;
  @Input() chatHistory: any;
  @Input() userId;
  @Input() receiverId;
  userIsChatWith;
  userInfo;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem(this.userId))['userInfo'];
    this.chatHistory = JSON.parse(localStorage.getItem(this.userId))['chatHistory'];
    console.log(this.chatHistory,"kokok")
    this.userId = this.userInfo.id;
    this.receiverId = (this.chatHistory[0].receiver != this.userId) ? (this.chatHistory[0].receiver) : (this.chatHistory[0].sender)
    //this.chatHistory = JSON.parse(localStorage.getItem("dashboardResponse"))['historyChat'];
    //console.log("this.chatDetailCom = ", this.chatHistory);

    //subcribe to receive when on message
    // this.dataService.onNewMessage().subscribe(data => {
    //   var param = {
    //     "ID1": data.sender,
    //     "ID2": data.username,
    //     "type": data.type
    //   }

    //   this.dataService.getInfoChat(param)
    //     .subscribe((result: Array<Chat>) => {
    //       this.chatDetailCom['chatDetail'] = result
    //     });
    // });

    // this.dataService.onNewRoomMessage().subscribe(data => {
    //   var param = {
    //     "ID1": this.userId,
    //     "ID2": data['room'],
    //     "type": 'g'
    //   }

    //   console.log(param)

    //   this.dataService.getInfoChat(param)
    //     .subscribe((result: Array<Chat>) => {
    //       this.chatDetailCom['chatDetail'] = result
    //     });
    // });
  }

  formatDate(date) {
    if (date != null) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    } else {
      return "";
    }
  }

  onSubmit(message) {
    var chat = {
      "content": message,
      "receiver": this.receiverId,
      "sender": this.userId,
      "type": "u"
    }
    // debugger
    // this.chatDetailCom.push(chat)
    this.dataService.addChat(chat).subscribe((data: Object) => {
      this.dataService.sendPrivateMessage(chat['sender'], chat['receiver'], chat['type'])
    })
    this.dataService.dashboard(this.receiverId).subscribe(
      (res) => {
        this.chatHistory = res["chatHistory"];
        localStorage.setItem(this.userId, JSON.stringify(res));
      }
      ,
      err => {
        alert("data not found")
      }
    );

  }

  showChat(receiverId) {
    this.dataService.dashboard(receiverId).subscribe(
      (response) => {
        console.log("show chat with user", response)
        // this.chatDetailCom = response
        // console.log(this.chatDetailCom['chatHistory'])
        // this.router.navigate(['/dashboard']);
      }
      ,
      err => {
        alert("dang nhap khong thanh cong")
      }
    );
  }

  onClickTest() {
    console.log("shows chat", this.chatHistory)
    console.log("shows userId", this.userId)
    console.log("shows receiver", this.receiverId)
  }

  openSetting(){
    
  }

  //reload when receiving new message

}

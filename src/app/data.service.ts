import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as $ from "jquery";
import * as io from 'socket.io-client';
import { templateJitUrl } from '@angular/compiler';

export interface User {
  account: string,
  email: string,
  password: string,
  userId: number,
  userName: string
}

export interface Chat {
  chatId: number,
  content: string,
  receiver: number,
  sender: number,
  time: string,
  type: string
}

export interface Group {
  admin: number,
  groupId: number,
  groupName: string
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  rootURL = "http://localhost:8085/dashchat/api";

  constructor(private http: HttpClient) { }

  //------------------API-----------------------------
  getAllUser(): Observable<Array<User>> {
    return this.http.get<Array<User>>(this.rootURL + "/user/getAll");
  }

  getAllUsersByUserId(userId): Observable<Array<User>> {
    return this.http.get<Array<User>>(this.rootURL + "/chat/getChatId/" + userId);
  }

  getAllGroupsByUserId(userId): Observable<Array<Group>> {
    return this.http.get<Array<Group>>(this.rootURL + "/group/findGroupById/" + userId);
  }

  getInfoChat(param): Observable<Array<Chat>> {
    return this.http.post<Array<Chat>>(this.rootURL + "/chat/getinfochat", param);
  }

  addChat(req): Observable<Object> {
    return this.http.post<Object>(this.rootURL + "/chat" + "?type=" + req.type, {
      "receiver": req.receiver,
      "content": req.content
    });
  }

  registerUser(user): Observable<Object> {
    return this.http.post<Object>(this.rootURL + "/user/addUser", user);
  }

  getInfoUser(Id, type): Observable<Object> {
    if (type == 'u') {
      return this.http.get<Object>(this.rootURL + "/user/getuserbyId/" + Id);
    } else {
      return this.http.get<Object>(this.rootURL + "/group/getgroupbyId/" + Id);
    }
  }

  searchBar(receiver, searchText): Observable<Object> {
      return this.http.get<Object>(this.rootURL + "/search-bar" + "?receiver="+receiver+"&searchText="+searchText);
  }

  //------------------API-END----------------------

  //socket service



  // login(username,password):Observable<Object>{
  //   console.log(username+" "+password)
  //   return this.http.post<Object>(this.rootURL+"/login",{"username":username,"password":password});
  // }

  login(data): Observable<Object> {
    return this.http.post<Object>(this.rootURL + "/login", { "email": data.email, "password": data.password });
  }

  dashboard(receiverId): Observable<Object[]> {
    return this.http.get<Object[]>(this.rootURL + "/dashboard" + "?receiver=" + receiverId);
  }

  // checkIsLogin(token): Observable<Object> {
  //   return this.http.post<Object>(this.rootURL + "/isLogin", { "token": token });
  // }


  //===========================================================================
  socket = io.connect('http://localhost:3000');

  // Add a username
  register_socket(id) {
    this.socket.emit("add-user", {
      "username": id
    });
  }

  register_room(roomId) {
    this.socket.emit('create', roomId);
  }

  broadcastWhenHasAnyLogin() {
    this.socket.emit('broadcast', 'update user log')
  }

  sendPrivateMessage(senderId, receiverId, type) {
    if (type == 'u') {
      this.socket.emit("private-message", {
        "sender": senderId,
        "receiver": receiverId,
        "type": type
      });
    }
    else {
      this.socket.emit("room-message", {
        "room": receiverId,
      });
    }
  }

  // Whenever we receieve a message, append it to the <ul>

  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('add-message', msg => {
        observer.next(msg);
      });
    });
  }

  onNewRoomMessage() {
    return Observable.create(observer => {
      this.socket.on('event', msg => {
        observer.next(msg);
      });
    });
  }

  onAnyoneLogin() {
    return Observable.create(observer => {
      this.socket.on('update', msg => {
        observer.next(msg);
      });
    });
  }

  //===========================================================================
  // socket.on("event", function(data) {
  //   console.log(data)
  //   $("#messages").append($("<li>", {
  //     "text": data.content
  //   }));
  // });

}

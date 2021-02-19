import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from 'primeng/primeng';
import * as signalR from '@aspnet/signalr';
import {version} from '../../package.json';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    // private _hubConnection: HubConnection;
    // msgs: Message[] = [];

    constructor() { }

    ngOnInit(): void {
        localStorage.setItem("Version",version);
        // this._hubConnection = new HubConnectionBuilder().withUrl('http://r3app-server/FOUNDATION/notify').build();
        // this._hubConnection
        //     .start()
        //     .then(() => console.log('Connection started!'))
        //     .catch(err => console.log('Error while establishing connection :('));

        // this._hubConnection.on('BroadcastMessage', (type: string, payload: string, user: string) => {
        //     var currentUser = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        //     var userId = currentUser['refUserId'].toString();
        //     if (userId == user) {
        //         this.msgs.push({ severity: type, summary: payload });
        //     }
        // });
        // this._hubConnection.on('SendPrivateMessage', (user: string, message: string, payload: string) => {
        //     console.log(user)
        //     console.log(message)
        // });
        // this._hubConnection.on('SendMessageToClient', (title, user, message) => {
        //     const received = `title: ${title}, name: ${user}, message: ${message}`;
        //     console.log(received);
        // });
    }
}
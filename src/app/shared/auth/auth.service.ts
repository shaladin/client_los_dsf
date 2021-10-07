import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

interface myData{
  success: boolean,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'true')
  // private loggedInStatus = false

  constructor(private http: HttpClient) {}

  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(email: string, password: string) {
    //your code for checking credentials and getting tokens for for signing in user
  }

  logout() {   
    this.token = null;
  }

  getToken() {    
    return this.token;
  }
  
  setLoggedIn(value: boolean){
    this.loggedInStatus = value
  }

  isAuthenticated() {
    // here you can check if user is authenticated or not through his token 
    return this.loggedInStatus;
  }

  get isLoggedIn()
  {
    return this.loggedInStatus;
  }

  
  getuserDetails(username, password){
    // Post these details to API server return user info if correct
    return this.http.get(AdInsConstant.Login);
    // return this.http.post('/api/auth.php',{
    //   username,
    //   password
    // })
    // if(username=="admin" && password=="admin"){
    //   username="Admin";
    //   password="Admin";
    //   return username,password;
    // }
  }
}

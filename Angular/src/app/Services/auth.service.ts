import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const BASE_URL="https://localhost:44331/api/auth/"

@Injectable({
    providedIn:"root"
})
export class AuthService{

    url = 'https://localhost:44331/api/TranslationWebAPI/uploadFileWithFromTo';
    constructor(private httpClient:HttpClient){}
    isLoggedIn=()=>localStorage.getItem("token")!=null;
    logout=()=>localStorage.removeItem("token");
    login=(email:string, password:string):Promise<any>=> this.httpClient.post(BASE_URL+"login", {email, password}, {responseType: 'text'}).toPromise().then(x=>{if(x)localStorage.setItem("token", x);return x;});
    signup=(name:string,email:string, password:string):Promise<any>=> this.httpClient.post(BASE_URL+"signup", {name,email, password},{responseType: 'text'}).toPromise().then(x=>{if(x)localStorage.setItem("token", x);return x;});
}
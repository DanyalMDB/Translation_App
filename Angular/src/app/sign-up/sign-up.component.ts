import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  isError:boolean=false;
  errorMessage:string="";
  isSuccess:boolean=false;
  successMessage:string="";
  loginForm:FormGroup;
  signUpForm:FormGroup;
  constructor(private router:Router, private authService:AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl(""),
      password: new FormControl("")
    });
    this.signUpForm = new FormGroup({
      name: new FormControl(""),
      email: new FormControl(""),
      password: new FormControl("")
    });
  }

  ngOnInit(): void {
    document.querySelector('.img__btn').addEventListener('click', function () {
      document.querySelector('.cont').classList.toggle('s--signup');
  });
  if(this.authService.isLoggedIn())this.router.navigateByUrl("/Translation");
  }


  onLoginSubmit() {
    console.log(this.loginForm.value);
    this.resetError();
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then(x => {
        console.log(x);
        localStorage.setItem("token" ,x);
        this.router.navigateByUrl("/Translation")
      }).catch(err => {
        this.isError = true;
        console.log(err)
        this.errorMessage = "login failed due to some unknown reasons";
      })
    }
    else {
      this.isError = true;
      this.errorMessage = "Form has some invalid values";
    }
  }
  onSignupSubmit(){
    this.resetError();
    if (this.signUpForm.valid) {
      this.authService.signup(this.signUpForm.value.name,this.signUpForm.value.email, this.signUpForm.value.password).then(x => {
        console.log(x);
        //this.router.navigateByUrl("/Translation")
        localStorage.setItem("token" ,x);
        //this.router.navigateByUrl("/Translation")
        this.isSuccess=true;
        this.successMessage="Sign Up successful, Please login with your credentials";
      }).catch(err => {
        this.isError = true;
        console.log(err)
        this.errorMessage = "login failed due to some unknown reasons";
      })
    }
    else {
      this.isError = true;
      this.errorMessage = "Form has some invalid values";
    }
  }

  resetError(){
    
    this.isError=false;
    this.errorMessage="";
    this.isSuccess=false;
    this.successMessage="";
  }
}

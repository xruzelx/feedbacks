import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { EMAIL_REGEXP } from 'src/configs/consts.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AurhService } from '../auth.service';
import { FeedbackService } from '../feedback.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  currentTab:string = 'login';

  registerForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.pattern(EMAIL_REGEXP)]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
    
  });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEXP)]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
  });

  constructor(
    public authService: AurhService,
    public feedbackService: FeedbackService,
    public afs: AngularFirestore,
    public router: Router,
  ){}


  tryRegister(){
    if(this.registerForm.valid){
      this.authService.doRegister(this.registerForm.value)
      .then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    } else {
      Object.keys(this.registerForm.controls).forEach(control => this.registerForm.controls[control].markAsTouched());
    }
  }

  tryLogin(){
    if(this.loginForm.valid){
      this.authService.doLogIn(this.loginForm.value)
      .then(res => {
        this.router.navigate(['/']);
      }, err => {
        console.log(err);
      })
    } else {
      Object.keys(this.loginForm.controls).forEach(control => this.loginForm.controls[control].markAsTouched());
    }
  }

  changeTab(value){
    this.currentTab = value;
  }
}

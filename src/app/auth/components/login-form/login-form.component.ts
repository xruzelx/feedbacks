import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { EMAIL_REGEXP } from 'src/configs/consts.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AurhService } from 'src/app/auth.service';
import { FeedbackService } from 'src/app/feedback.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {

  iserrorMessage: boolean = false;
  errorMessage: string;

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

  tryLogin(){
    if(this.loginForm.valid){
      this.authService.doLogIn(this.loginForm.value)
      .then(res => {
        this.router.navigate(['/']);
      }, err => {
        this.showError(err.message)
        console.log(err);
      })
    } else {
      Object.keys(this.loginForm.controls).forEach(control => this.loginForm.controls[control].markAsTouched());
    }
  }

  showError(msg){
    this.iserrorMessage = true;
    this.errorMessage = msg
  }
}

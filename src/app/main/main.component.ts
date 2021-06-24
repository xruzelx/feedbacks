import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { EMAIL_REGEXP } from 'src/configs/consts.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { FeedbackService } from '../feedback.service';
import { AurhService } from '../auth.service';
import { Feedback } from '../feedback';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent {
  isAuthorized: boolean = false

  feedbacks: Array<Feedback>

  iserrorMessage: boolean = false;
  errorMessage: string;

  isSuccessMessage: boolean = false;
  successMessage: string = 'Заявка отправлена!';

  feedbackForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEXP)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(18)]),
    name: new FormControl('',Validators.required),
  });


  constructor(
    public authService: AurhService,
    public feedbackService: FeedbackService,
    public afs: AngularFirestore,
  ){
    this.authService.getStatus().subscribe(() => {
      this.checkAuth()
    });
  }
  trySendForm(){
    if(this.feedbackForm.valid){
      this.feedbackService.doSendForm(this.feedbackForm.value).subscribe(
        () => {
          this.showSuccessMsg()
        },
        error => {
          this.showError(error.statusText)
        },
        )
      
    } else {
      Object.keys(this.feedbackForm.controls).forEach(control => this.feedbackForm.controls[control].markAsTouched());
   }
  }

  showError(msg){
    this.iserrorMessage = true;
    this.errorMessage = msg
  }

  showSuccessMsg(){
    this.isSuccessMessage = true;
    this.feedbackForm.reset();
    this.getFeedbacks();
  }

  ngOnInit() {
    this.checkAuth()
    if(this.isAuthorized) {
      this.getFeedbacks();
    }
  }
  checkAuth(){
    this.authService.isAuthorized().subscribe(e => this.isAuthorized = e)
  }

  getFeedbacks(){
    this.feedbackService.getFeedbacks().subscribe(
      items => {
        this.feedbacks = Object.keys(items).map(index => {
          let person = items[index];
          return person;
        });
      }
    );
  }
}

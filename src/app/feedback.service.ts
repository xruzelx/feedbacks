import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: { 'api-version': '1.0' }
};

@Injectable()
export class FeedbackService{
    constructor(
        public afs: AngularFirestore,
        private http: HttpClient,
    ){}

    doSendForm(value): Observable<any>{
      let body =  JSON.stringify(value);
      return this.http.post('https://feedback-6f4f1-default-rtdb.europe-west1.firebasedatabase.app/feedbacks.json',body ,httpOptions)
    }

    getFeedbacks(): Observable<any>{
      return this.http.get('https://feedback-6f4f1-default-rtdb.europe-west1.firebasedatabase.app/feedbacks.json')
    }

}
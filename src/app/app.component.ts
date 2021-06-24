import { Component } from '@angular/core';
import { AurhService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isAuthorized: boolean

  constructor(
    public authService: AurhService,
  ){
    this.authService.getStatus().subscribe(() => {
      this.checkAuth()
    });
  }

  ngOnInit(){
    this.checkAuth()
  }

  tryLogOut(){
    this.authService.doLogOut()
  }

  checkAuth(){
    this.authService.isAuthorized().subscribe(e => this.isAuthorized = e)
  }
}

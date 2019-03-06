import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface myData {
  success: boolean,
  message: string;
}

interface registerResponse {
  success: boolean,
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false;
  constructor(private http: HttpClient) {
  }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  getUsersDetails(email, password) {
    return this.http.post<myData>('/api/login', {
      email,
      password
    });
  }

  registerUser(email, password) {
    return this.http.post<registerResponse>('/api/register', {
      email,
      password
    });
  }
}

import {Injectable} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class saveClass {
  setItem(arg0: string, user: any): any {
    throw new Error("Method not implemented.");
  }

  constructor(protected localStorage: LocalStorage) {
  }
}

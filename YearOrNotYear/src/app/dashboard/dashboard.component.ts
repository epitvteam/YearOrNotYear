import {Component, OnInit} from '@angular/core';
import {HttpClient, JsonpClientBackend} from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public closeResult;
  public items;
  public itemsHave;
  public cpy;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.http.get<any>('assets/json/module.json')
      .subscribe(data => {
        this.items = data;
        this.itemsHave = [];
      });
    this.getModulesSubscribed('');
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getInfos(autologin) {
    let baseUrl = 'http://intra.epitech.eu/' + autologin + '/user/?format=json';
    this.http.get<any>(baseUrl)
      .subscribe(data => {
        let loginUser = data.login;
        let firstnameUser = data.firstname;
        let lastnameUser = data.lastname;
        var jsonRtn = {'login': loginUser, 'firstname': firstnameUser, 'lastname': lastnameUser};
      });
  }

  async getDescription(autologin, modulecode, year, city) {
    let URLb = 'http://intra.epitech.eu/' + autologin + '/module/' + year + '/' + modulecode + '/' + city + '/?format=json';
    return(await this.http.get(URLb).toPromise());
  }

  async getModulesSubscribed(autologin) {
    let baseUrl = 'http://intra.epitech.eu/' + autologin + '/course/filter?format=json';
    var returnArray = [];
    var JsonInArray;
    var descriptions;
    var datas = await this.http.get<any>(baseUrl).toPromise();
    for (let entry of datas) {
      //REPLACE 2018 BY YEAR
      if ((entry.status == 'ongoing' || entry.status == 'valid') && entry.scolaryear == 2018) {
        descriptions = await this.getDescription(autologin, entry.code, entry.scolaryear, entry.codeinstance);
        JsonInArray = {'name': entry.title, 'scolaryear': entry.scolaryear, 'description': descriptions.description, 'credits': entry.credits};
        returnArray.push(JsonInArray);
      }
    }
    console.log(returnArray);
  }
}

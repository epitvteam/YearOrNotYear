import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';
//import { $ } from 'protractor';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  public closeResult;
  public items = [];
  public itemsHave = [];
  public calcul = 0;
  public cred = 0;
  public ModuleName;
  public description = 'NULL';
  email = 'Loading email';
  firstName = 'Loading firstName';
  lastName = 'Loading lastName';
  year = 'Loading year';

  constructor(private http: HttpClient, private modalService: NgbModal, private user: UserService,
              private router: Router, private auth: AuthService) {
  }

  createModule(event) {
    event.preventDefault();
    const target = event.target;
    const errors = [];
    const nameModule = target.querySelector('#nameModule').value;
    const cred = target.querySelector('#cred').value;

    if (errors.length === 0) {
      this.auth.createModule(nameModule, cred).subscribe(data => {
        if (data.success) {
          console.log('Module set in DB');
        }
      });
    }
  }

  ngOnInit(): void {
    this.getModulesOnDB();
  }

  async getModulesOnDB() {
    let i = 0;
    let data = await this.user.getData().toPromise();
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.year = data.year;
    this.items = data.modulesAdd;
    this.items = this.items['0'].Module;
    for (let each of data.modulesAdd) {
      if (i > 0) {
        this.items = this.items.concat(each);
      }
      i++;
    }
    return data;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.get_credit();
      this.calculGradient();
    }
  }

  open(content, data) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (typeof data !== 'undefined') {
      this.cred = data.credits;
      this.description = data.description;
      this.ModuleName = data.name;
    }
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

  addmin_cred_counter(param) {
    if (param == '+')
      this.cred++;
    if (param == '-')
      if (this.cred > 0)
        this.cred--;
  }

  ret_cred_counter() {
    let i = 0;
    for (let each of this.itemsHave) {
      if (each.name === this.ModuleName) {
        this.itemsHave[i].credits = this.cred;
        break;
      }
      i++;
    }
    i = 0;
    for (let echs of this.items) {
      if (echs.name === this.ModuleName) {
        this.items[i].credits = this.cred;
        break;
      }
      i++;
    }
    this.get_credit();
    this.calculGradient();
  }

  get_csv() {
    const tab = Object.assign([], this.itemsHave);
    let len = tab.length;
    for (let loop = 0; loop != len ; loop++) {
      delete tab[loop].description;
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Votre simulation de crédits',
      useBom: true,
      noDownload: false,
      headers: ["Nom du module", "Année", "Crédits", "Etat"]
    };
    if (len > 0)
      new Angular5Csv(tab, this.lastName.concat(this.firstName), options);
    else
      alert("Aucun module à exporter");
  }

  get_credit() {
    this.calcul = 0;
    for (let loop of this.itemsHave) {
      if (loop.status !== 'fail') {
        this.calcul += Number(loop.credits);
      }
    }
  }

  async getScolarYear(autologin) {
    const URL = 'https://intra.epitech.eu/' + autologin + '/user/?format=json';
    let data = await this.http.get<any>(URL).toPromise();
    return (data.scolaryear);
  }

  async getDescription(autologin, modulecode, year, city) {
    const URLb = 'http://intra.epitech.eu/' + autologin + '/module/' + year + '/' + modulecode + '/' + city + '/?format=json';
    return (await this.http.get(URLb).toPromise());
  }

  async getModulesSubscribed(autologin) {
    let baseUrl = 'http://intra.epitech.eu/' + autologin + '/course/filter?format=json';
    var returnArray = [];
    var JsonInArray;
    var descriptions;
    var datas = await this.http.get<any>(baseUrl).toPromise();
    var scolarY = await this.getScolarYear(autologin);

    for (let entry of datas) {
      if ((entry.status == 'ongoing' || entry.status == 'valid' || entry.status == 'fail') && entry.scolaryear == scolarY) {
        descriptions = await this.getDescription(autologin, entry.code, entry.scolaryear, entry.codeinstance);
        JsonInArray = {
          'name': entry.title,
          'scolaryear': entry.scolaryear,
          'description': descriptions.description,
          'credits': entry.credits,
          'status': entry.status
        };
        returnArray.push(JsonInArray);
      }
    }
    console.log(returnArray);
    this.itemsHave = returnArray;
    this.get_credit();
    this.calculGradient();
    return (returnArray);
  }

  async getModulesNotSubscribed(autologin) {
    const baseUrl = 'http://intra.epitech.eu/' + autologin + '/course/filter?format=json';
    var returnArray = [];
    var JsonInArray;
    var descriptions;
    var datas = await this.http.get<any>(baseUrl).toPromise();
    var scolarY = await this.getScolarYear(autologin);

    for (let entry of datas) {
      if (entry.status == 'notregistered' && entry.scolaryear == scolarY) {
        descriptions = await this.getDescription(autologin, entry.code, entry.scolaryear, entry.codeinstance);
        JsonInArray = {
          'name': entry.title, 'scolaryear': entry.scolaryear, 'description': descriptions.description,
          'credits': entry.credits, 'status': entry.status
        };
        returnArray.push(JsonInArray);
      }
    }
    console.log(returnArray);
    this.items = returnArray;
    return (returnArray);
  }

  calculGradient() {
    const element: HTMLElement = document.getElementById('gradient');

    if (this.calcul <= 40 && this.calcul > 0) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, red, white, white)');
    } else if (this.calcul < 60 && this.calcul > 40) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, orange, white)');
    } else if (this.calcul >= 60 && this.calcul < 75) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, green, green, green, green, white)');
    } else if (this.calcul <= 0) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, grey, lightgrey)');
    } else if (this.calcul >= 75) {
      element.setAttribute('style', 'background-image: linear-gradient(to right, red, yellow, purple, blue, green)');
    }
  }

  clear() {
    this.items = this.items.concat(this.itemsHave);
    this.itemsHave = [];
    this.get_credit();
    this.calculGradient();
  }

  async load(token: string) {
    let i = 0;
    let img = document.querySelector('.gifimg');
    let auth = token.substr(25);
    let data = await this.getModulesOnDB();
    img.setAttribute('src', 'assets/images/chargement.gif');
    img.setAttribute('style', 'width: 30px');
    await this.getModulesSubscribed(auth);
    await this.getModulesNotSubscribed(auth);
    img.setAttribute('src', '');
    img.setAttribute('style', '');
    for (let each of data.modulesAdd) {
      if (i > 0) {
        this.items = this.items.concat(each);
      }
      i++;
    }
  }

  showProfile(state) {
    if (state === 1) {
      $('.profile').fadeIn(100);
    } else {
      $('.profile').fadeOut(50);
    }
  }
}

/*import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import jsonFile from "../assets/test2.json";
import { from } from "rxjs";

@Injectable()
export class JsonService {
  test: any = jsonFile;
  constructor(private http: HttpClient) {}

  getAllQuestion(): Observable<any[]> {
    const myObservable: any = from(this.test);
    return myObservable;
  }
}
*/
/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(private http: HttpClient) { }

  getJsonData(jsonLink: string): Observable<any> {
    return this.http.get<any>(jsonLink);
  }

  getAllData(jsonLink: string): Observable<any[]> {
    return this.http.get<any>(jsonLink).pipe(
      map(data => {
        if (data) {
          return data;
        }
        return [];
      })
    );
  }
}

*/
  /*
  getDataData(jsonLink: string): Observable<any[]> {
    return this.http.get<any>(jsonLink).pipe(
      map(data => {
        if (data && data.data && data.data.length > 0) {
          return data.data;
        }
        return [];
      })
    );
  }
  getConfigData(jsonLink: string): Observable<any[]> {
    return this.http.get<any>(jsonLink).pipe(
      map(data => {
        if (data && data.config && data.config.length > 0) {
          return data.config;
        }
        return [];
      })
    );
  }
}*/

/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {

  constructor() { }
}

*/
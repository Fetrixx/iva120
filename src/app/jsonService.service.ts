import { Injectable } from "@angular/core";
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

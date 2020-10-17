import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import { catchError, map, retry } from "rxjs/operators";
import { Subscription, BehaviorSubject, throwError } from "rxjs";
import { ErrorExcptionResult } from "../models/errorExcptionResult";
import { CaptchaModel } from "../models/CaptchaModel";
import { environment } from "src/environments/environment";
import { LinkManagementTargetShortLinkSetDtoModel } from "../models/LinkManagement/linkManagementTargetShortLinkSetDtoModel";
import { LinkManagementTargetShortLinkGetDtoModel } from "../models/LinkManagement/linkManagementTargetShortLinkGetDtoModel";
import { LinkManagementTargetShortLinkSetResponceModel } from "../models/LinkManagement/linkManagementTargetShortLinkSetResponceModel";
import { LinkManagementTargetShortLinkGetResponceModel } from "../models/LinkManagement/linkManagementTargetShortLinkGetResponceModel";
import { Router } from "@angular/router";
import { FileUploadChunkDtoModel } from "../models/FileManager/fileUploadChunkDtoModel";

@Injectable()
export class CmsService implements OnDestroy {
  subManager = new Subscription();
  baseUrl = environment.configApiServerPath; // "https://apicms.ir/api/v1/";
  public configApiRetry = environment.configApiRetry;

  ErrorMessage = "";
  constructor(private http: HttpClient) {}
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  getHeaders() {
    const token = "" + localStorage.getItem("token");
    const headers = { Authorization: token };
    return headers;
  }
  handleError(error) {
    if (!error) return;
    let errorMessage = error.message;
    if (error.status) {
      if (error.status == 401) {
        //this.router.navigate([environment.cmsUiConfig.Pathlogin]);
      }
      // server-side error
      errorMessage = `Cms Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status == 401 || error.status == "401") {
      }
    } else if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Cms Error: ${error.error.message}`;
    }

    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  errorExcptionResultCheck<TOut>(model: ErrorExcptionResult<TOut>) {
    if (model) {
      if (model.IsSuccess) {
      } else {
        this.ErrorMessage = model.ErrorMessage;
      }
    }
    return model;
  }

  ServiceCaptcha() {
    return this.http.get(this.baseUrl + "auth/captcha").pipe(
      map((ret: ErrorExcptionResult<CaptchaModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
          } else {
            this.ErrorMessage = ret.ErrorMessage;
          }
          return ret;
        }
      })
    );
  }

  ServiceShortLinkSet(model: LinkManagementTargetShortLinkSetDtoModel) {
    if (model == null) model = new LinkManagementTargetShortLinkSetDtoModel();

    return this.http
      .post(this.baseUrl + "LinkManagementTarget" + "/ShortLinkSet/", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map(
          (
            ret: ErrorExcptionResult<
              LinkManagementTargetShortLinkSetResponceModel
            >
          ) => {
            return this.errorExcptionResultCheck<
              LinkManagementTargetShortLinkSetResponceModel
            >(ret);
          }
        )
      );
  }
  ServiceShortLinkGet(model: LinkManagementTargetShortLinkGetDtoModel) {
    if (model == null) model = new LinkManagementTargetShortLinkGetDtoModel();

    return this.http
      .post(this.baseUrl + "LinkManagementTarget" + "/ShortLinkGet/", model, {
        headers: this.getHeaders(),
      })
      .pipe(
        retry(this.configApiRetry),
        catchError(this.handleError),
        map(
          (
            ret: ErrorExcptionResult<
              LinkManagementTargetShortLinkGetResponceModel
            >
          ) => {
            return this.errorExcptionResultCheck<
              LinkManagementTargetShortLinkGetResponceModel
            >(ret);
          }
        )
      );
  }
 
  ServiceUploadFileNormal(file: File,fileName:string, handleProgressMethods: any) {
    handleProgressMethods(1);
    this.baseUrl = "http://localhost:2390/api/v1/";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    return this.http
      .post(this.baseUrl + "FileContent" + "/Upload/", formData, {
        headers: this.getHeaders(),
        reportProgress: true,
        observe: "events",
        responseType: "text",
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            handleProgressMethods(
              Math.round((100 / event.total) * event.loaded)
            );
          } else if (event.type == HttpEventType.Response) {
            handleProgressMethods(100);
            return event.body;
          }
        }),
        catchError((err: any) => {
          handleProgressMethods(0);
          alert(err.message);
          return throwError(err.message);
        })
      ); //.toPromise();
  }
}

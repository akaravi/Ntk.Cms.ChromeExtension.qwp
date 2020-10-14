import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { bindCallback, Subscription } from "rxjs";
import { catchError, map, retry, tap } from "rxjs/operators";
import { CmsService } from "src/app/cmsService/cms.service";
import { CaptchaModel } from "src/app/models/CaptchaModel";
import { LinkManagementTargetShortLinkGetDtoModel } from 'src/app/models/LinkManagement/linkManagementTargetShortLinkGetDtoModel';
import { LinkManagementTargetShortLinkGetResponceModel } from 'src/app/models/LinkManagement/linkManagementTargetShortLinkGetResponceModel';
import { LinkManagementTargetShortLinkSetDtoModel } from 'src/app/models/LinkManagement/linkManagementTargetShortLinkSetDtoModel';
import { LinkManagementTargetShortLinkSetResponceModel } from 'src/app/models/LinkManagement/linkManagementTargetShortLinkSetResponceModel';

import { TAB_ID } from "../../../../providers/tab-id.provider";

@Component({
  selector: "app-popup",
  templateUrl: "popup.component.html",
  styleUrls: ["popup.component.scss"],
})
export class PopupComponent implements OnInit {
  message: string;
  constructor(
    @Inject(TAB_ID) readonly tabId: number,
    private http: HttpClient,
    private cmsService: CmsService
  ) {}
  subManager = new Subscription();
  captchaModel: CaptchaModel = new CaptchaModel();
  modelTargetGetDto: LinkManagementTargetShortLinkGetDtoModel = new LinkManagementTargetShortLinkGetDtoModel();
  modelTargetGetResponce: LinkManagementTargetShortLinkGetResponceModel = new LinkManagementTargetShortLinkGetResponceModel();
  modelTargetSetDto: LinkManagementTargetShortLinkSetDtoModel = new LinkManagementTargetShortLinkSetDtoModel();
  modelTargetSetResponce: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();

  ngOnInit() {
    this.onCaptchaOrder();
  }
  async onClick(): Promise<void> {
    this.message = await bindCallback<string>(
      chrome.tabs.sendMessage.bind(this, this.tabId, "request")
    )()
      .pipe(
        map((msg) =>
          chrome.runtime.lastError
            ? "The current page is protected by the browser, goto: https://www.google.nl and try again."
            : msg
        )
      )
      .toPromise();
  }
  onCaptchaOrder() {
    this.subManager.add(
      this.cmsService.ServiceCaptcha().subscribe(
        (next) => {
          this.captchaModel = next.Item;
        },
        (error) => {
          this.message = "خطا در دریافت عکس کپچا";
        }
      )
    );
  }

  onSubmitSet() {
    this.modelTargetSetResponce= new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce= new LinkManagementTargetShortLinkGetResponceModel();

    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    this.message = "onSubmitSet";
 
    this.subManager.add(
      this.cmsService.ServiceShortLinkSet(this.modelTargetSetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.modelTargetSetResponce=next.Item;
          }
        },
        (error) => {
          
        }
      )
    );
  }
  onSubmitGet() {
    this.modelTargetSetResponce= new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce= new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetGetDto.CaptchaKey = this.captchaModel.Key;
    this.message = "onSubmitGet";
    this.subManager.add(
      this.cmsService.ServiceShortLinkGet(this.modelTargetGetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.modelTargetGetResponce=next.Item;
          }
        },
        (error) => {

        }
      )
    );
  }
}

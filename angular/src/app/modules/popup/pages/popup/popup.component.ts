import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { bindCallback } from "rxjs";
import { map } from "rxjs/operators";
import { CaptchaModel } from "src/app/models/CaptchaModel";
import { ErrorExcptionResult } from "src/app/models/errorExcptionResult";
import { TargetGetDto } from "src/app/models/TargetGetDto";
import { TargetGetResponce } from "src/app/models/TargetGetResponce";
import { TargetSetDto } from "src/app/models/targetSetDto";
import { TargetSetResponce } from "src/app/models/targetSetResponce";
import { TAB_ID } from "../../../../providers/tab-id.provider";

@Component({
  selector: "app-popup",
  templateUrl: "popup.component.html",
  styleUrls: ["popup.component.scss"],
})
export class PopupComponent {
  message: string;

  constructor(
    private http: HttpClient,
    //private alertService: ToastrService,

    @Inject(TAB_ID) readonly tabId: number
  ) {}
  captchaModel: CaptchaModel = new CaptchaModel();
  baseUrl = "https://apicms.ir/api/v1/";
  modelTargetGetDto: TargetGetDto = new TargetGetDto();
  modelTargetGetResponce: TargetGetResponce = new TargetGetResponce();
  modelTargetSetDto: TargetSetDto = new TargetSetDto();
  modelTargetSetResponce: TargetSetResponce = new TargetSetResponce();

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
    this.http.get(this.baseUrl + "captcha").pipe(
      map((ret: ErrorExcptionResult<CaptchaModel>) => {
        if (ret) {
          if (ret.IsSuccess) {
            this.captchaModel = ret.Item;
          } else {
            //this.alertService.error(ret.ErrorMessage, "خطا در دریافت  کلید عکس کپتچا");
          }
          return ret;
        }
      })
    );
    // this.subManager.add(
    //   this.cmsAuthService.ServiceCaptcha().subscribe(
    //     (next) => {
    //       this.captchaModel = next.Item;
    //     },
    //     (error) => {
    //       this.alertService.error(
    //         this.publicHelper.CheckError(error),
    //         "خطا در دریافت عکس کپچا"
    //       );
    //     }
    //   )
    // );
  }
  onSubmitSet() {
    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    // this.subManager.add(
    //   this.cmsAuthService.ServiceForgetPassword(this.model).subscribe(
    //     (next) => {
    //       if (next.IsSuccess) {
    //         this.store.dispatch(new fromStore.InitHub());
    //         if (this.returnUrl === null || this.returnUrl === undefined) {
    //           this.returnUrl = this.cmsAuthService.getLoginUrl();
    //         }
    //         this.router.navigate([this.returnUrl]);
    //       }
    //     },
    //     (error) => {
    //       this.alertService.error(
    //         this.publicHelper.CheckError(error),
    //         'خطا در بازیابی پسورد'
    //       );
    //     }
    //   )
    // );
  }
  onSubmitGet() {
    this.modelTargetGetDto.CaptchaKey = this.captchaModel.Key;
    // this.subManager.add(
    //   this.cmsAuthService.ServiceForgetPassword(this.model).subscribe(
    //     (next) => {
    //       if (next.IsSuccess) {
    //         this.store.dispatch(new fromStore.InitHub());
    //         if (this.returnUrl === null || this.returnUrl === undefined) {
    //           this.returnUrl = this.cmsAuthService.getLoginUrl();
    //         }
    //         this.router.navigate([this.returnUrl]);
    //       }
    //     },
    //     (error) => {
    //       this.alertService.error(
    //         this.publicHelper.CheckError(error),
    //         'خطا در بازیابی پسورد'
    //       );
    //     }
    //   )
    // );
  }
}

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { bindCallback, Subscription } from "rxjs";
import { catchError, map, retry, tap } from "rxjs/operators";
import { CmsService } from "src/app/cmsService/cms.service";
import { CaptchaModel } from "src/app/models/CaptchaModel";
import { LinkManagementTargetShortLinkGetDtoModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkGetDtoModel";
import { LinkManagementTargetShortLinkGetResponceModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkGetResponceModel";
import { LinkManagementTargetShortLinkSetDtoModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkSetDtoModel";
import { LinkManagementTargetShortLinkSetResponceModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkSetResponceModel";
import { TAB, TAB_ID } from "../../../../providers/tab-id.provider";
const URL = "http://localhost:2390/api/v1/FileContent/Upload/";

@Component({
  selector: "app-popup",
  templateUrl: "popup.component.html",
  styleUrls: ["popup.component.scss"],
})
export class PopupComponent implements OnInit {
  message: string;
  messageShortLinkGet: string;
  messageShortLinkSetLink: string;
  messageShortLinkSetFile: string;
  messageShortLinkSetDescription: string;
  constructor(
    @Inject(TAB) readonly tab: any,
    @Inject(TAB_ID) readonly tabId: number,
    private http: HttpClient,
    private cmsService: CmsService
  ) {
    this.progress = 0;
  }

  submitted = false;
  subManager = new Subscription();
  captchaModel: CaptchaModel = new CaptchaModel();
  modelTargetGetDto: LinkManagementTargetShortLinkGetDtoModel = new LinkManagementTargetShortLinkGetDtoModel();
  modelTargetGetResponce: LinkManagementTargetShortLinkGetResponceModel = new LinkManagementTargetShortLinkGetResponceModel();
  modelTargetSetDto: LinkManagementTargetShortLinkSetDtoModel = new LinkManagementTargetShortLinkSetDtoModel();

  modelTargetSetResponceSetLink: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();
  modelTargetSetResponceSetFile: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();
  modelTargetSetResponceSetDescription: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();
  fileToUpload: File = null;
  selectedUserTab = 1;
  progress: number;
  tabs = [
    {
      name:
        '<b style="color: deepskyblue">Get</b> <i style="color: deeppink">Link</i>',
      key: 1,
      active: true,
    },
    {
      name:
        '<b style="color: deepskyblue">Set</b> <i style="color: deeppink">Link</i>',
      key: 2,
      active: false,
    },
    {
      name:
        '<b style="color: deepskyblue">Set</b> <i style="color: deeppink">File</i>',
      key: 3,
      active: false,
    },
    {
      name:
        '<b style="color: deepskyblue">Set</b> <i style="color: deeppink">Memo</i>',
      key: 4,
      active: false,
    },
  ];

  ngOnInit() {
    //lert(JSON.stringify(this.tab));
    this.onCaptchaOrder();
    this.SetCurrentUrl();
    if (this.tab) this.modelTargetSetDto.UrlAddress = this.tab.url;
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
  async SetCurrentUrl() {
    // chrome.tabs.getCurrent(
    //   function(tab) {
    //     this.modelTargetSetDto.UrlAddress =  tab.url;
    //   }
    // );
    return await bindCallback<chrome.tabs.Tab>(
      chrome.tabs.getCurrent.bind(this)
    )()
      .pipe(
        map(
          (tab) => (this.modelTargetSetDto.UrlAddress = tab.url)
          // chrome.runtime.lastError
          //   ? "The current page is protected by the browser, goto: https://www.google.nl and try again."
          //   : tab.url
        )
      )
      .toPromise();
  }
  onCaptchaOrder() {
    this.modelTargetSetDto.CaptchaText = "";
    this.modelTargetGetDto.CaptchaText = "";
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
  onSubmitGet() {
    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetGetDto.CaptchaKey = this.captchaModel.Key;
    var res = this.modelTargetGetDto.Key.split("@");
    if (res.length < 2) {
      this.messageShortLinkGet = "Key Is Worng.";
      return;
    }
    this.messageShortLinkGet = "Runing ...";

    this.subManager.add(
      this.cmsService.ServiceShortLinkGet(this.modelTargetGetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkGet = "Is Success";
            this.modelTargetGetResponce = next.Item;
          } else {
            this.messageShortLinkGet = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        (error) => {
          this.messageShortLinkGet = "Error.";

          console.log("modelTargetGetResponce" + this.modelTargetGetResponce);
          this.onCaptchaOrder();
        }
      )
    );
  }
  onSubmitSetLink() {
    this.messageShortLinkSetLink = "Runing ...";

    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    this.subManager.add(
      this.cmsService.ServiceShortLinkSet(this.modelTargetSetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkSetLink = "Is Success";
            this.modelTargetSetResponceSetLink = next.Item;
          } else {
            this.messageShortLinkSetLink = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        (error) => {
          this.messageShortLinkSetLink = "Error ...";
          this.onCaptchaOrder();
        }
      )
    );
  }
  onSubmitSetDescription() {
    this.messageShortLinkSetDescription = "Runing ...";

    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    this.modelTargetSetDto.UrlAddress = "";
    this.modelTargetSetDto.UploadFileKey = "";
    this.subManager.add(
      this.cmsService.ServiceShortLinkSet(this.modelTargetSetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkSetDescription = "Is Success";
            this.modelTargetSetResponceSetDescription = next.Item;
          } else {
            this.messageShortLinkSetDescription = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        (error) => {
          this.messageShortLinkSetDescription = "Error";
          this.onCaptchaOrder();
        }
      )
    );
  }
  onSubmitSetFile() {
    this.messageShortLinkSetFile = "Runing ...";
    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    this.modelTargetSetDto.UrlAddress = "";
    this.modelTargetSetDto.UploadFileKey = "";
    this.subManager.add(
      this.cmsService.ServiceShortLinkSet(this.modelTargetSetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkSetFile = "Is Success";
            this.modelTargetSetResponceSetFile = next.Item;
          } else {
            this.messageShortLinkSetFile = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        (error) => {
          this.messageShortLinkSetFile = "Error";
          this.onCaptchaOrder();
        }
      )
    );
  }
  handleProgress(progress) {
    this.progress = progress;
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    // this.cmsService
    //        .ServiceUploadFile(this.fileToUpload, (x) => this.handleProgress(x))

    this.subManager.add(
      this.cmsService
        .ServiceUploadFileNormal(
          this.fileToUpload,
          this.fileToUpload.name,
          (x) => this.handleProgress(x)
        )
        .subscribe(
          (next) => {
            this.modelTargetSetDto.UploadFileKey = next + "";
          },
          (error) => {}
        )
    );
  }
  tabChange(selectedTab) {
    console.log("### tab change");
    this.selectedUserTab = selectedTab.key;
    for (let tab of this.tabs) {
      if (tab.key === selectedTab.key) {
        tab.active = true;
      } else {
        tab.active = false;
      }
    }
  }
  /* To copy Text from Textbox */
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
  }

  /* To copy any Text */
  copyText(val: string) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }
}

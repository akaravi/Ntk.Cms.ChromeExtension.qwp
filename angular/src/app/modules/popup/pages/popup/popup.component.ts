import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, ChangeDetectorRef, Component, Directive, Inject, OnInit, ViewChild } from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { bindCallback, Subscription } from "rxjs";
import { catchError, map, retry, tap } from "rxjs/operators";
import { CmsService } from "src/app/cmsService/cms.service";
import { CaptchaModel } from "src/app/models/CaptchaModel";
import { LinkManagementTargetShortLinkGetDtoModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkGetDtoModel";
import { LinkManagementTargetShortLinkGetResponceModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkGetResponceModel";
import { LinkManagementTargetShortLinkSetDtoModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkSetDtoModel";
import { LinkManagementTargetShortLinkSetResponceModel } from "src/app/models/LinkManagement/linkManagementTargetShortLinkSetResponceModel";
import { TAB_ID } from "../../../../providers/tab-id.provider";
const URL = "http://localhost:2390/api/v1/FileContent/Upload/";
//const URL =  "https://apicms.ir/api/v1/FileContent/Upload/";;



// import { Transfer } from 'projects/ngx-flow/src/public_api';
// import { FlowDirective } from 'projects/ngx-flow/src/lib/flow.directive';

@Component({
  selector: "app-popup",
  templateUrl: "popup.component.html",
  styleUrls: ["popup.component.scss"],
})
// class FileSelectDirective
export class PopupComponent implements OnInit {
  //public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });



  message: string;
  constructor(
   
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

  modelTargetSetResponce: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();
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
    this.onCaptchaOrder();
    this.SetCurrentUrl();


     
    // this.flow.assignBrowse(document.getElementById('browseButton'));
    // this.flow.assignDrop(document.getElementById('dropTarget'));


    // this.flow.assignDrop(document.getElementById('flow-drop'));
    // this.flow.assignBrowse(document.getElementById('flow-browse'));
    // this.flow.assignBrowse(document.getElementById('flow-browse-folder'), true);
    // this.flow.assignBrowse(document.getElementById('flow-browse-image'), false, false, {accept: 'image/*'});


    // if (!this.flow.support) location.href = "/some-old-crappy-uploader";
    // this.flow.on("fileAdded", function (file, event) {
    //   console.log(file, event);
    // });
    // this.flow.on("fileSuccess", function (file, message) {
    //   console.log(file, message);
    // });
    // this.flow.on("fileError", function (file, message) {
    //   console.log(file, message);
    // });
    this.uploader = new FileUploader({
      url: URL,
      itemAlias: "file",
    });
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      console.log(fileItem);
      form.append("filename", fileItem.file.name);
      this.uploader.onCompleteItem = (
        item: any,
        response: any,
        status: any,
        headers: any
      ) => {
        console.log("ImageUpload:item:", item);
        console.log("ImageUpload:status:", status);
        console.log("ImageUpload:response:", response);
      };
    };

    // this.uploader = new FileUploader({
    //   url: URL,
    //   disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    //   formatDataFunctionIsAsync: true,
    //   method:"post",

    //   formatDataFunction: async (item) => {
    //     console.log(item);
    //     return new Promise( (resolve, reject) => {
    //       resolve({
    //         // fileName: item._file.name,
    //         // name: item._file.name,
    //         // length: item._file.size,
    //         //contentType: item._file.type,
    //         //date: new Date()
    //       });
    //     });
    //   }
    // });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = "";

    this.uploader.response.subscribe((res) => (this.response = res));
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
    this.modelTargetSetResponce = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetGetDto.CaptchaKey = this.captchaModel.Key;
    var res = this.modelTargetGetDto.Key.split("@");
    if (res.length < 2) {
      this.message = "Key Is Worng.";
    }
    this.subManager.add(
      this.cmsService.ServiceShortLinkGet(this.modelTargetGetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.modelTargetGetResponce = next.Item;
            console.log(
              "modelTargetGetResponce IsSuccess" + this.modelTargetGetResponce
            );
          }
        },
        (error) => {
          console.log("modelTargetGetResponce" + this.modelTargetGetResponce);
        }
      )
    );
  }
  onSubmitSetLink() {
    this.submitted = true;
    this.modelTargetSetResponce = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    this.subManager.add(
      this.cmsService.ServiceShortLinkSet(this.modelTargetSetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.modelTargetSetResponce = next.Item;
          }
        },
        (error) => {}
      )
    );
  }
  onSubmitSetDescription() {
    this.submitted = true;
    this.modelTargetSetResponce = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    this.modelTargetSetDto.UrlAddress = "";
    this.modelTargetSetDto.UploadFileKey = "";
    this.subManager.add(
      this.cmsService.ServiceShortLinkSet(this.modelTargetSetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.modelTargetSetResponce = next.Item;
          }
        },
        (error) => {}
      )
    );
  }
  onSubmitSetFile() {
    this.submitted = true;
    this.modelTargetSetResponce = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
    this.modelTargetSetDto.UrlAddress = "";
    this.modelTargetSetDto.UploadFileKey = "";
    this.subManager.add(
      this.cmsService.ServiceShortLinkSet(this.modelTargetSetDto).subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.modelTargetSetResponce = next.Item;
          }
        },
        (error) => {}
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

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}

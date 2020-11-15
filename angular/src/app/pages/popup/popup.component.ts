import { ComponentOptionModel } from 'src/app/models/componentOptionModel';
import { TAB, TAB_ID } from 'src/app/providers/tab-id.provider';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  CaptchaModel,
  CoreAuthService,
  LinkManagementTargetService,
  LinkManagementTargetShortLinkGetDtoModel,
  LinkManagementTargetShortLinkGetResponceModel,
  LinkManagementTargetShortLinkSetDtoModel,
  LinkManagementTargetShortLinkSetResponceModel,
  TokenInfoModel,
} from 'ntk-cms-api';


import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss'],
})
export class PopupComponent implements OnInit {
  message: string;
  messageShortLinkGet: string;
  messageShortLinkSetLink: string;
  messageShortLinkSetFile: string;
  messageShortLinkSetDescription: string;
  modelHistoryList: string[];
  constructor(
    @Inject(TAB) readonly tab: any,
    @Inject(TAB_ID) readonly tabId: number,
    private coreAuthService: CoreAuthService,
    private linkManagementTargetService: LinkManagementTargetService,
    private activatedRoute: ActivatedRoute
  ) { }

  submitted = false;

  captchaModel: CaptchaModel = new CaptchaModel();
  modelTargetGetDto: LinkManagementTargetShortLinkGetDtoModel = new LinkManagementTargetShortLinkGetDtoModel();
  modelTargetGetResponce: LinkManagementTargetShortLinkGetResponceModel = new LinkManagementTargetShortLinkGetResponceModel();
  modelTargetSetDto: LinkManagementTargetShortLinkSetDtoModel = new LinkManagementTargetShortLinkSetDtoModel();

  modelTargetSetResponceSetLink: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();
  modelTargetSetResponceSetFile: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();
  modelTargetSetResponceSetDescription: LinkManagementTargetShortLinkSetResponceModel = new LinkManagementTargetShortLinkSetResponceModel();
  fileToUpload: File = null;
  selectedUserTab = 1;

  uploadedfileName = '';
  uploadedfileKey = '';
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
    {
      name:
        '<b style="color: deepskyblue">Key</b> <i style="color: deeppink">History</i>',
      key: 5,
      active: false,
    },
  ];
  optionsUploadFile: ComponentOptionModel = new ComponentOptionModel();
  tokenInfoModel: TokenInfoModel;

  ngOnInit() {
    this.optionsUploadFile.actions = {
      onActionSelect: (model) => this.onActionSelectFile(model),
    };
    this.getHistory();
    this.optionsUploadFile.actions = {
      onActionSelect: (model) => this.onActionSelectFile(model),
    };
    this.onCaptchaOrder();
    if (this.tab) { this.modelTargetSetDto.UrlAddress = this.tab.url; }
  }
  onActionSelectFile(model: any): void {
    console.log('model', model);

    if (model && model.fileKey) {
      this.modelTargetSetDto.UploadFileKey = model.fileKey;
      this.uploadedfileName = model.fileName;
      if (this.uploadedfileKey.length > 0) {
        this.uploadedfileKey = this.uploadedfileKey + ',';
      }
      this.uploadedfileKey = this.uploadedfileKey + model.fileKey;
    }
  }
  onCaptchaOrder(): void {
    this.modelTargetSetDto.CaptchaText = '';
    this.modelTargetGetDto.CaptchaText = '';
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        this.captchaModel = next.Item;
        this.modelTargetSetDto.CaptchaKey = this.captchaModel.Key;
        const startDate = new Date();
        const endDate = new Date(next.Item.Expire);
        const seconds = (endDate.getTime() - startDate.getTime());
        setTimeout(() => {
          this.onCaptchaOrder();
        }, seconds);
      },
      () => {
        this.message = 'خطا در دریافت عکس کپچا';
        this.modelTargetSetDto.CaptchaKey = '';
        this.captchaModel = new CaptchaModel();
      }
    );

  }
  onSubmitGet(): void {
    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetGetDto.CaptchaKey = this.captchaModel.Key;
    const res = this.modelTargetGetDto.Key.split('@');
    if (res.length < 2) {
      this.messageShortLinkGet = 'Key Is Worng.';
      return;
    }
    this.messageShortLinkGet = 'Runing ...';

    this.linkManagementTargetService
      .ServiceShortLinkGet(this.modelTargetGetDto)
      .subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkGet = 'Is Success';
            this.modelTargetGetResponce = next.Item;
            this.addHistory(next.Item.Key);
          } else {
            this.messageShortLinkGet = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        () => {
          this.messageShortLinkGet = 'Error.';

          this.onCaptchaOrder();
        }
      );
  }
  onSubmitSetLink(): void {
    this.messageShortLinkSetLink = 'Runing ...';

    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();


    this.linkManagementTargetService
      .ServiceShortLinkSet(this.modelTargetSetDto)
      .subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkSetLink = 'Is Success';
            this.modelTargetSetResponceSetLink = next.Item;
            this.addHistory(next.Item.Key);
          } else {
            this.messageShortLinkSetLink = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        () => {
          this.messageShortLinkSetLink = 'Error ...';
          this.onCaptchaOrder();
        }
      );

  }
  onSubmitSetDescription(): void {
    this.messageShortLinkSetDescription = 'Runing ...';

    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.UrlAddress = '';
    this.modelTargetSetDto.UploadFileKey = '';

    this.linkManagementTargetService
      .ServiceShortLinkSet(this.modelTargetSetDto)
      .subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkSetDescription = 'Is Success';
            this.modelTargetSetResponceSetDescription = next.Item;
            this.addHistory(next.Item.Key);
          } else {
            this.messageShortLinkSetDescription = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        () => {
          this.messageShortLinkSetDescription = 'Error';
          this.onCaptchaOrder();
        }
      );

  }
  onSubmitSetFile(): void {
    this.messageShortLinkSetFile = 'Runing ...';
    this.submitted = true;
    this.modelTargetSetResponceSetLink = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetFile = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetSetResponceSetDescription = new LinkManagementTargetShortLinkSetResponceModel();
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetSetDto.UrlAddress = '';
    this.modelTargetSetDto.Description = '';


    this.linkManagementTargetService
      .ServiceShortLinkSet(this.modelTargetSetDto)
      .subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.messageShortLinkSetFile = 'Is Success';
            this.modelTargetSetResponceSetFile = next.Item;
            this.addHistory(next.Item.Key);
          } else {
            this.messageShortLinkSetFile = next.ErrorMessage;
          }
          this.onCaptchaOrder();
        },
        () => {
          this.messageShortLinkSetFile = 'Error';
          this.onCaptchaOrder();
        }
      );

  }

  tabChange(selectedTab): void {
    this.modelTargetGetResponce = new LinkManagementTargetShortLinkGetResponceModel();
    this.modelTargetGetDto.Key = '';
    this.selectedUserTab = selectedTab.key;
    for (const tab of this.tabs) {
      if (tab.key === selectedTab.key) {
        tab.active = true;
      } else {
        tab.active = false;
      }
    }
  }
  /* To copy Text from Textbox */
  copyInputMessage(inputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  /* To copy any Text */
  copyText(val: string): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  onClickHistory(item: string): void {
    if (item && item.length > 0) {
      this.tabChange({ key: 1 });
      this.modelTargetGetDto.Key = item;
    }
  }
  addHistory(item: string): void {
    let history = localStorage.getItem('history');
    // debugger;
    if (history && history.length > 0) {
      if (history.indexOf(item) < 0) {
        history = item + ',' + history;
      }
    } else {
      history = item;
    }

    this.modelHistoryList = history.split(',');
    if (this.modelHistoryList.length > 10) {
      this.modelHistoryList.length = 10;
    }
    localStorage.setItem('history', this.modelHistoryList.join(','));
  }
  getHistory(): void {
    let history = localStorage.getItem('history');
    if (history && history.length > 0) {
      this.modelHistoryList = history.split(',');
      return;
    }
    history = '';
    localStorage.setItem('history', history);
    this.modelHistoryList = history.split(',');
  }
  // async onClick(): Promise<void> {
  //   this.message = await bindCallback<string>(
  //     chrome.tabs.sendMessage.bind(this, this.tabId, "request")
  //   )()
  //     .pipe(
  //       map((msg) =>
  //         chrome.runtime.lastError
  //           ? "The current page is protected by the browser, goto: https://www.google.nl and try again."
  //           : msg
  //       )
  //     )
  //     .toPromise();
  // }

}

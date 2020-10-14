import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PopupComponent } from "./pages/popup/popup.component";
import { PopupRoutingModule } from "./popup-routing.module";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [PopupComponent],
  imports: [
    CommonModule,
    PopupRoutingModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
})
export class PopupModule {}

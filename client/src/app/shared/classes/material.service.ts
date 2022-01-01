import { ElementRef } from "@angular/core";

declare var M: {
  toast: (arg0: { html: string; }) => void;
  FloatingActionButton: { init: (arg0: any) => void; };
  updateTextFields: () => void;
}
export class MaterialService {
  static toast(message: string) {
    M.toast({html: message});
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }
}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-task';

  @ViewChild('generatorBtn') generatorBtn?: ElementRef<HTMLElement>;

  private subs: any;
  private subscriptions = new Subscription();
  private delay: number = 3000;
  pending: boolean = false;
  showPendingMsg: boolean = false;

  iconIndex: number = -1;
  iconName: IconName = 'coffee';
  iconPrefix: IconPrefix = "fas"

  ngAfterViewInit() {
    if (this.generatorBtn) {
      this.subscriptions.add(
        fromEvent(this.generatorBtn.nativeElement, 'click')
          .pipe(throttleTime(this.delay))
          .subscribe((e: any) => {
            this.subs.unsubscribe();

            const [faIcons, fasIcons, fabIcons] = this.getIconsArray()
            setTimeout(() => this.listenToClick());
            this.getRandomIconName(faIcons, fasIcons, fabIcons)

            this.pending = true;
            setTimeout(() => { this.pending = false; this.showPendingMsg = false}, this.delay);
          })
      );
      this.listenToClick();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.subs.unsubscribe();
  }

  private kebabize = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

  private getIconsArray = () => {
    const fasIcons = Object.getOwnPropertyNames(fas)
    const fabIcons = Object.getOwnPropertyNames(fab)
    const farIcons = Object.getOwnPropertyNames(far)
    const faIcons = [...fasIcons, ...fabIcons, ...farIcons]

    return [faIcons, fasIcons, fabIcons]
  }

  private getRandomIconName = (faIcons: string[], fasIcons: string[], fabIcons: string[]) => {
    let index = Math.floor(Math.random() * (faIcons.length - 0))

    if (index >= 0 && index <= fasIcons.length) this.iconPrefix = 'fas'
    if (index > fasIcons.length && index <= (fasIcons.length + fabIcons.length)) this.iconPrefix = 'fab'
    if (index > (fasIcons.length + fabIcons.length) && index <= faIcons.length) this.iconPrefix = 'far'
    
    this.iconIndex = index
    this.iconName = this.kebabize(faIcons[this.iconIndex].replace('fa', '')) as IconName
  }

  private listenToClick() {
    if (this.generatorBtn) {
      this.subs = fromEvent(this.generatorBtn.nativeElement, 'click').subscribe(
        (res) => this.showPendingMsg = true
      )
    }
  }
}

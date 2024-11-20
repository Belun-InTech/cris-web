import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpErrorInterceptor } from './core/security/http-error.interceptor';
import { AppLayoutModule } from './layout/app.layout.module';
import { LoginComponent } from './views/login/login.component';
import { FaqComponent } from './views/faq/faq.component';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [AppComponent, LoginComponent, FaqComponent],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    MessagesModule,
    AccordionModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideAnimationsAsync('noop'),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeroBannersComponent } from './components/hero-banners/hero-banners.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductSectionComponent } from './components/product-section/product-section.component';
import { HotDealComponent } from './components/hot-deal/hot-deal.component';
import { TopSellingGridComponent } from './components/top-selling-grid/top-selling-grid.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FooterComponent } from './components/footer/footer.component';

// Import DataService
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    HeaderComponent,
    NavigationComponent,
    HeroBannersComponent,
    ProductCardComponent,
    ProductSectionComponent,
    HotDealComponent,
    TopSellingGridComponent,
    NewsletterComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppComponent
  ],
  providers: [
    DataService  // Add DataService to providers if not using providedIn: 'root'
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

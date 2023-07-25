import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PictureViewComponent } from './components/picture-view/picture-view.component';
import { SearchComponent } from './components/search/search.component';


const routes: Routes = [
  
  { path: 'gallery/:id', component: GalleryComponent, },
  { path: 'full-view', component: PictureViewComponent },

  { path: '',   redirectTo: '/gallery/gallery', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: GalleryComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

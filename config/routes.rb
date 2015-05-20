Rails.application.routes.draw do
  resources :attachments do
    member do
      get :download
      put :remove
      post :popup
      post :preview
    end
  end
end

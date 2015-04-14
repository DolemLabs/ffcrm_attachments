Rails.application.routes.draw do
  resources :attachments do
    member do
      get :download
      put :remove
      post :popup
    end
  end
end

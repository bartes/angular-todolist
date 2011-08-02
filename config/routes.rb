Angular::Application.routes.draw do
  resources :todos do
    collection do
      get :paginate
      post :paginate, :to => 'todos#mass_update'
    end
  end

  root :to => 'index#index'
end

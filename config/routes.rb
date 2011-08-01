Angular::Application.routes.draw do
  resources :todos do
    collection do
      get :paginate
    end
  end

  root :to => 'index#index'
end

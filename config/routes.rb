Angular::Application.routes.draw do
  resources :todos do
    collection do
      get :paginate
      post :paginate, :to => 'todos#mass_update'
    end
  end

  match '/sandbox/watch' => 'sandbox#watch'

  match '/sandbox/tabs' => 'sandbox#tabs'
  match '/sandbox/tree' => 'sandbox#tree'

  root :to => 'index#index'
end

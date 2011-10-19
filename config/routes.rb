Angular::Application.routes.draw do
  resources :todos do
    collection do
      get :paginate
      post :validate
      post :paginate, :to => 'todos#mass_update'
    end
  end

  match '/sandbox/watch' => 'sandbox#watch'
  match '/sandbox/forms' => 'sandbox#forms'

  match '/sandbox/tabs' => 'sandbox#tabs'
  match '/sandbox/tree' => 'sandbox#tree'
  match '/sandbox/validations' => 'sandbox#validations'

  root :to => 'index#index'
end

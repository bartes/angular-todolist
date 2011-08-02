class TodosController < ApplicationController
  respond_to :html, :json

  # GET /todos
  # GET /todos.json
  def index
    @todos = Todo.all
    respond_with @todos
  end

  def paginate
    order_by = params[:orderBy] || 'created_at'
    order_direction = params[:orderDirection] || 'asc'

    @todos = Todo.order("#{order_by} #{order_direction}")
      .page(params[:currentPage] || 1)
      .per(params[:perPage] || 10)

    result = {
      :records => @todos,
      :paginationParams => {
        :orderBy => order_by, :orderDirection => order_direction,
        :totalCount => @todos.total_count,
        :numPages => @todos.num_pages,
        :perPage => @todos.limit_value,
        :currentPage => @todos.current_page
      }
    }
    render :json => result
  end

  def mass_update
    records = params[:records]
    records.each do |record|
      todo = Todo.find(record[:id])
      todo.update_attributes(record)
    end

    render :json => true
  end

  # GET /todos/1
  # GET /todos/1.json
  def show
    @todo = Todo.find(params[:id])
    respond_with @todo
  end

  # GET /todos/new
  # GET /todos/new.json
  def new
    @todo = Todo.new
    respond_with @todo
  end

  # GET /todos/1/edit
  def edit
    @todo = Todo.find(params[:id])
    respond_with @todo
  end

  # POST /todos
  # POST /todos.json
  def create
    @todo = Todo.new(params[:todo])
    @todo.save
    respond_with @todo
  end

  # PUT /todos/1
  # PUT /todos/1.json
  def update
    @todo = Todo.find(params[:id])
    @todo.update_attributes(params[:todo])
    render :json => @todo
  end

  # DELETE /todos/1
  # DELETE /todos/1.json
  def destroy
    @todo = Todo.find(params[:id])
    @todo.destroy
    respond_with @todo
  end
end

class TodosController < ApplicationController
  respond_to :html, :json

  # GET /todos
  # GET /todos.json
  def index
    @todos = Todo.all
    respond_with @todos
  end

  def paginate
    @todos = Todo.order("#{params[:order_by] || 'created_at'} #{params[:order_direction] || 'ASC'}")
      .page(params[:page] || 1)
      .per(params[:per_page] || 10)

    render :json => { :records => @todos, :totalCount => @todos.total_count, :numPages => @todos.num_pages, :currentPage => @todos.current_page }
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

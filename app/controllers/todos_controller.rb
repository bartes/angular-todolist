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
      :totalCount => @todos.total_count,
      :numPages => @todos.num_pages,
    }
    render :json => result
  end

  def mass_update
    data = params[:records]
    records = Todo.find(data.map { |d| d[:id] })

    records.each do |record|
      attributes = data.find { |d| d[:id] == record.id }
      record.update_attributes(attributes)
    end

    render :json => records
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

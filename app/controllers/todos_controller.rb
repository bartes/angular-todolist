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
    records = params[:records]
    updated_records = []

    records.each do |attributes|
      todo = Todo.find(attributes[:id])
      todo.name = attributes[:name]
      todo.estimate = attributes[:estimate]
      todo.done = attributes[:done]
      todo.save

      updated_records << todo.attributes
    end

    render :json => { :records => updated_records }
  end

  def validate
    id = params[:id]
    value = params[:value]

    todos = []
    if id.present?
      todos = Todo.where('id != ? AND name = ?', id, value)
    else
      todos = Todo.where('name = ?', value)
    end

    errors = {}
    if not todos.empty?
      errors[:name] = 'Todo exists!'
    end

    render :json => errors
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

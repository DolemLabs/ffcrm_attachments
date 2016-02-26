class AttachmentsController < ApplicationController

  def download
    attach = Attachment.find(params[:id])

    if Setting.storage_at_s3
      data = open attach.attachment.url(:original)
      send_data data.read, type: attach.attachment.content_type, disposition: 'inline'
    else
      send_file attach.attachment.path(:original), disposition: 'attachment'
    end
  end

  def remove
    attach = Attachment.find(params[:id])
    klass = attach.entity_type.constantize
    @entity = klass.find(attach.entity_id)
    
    TagList.remove_from(attach)
    attach.destroy
    
    respond_to do |format|
      format.js
    end
  end
  
  def popup
    @attach = Attachment.find(params[:id])
    klass = @attach.entity_type.constantize
    @entity = klass.find(@attach.entity_id)
    
    respond_to do |format|
      # format.js {render :partial => "attachment_popup"}
      format.js
    end
  end
  
  def popup_new
    @attach = Attachment.new
    @account = Account.find(params[:account_id])
    
    respond_to do |format|
      format.js
    end
  end
  
  def new
    entity_id = params[:entity_id]
    entity_type = params[:entity_type]
    klass = entity_type.constantize
    
    @attach = Attachment.new
    # @account = Account.find(params[:account_id])
    @entity = klass.find(entity_id)
    
    respond_to do |format|
      format.js
    end
  end
  
  def update
    entity_type = params[:entity_type]
    klass = entity_type.constantize
    
    # tags = params[:account][:attachments_attributes]['0'][:tag_list]
    tags = params[entity_type.downcase][:attachments_attributes]['0'][:tag_list]
    tags.delete('')
    
    if params[:id] == 'create'
      # account_id = params[:account][:attachments_attributes]['0'][:account_id]
      # attach_attributes = params[:account][:attachments_attributes]['0']
      # attach_attributes.delete(:account_id)
      
      # @account = Account.find(account_id)
      # @attach = @account.attachments.new(attach_attributes)
      # @attach.save
      
      entity_id = params[entity_type.downcase][:attachments_attributes]['0'][:entity_id]
      attach_attributes = params[entity_type.downcase][:attachments_attributes]['0']
      attach_attributes.delete(:entity_id)
      
      @entity = klass.find(entity_id)
      @attach = @entity.attachments.new(attach_attributes)
      @attach.save
    else
      @attach = Attachment.find(params[:id])
      @attach.tag_list = tags
      @attach.save
    end
    
    respond_to do |format|
      format.js #{render js: { status: true }}
    end
  end
  
  def preview
    @attach = Attachment.find(params[:id])
    @url = "http://#{Setting.host}#{@attach.attachment.url(:original)}"
    
    respond_to do |format|
      format.js
    end
  end
  
end

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
    attach.destroy
    render json: { status: true }
  end
  
  def popup
    @attach = Attachment.find(params[:id])
    @account = Account.find(@attach.entity_id)
    
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
    @attach = Attachment.new
    @account = Account.find(params[:account_id])
    
    respond_to do |format|
      format.js
    end
  end
  
  def update
    tags = params[:account][:attachments_attributes]['0'][:tag_list]
    tags.delete('')
    
    if params[:id] == 'create'
      account_id = params[:account][:attachments_attributes]['0'][:account_id]
      attach_attributes = params[:account][:attachments_attributes]['0']
      attach_attributes.delete(:account_id)
      
      @account = Account.find(account_id)
      @attach = @account.attachments.new(attach_attributes)
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
  
end

$('#main form[class^=new_], #main form[class^=edit_]').ajaxForm();

$(document).on("click", "#main form[class^=new_] input[type=submit], #main form[class^=edit_] input[type=submit]", function(event) {
  $form = $(event.target).closest('form');
  $form.ajaxSubmit({
      clearForm: true,
      resetForm: true,
      success: function(data) {
      },
      error: function(jqXHR, error, errorThrown) {
        alert(error);
      }
  });
  return false;
});


//$(document).on('change', "#attach", function (){
//  var parent_div = $(this).closest(".attach_div");
//  var attach_limit = $(parent_div.closest('table')[0]).attr("attach_limit");
//  var attach_limit_size = file_size_in_bytes(attach_limit);
//  var file_type = this.files[0].type;
//
//  console.log(this);
//
//  if((file_type == "") || (this.files[0].size > attach_limit_size)) {
//    error_msg = (file_type == "") ? "Invalid file type" : "File size is too long.";
//    parent_div.find('.current_file_name').addClass('error').html(error_msg);
//    $(this).val('');
//    parent_div.find(".file_size").html('');
//    parent_div.find(".remove_link").hide();
//  } else {
//    var last_file_input = $("#entity_extra").find('input').last()[0].files;
//
//    // append file input
//    append_file_input(last_file_input);
//
//    // display attachment-name
//    var file_name = this.files[0].name;
//    parent_div.find('.current_file_name').removeClass("error").html(file_name);
//
//    // display attachment-size
//    var file_size = get_file_size(this.files[0]);
//    parent_div.find(".file_size").html(file_size);
//
//    // display remove attachment link
//    parent_div.find(".remove_link").show();
//  }
//});

$(document).on('click', ".remove_link", function(){
  // new attachment
  var $this = $(this);
  current_file_div = $this.closest(".attach_div");
  current_file_div.find("#attach").val('');
  current_file_div.hide();

  // old attachment
  destroy_attachment(current_file_div, $this);

  return false;
});

function destroy_attachment(current_file_div, current_obj) {
  edit_form = current_obj.closest('table').hasClass('edit_form');
  old_attachment = current_obj.hasClass('display_remove');

  if(edit_form && old_attachment) {
    var attach_id = $(current_file_div.next('input')[0]).val();
    $.ajax({
      url: "/attachments/"+attach_id+"/remove",
      data: {
        id: attach_id
      },
      type: 'PUT'
    });
    $(current_file_div.next('input')[0]).val('');
  }
}

function get_file_size(file) {
  var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
  fSize = file.size;
  i = 0;
  while(fSize > 900){
    fSize /= 1024;
    i++;
  }
  value = (Math.round(fSize*100)/100) + ' ' + fSExt[i];
  return value;
}

function file_size_in_bytes(limit_size) {
  var size_arr = limit_size.split(' ');
  var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
  index = $.inArray(size_arr[1], fSExt);
  multiplier = 1;
  i = 1;
  while(i<=index){
    multiplier = multiplier * 1024;
    i++;
  }
  value = size_arr[0] * multiplier;
  return value;
}

function get_file_input(file_attr_name) {
  file_name_div = "<div class='current_file_name'></div>";
  file_size_div = "<div class='file_size'></div>";
  remove_link_div = "<div class='remove_link'><a href='#'>Remove</a></div>";
  file_input_div = "<input id='attach' name='"+file_attr_name+"' type='file'>";
  complete_div = "<div class='attach_div'>" + file_input_div + file_name_div +
    file_size_div + remove_link_div + "</div>";
  return complete_div;
}

function append_file_input(last_file_input) {
  if(last_file_input.length > 0) {
    var input_length = $("#entity_extra").find('input:file').length;
    var attr_name = $("input#attach").attr('name');
    var set_attr_name = attr_name.replace("[0]", "["+input_length+"]");
    var next_attach_input = get_file_input(set_attr_name);
    $(".next_attachment").append(next_attach_input);
  }
}

function onPhotoUpload(event, entity_type) {
  $('#' + entity_type + '_attachments_attributes_0_attachment_file_name').val(event.fpfile.filename);
  $('#name').val(event.fpfile.filename);
}

function loadPopup(attach_id) {
  url = "/attachments/" + attach_id + "/popup";
  data = {id: attach_id};
  
  var jqxhr = $.post( url, function(data) {
      // success
      $("#myModal").html(data.responseText);
    })
    .done(function() {
      // second success
    })
    .always(function(data) {
      // finished
    });
}

function loadPopupNew(entity_id, entity_type) {
  url = "/attachments/new?entity_id=" + entity_id + "&entity_type=" + entity_type;
  
  var jqxhr = $.get( url, function(data) {
      // success
      $("#myModal").html(data.responseText);
    });
}

function deleteFile(attachment_id) {
  url = "/attachments/" + attachment_id + "/remove";
  data = { id: attachment_id, _method: 'put' };
  
  var request = $.post( url, data);
  request.done(function(data) {
      // success
      // $("#myModal").html(data.responseText);
      $("#attachment_" + attachment_id).fadeOut(400, function(){
        $(this).remove();
      });
      $("#close_button").click();
    });
}

$(document).on("click", "#main-content section div div section header ul li:last", function(event) {
  onShowAttachments();
});

function onShowAttachments() {
  $("#media_filter_all").click();
}

function showPreview(attachment_id) {
  url = "/attachments/" + attachment_id + "/preview";
  data = { id: attachment_id };
  
  var jqxhr = $.post( url, function(data) {
      // success
      $("#myPreview").html(data.responseText);
    });
}



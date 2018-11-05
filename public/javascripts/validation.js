document.addEventListener('DOMContentLoaded', function(){
  $('form').submit(function(e){
    $('.alert.alert-danger').hide('fast');
    if (!$('#name').val() || !$('#rating').val() || !$('#review').val()){
      if ($('.alert.alert-danger').length){
        $('.alert.alert-danger').show('fast');
      }else{
        $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
      }
      return false;
    }
  });
});
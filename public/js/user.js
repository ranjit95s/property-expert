function changeImage(a) {
    document.getElementById("img").src = a;
  }

  jQuery(document).ready(function(){
    jQuery('#hideshow').on('click', function(event) {        
        jQuery('#content').toggle('show');
    });
});
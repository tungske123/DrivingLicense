getPagination('#table-info');


function getPagination(table) {
  var lastPage = 1;

  $('#maxRows')
    .on('change', function(evt) {

     lastPage = 1;
      $('.pagination')
        .find('li')
        .slice(1, -1)
        .remove();
      var trnum = 0; 
      var maxRows = parseInt($(this).val()); 

      if (maxRows == 5000) {
        $('.pagination').hide();
      } else {
        $('.pagination').show();
      }

      var totalRows = $(table + ' tbody tr').length;
      $(table + ' tr:gt(0)').each(function() {
        trnum++; 
        if (trnum > maxRows) {


          $(this).hide(); 
        }
        if (trnum <= maxRows) {
          $(this).show();
        } 
      });
      if (totalRows > maxRows) {

        var pagenum = Math.ceil(totalRows / maxRows); 
        for (var i = 1; i <= pagenum; ) {

          $('.pagination #prev')
            .before(
              '<li class="page-item" data-page="' +
                i +
                '">\
                    <a class="page-link">' +
                i++ +
                '<span aria-hidden="true" class="sr-only"></span></a>\
								</li>'
            )
            .show();
        } 
      } 
      $('.pagination [data-page="1"]').addClass('active'); 
      $('.pagination li').on('click', function(evt) {

        evt.stopImmediatePropagation();
        evt.preventDefault();
        var pageNum = $(this).attr('data-page'); 

        var maxRows = parseInt($('#maxRows').val()); 

        if (pageNum == 'prev') {
          if (lastPage == 1) {
            return;
          }
          pageNum = --lastPage;
        }
        if (pageNum == 'next') {
          if (lastPage == $('.pagination li').length - 2) {
            return;
          }
          pageNum = ++lastPage;
        }

        lastPage = pageNum;
        var trIndex = 0; 
        $('.pagination li').removeClass('active'); 
        $('.pagination [data-page="' + lastPage + '"]').addClass('active'); 
	  	limitPagging();
        $(table + ' tr:gt(0)').each(function() {
          trIndex++; 
          if (
            trIndex > maxRows * pageNum ||
            trIndex <= maxRows * pageNum - maxRows
          ) {
            $(this).hide();
          } else {
            $(this).show();
          } 
        }); 
      }); 
	  limitPagging();
    })
    .val(5)
    .change();


}

function limitPagging(){


	if($('.pagination li').length > 7 ){
			if( $('.pagination li.active').attr('data-page') <= 3 ){
			$('.pagination li:gt(5)').hide();
			$('.pagination li:lt(5)').show();
			$('.pagination [data-page="next"]').show();
		}if ($('.pagination li.active').attr('data-page') > 3){
			$('.pagination li:gt(0)').hide();
			$('.pagination [data-page="next"]').show();
			for( let i = ( parseInt($('.pagination li.active').attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active').attr('data-page'))  + 2 ) ; i++ ){
				$('.pagination [data-page="'+i+'"]').show();

			}

		}
	}
}

$(function() {

  $('table tr:eq(0)').prepend('<th> ID </th>');

  var id = 0;

  $('table tr:gt(0)').each(function() {
    id++;
    $(this).prepend('<td>' + id + '</td>');
  });
});

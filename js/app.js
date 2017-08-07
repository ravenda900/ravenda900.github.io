
$(() => {
  var $sidebar = $('#sidebar').sidebar();

  $.each(types, (key, value) => {
    let $label = $('<label/>');
    let $input = $('<input/>');
    let $span = $('<span/>');

    $label.attr({
      for: value
    }).addClass('mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect');

    $input.attr({
      type: 'checkbox',
      id: value,
      value: value,
      name: 'type[]'
    }).addClass('mdl-checkbox__input');

    if (key === 0) {
      $input.prop('checked', true);
    }

    $span.addClass('mdl-checkbox__label').text(() => {
      return value.replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    });

    $('#form-filter').append($label.append($input).append($span));
  });

  $('input[name="type[]"]').on('change', (e) => {
    filterMarkers();
  });

  $('#switch-1').change(function() {
    if ($(this).is(':checked')) {
      circle.set('editable', true);
    } else {
      circle.set('editable', false);
    }
  });

  $('.sidebar-close').click(function() {
    $('#reviews').find('.mdl-list').empty();
    $('#reviews').find('.review-counter').empty();
    $('[href="#reviews"]').parent().addClass('hide');
    $('[href="#directions"]').parent().addClass('hide');
  });

  $('#switch-2').change(function() {
    if ($(this).is(':checked')) {
      circle.set('draggable', true);
    } else {
      circle.set('draggable', false);
    }
  });
});
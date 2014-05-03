var floorData = {};

$(function() {
  getFloorData('estancia');
});

function getFloorData(room) {
  $.getJSON('data/' + room + '.json', function(data) {
    floorData = data;
    drawFloor();
    $(".item").resizable({ 
      minHeight: 20, 
      maxHeight: 20,
      ghost: true,
      stop: function( event, ui ) {
        var item_id = ui.element.context.id;
        var aux = item_id.split('_');
        var next_item = $('#' + aux[0] + '_' + aux[1] + '_' + (parseFloat(aux[2]) + 1)); 
        next_item.width(next_item.width() + ui.originalSize.width - ui.size.width); 
        // TODO: Save
      } 
    });
  });
}

function drawFloor() {
  $('#floor').width(floorData.size);
  $.each(floorData.rows, function(rk, row) {
    var $rowDiv = $('<div class="floor-row" id="row_' + rk + '"/>');
    $rowDiv.width(row.size);
    $.each(row.items, function(ik, item) {
      var item_class = 'item';
      if (typeof row.items[ik + 1] === 'undefined') {
      	item_class = 'last-item';
      }
      var $itemDiv = $('<div class="' + item_class + '" id="item_' + rk + '_' + ik + '"/>');
      $itemDiv.width(item.size * row.size);
      $itemDiv.addClass('damage_' + item.damage);
      $itemDiv.data("row_size", row.size);
      $rowDiv.append($itemDiv);
    });
    $("#floor").append($rowDiv);
    $("#floor").append('<div class="clearfix"></div>');
  });
}
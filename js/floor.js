var floorData = {};

$(function() {
  
});

$(document).on('click', '.room-link', function(e) {
  el = $('#' + this.id);
  getFloorData(el.data('room'));
  $('.nav li').removeClass('active');
  el.parent().addClass('active');
});

$(document).on('click', '#save-button', function(e) {
  saveData();
});

function getFloorData(room) {
  $.getJSON('data/' + room + '.json', function(data) {
    floorData = data;
    drawFloor();
  });
}

function saveData() {
  $.ajax({
    type: 'POST',
    url: 'save.php',
    data: floorData, 
    success: function(data) { console.log('Data Saved'); }
  });
}

function drawFloor() {
  $('#floor').empty();
  $('#floor').width(floorData.size);
  $("#room-name").html('<h1>' + floorData.room + '</h1>');
  var r = 0;
  var total_items = 0;
  var damage_labels = ["Sin da&ntilde;os", 
                       "Cuarteadita", 
                       "Varias cuarteaditas", 
                       "Cuarteadas", 
                       "Muchas cuarteadas largas", 
                       "Super da&ntilde;ada"];
  var damage_counter = [];
  damage_counter[0] = 0;
  damage_counter[1] = 0;
  damage_counter[2] = 0;
  damage_counter[3] = 0;
  damage_counter[4] = 0;
  damage_counter[5] = 0;
  $.each(floorData.rows, function(rk, row) {
    r++;
    var $rowDiv = $('<div class="floor-row" id="row_' + rk + '" title="' + r +'" />');
    $rowDiv.width(row.size);
    if (typeof row.offset != 'undefined') {
      $rowDiv.css('margin-left', row.offset + 'px');
    }
    $.each(row.items, function(ik, item) {
      var item_class = 'item';
      total_items++;
      damage_counter[item.damage]++;
      if (typeof row.items[ik + 1] === 'undefined') {
      	item_class = 'last-item';
      }
      var $itemDiv = $('<div class="' + item_class + '" id="item_' + rk + '_' + ik + '"/>');
      $itemDiv.width(item.size * row.size);
      $itemDiv.addClass('damage_' + item.damage);
      $itemDiv.append('<div class="item-inner" />')
      $rowDiv.append($itemDiv);
    });
    $("#floor").append($rowDiv);
    $("#floor").append('<div class="clearfix"></div>');
  });

  var table = '<table class="table"><tr><th>Tipo</th><th>Porc.</th><th>Cant.</th></tr>';
  $.each(damage_counter, function(k,v) {
    var avg = Math.round((damage_counter[k] / total_items) * 100);
    table += '<tr class="damage_' + k + '">';
    table += '<td>' + damage_labels[k] + '</td>';
    table += '<td>' + avg + '%</td>';
    table += '<td>' + damage_counter[k] + '/' + total_items + '</td>';
    table += '</tr>'; 
  });
  $("#room-stats").html(table);
  $('#room-actions').html('<button class="btn btn-primary" id="save-button">Guardar</button>')

  $(".item").resizable({ 
    minHeight: 14, 
    maxHeight: 14,
    ghost: true,
    stop: function( event, ui ) {
      var item_id = ui.element.context.id;
      var aux = item_id.split('_');
      var next_item = $('#' + aux[0] + '_' + aux[1] + '_' + (parseFloat(aux[2]) + 1)); 
      next_item.width(next_item.width() + ui.originalSize.width - ui.size.width); 
      floorData.rows[aux[1]].items[aux[2]].size = ui.size.width / floorData.rows[aux[1]].size
      floorData.rows[aux[1]].items[parseFloat(aux[2]) + 1].size = next_item.width() / floorData.rows[aux[1]].size
    } 
  });
}
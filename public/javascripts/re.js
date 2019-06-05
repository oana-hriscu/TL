$(function() {

  let min_year=5000;
  let max_year=-5000;

  let p_list = [];

  function range_int(start, end, interval) {
    let yearList = [];
    for(item = start - start%interval; item<=end - end%interval + interval; item+=interval){
      yearList.push(item);
    }
    return yearList;
  }

  function range1(start, end) {
    let yearList = [];
    for(item = start; item<=end; item++){
      yearList.push(item);
    }
    return yearList;
  }

  function yearAxis(yearList){

    let container = $('#axis');
    container.empty();

    if(yearList.length<=42) {
      for(let i=0; i < yearList.length; i++) {
        let paragraph = $('<p/>').attr('id', 'year_tag').addClass('axis-year').text(yearList[i]);
        let line = $('<hr/>').addClass('vertical-line');
        let div = $('<div id="axis_element" class="axis-element"></div>');
        paragraph.appendTo(div);
        line.appendTo(div);
        
        div.appendTo(container);
      }
    }
    else {
      $('#axis').css("justify-content", "");
      for(let i=0; i < yearList.length; i++) {
        let paragraph = $('<p/>').attr('id', 'year_tag').addClass('axis-year').text(yearList[i]);
        let line = $('<hr/>').addClass('vertical-line');
        let div = $('<div id="axis_element" class="axis-element"></div>'); //0.5% style="padding-left: 5px; padding-right: 5px"
        paragraph.appendTo(div);
        line.appendTo(div);
        
        div.appendTo(container);
      }
    }
    $('#bar_id').css('margin-top', $('#year_tag').height());
    
  }

  function addTLElements(listOfPeople, years, interval) {
    let container = $('#bar_id');
    container.empty();
    let margin = $('.vertical-line').offset()['left']+0.5; //add to everything
    let unit = margin *2; //width of year-bar element
    let width = unit * years.length; //width of container
    
    for(let i=0; i<listOfPeople.length; i++) {
      let span = (listOfPeople[i]['deces'] - listOfPeople[i]['nastere']) / interval * unit //life span in pixels (65 years = 6.5 units => 6.5* unit= pixels)
      let yearPos = years.indexOf(listOfPeople[i]['nastere']- listOfPeople[i]['nastere'] % interval);
      let mgLeft = margin +  (yearPos + (listOfPeople[i]['nastere'] % interval) / interval) * unit;

      let person;
      
      if(listOfPeople[i]['deces'] == 2019) {
        person = $('<p></p>').addClass('person').css('margin-left', mgLeft+'px').text(listOfPeople[i]['_nume'] +' ('+listOfPeople[i]['nastere']+'-prezent)').appendTo(container);
      }
      else {
        person = $('<p></p>').addClass('person').css('margin-left', mgLeft+'px').text(listOfPeople[i]['_nume'] +' ('+listOfPeople[i]['nastere']+'-'+listOfPeople[i]['deces']+')').appendTo(container);
      
      }

      let arrow = $('<div/>').addClass('arrow').appendTo(person);
      let drop = $('<div/>').addClass('drop').appendTo(arrow);
      let tbox = $('<div/>').addClass('tbox');
      $('<div/>').addClass('pic').prepend($('<img src="'+listOfPeople[i]['img']+'">').addClass('theImage')).appendTo(drop);
      $('<div/>').addClass('info-box-title').text(listOfPeople[i]['_nume']).appendTo(tbox);
      $('<div/>').addClass('info-box-ocupation').text(listOfPeople[i]['ocupatie']).appendTo(tbox);
      $('<div/>').addClass('info-box-description').text(listOfPeople[i]['descriere']).appendTo(tbox);
      tbox.appendTo(drop);
        
      let bar = $('<hr></hr>').addClass('bars');
      bar.css('background', listOfPeople[i]['culoare']);
      bar.css('width', String(span) + 'px');
      bar.css('margin-left', String(mgLeft)+'px');
      bar.appendTo(container);
    }

    if ($('#bar_id').height() > $('#axis').height()) {
      $('.vertical-line').css('height', $('#bar_id').height()+ 10 + 'px');
    }

  }

  function checkYears(start, end, startCheck, endCheck) {
    if(start < end) {
      if((startCheck==true && endCheck==true) || (startCheck==false && endCheck==true)){
        return false;
      }
    }
    if(start > end) {
      if((startCheck==false && endCheck==false) || (startCheck==false && endCheck==true)) {
        return false;
      }
    }
    return true;
  }

  function validateForm() {
    let interval = parseInt($('#interval').val());
    let imagine = $('#input_imagine').val();
    let nume = $('#input_nume').val();
    let ocup = $('#input_ocupatie').val();
    let colour = $('#colour_box').css('background-color');
    let start = parseInt($('#year_start').val());
    let startCheck = $('#start_checkbox').is(':checked');
    let end = parseInt($('#year_end').val());
    let endCheck = $('#end_checkbox').is(':checked'); 
    let desc = $('#input_descriere').val();

    if (!checkYears(start, end, startCheck, endCheck)) {
      console.log('false');
      return false;
    }

    if(nume=='' || ocup=='' || start=='' || end=='' || desc=='' ) {
      return false;
    }
    else {
      if(startCheck){
        start *= -1;
      }
      if(endCheck){
        end *= -1;
      }

      if(start < min_year){
        min_year=start;
      }

      if(end > max_year){
        max_year=end;
      }

      let years;
      if(interval === 1){
        years = range1(min_year, max_year);
      }
      else {
        years = range_int(min_year, max_year, interval);
      }

      yearAxis(years);
      
      var pDict = {
        img: imagine,
        _nume: nume,
        ocupatie: ocup,
        nastere: start,
        deces: end,
        descriere: desc,
        culoare: colour
        };

      p_list.push(pDict);
      addTLElements(p_list, years, interval);
      return true;
    } 
  };

  function extractYears(passed_text) {
    let re = /(\d{1,2}) (ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie) (\d{4})/ig;
    let ylist =passed_text.match(re);
    let birth = ylist[0].split(" ")[2];
    let death;

    if (ylist.length === 1){
      death = new Date().getFullYear();
    }
    else {
      death = ylist[1].split(" ")[2];
    }
    return [parseInt(birth), parseInt(death)];
  };

  $('#add_button').click(function() {
    if (validateForm()) {
      $(this).parents('.dropdown').find('button.dropdown-toggle').dropdown('toggle')
      $('#interval').attr('disabled', true);
    }
  });

  $('#reset_button').click(function() {
    $('#axis').empty();
    $('#bar_id').empty();
    $('#interval').attr('disabled', false);
    min_year=5000;
    max_year=-5000;
    p_list.length=0;
  });

  $(document).on('click', 'div.dropdown div.dropdown-menu', function (e) {
    e.stopPropagation();
  });

  $("#search_form").submit(function(event) {
    $("#info_box").empty();
    event.preventDefault();
    let $form = $( this ),
        url = $form.attr('action');

    /* Send the data using post with element id name and name2*/
    var posting = $.post( url, { name: $('#search_bar').val()} );

    /* Alerts the results */
    posting.done(function( data ) {
      for (let i = 0; i < data[1].length; i++) {
        let title = $('<p/>').addClass('entry-title').text(data[1][i]);
        let desc = $('<p/>').addClass('entry-desc').text(data[2][i]);
        let about = $('<div/>').addClass('entry-about');
        let btn = $('<button type="button" class="btn mini-add" id="srcResult_add'+i+'" data-container="body" data-toggle="popover" data-placement="right" data-content="Eroare">ADAUGA</button>');

        about.append(title);
        about.append(desc);
        about.append(btn);
        $('#info_box').append(about);

        $('#srcResult_add'+i).click(function() {
          let interval = parseInt($('#interval').val());
          let y = extractYears(data[2][i]);
          let years;

          if(y[0] < min_year){
            min_year=y[0];
          }
    
          if(y[1] > max_year){
            max_year=y[1];
          }

          if(interval === 1){
            years = range1(min_year, max_year);
          }
          else {
            years = range_int(min_year, max_year, interval);
          }

          yearAxis(years);
          console.log(data[5][0]);
          var pDict = {
            _nume: data[1][i],
            ocupatie: data[4][i],
            nastere: y[0],
            deces: y[1],
            descriere: data[2][i],
            culoare: "ab2567",
            img: 'face.jpg'
            };

          p_list.push(pDict);

          addTLElements(p_list, years, interval);
        });
      }
      //$('<div/>').addClass('pic').prepend($('<img>',{class:'theImage',src: 'face.jpg'})).appendTo('#a_response');
    });
  });


});
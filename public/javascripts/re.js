$(function() {

  let min_year=5000;
  let max_year=-5000;

  let p_list = [];

  function range10(start, end) {
    let yearList = [];
    for(item = start - start%10; item<=end - end%10 + 10; item+=10){
      yearList.push(item);
    }
    return yearList;
  }

  function extract_data(dict) {
    let i=2;
    let minimum = 3000;
    let maximum = 0;

    let listOfPeople =[];

    while(dict['A'+i] !=undefined || dict['B'+i] !=undefined || dict['C'+i]!=undefined){
      
      let pObj = {}

      pObj['Nume'] = dict['A'+i]['v'];
      pObj['Nastere'] = dict['B'+i]['v'];
      pObj['Deces'] = dict['C'+i]['v'];
      listOfPeople.push(pObj);

      if(dict['B'+i]['v']>maximum)
        maximum = dict['B'+i]['v'];
      if(dict['B'+i]['v']<minimum)
        minimum = dict['B'+i]['v'];
      if(dict['C'+i]['v']>maximum)
        maximum = dict['C'+i]['v'];
      if(dict['C'+i]['v']<minimum)
        minimum = dict['C'+i]['v'];

      i++;
    }

    listOfPeople.sort(function(a, b) {
      return a.Nastere - b.Nastere;
    });

    console.log(listOfPeople);

    let years = range10(minimum, maximum);
    yearAxis(years);
    $( document ).ready(bars(listOfPeople, years)); 
  }

  function yearAxis(yearList){

    let container = $('.axis');
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
      $('.axis').css("justify-content", "");
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

  function bars(listOfPeople, yearList) {
    let container = $('#bar_id');
    let unit = $('#axis_element').outerWidth() + 4.9188; //width of year-bar element
    //unit = 39.37;
    let width = unit * yearList.length; //width of container
    let margin = unit/2; //add to everything
    
    for(let i=0; i<listOfPeople.length; i++) {
      let span = (listOfPeople[i]['Deces'] - listOfPeople[i]['Nastere']) / 10 * unit //life span in pixels (65 years = 6.5 units => 6.5* unit= pixels)
      let percentage = span / width * 100; //width of bar in percentage
      let yearPos = yearList.indexOf(String(listOfPeople[i]['Nastere']- listOfPeople[i]['Nastere']%10));
  
      //recalculate margin-left = margin + (indexof year00 in list + what's left)*unit
      let mgLeft = margin +  (yearPos + (listOfPeople[i]['Nastere']%10)/10) * unit;
      let mgLeftPc = mgLeft * (100/width);

      let person = $('<p></p>').addClass('person')
      .css('margin-left', String(mgLeft)+'px')
      .text(listOfPeople[i]['Nume']+' ('+listOfPeople[i]['Nastere']+'-'+listOfPeople[i]['Deces']+')')
      .appendTo(container);
      let arrow = $('<div/>').addClass('arrow').appendTo(person);
      let drop = $('<div/>').addClass('drop').appendTo(arrow);
      $('<div/>').addClass('pic').prepend($('<img>',{class:'theImage',src: listOfPeople[i]['Nume'].split(' ')[1]+'.jpg'})).appendTo(drop);
      $('<div/>').addClass('line one').text(listOfPeople[i]['Nume']).appendTo(drop);
      $('<div/>').addClass('line two').text('filozof').appendTo(drop);
      
      let bar = $('<hr></hr>').addClass('bars');
      bar.css('width', String(span) + 'px');
      bar.css('margin-left', String(mgLeft)+'px');
      bar.appendTo(container);
    }

    if ($('#bar_id').height() > $('.axis').height()) {
      $('.vertical-line').css('height', $('#bar_id').height()+ 10 + 'px');
    }
  }

  function addTLElements(listOfPeople, years) {
    let container = $('#bar_id');
    container.empty();
    let margin = $('.vertical-line').offset()['left']+0.5; //add to everything
    let unit = margin *2; //width of year-bar element
    console.log(margin, unit);
    let width = unit * years.length; //width of container
    
    for(let i=0; i<listOfPeople.length; i++) {
      let span = (listOfPeople[i]['deces'] - listOfPeople[i]['nastere']) / 10 * unit //life span in pixels (65 years = 6.5 units => 6.5* unit= pixels)
      let yearPos = years.indexOf(listOfPeople[i]['nastere']- listOfPeople[i]['nastere']%10);
      //console.log('pozitie: ', start- start%10);
      //console.log('yearPos:', yearPos);
      let mgLeft = margin +  (yearPos + (listOfPeople[i]['nastere']%10)/10) * unit;

      let person = $('<p></p>').addClass('person')
      .css('margin-left', mgLeft+'px')
      .text(listOfPeople[i]['_nume'] +' ('+listOfPeople[i]['nastere']+'-'+listOfPeople[i]['deces']+')')
      .appendTo(container);
      let arrow = $('<div/>').addClass('arrow').appendTo(person);
      let drop = $('<div/>').addClass('drop').appendTo(arrow);
      $('<div/>').addClass('pic').prepend($('<img>',{class:'theImage',src: 'face.jpg'})).appendTo(drop);
      $('<div/>').addClass('line one').text(listOfPeople[i]['_nume']).appendTo(drop);
      $('<div/>').addClass('line two').text(listOfPeople[i]['ocupatie']).appendTo(drop);
        
      let bar = $('<hr></hr>').addClass('bars');
      bar.css('width', String(span) + 'px');
      bar.css('margin-left', String(mgLeft)+'px');
      bar.appendTo(container);
    }

    if ($('#bar_id').height() > $('.axis').height()) {
      $('.vertical-line').css('height', $('#bar_id').height()+ 10 + 'px');
    }

  }

  $.getScript('javascripts/xlsx.full.min.js', function() {
    console.log('Load performed.');
  });

  $('#upload_button').click(function() {
    $('#file_browser').click();
    $('#file_browser').change(function() {
      let file = document.getElementById('file_browser').files[0];
      if (file) {
          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function(file) {
            let data = new Uint8Array(reader.result);
            let wb = XLSX.read(data,{type:'array'});
            extract_data(wb['Sheets']['Frâncu']);
          }
      }
    }); 
  });

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
    let nume = $('#input_nume').val();
    let ocup = $('#input_ocupatie').val();
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
      //$('#add_button').popover('enable');
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
      let years = range10(min_year, max_year);
      yearAxis(years);

      console.log(years);

      var pDict = {
        _nume: nume,
        ocupatie: ocup,
        nastere: start,
        deces: end,
        descriere: desc
        };

      p_list.push(pDict);
      console.log(p_list);
      addTLElements(p_list, years);
      return true;
    } 
  };

  $('#add_button').click(function() {
    if (validateForm()) {
      //$('#add_button').popover('disable');
      $(this).parents('.dropdown').find('button.dropdown-toggle').dropdown('toggle')
    }
  });

  $(document).on('click', 'div.dropdown div.dropdown-menu', function (e) {
    e.stopPropagation();
  });



  // $('#search_button').click(function() {
  //   if(!$('#search_bar').val()) {
  //   }
  //   else {
  //     let s = $('#search_bar').val().replace(/ /g, '+');
  //     $.get('https://www.google.com/search?q='+s+'&num=5&lr=lang_ro', function( data ) {
  //       let page = data;
  //       console.log(page);
  //   });
  //   }
  // });


});
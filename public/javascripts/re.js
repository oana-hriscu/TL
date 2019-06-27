$(function() {

  let min_year=5000;
  let max_year=-5000;

  let eventByPerson = {};
  let p_list = [];

  let s_list = [];

  function range_int(start, end, interval) {
    let yearList = [];

    let item;
    if(start < 0) {
      item = start - start%interval - interval;
    }
    else {
      item = start - start%interval;
    }

    for(item; item<=end - end%interval + interval; item+=interval){
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

  function addEvents(bar, unit, birth, eventList){
    let prev = birth;
    for(let i=0; i < eventList.length; i++) {
      let mg = eventList[i]['year'] - prev;
      let aux = $('<hr/>').addClass('event-overlap').css('margin-left', (mg*unit - unit/2)+'px').appendTo(bar);
      let arrow = $('<div/>').addClass('arrow').appendTo(aux);
      let evDrop = $('<div/>').addClass('event-drop').appendTo(arrow);
      for(let j=0; j < eventList[i]['description'].length; j++) {
        $('<p>').addClass('event-text').text(eventList[i]['description'][j]).appendTo(evDrop);
      }

      prev = eventList[i]['year'];
    }
  }

  function addTLElements(listOfPeople, years, interval, eventByPerson) {
    listOfPeople.sort((a,b) => (a.nastere < b.nastere) ? -1 : ((b.nastere < a.nastere) ? 1 : 0));

    let container = $('#bar_id');
    container.empty();
    let margin = $('.vertical-line').offset()['left']+0.5; //add to everything
    let unit = margin *2; //width of year-bar element
    //let width = unit * years.length; //width of container
    for(let i=0; i<listOfPeople.length; i++) {
      let span;

      if(listOfPeople[i]['deces'] - listOfPeople[i]['nastere'] === 0){
        span = unit/interval;
      }
      else {
        span = (listOfPeople[i]['deces'] - listOfPeople[i]['nastere']) / interval * unit //life span in pixels (65 years = 6.5 units => 6.5* unit= pixels)\
      }

      let yearPos = years.indexOf(listOfPeople[i]['nastere']- listOfPeople[i]['nastere'] % interval);
      let mgLeft = margin +  (yearPos + (listOfPeople[i]['nastere'] % interval) / interval) * unit;
      let auxDiv = $('<div id="parent"/>');
      let person;
      
      if(listOfPeople[i]['nastere'] === listOfPeople[i]['deces']) {
        person = $('<p></p>').addClass('person').css('margin-left', mgLeft+'px').text(listOfPeople[i]['_nume'] +' ('+listOfPeople[i]['nastere']+')').appendTo(auxDiv);
      }
      else if(listOfPeople[i]['deces'] === 2019) {
        person = $('<p></p>').addClass('person').css('margin-left', mgLeft+'px').text(listOfPeople[i]['_nume'] +' ('+listOfPeople[i]['nastere']+'-prezent)').appendTo(auxDiv);
      }
      else if(listOfPeople[i]['nastere'] < 0 || listOfPeople[i]['deces'] < 0){
        if(listOfPeople[i]['nastere'] < 0 && listOfPeople[i]['deces'] > 0){
          person = $('<p></p>').addClass('person').css('margin-left', mgLeft+'px').text(listOfPeople[i]['_nume'] +' ('+Math.abs(listOfPeople[i]['nastere'])+' î.Hr. -'+listOfPeople[i]['deces']+')').appendTo(auxDiv);
        }
        if(listOfPeople[i]['nastere'] < 0 && listOfPeople[i]['deces'] < 0){
          person = $('<p></p>').addClass('person').css('margin-left', mgLeft+'px').text(listOfPeople[i]['_nume'] +' ('+Math.abs(listOfPeople[i]['nastere'])+' î.Hr. -'+Math.abs(listOfPeople[i]['deces'])+' î.Hr.)').appendTo(auxDiv);
        }
      }
      else {
        person = $('<p></p>').addClass('person').css('margin-left', mgLeft+'px').text(listOfPeople[i]['_nume'] +' ('+listOfPeople[i]['nastere']+'-'+listOfPeople[i]['deces']+')').appendTo(auxDiv);
      }


      let arrow = $('<div/>').addClass('arrow').appendTo(person);
      let drop = $('<div/>').addClass('drop').appendTo(arrow);
      let tbox = $('<div/>').addClass('tbox');
      $('<div/>').addClass('pic').prepend($('<img src="'+listOfPeople[i]['img']+'">').addClass('theImage')).appendTo(drop);
      $('<div/>').addClass('info-box-title').text(listOfPeople[i]['_nume']).appendTo(tbox);
      $('<div/>').addClass('info-box-ocupation').text(listOfPeople[i]['ocupatie']).appendTo(tbox);
      $('<div/>').addClass('info-box-description').text(listOfPeople[i]['descriere']).appendTo(tbox);

      tbox.appendTo(drop);

      let editable = $('<div/>').addClass('editMenu');
      let trash = $('<i class="fa fa-trash" id="trash"></i>');

      trash.click(function () {
        console.log(listOfPeople[i]);
        $(this).closest('#parent').remove();
        listOfPeople.splice(i, 1);
        console.log(listOfPeople);
      });

      trash.appendTo(editable);
      editable.appendTo(drop);
        
      let bar = $('<hr></hr>').addClass('bars');
      bar.css('background', listOfPeople[i]['culoare']);
      bar.css('width', String(span) + 'px');
      bar.css('margin-left', String(mgLeft)+'px');

      if(eventByPerson[listOfPeople[i]['_nume']] !== undefined){
        addEvents(bar, span/(listOfPeople[i]['deces'] - listOfPeople[i]['nastere']), listOfPeople[i]['nastere'], eventByPerson[listOfPeople[i]['_nume']]);
      }

      bar.appendTo(auxDiv);

      auxDiv.appendTo(container);
    }

    if ($('#bar_id').height() > $('#axis').height()) {
      $('.vertical-line').css('height', $('#bar_id').height()+ 10 + 'px');
    }

  }

  function checkYears(start, end, startCheck, endCheck) {
    if (isNaN(start) || isNaN(end)) 
    {
      alert("Introduceți numere valide în casetele de interval");
      return false;
    }

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

  function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
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

    if(!validURL(imagine)){
      imagine ="face.jpg";
    }

    if(nume=='' || ocup=='' || start=='' || end=='') {
      alert('Completați toate câmpurile necesare (nume, ocupație, interval)')
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

      if(imagine == '') {
        imagine = "face.jpg";
      }
      
      let pDict = {
        img: imagine,
        _nume: nume,
        ocupatie: ocup,
        nastere: start,
        deces: end,
        descriere: desc,
        culoare: colour
        };

      p_list.push(pDict);
      addTLElements(p_list, years, interval, eventByPerson);
      addToHistory(pDict, years, interval, eventByPerson);

      return true;
    } 
  };

  $('#add_button').click(function() {
    if (validateForm()) {
      $(this).parents('.dropdown').find('button.dropdown-toggle').dropdown('toggle')
      $('#interval').attr('disabled', true);
    }
  });

  function extractYears(json, passed_text) {

    if(json['born'] != undefined && json['died'] != undefined) {
      let bc = /BC/i;
      if((json['born'].match(bc) || []).length) {
        return [2010, 2020];//complete
      }
      if((json['died'].match(bc) || []).length) {
        return [2010, 2020];//complete///////////////////////////////////////////////////////////
      }
      else return [parseInt(json['born'].match(/\d{4}/)[0]), parseInt(json['died'].match(/\d{4}/)[0])];
    }
    if(json['born'] != undefined && json['died'] === undefined) {
      return [parseInt(json['born'].match(/\d{4}/)[0]), 2019];
    }
    if(json['born'] === undefined && json['died'] === undefined) {
      let birth = 2019;
      let death = 2019;

      let re_birth1 = /n\. (\d{1,2}) (ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie) (\d{4})/i;
      let re_death1 = /d\. (\d{1,2}) (ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie) (\d{4})/i;
      let re_birth2 = /n\. (\d{4})/i;
      let re_death2 = /d\. (\d{4})/i;
      let before = /î\.Hr\./i;

      if(re_birth1.test(passed_text)){
        birth = parseInt(passed_text.match(re_birth1)[3]);
      }
      if(re_death1.test(passed_text)){
        death = parseInt(passed_text.match(re_death1)[3]);
      }
      
      if(re_birth2.test(passed_text)){
        birth = parseInt(passed_text.match(re_birth2)[1]);
      }
      if(re_death2.test(passed_text)){
        death = parseInt(passed_text.match(re_death2)[1]);
      }
      
      

      return [birth, death];
    }
    else return [2010, 2020];

    //return [parseInt(birth), parseInt(death)];
  };

  function addToHistory(pDict, years, interval, eventByPerson) {
    let history = $('#history');
    let entry = $('<div/>').addClass('entry');;
    let about = $('<div/>').addClass('entry-about').attr('style', 'justify-content: space-evenly');
    let pic = $('<img/>').attr('src', pDict['img']).addClass('entry-image');

    let title = $('<p/>').addClass('entry-title').text(pDict['_nume'] +' ('+pDict['nastere']+'-'+pDict['deces']+')');
    title.appendTo(about);

    let btn = $('<button type="button" class="btn mini-add" id="history_add" data-container="body">ADAUGA</button>');
    btn.appendTo(about);

    pic.appendTo(entry);
    about.appendTo(entry);

    entry.appendTo(history);
    btn.click(function () {
      if(!$('#interval').prop("disabled")){
        min_year = 5000;
        max_year = -5000;
        console.log('sup');
        $('#interval').attr('disabled', true);

        if(pDict['nastere'] < min_year){
        min_year=pDict['nastere'];
        }

        if(pDict['deces'] > max_year){
          max_year=pDict['deces'];
        }

        let years;
        interval = parseInt($('#interval').val());
        if(interval === 1){
          years = range1(min_year, max_year);
        }
        else {
          years = range_int(min_year, max_year, interval);
        }

        yearAxis(years);
        p_list.push(pDict);
        addTLElements(p_list, years, interval, eventByPerson);

      }
      else {
        p_list.push(pDict);
        addTLElements(p_list, years, interval, eventByPerson);
      }
    });
  }

  function addToSocialHistory(event) {
    let history = $('#history');
    let entry = $('<div/>').addClass('entry');;
    let about = $('<div/>').addClass('entry-about').attr('style', 'justify-content: space-evenly');

    let title = $('<p/>').addClass('entry-title').text(event['txt']);
    let date = $('<p/>').addClass('entry-title').text(event['month']+' '+event['year']);
    let description = $('<p/>').addClass('entry-desc').text(event['desc']);
    title.appendTo(about);
    date.appendTo(about);
    description.appendTo(about);

    let btn = $('<button type="button" class="btn mini-add" id="history_add" data-container="body">ADAUGA</button>');
    btn.appendTo(about);

    about.appendTo(entry);

    entry.appendTo(history);

    btn.click(function () {

      if(event['year'] < min_year){
        min_year = event['year'];
      }

      if(event['year'] > max_year) {
        max_year = event['year'];
      }

      let years;
      years = range1(min_year, max_year);

      socialAxis(years);

      let height = $('.social-year').height() + $('.axis-year').height();
      $('#bar_id').css({"top": String(height+5)+"px"});
      s_list.push(event);
      addSocialEvent(s_list);
    });

  }

  $('#reset_button').click(function() {
    $('#axis').empty();
    $('#bar_id').empty();
    $('#interval').attr('disabled', false);
    min_year = 5000;
    max_year = -5000;
    p_list.length = 0;
    s_list.length = 0;
    console.log('blabla');
    eventByPerson.length = 0;
  });

  $(document).on('click', 'div.dropdown div.dropdown-menu', function (e) {
    e.stopPropagation();
  });

  $("#search_form").submit(function(event) {
    $("#info_box").empty();
    event.preventDefault();
    let $form = $( this );
    url = $form.attr('action');

    /* Send the data using post with element id name and name2*/
    var posting = $.post( url, { name: $('#search_bar').val()} );

    /* Alerts the results */
    posting.done(function( data ) {
      if (data[1].length === 0) {
        let nfdiv = $('<div/>').addClass('nothing-found');
        let not_found = $('<p style="font-size: 100%;" />').text('Nu am gasit nimic 😞');
        let shrug = $('<img/>').attr('src', 'shrug.png').addClass('shrug');
        $(nfdiv).append(not_found);
        $(nfdiv).append(shrug);
        $('#info_box').append(nfdiv);

      }
      else {
        for (let i = 0; i < data[1].length; i++) {
          let entry = $('<div/>').addClass('entry');
          let title = $('<p/>').addClass('entry-title').text(data[1][i]);
          let desc = $('<p/>').addClass('entry-desc').text(data[2][i].replace(/&amp;/g,'&'));
          let about = $('<div/>').addClass('entry-about');
          let pic = $('<img/>').attr('src', data[5][i]).addClass('entry-image');
          let btn = $('<button type="button" class="btn mini-add" id="srcResult_add'+i+'" data-container="body" data-toggle="popover" data-placement="right" data-content="Eroare">ADAUGA</button>');

          about.append(title);
          about.append(desc);
          about.append(btn);

          entry.append(pic);
          entry.append(about);
          $('#info_box').append(entry);

          $('#srcResult_add'+i).click(function() { //add functionality for each button
            $('#interval').attr('disabled', true);
            
            let interval = parseInt($('#interval').val());
            let y = extractYears(data[6][i], data[2][i]);
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

            let randomColor = "ab2567";
            randomColor = Math.floor(Math.random()*16777215).toString(16);

            yearAxis(years);
            let pDict = {
              _nume: data[1][i],
              ocupatie: data[4][i],
              nastere: y[0],
              deces: y[1],
              descriere: data[2][i].replace(/&amp;/g,'&'),
              culoare: randomColor,
              img: data[5][i]
              };

            p_list.push(pDict);
            
            let getting = $.get( '/something', { term: data[1][i], birth: y[0], death: y[1]});
            
            getting.done(function( theList ) {
              eventByPerson[data[1][i]] = theList;
              addTLElements(p_list, years, interval, eventByPerson);
              addToHistory(pDict, years, interval, eventByPerson);
            });
            
          });
        }

    }
    });
  });

  function createDropdown() {
    let container = $('#dropdown_menu');
    let m = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];

    let dateY = $('<div class="dropdown-item input-group input-group-sm mb-3"/>');
    let subY = $('<div class="input-group-prepend"/>').appendTo(dateY);
    let spanY = $('<span class="input-group-text" id="inputGroup-sizing-sm"/>').text('An').appendTo(subY);
    let year = $('<input class="form-control w-25" id="sYear" type="text"/>').appendTo(dateY);
    dateY.appendTo(container);

    let dateM = $('<div class="dropdown-item input-group input-group-sm mb-3"/>');
    let subM = $('<div class="input-group-prepend"/>').appendTo(dateM);
    let spanM = $('<span class="input-group-text" id="inputGroup-sizing-sm"/>').text('Luna').appendTo(subM);
    let month = $('<select class="form-control w-25" id="sMonth" type="text" placeholder="Ian"/>').appendTo(dateM);

    $(m).each(function() {
      month.append($("<option>").text(this));
    });

    let nameEvent = $('<div class="dropdown-item input-group input-group-sm mb-3"/>');
    let subEv = $('<div class="input-group-prepend"/>').appendTo(nameEvent);
    let spanEv = $('<span class="input-group-text" id="inputGroup-sizing-sm"/>').text('Eveniment').appendTo(subEv);
    let inputEv = $('<input type="text" id="input_nume" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>').appendTo(nameEvent);

    let descEvent = $('<div class="dropdown-item form-group"/>');
    let label = $('<label for="exampleFormControlTextarea1"/>').text('Descriere: ').appendTo(descEvent);
    let txtarea = $('<textarea class="form-control" id="input_descriere" rows="3"/>').appendTo(descEvent);

    let btnDiv = $('<div class="add-button">');
    let btn = $('<button type="button" id="event_add_button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="right" data-content="Eroare">').text('ADAUGĂ').appendTo(btnDiv);

    dateM.appendTo(container);
    nameEvent.appendTo(container);
    descEvent.appendTo(container);
    btnDiv.appendTo(container);

    $('#event_add_button').click(function() {
        let yearInput = parseInt($('#sYear').val());
        let monthInput = $('#sMonth').val().substring(0,3);
        let title = $('#input_nume').val();
        let desc = $('#input_descriere').val();

        if (isNaN(yearInput)) 
        {
          alert('Introduceți un număr valid în caseta "An"');
          return false;
        }

        if(yearInput < min_year){
          min_year = yearInput;
        }

        if(yearInput > max_year) {
          max_year = yearInput
        }

        let years;
        years = range1(min_year, max_year);

        socialAxis(years);

        let height = $('.social-year').height() + $('.axis-year').height();
        $('#bar_id').css({"top": String(height+5)+"px"});

        let event = {
          year: yearInput,
          month: monthInput,
          txt: title,
          description: desc
        }

        s_list.push(event);
        addSocialEvent(s_list);
        addToSocialHistory(event);
    });  
    
    $(document).on('click', 'div.dropdown div.dropdown-menu', function (e) {
      e.stopPropagation();
    });
  }

  function socialAxis(years) {
    let container = $('#axis');
    container.empty();

    for(let j = 0 ; j < years.length; j++){
      let one = $('<div\>').addClass('one');
      let year = $('<p\>').addClass('social-year').text(years[j]).appendTo(one);

      let monthDiv = $('<div\>').addClass('axis').appendTo(one);
      let m = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'];

      for (let i = 0; i<m.length; i++){
          let paragraph = $('<p/>').attr('id', 'year_tag').addClass('axis-year').text(m[i]);
          let line = $('<hr/>').addClass('vertical-line').attr('id', years[j]+m[i]);

          if(m[i] === 'Ian') {
            line.css({'background': 'black'});
          }

          let div = $('<div id="axis_element" class="axis-element"></div>'); //0.5% style="padding-left: 5px; padding-right: 5px"
          paragraph.appendTo(div);
          line.appendTo(div);

          div.appendTo(monthDiv);
      }

      one.append(year);
      one.append(monthDiv);

      container.append(one);
    }
  }

  function addSocialEvent(ev_list) {
    let container = $('#bar_id');
    container.empty();

    for(let i=0; i<ev_list.length;i++){
      let auxDiv = $('<div id="parent"/>');

      let loc = $('#'+ev_list[i]['year']+ev_list[i]['month']);
      let mgLeft = loc.offset()['left'];

      let name = $('<p></p>').addClass('person').text(ev_list[i]['txt']);
      let bar = $('<hr></hr>').addClass('Evbars');
      bar.css('width', '8px');
      bar.css('height', '8px');
      bar.css('margin-left', String(mgLeft-4)+'px');

      let arrow = $('<div/>').addClass('arrow').appendTo(bar);
      let drop = $('<div/>').addClass('drop').appendTo(arrow);
      let tbox = $('<div/>').addClass('tbox');

      let editable = $('<div/>').addClass('editMenu');
      let trash = $('<i class="fa fa-trash" id="trash"></i>');

      trash.click(function () {
        console.log(ev_list[i]);
        $(this).closest('#parent').remove();
        ev_list.splice(i, 1);
        console.log(ev_list);
      });

      $('<div/>').addClass('info-box-description').text(ev_list[i]['description']).appendTo(tbox);
      tbox.appendTo(drop);
      name.appendTo(auxDiv);
      bar.appendTo(auxDiv);
      trash.appendTo(editable);
      editable.appendTo(drop);
      auxDiv.appendTo(container);
      
      name.css('margin-left', mgLeft-name.outerWidth()/2+'px');
    }
  }

  $('#historyTL_button').click(function () {
    $('#axis').css({"align-items": ""}).empty();
    $('#dropdownMenuButton').attr('disabled', false);
    $('#interval').attr('disabled', false);
    $('#search_bar').attr('disabled', false);
    $('#submit_button').attr('disabled', false);
    $('#history_button').attr('disabled', false);
    $('#reset_button').attr('disabled', false);
  })

  $('#socialTL_button').click(function () {
    $('#axis').css({"align-items": ""}).empty();
    $('#axis').css({"justify-content": "flex-start"});
    $('#dropdownMenuButton').attr('disabled', false);
    $('#history_button').attr('disabled', false);
    $('#reset_button').attr('disabled', false);
    $('#dropdown_menu').empty();

    createDropdown();
  })
});
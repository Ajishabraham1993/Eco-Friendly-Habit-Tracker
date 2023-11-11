$(document).ready(function () {
    // Habit tracking
    let timenow = new Date();	
	let yearnow = timenow.getFullYear();
	let monthnow = timenow.getMonth();
	let daynow = timenow.getDate();
    let today = daynow+'-'+monthnow+'-'+yearnow;
    let habitlist = (localStorage.getItem(today+'-habit_list'))?localStorage.getItem(today+'-habit_list'):null;
    let allhabit = (localStorage.getItem('all_habit'))?localStorage.getItem('all_habit'):null;
    let allbadges = (localStorage.getItem('all_badges'))?localStorage.getItem('all_badges'):null;
    let all_habit = (allhabit)?JSON.parse(allhabit):[];
	let habit_list = (habitlist)?JSON.parse(habitlist):[];		
	let all_badges = (allbadges)?JSON.parse(allbadges):{};		
	if(!all_badges[monthnow+'-'+yearnow]){
		all_badges[monthnow+'-'+yearnow] = [];
	}
	//for badge example
	//all_badges[monthnow+'-'+yearnow] = ['1','2','3','4','5','6','1','2','3','4','5','6'];
	
	set_habit_sel();
	set_habit_list();
	set_badges_list();
	set_calhistory();
	
	$('select#history_year').material_select();
	$('select#history_month').material_select();
	
    $('#habit-input').focus();
    //add habbit event
	let rate_limit = 0;
    $(document).off('click', '#add-habit');
    $(document).on('click', '#add-habit', function() {
	    rate_limit++;
        var habit = $('#habit-input').val();
	    
        if(rate_limit>5){        	
        	Materialize.toast('Please dont spamming add habbit!', 2000, '', function toastCompleted(){
                     $('.toast').removeClass('dangeralrt');
            });
            $('.toast').addClass('dangeralrt');
			return false;
		}
        if(habit==''){        	
        	Materialize.toast('Please enter a habbit!', 2000, '', function toastCompleted(){
                     $('.toast').removeClass('dangeralrt');
            });
            $('.toast').addClass('dangeralrt');
			return false;
		}
	 if(habit.lenght>100){        	
        	Materialize.toast('Habbit cannot exceed 100 length!', 2000, '', function toastCompleted(){
                     $('.toast').removeClass('dangeralrt');
            });
            $('.toast').addClass('dangeralrt');
			return false;
		}
        var option = {};
	    option.id = generateUniqueId(6);
	    option.text = removeHtmlTags(habit);
	    set_habit_sel(option);
	     Materialize.toast('Checkin successfull!', 2000);
	    $('#habit-input').val('');
    });
	//show delete button
    $(document).off('mouseover', '.timeline_par');
    $(document).on('mouseover', '.timeline_par', function() {
    	if(!$(this).find('.iconpar').hasClass('disabledel')){
			$(this).find('.iconpar').show();
		}    	
    });
    $(document).off('mouseleave', '.timeline_par');
    $(document).on('mouseleave', '.timeline_par', function() {
    	$(this).find('.iconpar').hide();
    });
    $(document).off('click', '.badgeinfo');
    $(document).on('click', '.badgeinfo', function() {
    	$('.tooltipCustInfo').toggleClass('hideel');
    });
    //show history event
    $(document).off('click', '.historyico');
    $(document).on('click', '.historyico', function() {
    	$('.history_body').toggleClass('hideel');
    });
    $(document).off('click', '.tooltipCustInfoClose');
    $(document).on('click', '.tooltipCustInfoClose', function() {
    	$('.tooltipCustInfo').addClass('hideel');
    });
    // history change month event
    $(document).off('change', '#history_month');
    $(document).on('change', '#history_month', function() {
    	let yearcurr = $('#history_year').val();
    	set_calhistory($(this).val(),yearcurr);
    });
    // history change year event
    $(document).off('change', '#history_year');
    $(document).on('change', '#history_year', function() {
    	let monthcurr = $('#history_month').val();
    	set_calhistory(monthcurr,$(this).val());
    });
    // select day from history
    $(document).off('click', '.activedcls');
    $(document).on('click', '.activedcls', function() {    	
		let day = $(this).data('curr');
		let calmonth = $('#history_month').val();
		let calyear = $('#history_year').val();
		habitlist = (localStorage.getItem(day+'-'+calmonth+'-'+calyear+'-habit_list'))?localStorage.getItem(day+'-'+calmonth+'-'+calyear+'-habit_list'):null;
        habit_list = (habitlist)?JSON.parse(habitlist):[];
        set_habit_list();
    });
    // Delete habbbit list
    $(document).off('click', '.iconpar');
    $(document).on('click', '.iconpar', function() {
    	let parel = $(this).closest('li');
    	let eltime = parel.data('time');
    	$('.material-tooltip').css("display", "none");
    	parel.remove();
    	habit_list = $.grep(habit_list, function(obj) {
		  return obj.time !== eltime;
		});    	
		habitlist = JSON.stringify(habit_list);
    	localStorage.setItem(today+'-habit_list', habitlist);
    	set_badges_list();
    	set_calhistory();
    });
    // Daily check-in
    $(document).off('click', '#check-in-button');
    $(document).on('click', '#check-in-button', function() {
        let status = $('#successchk').prop('checked');
        let habbit_id = $('#habit-select').val();
        let time = new Date().getTime();
        if(habbit_id==''){        	
        	Materialize.toast('Please select a habbit!', 2000, '', function toastCompleted(){
                     $('.toast').removeClass('dangeralrt');
            });		
            $('.toast').addClass('dangeralrt');	
			return false;
		}
        let savehabit = {
							habbit_id,
							status,
							time
						};
		set_habit_list(savehabit);
		Materialize.toast('New habbit added!', 2000);
		$('#successchk').prop('checked',false);
    });
	
	// generate eco tips
    let marqueearr = ["Replace incandescent bulbs with LED for energy savings.","Reduce your carbon footprint by walking or biking for short trips instead of driving.","Conserve water by fixing leaks and installing low-flow fixtures in your home.","Choose reusable shopping bags and containers to reduce single-use plastic waste.","Plant a tree to enhance air quality and create a greener environment.","Unplug chargers and electronics when not in use to save energy and reduce standby power."];
    marqueearr.map(function(el){
    	$('marquee').append(`<span>${el}</span>`);
    });
    
    //function for generate habbit select
	function set_habit_sel(new_habbit=null){
		$('.selhabbitpar').html('');
		if(new_habbit){
			// add new habbit
			all_habit.push(new_habbit);
			let allhabit = JSON.stringify(all_habit);
			localStorage.setItem('all_habit', allhabit);
			rate_limit=0;
		}
		let select = `<select id="habit-select"><option value="">Select Habbit</option>`;
		if(all_habit.length){
			all_habit.map(function(e){
				select += `<option value="${e.id}">${e.text}</option>`;
			});
		}		
		select += `</select><label>Select Habbit</label>`;
		$('.selhabbitpar').html(select);
		$('select#habit-select').material_select();
	}
	
	//function for create achievement badge list
	function set_badges_list(){
		$('.badges').addClass('hideel');
		//if(all_badges && all_badges[monthnow+'-'+yearnow].length){
			if(all_badges[monthnow+'-'+yearnow].length>4){
				$('.badge_wood').removeClass('hideel');
			}else{
				$('.badge_wood_hide').removeClass('hideel');
			}
			if(all_badges[monthnow+'-'+yearnow].length>9){
				$('.badge_iron').removeClass('hideel');
			}else{
				$('.badge_iron_hide').removeClass('hideel');
			}
			if(all_badges[monthnow+'-'+yearnow].length>14){
				$('.badge_bronze').removeClass('hideel');
			}else{
				$('.badge_bronze_hide').removeClass('hideel');
			}
			if(all_badges[monthnow+'-'+yearnow].length>19){
				$('.badge_silver').removeClass('hideel');
			}else{
				$('.badge_silver_hide').removeClass('hideel');
			}
			if(all_badges[monthnow+'-'+yearnow].length>29){
				$('.badge_gold').removeClass('hideel');
			}else{
				$('.badge_gold_hide').removeClass('hideel');
			}
		//}		
	}
	
	//function for create habbit list
	function set_habit_list(new_habbit=null){
		if(new_habbit){
			// add new habbit list
			habit_list.push(new_habbit);
			habitlist = JSON.stringify(habit_list);
			localStorage.setItem(today+'-habit_list', habitlist);
			
			if($.inArray(today, all_badges[monthnow+'-'+yearnow])==-1){				
				all_badges[monthnow+'-'+yearnow].push(today);
				allbadges = JSON.stringify(all_badges);
				localStorage.setItem('all_badges', allbadges);
				set_badges_list();
				set_calhistory();
			}
		}
		let habbitlst = ``;
		if(habit_list.length){		
			$('.habbit_list').removeClass('w-100');	
			
			habit_list.map(function(e){
				var matchingOption = $.map(all_habit, function(option) {
										  if (option.id === e.habbit_id) {
										    return option;
										  }
										});
				var date = new Date(e.time);
				var year = date.getFullYear();
				var month = date.getMonth();
				var day = date.getDate();
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();
				var period = hours < 12 ? "AM" : "PM";
				var monthNames = [
								  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
								  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
								];
				if (hours > 12) {
				  hours -= 12;
				}
				let img = "x-mark.png";
				if(e.status){
					img = "check-mark.png";
				}
				let extracls = "";
				
				if(today!=(day+'-'+month+'-'+year)){
					extracls = "disabledel";
					$('#check-in-button').addClass('disableel');
				}else{
					$('#check-in-button').removeClass('disableel');
				}
				let habitText = (matchingOption[0])?matchingOption[0].text:'';
				habbitlst += `<li data-time="${e.time}" class="rb-item">
						<div class="timeline_par">						
				          <div class="timestamp">
				            ${day} ${monthNames[month]} ${year} ${hours}:${minutes} ${period}
				          </div>
				          <span class="stat-icon"><img src="assets/image/${img}" /></span>
				          <span class="tooltipped iconpar ${extracls} ml-1"  data-position="top" data-tooltip="Delete"><i class="fa fa-trash" aria-hidden="true"></i></span>
				        </div>
				          <div class="item-title">${habitText}</div>
				          <div class="habitactions"></div>
				        </li>`;
			});
			$('.habbit_list').html(habbitlst);
			$('.tooltipped').tooltip();
		}else{
			$('.habbit_list').addClass('w-100');
			let htmlnone = "<span class='nohabbit'>NoT Checked In Yet!</span>";
			$('.habbit_list').html(htmlnone);
		}
	}
	
	//function for create habbit history calendar
	function set_calhistory(month=null,year=null){
		let calyear = (year)?year:yearnow;
		let calmonth = (month)?month:monthnow;
        const daysInMonth = new Date(calyear, calmonth + 1, 0).getDate();
        const firstDay = new Date(calyear, calmonth, 1).getDay(); 
		
        const calendarContainer = $(".calendar_h");
		calendarContainer.html('');
        for (let i = 0; i < firstDay; i++) {
            calendarContainer.append('<div class="day_h disableel"></div>');
        }
        for (let day = 1; day <= daysInMonth; day++) {
        	let habittoday = (localStorage.getItem(day+'-'+calmonth+'-'+calyear+'-habit_list'))?localStorage.getItem(day+'-'+calmonth+'-'+calyear+'-habit_list'):null;
        	let habitarr = (habittoday)?JSON.parse(habittoday):[];
        	let activecls = (habitarr.length)?'activedcls':'';
            calendarContainer.append('<div data-curr="'+day+'" class="day_h '+activecls+'"></div>');
        }
        const totalDaysInCalendar = firstDay + daysInMonth;
        const totalCellsInCalendar = 35;

        for (let i = totalDaysInCalendar; i < totalCellsInCalendar; i++) {
            calendarContainer.append('<div class="day_h disableel"></div>');
        }
	}
	
	//function for generate unique id
	function generateUniqueId(length) {
	   const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	  let uniqueId = '';

	  for (let i = 0; i < length; i++) {
	    const randomIndex = Math.floor(Math.random() * characters.length);
	    uniqueId += characters.charAt(randomIndex);
	  }
	  
	  var idExists = false;
		all_habit.map(function(e){
		  if (e.id == uniqueId) {
		    idExists = true;
		  }
		});
		// check if unique id already used
		if(idExists){
			uniqueId = generateUniqueId(6);
		}
	  return uniqueId;
	}
	
	//function for remove html tags for security
	function removeHtmlTags(input) {
	  return input.replace(/<[^>]*>/g, '');
	}

});

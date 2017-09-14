$(document).ready(onLoad);

function onLoad(){
	cardRestore();
	completedDisable();
	unhideShowMore();
	showArticles(10);
	showMoreDisable(10);
	dayDue();
	yearDue();
	fade();
	$('#title-input').focus();
}

function cardRestore(){
	var keys = Object.keys(localStorage);
	keys.forEach(function(key){
		if(JSON.parse(localStorage[key]).completed === true){
		}else{
		prependIdea(JSON.parse(localStorage[key]))}
	})
}

$('.restore-completed').on('click',restoreCompleted);

function restoreCompleted(){
	var keys = Object.keys(localStorage);
	keys.forEach(function(key){
		if(JSON.parse(localStorage[key]).completed === true && $('article#'+key).length === 0){
			prependCompleted(JSON.parse(localStorage[key]));
		}
	})
	$('.restore-completed').prop('disabled',true);
}

function countCompleted(){
	var keys = Object.keys(localStorage);
	var restoreLength = 0;
	keys.forEach(function(key){
		if(JSON.parse(localStorage[key]).completed === true){
			restoreLength++;
		}
	})
	return restoreLength;
}

function completedDisable(){
	if(countCompleted() === 0){
		$('.restore-completed').prop('disabled',true);
	}
}

$('.main-title , .idea-input').on('keyup', enabledBtn);

function enabledBtn(){
    if ($('.idea-input').val() === '' || $('.main-title').val() === '') {
      $('.enterButton').prop('disabled', true);
    } else {
      $('#submit-button').removeAttr('disabled');
    }
}

function Idea(title, body, status, dueDate) {
	this.title = title;
	this.body = body; 
	this.status = 'Normal'; 
	this.id = Date.now();
	this.completed = false;
	this.dueDate = dueDate;
	this.overdue = false;
}

Idea.prototype.isOverDue = function(dueDate) {
	var nowDate = new Date();
	var thisDueDate = new Date(dueDate);
	if(nowDate.getTime() >= thisDueDate.getTime()){
		this.overdue = true;
	}
};

$('#submit-button').on('click', addIdea);

function storeIdea (id, card) {
	localStorage.setItem(id, JSON.stringify(card));
}

function addIdea(e){
	var title = $('.main-title').val();
	var body = $('.idea-input').val();
	var status = 'Normal';
	var dueDate = $('.month').val() +'-'+ $('.day').val() +'-'+ $('.year').val();
	var anotherIdea = new Idea(title, body, status, dueDate);
	anotherIdea.isOverDue(dueDate);
	if (anotherIdea.overdue === false){
		prependIdea(anotherIdea);
	}else{
		prependOverdue(anotherIdea);
	}
	unhideShowMore();
	storeIdea(anotherIdea.id, anotherIdea);
	showArticles(10);
	fade();
	$('.main-title').focus();
}

function prependIdea(idea){
	$('.bookmark-list').prepend(
		`<article id=${idea.id} class="idea-article">
			<h2 class="idea-title" contenteditable=true >${idea.title}</h2>
			<h2 class="overdue overdue-display-none">OVERDUE</h2>
			<div class="icon-buttons delete-button right"></div>
			<p contenteditable="true" class="idea-paragraph">${idea.body}</p>
	<div class="quality-completed">
		<div class="quality-rank"> 
			<div class="icon-buttons upvote-button"></div>
			<div class="icon-buttons downvote-button"></div>
			<p class="importance"> Importance: <span class="quality-content">${idea.status}</span> </p><br />
			<div><p class="task-due-date">Due Date:<span contenteditable="true" class="due-content">${idea.dueDate}</span></p></div>
		</div> 
		<button class="isCompleted"> Completed </button>
	</div>
		<hr/> 
</article>`)
	$('.main-title').val("");
	$('.idea-input').val("");
	$('input[type="date"]').val('');
	$('#body-char-count').text(120);
}

function prependOverdue(idea){
	$('.bookmark-list').prepend(
		`<article id=${idea.id} class="idea-article">
			<h2 class="idea-title" contenteditable=true >${idea.title}</h2>
			<h2 class="overdue">OVERDUE</h2>
			<div class="icon-buttons delete-button right"></div>
			<p contenteditable="true" class="idea-paragraph">${idea.body}</p>
	<div class="quality-completed">
		<div class="quality-rank"> 
			<div class="icon-buttons upvote-button"></div>
			<div class="icon-buttons downvote-button"></div>
			<p class="importance"> Importance: <span class="quality-content">${idea.status}</span> </p><br />
			<div><p class="task-due-date">Due Date:<span contenteditable="true" class="due-content">${idea.dueDate}</span></p></div>
		</div> 
		<button class="isCompleted"> Completed </button>
	</div>
		<hr/> 
</article>`)
	$('.main-title').val("");
	$('.idea-input').val("");
	$('input[type="date"]').val('');
	$('#body-char-count').text(120);
}

function prependCompleted(idea){
	$('.bookmark-list').prepend(
		`<article id=${idea.id} class="idea-article completed">
			<h2 class="idea-title completed" contenteditable=true >${idea.title}</h2>
			<h2 class="overdue">OVERDUE</h2>
			<div class="icon-buttons delete-button right"></div>
			<p contenteditable="true" class="idea-paragraph completed">${idea.body}</p>
	<div class="quality-completed">
		<div class="quality-rank"> 
			<div class="icon-buttons upvote-button"></div>
			<div class="icon-buttons downvote-button"></div>
			<p class="importance completed"> Importance: <span class="quality-content">${idea.status}</span></p>
			<div><p class="task-due-date">Due Date:<span contenteditable="true" class="due-content">${idea.dueDate}</span></p></div>
		</div> 
		<button class="isCompleted"> Completed </button>
	</div>
		<hr/> 
</article>`)
	$('.main-title').val("");
	$('.idea-input').val("");
	$('input[type="date"]').val('');
	$('#body-char-count').text(120);
}

$('.bookmark-list').on('click', '.delete-button', removeThis);

function removeThis(e){
	$(e.target).parent().remove();
	unhideShowMore();
	localStorage.removeItem($(e.target).parent().attr('id'));
	showArticles(10);
	fade();
}

$('.main-title , .idea-input').on('keyup', returnBtnCheckValue); 

function returnBtnCheckValue(e){
	if (e.keyCode === 13 && $('.main-title').val() !== '' && $('.idea-input').val() !== ''){
		e.preventDefault();
		addIdea();
	}
	unhideShowMore();
	charCounter(e);
}

function dayDue(){
	var $selectDay = $('.day');
    for (var i = 1 ; i <= 31 ; i++){
        $selectDay.append($('<option></option>').val(i).html(i));
    }
}

function yearDue(){
	var $selectYear = $('.year');
	for (var i = 2017 ; i <= 2117 ; i++){
		$selectYear.append($('<option></option>').val(i).html(i));
	}
}

function charCounter(e){
	var bodyInput = $('#body-input').val();
	$('#body-char-count').text(120 - bodyInput.length);
	if (bodyInput.length >= 120 || bodyInput.length >= 120 && e.keyCode === 13){
		$('#body-char-count').text('Input can not exceed 120 characters!');
		e.preventDefault();
	}
}

$('.bookmark-list').on('click', '.upvote-button', upVoteTodo);

function upVoteTodo(){
	var currentId = ($(this).closest('.idea-article').attr('id'));
	var currentQuality = ($(this).parent().find('.quality-content').text());
	var qualityValue = retQualityValue(currentQuality);
	if (qualityValue === 1){
	}else{
		qualityValue--;
	}
	var newQuality = retrieveQuality(qualityValue);
	($(this).parent().find('.quality-content').text(newQuality));
	resetCard(newQuality,currentId);
}

$('.bookmark-list').on('click', '.downvote-button', downVoteTodo);

function downVoteTodo(){
	var currentId = ($(this).closest('.idea-article').attr('id'));
	var currentQuality = ($(this).parent().find('.quality-content').text());
	var qualityValue = retQualityValue(currentQuality);
	if (qualityValue === 5){
	}else{
		qualityValue++;
	}
	var newQuality = retrieveQuality(qualityValue);
	($(this).parent().find('.quality-content').text(newQuality));
	resetCard(newQuality,currentId);
}

function retQualityValue(current){
	var qualityArr = [[5,'None'],[4,'Low'],[3,'Normal'],[2,'High'],[1,'Critical']];
	for (var i = 0 ; i < qualityArr.length ; i++){
		if (current === qualityArr[i][1]){
			return qualityArr[i][0];
		}
	}
}

function retrieveQuality(newNumber){
	var qualityArr = [[5,'None'],[4,'Low'],[3,'Normal'],[2,'High'],[1,'Critical']];
	for (var i = 0 ; i < qualityArr.length ; i++){
		if (newNumber === qualityArr[i][0]){
			return qualityArr[i][1];
		}
	}
}

function resetCard(newQuality,id){
	var uniqueCard = JSON.parse(localStorage.getItem(id));
	uniqueCard.status = newQuality;
	localStorage.setItem(id, JSON.stringify(uniqueCard));
}

$('.bookmark-list').on('keyup', '.idea-title', editTitle);

function editTitle(event){
	var id = ($(this).closest('.idea-article').attr('id'));
	var uniqueCard = JSON.parse(localStorage.getItem(id));
	if (event.keyCode === 13) {
		event.preventDefault();
		this.blur();
	}
	uniqueCard.title = $(this).text();
	localStorage.setItem(id, JSON.stringify(uniqueCard));
}

$('.bookmark-list').on('keyup', '.idea-paragraph', editBody);

function editBody(event){
	var id = ($(this).closest('.idea-article').attr('id'));
	var uniqueCard = JSON.parse(localStorage.getItem(id));
	if (event.keyCode === 13) {
		event.preventDefault();
		this.blur();
	}
	uniqueCard.body = $(this).text();
	localStorage.setItem(id, JSON.stringify(uniqueCard));
}

$('.bookmark-list').on('keyup', '.due-date', editDueDate);

function editDueDate(event){
	var id = ($(this).closest('.idea-article').attr('id'));
	var uniqueCard = JSON.parse(localStorage.getItem(id));
	if (event.keyCode === 13) {
		event.preventDefault();
		this.blur();
	}
	uniqueCard.dueDate = $(this).text();
	localStorage.setItem(id, JSON.stringify(uniqueCard));
}

$('.bookmark-list').on('click', '.isCompleted', markCompleted);

function markCompleted(event){
	($(this).closest('.idea-article')).toggleClass('completed');
	($(this).closest('.idea-article').find('.idea-title')).toggleClass('completed');
	($(this).closest('.idea-article').find('.idea-paragraph')).toggleClass('completed');
	($(this).closest('.idea-article').find('.importance')).toggleClass('completed');
	var storedObj = JSON.parse(localStorage.getItem(($(this).closest('.idea-article')).attr('id')));
	storedObj.completed = ($(this).closest('.idea-article')).hasClass('completed');
	localStorage.setItem(($(this).closest('.idea-article')).attr('id'),JSON.stringify(storedObj));
}

$('.search-box').on('keyup', realtimeSearch)

function realtimeSearch(){
    var searchTerm = $('.search-box').val().toUpperCase();
    $('.idea-article').each (function(index, element){
	if (doYouMatch(searchTerm, index)) {
            $(element).removeClass('card-display-none');
        } else {
            $(element).addClass('card-display-none');
        }
   })
}

function doYouMatch(searchTerm, index){
	var title = $($('.idea-title')[index]).html();
	var upperCaseTitle = title.toUpperCase();
	var body = $($('.idea-paragraph')[index]).html();
	var upperCaseBody = body.toUpperCase();
	if (upperCaseTitle.indexOf(searchTerm) !== -1) {
		return true;
	} else if (upperCaseBody.indexOf(searchTerm) !== -1){
 		return true;
 	} else {
    	return false;
    }
}

$('.filter').on('click',filterIdeas)

//disables clicking styling spans
$('span').css('pointer-events','none');

function filterIdeas(e){
	var filterNum = parseInt($(e.target).attr('class'));
	var translateQuality = retrieveQuality(filterNum);
	for (var i = 0 ; i < $('article').length; i++){
		if ($($('article')[i]).find('.quality-content').text() === translateQuality){
			($($('article')[i])).show();
		}
		else{
			($($('article')[i])).hide();
		}
	}
	checkFilters(e);
}

function checkFilters(e){
	($(e.target)).toggleClass('active-filter');
	if(($('.active-filter').length)===2){
		removeAllFilters();
		($(e.target)).toggleClass('active-filter');
	}else if (($('.active-filter').length)===0){
		showAllArticles();
	}
}

function showAllArticles(){
	for (var i = 0 ; i < $('article').length ; i++){
		($($('article')[i])).show();
	}
}

function removeAllFilters(){
	for (var i = 0 ; i < $('li').length ; i++){
		($($('li')[i])).removeClass('active-filter');
	}
}

$('.show-more').on('click',showMore);

function showArticles(n){
	var artLength = $('article').length;
		for (var i = 0 ; i < artLength ; i++){
			if (i < n){
				$($('article')[i]).show();
			}else{
				$($('article')[i]).hide();	
			}
		}
	showMoreDisable(10);
}

function unhideShowMore(){
	if ($('article').length > 10){
		$('.show-more').show();
	}
}

function showMore(){
	var showHowMany = $('article:visible').length;
	showHowMany += 10;
	showArticles(showHowMany);
	showMoreDisable(showHowMany);
}

function showMoreDisable(n){
	if (n > $('article').length){
		$('.show-more').prop('disabled',true);
	}else{
		$('.show-more').prop('disabled',false);
	}
}

function fade(){
    if ($('article').length > 0 && $('#dropInFadeOut').hasClass("fadeout")){
        $('#dropInFadeOut').removeClass("fadeout").addClass("fadein");
    }
    else{
        $('#dropInFadeOut').removeClass("fadein").addClass("fadeout");
    }
}





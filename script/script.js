$(document).ready(onLoad);
// getStoredCards()

//TL: made on page-load function non-anonymous.
function onLoad(){
	cardRestore();
	$('#title-input').focus();
}

function cardRestore(){
	var keys = Object.keys(localStorage);
	keys.forEach(function(key){
		localStorage[key]
		prependIdea(JSON.parse(localStorage[key]))
	})
}

$('.main-title , .idea-input').on('keyup', enabledBtn);

function enabledBtn(){
    if ($('.idea-input').val() === '' || $('.main-title').val() === '') {
      $('.enterButton').prop('disabled', true);
    } else {
      $('#submit-button').removeAttr('disabled');
    }
}

function Idea(title, body, status ) {
	this.title = title;
	this.body = body; 
	this.status = 'Normal'; 
	this.id = Date.now();
	this.completed = false;
}

$('#submit-button').on('click', addIdea);

function storeIdea (id, card) {
	localStorage.setItem(id, JSON.stringify(card));
}

function addIdea(e){
	var title = $('.main-title').val();
	var body = $('.idea-input').val();
	var status = 'Normal';
	var anotherIdea = new Idea(title, body, status);
	prependIdea(anotherIdea);
	storeIdea(anotherIdea.id, anotherIdea);
	$('.main-title').focus();
}

function prependIdea(idea){
	$('.bookmark-list').prepend(
		`<article id=${idea.id} class="idea-article">
			<h2 class="idea-title" contenteditable=true >${idea.title}</h2> 
			<div class="icon-buttons delete-button right"></div>
			<p contenteditable="true" class="idea-paragraph">${idea.body}</p>
	<div class="quality-completed">
		<div class="quality-rank"> 
			<div class="icon-buttons upvote-button"></div>
			<div class="icon-buttons downvote-button"></div>
			<p> importance: <span class = "quality-content">${idea.status}</span> </p> 
		</div> 
		<button class="isCompleted"> Completed </button>
	</div>
		<hr/> 
</article>`)
	$('.main-title').val("");
	$('.idea-input').val("");
}

$('.bookmark-list').on('click', '.delete-button', removeThis);

function removeThis(e){
	$(e.target).parent().remove();
	localStorage.removeItem($(e.target).parent().attr('id'));
}

$('.main-title , .idea-input').on('keyup', returnBtnCheckValue); 

function returnBtnCheckValue(e){
	if (e.keyCode === 13 && $('.main-title').val() !== '' && $('.idea-input').val() !== ''){
		e.preventDefault();
		addIdea();
	}
	charCounter(e);
}

//Future home of autocomplete function...

function charCounter(e){
	var bodyInput = $('#body-input').val();
	$('#title-char-count').text(bodyInput.length);
	if (bodyInput.length >= 120 || bodyInput.length >= 120 && e.keyCode === 13){
		$('#title-char-count').text('Input can not exceed 120 characters!');
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

$('.bookmark-list').on('click', '.isCompleted', markCompleted);

function markCompleted(event){
	($(this).closest('.idea-article')).toggleClass('completed');
	($(this).closest('.idea-article').find('.idea-title')).toggleClass('completed');
	($(this).closest('.idea-article').find('.idea-paragraph')).toggleClass('completed');
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
	($(e.target)).toggleClass('active-filter');
}
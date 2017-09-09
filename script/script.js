$(document).ready(onLoad);
// getStoredCards()

//TL: made on page-load function non-anonymous.
function onLoad(){
	getIdea();
	cardRestore();
}

function getIdea(id) {
	var retrieveIdea = JSON.parse(localStorage.getItem(id));
	if (retrieveIdea) {
		return retrieveIdea;
	} else {
		return [];
	}
}

$('.idea-input').keyup(enabledBtn);
$('.main-title').keyup(enabledBtn);

function enabledBtn() {
    if ( $('.idea-input').val() === "" || $('.main-title').val() === "") {
      $('.enterButton').prop('disabled', true);
      console.log('trying to disable')
    } else {
      $('#submit-button').removeAttr('disabled');
      console.log('trying to enable');
    }
}

$('#submit-button').on('click', addIdea);

function cardRestore(){
	var keys = Object.keys(localStorage)
	keys.forEach(function(key){
		localStorage[key]
		console.log(localStorage[key])
		prependIdea(JSON.parse(localStorage[key]))
	})
}

function Idea(title, body, status ) {
	this.title = title;
	this.body = body; 
	this.status = 'swill'; 
	this.id = Date.now();
}

function addIdea(e) {
	var title = $('.main-title').val();
	var body = $('.idea-input').val();
	var status = 'swill';
	var anotherIdea = new Idea(title, body, status);
	prependIdea(anotherIdea);
	storeIdea(anotherIdea.id, anotherIdea);
	$('.main-title').focus();
}

function prependIdea(idea) {
	$('.bookmark-list').prepend(
		`<article id=${idea.id} class="idea-article">
		<h2 class="idea-title" contenteditable=true >${idea.title}</h2> 
		<div class="icon-buttons delete-button right">
		</div>
		<p contenteditable="true" class="idea-paragraph">${idea.body}</p>
		<div class="quality-rank"> 
		<div class="icon-buttons upvote-button">
		</div>
		<div class="icon-buttons downvote-button"> 
		</div>
		<p> quality: <span class = "quality-content">${idea.status}</span> </p> </div>
		<hr /> 
		</article>`)
	$('.main-title').val("");
	$('.idea-input').val("");
}

$('.bookmark-list').on('click', '.delete-button', removeThis);

function removeThis(e){
	$(e.target).parent().remove();
	localStorage.removeItem($(e.target).parent().attr('id'));
}


function storeIdea (id, card) {
	localStorage.setItem(id, JSON.stringify(card));
}

$('.main-title , .idea-input').on('keyup', checkValue); 

function checkValue(e) {
	if (e.keyCode === 13 && ($('.main-title').val() !== '' && $('.idea-input').val() !== '')){
		addIdea();
	}
};

$('.bookmark-list').on('click', '.upvote-button', upVoteTodo);

function upVoteTodo(){
	var qualityArr = ['swill', 'plausible', 'genius'];
	var quality = $(this).parent().find('.quality-content').text();
    quality > qualityArr[0] ? quality = qualityArr[1] : quality = qualityArr[2]
    $(this).parent().find('.quality-content').text(quality);
	console.log(quality)
}

// console.log(qualityArr[0])
	// $('.quality-content').text(qualityArr[i])

// function upVoteTodo(e) {
// 	var checkStatus = $(this).parent().find('.quality-content').text();
// 	var id = ($(this).closest('.idea-article').attr('id'));
// 	var uniqueCard = JSON.parse(localStorage.getItem(id));

// 	if (checkStatus === 'swill') {	
//     	$(this).parent().find('.quality-content').text('plausible');
//     	uniqueCard.status = 'plausible';
// 		localStorage.setItem(id, JSON.stringify(uniqueCard));
//     } else {
//     	$(this).parent().find('.quality-content').text('genius');
//     	uniqueCard.status = 'genius';
//     	localStorage.setItem(id, JSON.stringify(uniqueCard));
//     }
// };

$('.bookmark-list').on('click', '.downvote-button', downVoteTodo);

function downVoteTodo() {
  	var checkStatus = $(this).parent().find('.quality-content').text();
  	var id = ($(this).closest('.idea-article').attr('id'));
	var uniqueCard = JSON.parse(localStorage.getItem(id));

  	if (checkStatus === 'genius') {
		$(this).parent().find('.quality-content').text('plausible');
		uniqueCard.status = 'plausible';
		localStorage.setItem(id, JSON.stringify(uniqueCard));
  	} else {
  		$(this).parent().find('.quality-content').text('swill');
  		uniqueCard.status = 'swill';
		localStorage.setItem(id, JSON.stringify(uniqueCard));
  	}
};

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


$('.bookmark-list').on('keyup', '.idea-title', editTitle);

function editTitle (event){
	var id = ($(this).closest('.idea-article').attr('id'));
	var uniqueCard = JSON.parse(localStorage.getItem(id));
	if (event.keyCode === 13) {
		event.preventDefault();
		this.blur();
	}
	uniqueCard.title = $(this).text();
	localStorage.setItem(id, JSON.stringify(uniqueCard));
}

function realtimeSearch() {
    var searchTerm = $('.search-box').val().toUpperCase();
    console.log(searchTerm);
    $('.idea-article').each ( function (index, element) {
		// console.log(element);
	if (doYouMatch(searchTerm, index)) {
            // console.log('something')
            $(element).removeClass('card-display-none');
        } else {
            $(element).addClass('card-display-none');
           
        };

   })
};

$('.search-box').on('keyup', realtimeSearch)

function doYouMatch (searchTerm, index) {
	var title = $($('.idea-title')[index]).html();
	var upperCaseTitle = title.toUpperCase();
	var body = $($('.idea-paragraph')[index]).html();
	var upperCaseBody = body.toUpperCase();

	// console.log(title)
	// console.log(body)

	if (upperCaseTitle.indexOf(searchTerm) !== -1) {
		return true;
	} else if (upperCaseBody.indexOf(searchTerm) !== -1){
 	return true;
 	} else {
    	return false
    };
};











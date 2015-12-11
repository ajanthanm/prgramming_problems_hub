var problems = new Array();
function init()
{
	getProblems();
	getAPIHits();
	getTotalLikes();
}
function getProblems()
{
	$.ajax({
		url: "http://hackerearth.0x10.info/api/problems",
		method:"GET",
		dataType: "JSON",
		data: {"type":"json", "query":"list_problems"},
		success: function(data){
			problems = data.problems;
			for( var i =0; i < problems.length; i++){
				problems[i].id = i; 
				if(localStorage.getItem('like_count_'+i)){
					problems[i].likes = localStorage.getItem('like_count_'+i)
				}
				else
				{
					problems[i].likes = 0;
				}
			}
			console.log(problems);
			displayProblems(problems);
		},
		error: function(err){
			console.log(err);
		}
	})
}
function newLike(id){
	var problem_id = "like_count_"+id;
	var count = 0;
	if(localStorage.getItem(problem_id))
	{
		count = localStorage.getItem(problem_id);	
	}
	localStorage.setItem(problem_id, ++count);
	document.getElementById(problem_id).innerHTML = count;
	for(var i =0; i < problems.length; i++){
		if(problems[i].id == id) {
			problems[i].likes = count;
		}
	}
	getTotalLikes();
}
function getAPIHits(){
	$.ajax({
		url: "http://hackerearth.0x10.info/api/problems",
		method:"GET",
		dataType: "JSON",
		data: {"type":"json", "query":"api_hits"},
		success: function(data){
			document.getElementById('api_hits').innerHTML = data.api_hits;
		},
		error: function(err){
			console.log(err);
		}
	})
}
function getTotalLikes(){
	var total_likes = 0;
	for(var i =0; i <localStorage.length; i++){
		total_likes += Number(localStorage.getItem(localStorage.key(i)));
	}
	if(total_likes > 0)
	{
		//$(".like_info").children(".total_likes").html(total_likes);
		document.getElementById('total_likes').innerHTML = ""+total_likes;
	}
}

function displayProblems(problems){
	document.getElementById('challenges').innerHTML = "";
	for(var i=0; i < problems.length; i++) {
		if(problems[i].name != null && problems[i].parent_challenge != null){
			var temptag = "";
			var count = 0;
			problems[i].tags.forEach(function(tag){
				temptag += '<span>'+tag+'</span>';
			});
			localStorage.getItem('like_count_'+problems[i].id) ? count = localStorage.getItem('like_count_'+problems[i].id) : count = 0;
			var tempDom  = '<li class="card"><div class="problem-bg" style="background-image: url(\''+problems[i].image+'\')"><div class="extra"><div class="rating"><span>'+problems[i].rating+'</span><a><i class="fa fa-star-half-o"></i></a></div><div class="like" onclick="newLike('+problems[i].id+')"><span id="like_count_'+problems[i].id+'">'+count+'</span><a><i class="fa fa-heart"></i></a></div></div></div><div class="problems-body"><h1>'+problems[i].name+'</h1><h2><i class="fa fa-home"></i>'+problems[i].parent_challenge+'</h2><div class="skill"><i class="fa fa-tags"></i>'+temptag+'</div><div class="participants"><span>solved by '+problems[i].solved_by+'</span></div></div><div class="problem-footer"><a href="'+problems[i].url+'" target="_blank" class="participate">I want to Participate</a></div></li>';
	 		document.getElementById('challenges').innerHTML += tempDom;
		}
	}
}
function sortProblems(ele, sort_mode) {
	console.log(problems);
	if(sort_mode == "rating"){
		problems.sort(function(a, b) {
    		return parseFloat(b.rating) - parseFloat(a.rating);
		});
		displayProblems(problems);
	}
	else if(sort_mode == "like"){
		problems.sort(function(a, b) {
    		return parseFloat(b.likes) - parseFloat(a.likes);
		});
		displayProblems(problems);	
	}
	$(".sort-button").removeClass("active");
	$(ele).addClass("active");
}
init();
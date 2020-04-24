const finalScoreList = document.getElementById("finalScoreList");
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

finalScoreList.innerHTML = highScores.map( score => {
  return '<li class="high-score">' + score.score + ' - ' + score.name + '</li>'; 
  //return `<li class="high-score">${score.score} - ${score.name}</li>`; 
}).join("");

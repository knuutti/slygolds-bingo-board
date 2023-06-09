let username
const year = "2023"
$(document).ready(function(){
    username = localStorage.getItem('username-' + year );
    if (username){
        $("#username").val(username)
            $("#go").removeClass("disabled")
            $("#go_games").removeClass("disabled")
    }
    $("#username").on("input", function(){
        username = $(this).val()
        if (username){
            $("#go").removeClass("disabled")
            $("#go_games").removeClass("disabled")
        } else {
            $("#go").addClass("disabled")
            $("#go_games").addClass("disabled")
        }
    });
    $("#go").on( "click", function() {
        if (username){
            localStorage.setItem('username-' + year , username);
            window.location.href = "play.html";
        }
    });
    $("#go_games").on( "click", function() {
        if (username){
            localStorage.setItem('username-' + year , username);
            window.location.href = "games.html";
        }
    });
    if (Object.keys(bg_colors).length > 0){
        set_bg_color()
    }

});

let bg_colors = {
    0.0: [21,43,57],
    6.0: [21,43,57],
    9.0: [139,205,250],
    19.0: [139,205,250],
    23.0: [21,43,57],
    24.0: [21,43,57]
}

function set_bg_color(){

    let time = new Date()
    let hour = time.getHours() + time.getMinutes()/60.0;
    let low = 0
    let high = -1
    let times = Object.keys(bg_colors)
    for (let i = 0; i < times.length; i++){
        if (times[i] > hour){
            high = times[i]
            break
        }
        low = times[i]
    }
    let percent = (hour - low) / (high - low)
    let r = Math.round(lerp(bg_colors[low][0], bg_colors[high][0], percent))
    let g = Math.round(lerp(bg_colors[low][1], bg_colors[high][1], percent))
    let b = Math.round(lerp(bg_colors[low][2], bg_colors[high][2], percent))
    $('body').css({"background-color": "rgb(" + r + "," + g + "," + b + ")"})
    setTimeout(set_bg_color, 60000)
}

function lerp (start, end, value){
  return (1-value)*start+value*end
}
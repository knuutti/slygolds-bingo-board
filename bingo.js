let username
let bstate
const year = "2023"
$(document).ready(function(){
    username = localStorage.getItem('username-' + year );
    bstate = JSON.parse(localStorage.getItem('state-' + year + '-' + bid ));
    if (username){
        seed_spot = username.length + seed
        set_nametext(username)
        if (!bstate){
            init_state()
        }
        if (bstate.hasOwnProperty("board")){
            if ( bstate["board"].hasOwnProperty(username)){
                unlocks = bstate["board"][username]
            }
            else {
                init_user_state()
            }
        }
        else {
            init_state()
        }
        generate()
    } else {
        window.location.href = "index.html";
    }


    var interval;
    $(".board-cell").on('mousedown touchstart',function(e) {
        e.preventDefault();
        if ($(this).hasClass("show_hover")){
            $(this).removeClass("show_hover")
        } else {
            let cell = $(this)
            $(this).addClass("clicked")
            interval = setTimeout(function() {
                cell.removeClass("clicked")
                cell.addClass("show_hover")
            },0, cell);
        }
    });
    $(".board-cell").on('mouseup touchend',function(e) {
        e.preventDefault();
        if ($(this).hasClass("clicked")){
            $(this).removeClass("clicked")
            if (!$(this).hasClass("show_hover")){
                unlock(this)
            }
        }
        clearInterval(interval);
    });
    $(".board-cell").on('mouseout',function(e) {
        e.preventDefault();
        $(this).removeClass("clicked")
        clearInterval(interval);
    });
    // $(document).on('mousedown touchstart',function(e)  {
    //     e.preventDefault();
    //     $('.show_hover').removeClass("show_hover");
    // });

    if (Object.keys(bg_colors).length > 0){
        set_bg_color()
    }
    // $("#closeguide").on('mousedown touchstart',function(e) {
    //     e.preventDefault();
    //     $("#fillguide").hide();
    // });

});


function set_bg_color(){

    let time = new Date()
    let hour = 23;//time.getHours() + time.getMinutes()/60.0;
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

function unlock(c){
    $(c).toggleClass("unlocked")

    var classList = $(c).attr('class').split(/\s+/);
    let row
    let cell
    $.each(classList, function(index, item) {
        if (item.split("-")[0] === "r") {
            row = parseInt(item.split("-")[1])
        }
        if (item.split("-")[0] === "c") {
            cell = parseInt(item.split("-")[1])
        }
    });
    if (unlocks[row][cell]) {
        unlocks[row][cell] = false
    } else {
        unlocks[row][cell] = true
    }
    bstate["board"][username] = unlocks
    localStorage.setItem('state-' + year + '-' + bid, JSON.stringify(bstate));
}

function init_state(){
    $('#fillguide').show()
    bstate = {"board": {}}
    init_user_state()
}

function init_user_state(){
    bstate["board"][username] = unlocks
    localStorage.setItem('state-' + year + '-' + bid, JSON.stringify(bstate));
}


let unlocks = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
]



// Damage boost
var seed_spot = 0
function random() {
    var n = username.charCodeAt(username.charCodeAt(seed_spot % username.length) % username.length)
    seed_spot += 1
    var x = Math.sin(seed + n) * 1000.0;
    seed += 1
    return x - Math.floor(x);
}


function set_nametext(s){
    html = ""
    for (var c = 0; c < s.length; c++){
        html += "<div>"
        html += s.charAt(c)
        html += "</div>"
    }
    $("#username").html(html)

}

function generate() {
    let html = ""
    for (var row = 0; row < 5; row++) {
        html += "<div class='board-row'>"
        for (var cell = 0; cell < 5; cell++) {
            let unlocked = ""
            if (unlocks[row][cell]) {
                unlocked = "unlocked"
            }
            html += "<div class='board-cell r-" + row + " c-" + cell + " " + unlocked + "'><div class='cell'><div>"
            let rnum = random()
            while (rnum === 1) {
                rnum = random()
            }
            rnum = Math.floor(choises.length * rnum)
            let cell_text = choises[rnum][0]
            let cell_hover = choises[rnum][0]
            choises.splice(rnum, 1)
            if (row === 2 && cell === 2) {
                if (mid){
                    cell_text = mid[0]
                    cell_hover = mid[0]
                }
            }
            html += cell_text
            html += "</div></div>"
            html += "<div class='hover'><div>" + cell_hover + "</div></div></div>"
        }
        html += "</div>"
    }
    $("#board").html(html)

}
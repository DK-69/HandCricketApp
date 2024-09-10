document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes('head_page.html')) {
        setupHeadPage();
    }
    if (window.location.pathname.includes('game.html')) {
        setupGamePage();
    }
});

function setupHeadPage() {
    let no_of_players = 0;

    function handleButtonClick() {
        var numberInput = document.getElementById("numberInput").value;

        if (numberInput === "") {
            alert("Please enter a number.");
        } else if (numberInput <= 0 || numberInput > 11) {
            alert("Please select a number between 1 to 11.");
        } else {
            localStorage.setItem('no_of_players', numberInput);
            window.location.href = "game.html";
        }
    }

    document.querySelector('.butt').addEventListener('click', handleButtonClick);
}

function setupGamePage() {
    let no_of_players = localStorage.getItem('no_of_players');
    let Total_score = 0;
    let current_score = 0;
    let write_curr_score = document.getElementById("score");
    let myscore = document.getElementById("score-left");
    let compscore = document.getElementById("score-right");


    function check_players(no_of_players) {
        if (no_of_players) {
            document.getElementById("players_count").textContent = no_of_players;
        } else {
            document.getElementById("players_count").textContent = "GAME OVER " + Total_score;
            setTimeout(() => {
                window.location.href = "game.html";
            }, 10000); // 10000 milliseconds = 10 seconds
        }
        
    }

    check_players(no_of_players);

    window.handleClick = function (num) {
        const computerChoice = Computerchoice();
        myscore.value = num;
        compscore.value = computerChoice;
        if (computerChoice === num) {
            Total_score = Total_score + current_score;
            current_score = 0;
            write_curr_score.innerHTML = current_score;
            no_of_players = no_of_players-1;
            check_players(no_of_players);
        } else {
            current_score = current_score + num;
            write_curr_score.innerHTML = current_score;
        }
    };
}

function Computerchoice() {
    const nums = [1, 2, 3, 4, 5, 6];
    const N = Math.floor(Math.random() * 6);
    return nums[N];
}

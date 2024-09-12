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
        let numberInput = parseInt(document.getElementById("numberInput").value);

        if (numberInput === "" || isNaN(numberInput)) {
            alert("Please enter a number.");
        } else if (numberInput <= 0 || numberInput > 11) {
            alert("Please select a number between 1 and 11.");
        } else if (!Number.isInteger(numberInput)) {
            alert("Please select an integer.");
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
    let wickets = 0;
    let current_score = 0;
    let write_curr_score = document.getElementById("score");
    let myscore = document.getElementById("score-left");
    let compscore = document.getElementById("score-right");

    function check_players(no_of_players) {
        if (no_of_players > 0) {
            document.getElementById("players_count").textContent = no_of_players;
        } else {
            document.getElementById("players_count").textContent = "Game Over";
            setTimeout(() => {
                window.location.href = "game.html";
            }, 10000); // Wait 10 seconds before restarting
        }
    }

    check_players(no_of_players);

    window.handleClick = function (num) {
        if (no_of_players > 0) { // Only allow if players are left
            const computerChoice = Computerchoice();
            myscore.value = num;
            compscore.value = computerChoice;
            const button = document.querySelector(`.sign${num}`);

            if (computerChoice === num) {
                button.classList.add('red-glow');
                current_score = 0;
                wickets += 1;
                no_of_players = Math.max(no_of_players - 1, 0); // Prevent players from going below 0
                write_curr_score.innerHTML = Total_score + " - " + wickets;
                check_players(no_of_players);
            } else {
                button.classList.add('green-glow');
                current_score += num; 
                Total_score += num;  
                write_curr_score.innerHTML = Total_score + " - " + wickets;
            }
            setTimeout(() => {
                button.classList.remove('green-glow');
            }, 500);
            setTimeout(() => {
                button.classList.remove('red-glow');
            }, 1000);
        }
    };
}

function Computerchoice() {
    const nums = [1, 2, 3, 4, 5, 6];
    const randomIndex = Math.floor(Math.random() * nums.length);
    return nums[randomIndex];
}

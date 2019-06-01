//Ensures the code doesn't run until after the index.html file is loaded
$(function() {

    //Toggle the fa chevron to up/down when each accordion button is clicked
    $(".btn-link").click(function() {
        $(this).children('.fas').toggleClass('fa-chevron-up fa-chevron-down');
    });

    //-----------------------------------------------------------Sound Variables
    const yellowBtnSound = new Audio("assets/sounds/yellow-btn.mp3");
    const redBtnSound = new Audio("assets/sounds/red-btn.mp3");
    const greenBtnSound = new Audio("assets/sounds/green-btn.mp3");
    const blueBtnSound = new Audio("assets/sounds/blue-btn.mp3");
    const clickOnSound = new Audio("assets/sounds/click-on.mp3");
    const clickOffSound = new Audio("assets/sounds/click-off.mp3");
    const winGameSound = new Audio("assets/sounds/win-game.mp3");
    const loseGameSound = new Audio("assets/sounds/lose-game.mp3");

    // //--------------------------------------------------Game button variables
    const yellowBtn = $("#yellow-btn");
    const redBtn = $("#red-btn");
    const greenBtn = $("#green-btn");
    const blueBtn = $("#blue-btn");
    const powerBtn = $("#power-btn");
    const startBtn = $("#start-btn");
    const strictBtn = $("#strict-btn");
    const roundTxt = $("#round-text");
    const roundNum = $("#round-num");

    //-----------------------------------------------------------------Variables
    let cpuSequence = []; //CPU sequence
    let userSequence = []; //User sequence
    let flash; //Number of flashes that appear in the game
    let round; //Determines which round/attempt we are on
    let correct; //Determines whether the player has hit the right colors or not
    let cpuTurn; //keeps track of whether it's the computer's turn or the user's turn
    let intervalId; //Determines the duration of function execution
    let strict = false; //Strict mode will be false as default
    let sound = true; //Ensures that the sound is on when the game is being played
    let power = false; //Game is off as a default so power variable is set to false
    let win; //Determines if the player has won the game or not

    //--------------------------------------------------------------Power Button
    $(powerBtn).click(function() {
        $(powerBtn).toggleClass("game-option-btn-on");
        if (power) {
            power = false;
            //Text changes to "ON" when the power is turned off again
            // $(powerBtn).text(`ON`);
            // //Remove text in round display area
            // $(roundTxt).text("");
            $(roundNum).text("");
            // //Remove text in start button
            // $(startBtn).text("");
            // //Remove text in strict button
            // $(strictBtn).text("");
            // //Deactivate the game board and disable all game buttons
            resetColor();
            clearInterval(intervalId);
        }
        else {
            power = true;
            //Text changes to "OFF" when the power is on
            // $(powerBtn).text(`OFF`);
            // //Display "ROUND" text in and -- in the round display area
            // $(roundTxt).text(`ROUND`);
            $(roundNum).text(`--`);
            // //Display "START" text in start button
            // $(startBtn).text(`START`);
            // //Display "STRICT" text in strict button
            // $(strictBtn).text(`STRICT`);
        }
        console.log("power", power);
    });

    //-------------------------------------------------------------Strict Button
    $(strictBtn).click(function() {
        $(strictBtn).toggleClass("game-option-btn-on");
        if (power) {
            if (strict) {
                strict = false;
            }
            else {
                strict = true;
            }
            console.log("strict", strict);
        }
    });

    //--------------------------------------------------------------Start Button
    $(startBtn).click(function() {
        if (power || win) {
            startGame();
            $(startBtn).text(`RESET`)
        }
    });

    //------------------------------------------------------------Game Functions

    //Function to start the game
    function startGame() {
        win = false;
        cpuSequence = [];
        userSequence = [];
        flash = 0;
        intervalId = 0;
        round = 1;
        $(roundNum).text(round);
        correct = true;
        getNewMove();
        cpuTurn = true;
        //Ensures that the cpuAttempt function runs every 1 second
        intervalId = setInterval(cpuAttempt, 1000);
    }

    function getNewMove() {
        for (var i = 0; i < 20; i++) {
            let newMove = Math.floor(Math.random() * 4);
            cpuSequence.push(newMove);
            console.log(cpuSequence);
        }
    }

    function cpuAttempt() {
        //Deactivates the buttons
        power = false;

        //If the number of flashes in the round equals the round number, it will be the user's turn
        if (flash == round) {
            clearInterval(intervalId);
            cpuTurn = false;
            resetColor();
            power = true;
        }

        //This if statement will run if it is the CPU's turn and there will be a gap of 500 milliseconds between each flash
        if (cpuTurn) {
            resetColor();
            setTimeout(function() {
                //If the cpuSequence in the array equals 0, it will run the flashYellowBtn function
                playBtnEffects(cpuSequence[flash]);
                //Increment the flash count each time the function runs and
                flash++;
            }, 500);
        }
    }

    //Plays the button effect for the corresponding case number in the cpuSequence[flash] array
    function playBtnEffects(id) {
        if (sound) {
            switch (id) {
                case 0:
                    $(yellowBtn).addClass("lit");
                    yellowBtnSound.play();
                    break;
                case 1:
                    $(redBtn).addClass("lit");
                    redBtnSound.play();
                    break;
                case 2:
                    $(greenBtn).addClass("lit");
                    greenBtnSound.play();
                    break;
                case 3:
                    $(blueBtn).addClass("lit");
                    blueBtnSound.play();
                    break;
            }
            sound = true;
        }
    }

    //Resets the button colors to the original colors
    function resetColor() {
        $(yellowBtn).removeClass("lit");
        $(redBtn).removeClass("lit");
        $(greenBtn).removeClass("lit");
        $(blueBtn).removeClass("lit");
    }

    //Play sounds and light when user clicks on the buttons
    $(yellowBtn).click(function() {
        addUserSequence(0);
    });

    $(redBtn).click(function() {
        addUserSequence(1);
    });

    $(greenBtn).click(function() {
        addUserSequence(2);
    });

    $(blueBtn).click(function() {
        addUserSequence(3);
    });

    //Function to play corresponding sound and light when relevant button is clicked
    function addUserSequence(id) {
        if (power) {
            userSequence.push(id);
            checkUserInput();
            playBtnEffects(id);
            if (!win) {
                setTimeout(function() {
                    resetColor();
                }, 500);
            }
        }
    }



    //Plays the sound and adds class when relevant game button is pressed
    function checkUserInput() {
        //Verifies userSequence against the cpuSequence
        if (userSequence[userSequence.length - 1] !== cpuSequence[userSequence.length - 1]) {
            //Sequence is incorrect
            correct = false;
        }

        //Statement runs if userSequence is 20, which is the end of the game AND all steps are correct
        if (userSequence.length == 20 && correct) {
            userWin();
        }

        if (correct == false) {
            //All lights flash, loseGameSound plays and roundNum text changes to "WRONG, TRY AGAIN for 500 milliseconds, then reverts back to round number"
            lightAll();
            $(roundNum).text(`WRONG, TRY AGAIN!`);
            setTimeout(function() {
                $(roundNum).text(round);
                resetColor();
                loseGameSound.play();

                //If in strict mode, game restarts
                if (strict) {
                    startGame();
                }
                else {
                    //Round is repeated if not in strict mode
                    //*****************************************REFACTOR*****************************************
                    cpuTurn = true;
                    flash = 0;
                    userSequence = [];
                    correct = true;
                    intervalId = setInterval(cpuAttempt, 1000);
                }
            }, 1000);

        }

        //This statement executes if the user gets the sequence correct, but hasn't won the game
        if (round == userSequence.length && correct && !win) {
            round++;
            //*****************************************REFACTOR*****************************************
            userSequence = [];
            cpuTurn = true;
            flash = 0;
            $(roundNum).text(round);
            intervalId = setInterval(cpuAttempt, 1000);
        }
    }

    //lightAll function will be triggered if user enters wrong sequence or user wins the game
    function lightAll() {
        $(yellowBtn).addClass("lit");
        $(redBtn).addClass("lit");
        $(greenBtn).addClass("lit");
        $(blueBtn).addClass("lit");
    }

    function userWin() {
        lightAll();
        winGameSound.play();
        $(startBtn).text(`START`);
        $(roundNum).text(`CONGRATULATIONS, YOU WIN!`);
        power = false;
        win = true;
    }

});

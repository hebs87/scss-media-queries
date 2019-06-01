//-----------------------------------------------------------Sound Variables
    const yellowBtnSound = new Audio("assets/sounds/yellow-btn.mp3");
    const redBtnSound = new Audio("assets/sounds/red-btn.mp3");
    const greenBtnSound = new Audio("assets/sounds/green-btn.mp3");
    const blueBtnSound = new Audio("assets/sounds/blue-btn.mp3");
    const clickOnSound = new Audio("assets/sounds/click-on.mp3");
    const clickOffSound = new Audio("assets/sounds/click-off.mp3");
    const winGameSound = new Audio("assets/sounds/win-game.mp3");
    const loseGameSound = new Audio("assets/sounds/lose-game.mp3");

    //-----------------------------------------------------Game button variables
    
    
    //-----------------------------------------------------------------Variables
    let cpuSequence = []; //CPU sequence
    let count = 0; //Number of button presses
    const totalRounds = 5; //Total number of rounds
    let strict = false; //Strict mode will be false as default
    let play = false; //Play will be false as a default and will be true when the user is playing

    //-----------------------------------------------------------User's sequence

    //Add event listeners to each game button
    $("#yellow-btn").click(function() {
        checkUserInput(0);
    });

    $("#red-btn").click(function() {
        checkUserInput(1);
    });

    $("#green-btn").click(function() {
        checkUserInput(2);
    });

    $("#blue-btn").click(function() {
        checkUserInput(3);
    });

    //Checks the user input value and determines if it is correct
    function checkUserInput(id) {
        //lights the btn and plays the sound
        pressBtn(id);

        //Validate userSequence
        if (id == cpuSequence[count]) {
            //Increment the count with every button press
            count++;
            $(roundNum).text(count);
            if (count < totalRounds && count == cpuSequence.length) {
                //Reset the count to 0 after each correct sequence
                count = 0;
                startCpuSequence();
            } else if (count == totalRounds) {
                $(roundNum).text("CONGRATULATIONS! YOU WIN!");
                winGameSound.play();
                var i = 0;
                var interval = setInterval(function() {
                    i++;
                    if (i > 1) {
                        clearInterval(interval);
                        // restart game
                        restartGame();
                    }
                }, 5000);
            }
            
        }


    }

    //Function to start new game - this will be called if user enters the wrong sequence, if the game is reset, or if the user wins the game
    function restartGame() {
        //Clear the CPU sequence
        cpuSequence = [];
        //Reset count
        count = 0;
        startCpuSequence();
    }

    //Plays the sound and adds class when relevant game button is pressed - passes the value into checkUserInput() function
    function pressBtn(id) {
        playBtnSound(id);
        $("#" + gameBtns[id]).addClass("lit");
        //setTimeout() method background information from w3schools.com
        setTimeout(function() {
            $("#" + gameBtns[id]).removeClass("lit");
        }, 500);
    }
    
    
    
    //------------------------------------------------------------CPU's sequence
    $(startBtn).click(function() {
        startCpuSequence();
    });

    function startCpuSequence() {
        getNewMove();
        let i = 0;
        //setInterval() method background information from w3schools.com
        let interval = setInterval(function() {
            showCpuSequence(i);
            i++;
            if (i >= cpuSequence.length) {
                clearInterval(interval);
            }
        }, 1000); //Function should execute every 1 second
    }

    //Generate random number - sample code from freecodecamp.org and tailored it to my requirements
    function getNewMove() {
        let newMove = Math.floor(Math.random() * 4);
        cpuSequence.push(newMove);
    }

    //Show CPU sequence function, which adds class when button is lit and removes class when timeout interval is reached
    function showCpuSequence(i) {
        playBtnSound(cpuSequence[i]);
        $("#" + gameBtns[cpuSequence[i]]).addClass("lit");
        //setTimeout() method background information from w3schools.com
        setTimeout(function() {
            $("#" + gameBtns[cpuSequence[i]]).removeClass("lit");
        }, 500);
    }

    //playSound function, which plays sounds that correspond to the particular button
    function playBtnSound(button) {
        switch (button) {
            case 0:
                yellowBtnSound.play();
                break;
            case 1:
                redBtnSound.play();
                break;
            case 2:
                greenBtnSound.play();
                break;
            case 3:
                blueBtnSound.play();
                break;
        }
    }
// ==========================================================
// FuelFlow - Sale Notification Sound
// Only plays a sound when a NEW sale is created
// ==========================================================


const notificationBell =
    document.getElementById("notificationBell");


// ==========================================================
// SOUND
// ==========================================================

function playSaleNotificationSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        const audioContext =
            new AudioContext();


        // Create oscillator

        const oscillator =
            audioContext.createOscillator();


        // Volume

        const gainNode =
            audioContext.createGain();


        oscillator.type = "sine";


        // Bell-like tone

        oscillator.frequency.setValueAtTime(
            880,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            1320,
            audioContext.currentTime + 0.12
        );


        // Volume

        gainNode.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.25,
            audioContext.currentTime + 0.02
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.5
        );


        // Connect

        oscillator.connect(gainNode);

        gainNode.connect(
            audioContext.destination
        );


        // Play

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.5
        );


        // Bell animation

        if (notificationBell) {

            notificationBell.classList.add(
                "bell-ring"
            );


            setTimeout(() => {

                notificationBell.classList.remove(
                    "bell-ring"
                );

            }, 600);

        }


    }

    catch (error) {

        console.log(
            "Notification sound could not play:",
            error
        );

    }

}


// ==========================================================
// CHECK FOR NEW SALES
// ==========================================================

let lastSaleCount =
    JSON.parse(
        localStorage.getItem("sales")
    )?.length || 0;


function checkForNewSale() {

    const currentSales =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];


    const currentSaleCount =
        currentSales.length;


    // New sale detected

    if (
        currentSaleCount >
        lastSaleCount
    ) {

        playSaleNotificationSound();

    }


    lastSaleCount =
        currentSaleCount;

}


// ==========================================================
// CHECK EVERY SECOND
// ==========================================================

setInterval(
    checkForNewSale,
    1000
);
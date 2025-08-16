document.addEventListener('DOMContentLoaded', () => {
    // mengambil elemen id dari html
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    const restartBtn = document.getElementById('restart-btn');

    // emoji yang akan digunakan
    const symbols = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'];
    let cards = [...symbols, ...symbols]; // Duplikasi simbol

    let flippedCards = []; // menyimpan kartu yang sedang dibalik
    let matchedPairs = 0;
    let lockBoard = false; // mencegah klik saat kartu sedang dicek

    // fungsi mengacak array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // fungsi membuat papan permainan
    function createBoard() {
        gameContainer.innerHTML = ''; // kosongkan papan sebelum memulai
        shuffle(cards);

        cards.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.symbol = symbol;

            card.innerHTML = `
                <div class="card-face card-back">?</div>
                <div class="card-face card-front">${symbol}</div>
            `;

            card.addEventListener('click', flipCard);
            gameContainer.appendChild(card);
        });
    }

    // fungsi saat kartu diklik
    function flipCard() {
        if (lockBoard) return; // jika papan terkunci, jangan lakukan apa-apa
        if (this === flippedCards[0]) return; // mencegah klik kartu yang sama dua kali

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    // fungsi untuk mengecek apakah dua kartu yang dibalik cocok
    function checkForMatch() {
        lockBoard = true; // kunci papan agar tidak ada klik lain
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.symbol === card2.dataset.symbol;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    // fungsi jika kartu cocok
    function disableCards() {
        flippedCards[0].removeEventListener('click', flipCard);
        flippedCards[1].removeEventListener('click', flipCard);
        
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
        
        matchedPairs++;
        scoreElement.textContent = matchedPairs;
        
        resetBoard();
        
        // cek jika permainan selesai
        if (matchedPairs === symbols.length) {
            setTimeout(() => alert('Selamat! Anda memenangkan permainan!'), 500);
        }
    }

    // fungsi jika kartu tidak cocok
    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            resetBoard();
        }, 1000); // beri waktu 1 detik untuk melihat kartu sebelum dibalik lagi
    }

    // fungsi untuk mereset state setelah giliran
    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    // fungsi untuk memulai ulang permainan
    function restartGame() {
        matchedPairs = 0;
        scoreElement.textContent = 0;
        resetBoard();
        createBoard();
    }

    // event listener untuk tombol mulai ulang
    restartBtn.addEventListener('click', restartGame);

    // mulai permainan saat halaman dimuat
    createBoard();
});
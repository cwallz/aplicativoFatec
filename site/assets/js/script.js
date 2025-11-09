(function(){
	//array que armazenará os objetos com src e id de 1 a 8
	var images = [];
	
	//imagem a ser exibida em caso de acerto
	var matchSign = document.querySelector("#match");
	
	//imagem de fim do jogo
	var modal = document.querySelector("#fimDeJogo");
	
	//array que armazena as cartas viradas
	var flippedCards = [];
	
	//variável contadora de acertos. ao chegar em 8 o jogo termina
	var matches = 0;
	
	//estrutura de atribiução das imagens aos card
	for(var i = 0; i < 12; i++){
		//cria um objeto img com um src e um id
		var img = {
			src: "../assets/img/" + i + ".jpg",
			id: i%6
		};
		
		//inserer o objeto criado no array
		images.push(img);
	}

	//chama a função de inicialização do jogo
	startGame();
	
	//função de inicialização do jogo
	function startGame(){
		//zera o array de cartas viradas
		flippedCards = [];
		
		//zera o contador de acertos
		matches = 0;
		
		//embaralhamento do array de imagens
		images = randomSort(images);
		
		//lista de elementos div com as classes back e front
		var backFaces = document.getElementsByClassName("back");
		var frontFaces = document.getElementsByClassName("front");
		
		//posicionamento das cartas e adição do evento click
		for(var i = 0; i < 12; i++){
			//limpa as cartas marcadas
			backFaces[i].classList.remove("match","flipped");
			frontFaces[i].classList.remove("match","flipped");
			
			//posiciona as cartas no tabuleiro
			var card = document.querySelector("#card" + i);
			card.style.left = (i % 6) === 0 ? 5 + "px" : 5 + ((i % 6) * 165) + "px";
			card.style.top = i/6 >= 1 ? 250 + "px" : 5 + "px";
			
			//adiciona às cartas o evento click chamando a função que vira as cartas
			card.addEventListener("click",flipCard,false);
			
			//adiciona as imagens às cartas
			frontFaces[i].style.background = "url('" + images[i].src + "')";
			frontFaces[i].setAttribute("id",images[i].id);
		}
		
		//joga a imagem de game over para o plano de fundo
		modal.style.zIndex = "-2";
		
		//remove o evento click da imagem de game over
		modal.removeEventListener('click',function(){
			startGame();
		},false);

	}//fim da função de inicialização do jogo
	
	
	//função que vira as cartas
	function flipCard(){
		//verifica se o número de cartas viradas é menor que 2
		if(flippedCards.length < 2){
			//pega as faces da carta clicada
			var faces = this.getElementsByClassName("face");
			
			//confere se a carta já está virada, impedindo que a mesma carta seja virada duas vezes
			if(faces[0].classList[2]){
				return;
			}

			// toca o som de virar carta
			var flipSound = document.getElementById("flipSound");
			flipSound.play();
			
			//adiciona a classe fliped às faces da carta para que sejam viradas
			faces[0].classList.toggle("flipped");
			faces[1].classList.toggle("flipped");
			
			//adiciona a carta clicada ao array de cartas viradas
			flippedCards.push(this);
			
			//verifica se o número de cartas no array de cartas viradas é igual a 2
			if(flippedCards.length === 2){
				//compara o id das cartas viradas para ver se houve um acerto
				if(flippedCards[0].childNodes[3].id === flippedCards[1].childNodes[3].id){
					//em caso de acerto adiciona a classe match a todas as faces das duas cartas presentes no array de cartas viradas
					flippedCards[0].childNodes[1].classList.toggle("match");
					flippedCards[0].childNodes[3].classList.toggle("match");
					flippedCards[1].childNodes[1].classList.toggle("match");
					flippedCards[1].childNodes[3].classList.toggle("match");
					
					//chama a função que exibe a mensagem MATCH
					matchCardsSign();
					
					//limpa o array de cartas viradas
					flippedCards = [];
					
					//soma um ao contador de acertos
					matches++;
					
					//verifica se o contador de acertos chegou a 8
					if(matches >= 6){
						//caso haja 8 acertos, chama a função que finaliza o jogo
						fimDeJogo();
					}
				} 
			} 
		} else {
			//em caso haver duas cartas no array de cartas viradas (terceiro click) remove a classe flipped das cartas no array de cartas viradas
			flippedCards[0].childNodes[1].classList.toggle("flipped");
			flippedCards[0].childNodes[3].classList.toggle("flipped");
			flippedCards[1].childNodes[1].classList.toggle("flipped");
			flippedCards[1].childNodes[3].classList.toggle("flipped");
			
			//limpa o array de cartas viradas
			flippedCards = [];
		}
	}
	
	
	//função que embaralha as cartas recebendo um array de cartas por parâmetro
	function randomSort(array){
		//cria um array vazio
		var newArray = [];
		
		//executa a estrutura enquanto o novo array não atingir o mesmo número de elementos do arrau passado por parâmetro
		while(newArray.length !== array.length){
			//cria uma variável i recebendo um número aleatório entre 0 e o número de elementos no array -1
			var i = Math.floor(Math.random()*array.length);
			
			//verifica se o elemento indicado pelo índice i já existe no array novo
			if(newArray.indexOf(array[i]) < 0){
				//caso não exista é inserido
				newArray.push(array[i]);
			}
		}
		
		//retorna o array novo, que possui os elementos do array passado por parâmetro embaralhados
		return newArray;
	}//fim da função que embaralha as cartas
	
	
	//função que gera o sinal de MATCH
	function matchCardsSign(){
		//joga a mensagem de MATCH para o primeiro plano
		matchSign.style.zIndex = "1";
		
		//deixa a mensagem transparente
		matchSign.style.opacity = "0";
		
		//move a mensagem para cima
		matchSign.style.top = "150px";
		
		// toca o som de acerto
		var matchSound = document.getElementById("matchSound");
		matchSound.play();

		// Usa setTimeout para esperar 1 segundo antes de usar a síntese de voz
		setTimeout(function() {
			// usa a síntese de voz para dizer "par!"
			if ('speechSynthesis' in window) {
				var utterance = new SpeechSynthesisUtterance("par!");
				window.speechSynthesis.speak(utterance);
			} else {
				alert('Seu navegador não suporta a síntese de voz.');
			}
		}, 500); // Espera milisegundos)

		//função executada após 1.5 segundo
		setTimeout(function(){
			//joga a mensagem de MATCH para o plano de fundo
			matchSign.style.zIndex = "-1";
			
			//remove a transparência da mansagem
			matchSign.style.opacity = "1";
			
			//move a mensagem para o centro da tela
			matchSign.style.top = "250px";
		},1500);
	}//fim da função que exibe mensagem de MATCH
	
	//função de fim do jogo
	function fimDeJogo(){
		//joga a mensagem de fim do jogo para o plano da frente
		modal.style.zIndex = "99";
		
		// toca o som de aplausos
		var applauseSound = document.getElementById("applauseSound");
		applauseSound.volume = 0.5; // Define o volume para 50%
		applauseSound.play();
		
		// Usa setTimeout para esperar 1 segundo antes de usar a síntese de voz
		setTimeout(function() {
			// usa a síntese de voz para dizer "Muito bem! Clique para jogar de novo!"
			if ('speechSynthesis' in window) {
				var utterance = new SpeechSynthesisUtterance("Muito bem! Clique para jogar de novo!");
				window.speechSynthesis.speak(utterance);
			} else {
				alert('Seu navegador não suporta a síntese de voz.');
			}
		}, 2000); // Espera milissegundos

		//adiciona o evento click à imagem de game over
		modal.addEventListener('click',function(){
			//chama a função que reinicia o jogo
			startGame();
		},false);
	}
	document.getElementById('speakButton').addEventListener('click', function() {
		var text = document.getElementById('textToSpeak').value;
		if ('speechSynthesis' in window) {
			var utterance = new SpeechSynthesisUtterance(text);
			window.speechSynthesis.speak(utterance);
		} else {
			alert('Seu navegador não suporta a síntese de voz.');
		}
	});
	document.getElementById('mascote').addEventListener('click', function() {
		var balloon = document.getElementById('balloon');
		balloon.style.display = 'block';
		setTimeout(function() {
		  balloon.style.display = 'none';
		}, 3000);

		if ('speechSynthesis' in window) {
			var utterance = new SpeechSynthesisUtterance("Digite algo para eu ler para você, pruuu!");
			window.speechSynthesis.speak(utterance);
		  } else {
			alert('Seu navegador não suporta a síntese de voz.');
		}
	});
}());

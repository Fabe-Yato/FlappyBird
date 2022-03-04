console.log("[Fabe-Yato] Flappy Bird");

const somHit = new Audio();
somHit.src = './efeitos/efeitos_hit.wav'

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");



//background
const background = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    canvasX: 0,
    canvasY: canvas.height -204,
    desenha(){
        contexto.fillStyle = "#70c5ce";
        contexto.fillRect(0,0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            background.spriteX, background.spriteY, 
            background.largura, background.altura, 
            background.canvasX, background.canvasY,  
            background.largura, background.altura
        );
        contexto.drawImage(
            sprites,
            background.spriteX, background.spriteY, 
            background.largura, background.altura, 
            (background.canvasX + background.largura), background.canvasY,  
            background.largura, background.altura
        );
    }
}

//chao
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    canvasX: 0,
    canvasY: canvas.height -112,
    desenha(){
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY, 
            chao.largura, chao.altura, 
            chao.canvasX, chao.canvasY,  
            chao.largura, chao.altura
        );

        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY, 
            chao.largura, chao.altura, 
            (chao.canvasX + chao.largura), chao.canvasY,  
            chao.largura, chao.altura
        );
    }
}

function fazColisao(flappybird, chao){
    const flappyBirdY = flappybird.canvasY + flappybird.altura;
    const chaoY = chao.canvasY;
    if(flappyBirdY >= chaoY){
        return true
    }
    else{
        return false
    }
}

function criaFlappyBird(){
    const flappybird = {
        spriteX: 0, 
        spriteY: 0,
        largura: 33,
        altura: 24,
        canvasX: 10,
        canvasY: 50,
        gravidade: 0.25,
        pulo: 4.3,
        velocidade: 0,
        pula(){
            flappybird.velocidade = -flappybird.pulo
        },
        
        atualiza(){
            if(fazColisao(flappybird, chao)){
                console.log("colidiu");

                somHit.play()

                setTimeout(()=>{
                    mudarParaTela(telas.iniciar)
                }, 400);

                
                return;
            }


            flappybird.velocidade = flappybird.velocidade + flappybird.gravidade; // aumentando a velocidade conforme a gravidade
            flappybird.canvasY = flappybird.canvasY + flappybird.velocidade;

        },
        desenha(){
            contexto.drawImage(
                sprites,
                flappybird.spriteX, flappybird.spriteY, //sprite position
                flappybird.largura, flappybird.altura, //tamanho do recorte na sprite
                flappybird.canvasX, flappybird.canvasY,  // posição no canvas
                flappybird.largura, flappybird.altura
        );
        }
    }
    return flappybird
}

const mensagemIniciar = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    canvasX: (canvas.width / 2) - 174 /2,
    canvasY: 50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemIniciar.spriteX, mensagemIniciar.spriteY,
            mensagemIniciar.largura, mensagemIniciar.altura,
            mensagemIniciar.canvasX, mensagemIniciar.canvasY,
            mensagemIniciar.largura, mensagemIniciar.altura
        );
    }
}

const globais = {};
let telaAtiva = {};
function mudarParaTela(novaTela){
    telaAtiva = novaTela;

    if(telaAtiva.inicializa){
        telaAtiva.inicializa()
    }
}

const telas = {
    iniciar: {
        inicializa(){
           globais.flappybird = criaFlappyBird();
        },
        desenha(){
            background.desenha();
            chao.desenha();
            globais.flappybird.desenha();
            mensagemIniciar.desenha();
        },
        click(){
            mudarParaTela(telas.Jogo);
        },
        atualiza(){

        }
    }
}

telas.Jogo = {
    desenha(){
        background.desenha();
        chao.desenha();
        globais.flappybird.desenha();
    },
    click(){
        globais.flappybird.pula();
    },
    atualiza(){
        globais.flappybird.atualiza();
    }
}

function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
 

    requestAnimationFrame(loop);
}

window.addEventListener("click", function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});


mudarParaTela(telas.iniciar)
loop();
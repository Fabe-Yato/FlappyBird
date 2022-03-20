console.log("[Fabe-Yato] Flappy Bird");

let frames = 0;
const somHit = new Audio();
somHit.src = './efeitos/efeitos_hit.wav'

const somPonto = new Audio();
somPonto.src = './efeitos/efeitos_ponto.wav'

const somPula = new Audio();
somPula.src = './efeitos/efeitos_pulo.wav'

const somCaiu = new Audio();
somCaiu.src = './efeitos/efeitos_caiu.wav'

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

function criarChao(){
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        canvasX: 0,
        canvasY: canvas.height -112,
        atualiza(){
            const movimentoChao = 1;

            chao.canvasX = chao.canvasX - movimentoChao;
            if(chao.canvasX < -112){
                chao.canvasX = 0;
            }
            
        },
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
    return chao;
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
            somPula.play();
        },
        
        atualiza(){
            
            if(fazColisao(flappybird, globais.chao)){

                somHit.play()

                setTimeout(()=>{
                    mudarParaTela(telas.gameOver)
                }, 400);

                
                return;
            }


            flappybird.velocidade = flappybird.velocidade + flappybird.gravidade; // aumentando a velocidade conforme a gravidade
            flappybird.canvasY = flappybird.canvasY + flappybird.velocidade;

        },
        movimentos:[
            {spriteX:0, spriteY:0}, //asa pra cima
            {spriteX:0, spriteY:26}, //asa meio
            {spriteX:0, spriteY:52} //asa pra baixo
        ],
        frameAtual: 0,
        atualizaFrameAtual(){
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;
            if(passouIntervalo){
                const baseIncremento = 1;
                const incremento = baseIncremento + flappybird.frameAtual;
                const baseRepeticao = flappybird.movimentos.length;
                flappybird.frameAtual = incremento % baseRepeticao;
            
            }
            
        },
        desenha(){
            flappybird.atualizaFrameAtual();
            let {spriteX, spriteY} = this.movimentos[flappybird.frameAtual]
            
            
            contexto.drawImage(
                sprites,
                spriteX, spriteY, //sprite position
                flappybird.largura, flappybird.altura, //tamanho do recorte na sprite
                flappybird.canvasX, flappybird.canvasY,  // posição no canvas
                flappybird.largura, flappybird.altura
            );
        }
    }
    return flappybird
}

function criaCanos(){
    const canos = {
        largura: 52,
        altura: 400,
        chao:{
            spriteX:0,
            spriteY: 169,
        },
        ceu:{
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        atualiza(){
          
            
        },
        desenha(){
            canos.pares.forEach((par)=>{  
                const espacamentoEntreCanos = 90;
                const randomY = par.y;
                const canoCeuX = par.x;
                const canoCeuY = randomY;

                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY, //sprite position
                    canos.largura, canos.altura, //tamanho do recorte na sprite
                    canoCeuX, canoCeuY,  // posição no canvas
                    canos.largura, canos.altura
                );

                // [Cano Chão]
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + randomY
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY, //sprite position
                    canos.largura, canos.altura, //tamanho do recorte na sprite
                    canoChaoX, canoChaoY,  // posição no canvas
                    canos.largura, canos.altura
                );
                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                } 
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
          
        },
        colisaoComFlappyBird(par){
            const cabecaFlappy = globais.flappybird.canvasY;
            const peFlappy = globais.flappybird.canvasY + globais.flappybird.altura;

            if((globais.flappybird.canvasX + globais.flappybird.largura) >= par.x){
                somPonto.play();
                if(cabecaFlappy <= par.canoCeu.y){
                    somHit.play()
                    setTimeout(()=> somCaiu.play(), 500);
                    
                    return true
                }
                if(peFlappy >= par.canoChao.y){
                    somHit.play()
                    return true
                }
            }
            return false
        },
        pares: [

        ],
        atualiza(){ 
            const passou100Frames = frames % 100 === 0;

            if(passou100Frames){
                canos.pares.push({x: 310, y: -150 * (Math.random() + 1)})
            }
            canos.pares.forEach((par)=>{
                par.x = par.x -2.5;

                if(canos.colisaoComFlappyBird(par)){
                    console.log("Perdeu")
                    mudarParaTela(telas.gameOver)

                }

                if(par.x + canos.largura <= 0){
                    canos.pares.shift();
                }
            })
        }
    }
    return canos;
}

function gameOverTela() {
    const gameOver = {
        spriteX: 134,
        spriteY: 153,
        largura: 250,
        altura: 250,
        canvasX: (canvas.width / 2) - 215 /2,
        canvasY: 50,
        desenha(){
            contexto.drawImage(
                sprites,
                gameOver.spriteX, gameOver.spriteY,
                gameOver.largura, gameOver.altura,
                gameOver.canvasX, gameOver.canvasY,
                gameOver.largura, gameOver.altura
            );
        },
        atualiza(){

            setTimeout(function(){
                globais.flappybird.velocidade = globais.flappybird.velocidade + globais.flappybird.gravidade; 

                globais.flappybird.canvasY = globais.flappybird.canvasY + globais.flappybird.velocidade;
            }, 100)
           

            if(globais.flappybird.canvasY >= canvas.width){
                globais.flappybird.canvasY = 340; 
                globais.flappybird.velocidade = 0;
                globais.flappybird.gravidade = 0;
            }
        },
        click(){
          
            setTimeout(()=>{
                mudarParaTela(telas.iniciar)
            }, 400);
        }

    }
    return gameOver;
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
           globais.chao = criarChao();
           globais.canos = criaCanos();
           globais.gameOver = gameOverTela();
          
        },
        desenha(){
            background.desenha();
            globais.chao.desenha();
            globais.flappybird.desenha();
            mensagemIniciar.desenha();
        },
        click(){
            mudarParaTela(telas.Jogo);
        },
        atualiza(){
            globais.chao.atualiza();
            
 
        }
    }
}

telas.Jogo = {
    desenha(){
        background.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappybird.desenha();
        
    },
    click(){
        globais.flappybird.pula();
    },
    atualiza(){
        globais.flappybird.atualiza();
        globais.chao.atualiza();
        globais.canos.atualiza();

    }
}

telas.gameOver = {
    desenha(){
        background.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappybird.desenha();
        globais.gameOver.desenha();
        
    },
    click(){
        globais.gameOver.click();
    },
    atualiza(){
        globais.gameOver.atualiza()
    }

}

function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
 
    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener("click", function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});


mudarParaTela(telas.iniciar)
loop();
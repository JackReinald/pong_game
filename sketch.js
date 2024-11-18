// Dimensiones de la pantalla, objetos y marcos
let anchoPantalla = 800;
let altoPantalla = 600;
let anchoRaqueta = 10; // Ancho original, ahora no usado directamente
let altoRaqueta = 80; // Altura original, ahora no usado directamente
let altoMarco = 20; // Altura de los marcos superior e inferior

// Posición y velocidad de la pelota
let pelotaX = anchoPantalla / 2;
let pelotaY = altoPantalla / 2;
let velocidadX = 5;
let velocidadY = 5;

// Rotación de la pelota
let anguloRotacion = 0;
let velocidadRotacion = 15; // Incremento de rotación tras cada colisión

// Posición de las raquetas
let raquetaIzquierdaY = altoPantalla / 2 - altoRaqueta / 2;
let raquetaDerechaY = altoPantalla / 2 - altoRaqueta / 2;

// Velocidad de las raquetas
let velocidadRaquetaJugador = 5;
let velocidadRaquetaEnemigo = 5;

// Puntaje de los jugadores
let puntajeJugador1 = 0;
let puntajeJugador2 = 0;

// Variable para controlar el ángulo de impacto
let anguloImpacto = 0;

// Imágenes del juego
let fondo, barra1, barra2, bola;

// Sonidos del juego
let sonidoRebote, sonidoPunto;

function preload() {
  // Cargar las imágenes antes de iniciar el juego
  fondo = loadImage("fondo2.png");
  barra1 = loadImage("barra1.png");
  barra2 = loadImage("barra2.png");
  bola = loadImage("bola.png");

  // Cargar los sonidos antes de iniciar el juego
  sonidoRebote = loadSound("446100__justinvoke__bounce.wav");
  sonidoPunto = loadSound("173859__jivatma07__j1game_over_mono.wav");
}

function setup() {
  createCanvas(anchoPantalla, altoPantalla);

  // Configurar volúmenes iniciales de los sonidos
  sonidoRebote.setVolume(0.2); // Volumen bajo para rebote
  sonidoPunto.setVolume(0.2); // Volumen medio para anotación
}

function draw() {
  // Dibujar la imagen de fondo
  background(fondo);

  // Dibujar los marcos
  fill("#8D26B6"); // Color blanco para los marcos
  rect(0, 0, anchoPantalla, altoMarco); // Marco superior
  rect(0, altoPantalla - altoMarco, anchoPantalla, altoMarco); // Marco inferior

  // Dibujar las raquetas con imágenes
  image(barra1, 0, raquetaIzquierdaY, anchoRaqueta * 2, altoRaqueta); // Raqueta del jugador
  image(
    barra2,
    anchoPantalla - anchoRaqueta * 2,
    raquetaDerechaY,
    anchoRaqueta * 2,
    altoRaqueta
  ); // Raqueta del enemigo

  // Dibujar la pelota con rotación
  push();
  translate(pelotaX, pelotaY); // Mover al centro de la pelota
  rotate(radians(anguloRotacion)); // Aplicar rotación
  imageMode(CENTER);
  image(bola, 0, 0, 20, 20);
  pop();

  // Mover la pelota
  pelotaX += velocidadX;
  pelotaY += velocidadY;

  // Rebotar la pelota en los bordes superior e inferior y marcos
  if (pelotaY <= altoMarco || pelotaY >= altoPantalla - altoMarco) {
    velocidadY *= -1;
    anguloRotacion += velocidadRotacion; // Incrementar rotación tras colisión
    sonidoRebote.play(); // Reproducir sonido de rebote
  }

  // Detectar colisiones con las raquetas y cambiar la dirección de la pelota
  if (
    pelotaX <= anchoRaqueta * 2 &&
    pelotaY > raquetaIzquierdaY &&
    pelotaY < raquetaIzquierdaY + altoRaqueta
  ) {
    velocidadX *= -1;
    anguloImpacto = map(
      pelotaY - raquetaIzquierdaY,
      0,
      altoRaqueta,
      -PI / 4,
      PI / 4
    );
    velocidadY += sin(anguloImpacto) * 5;
    anguloRotacion += velocidadRotacion; // Incrementar rotación tras colisión
    sonidoRebote.play(); // Reproducir sonido de rebote
  } else if (
    pelotaX >= anchoPantalla - anchoRaqueta * 2 &&
    pelotaY > raquetaDerechaY &&
    pelotaY < raquetaDerechaY + altoRaqueta
  ) {
    velocidadX *= -1;
    anguloImpacto = map(
      pelotaY - raquetaDerechaY,
      0,
      altoRaqueta,
      -PI / 4,
      PI / 4
    );
    velocidadY += sin(anguloImpacto) * 5;
    anguloRotacion += velocidadRotacion; // Incrementar rotación tras colisión
    sonidoRebote.play(); // Reproducir sonido de rebote
  }

  // Actualizar el puntaje si la pelota sale por los lados
  if (pelotaX < 0) {
    puntajeJugador2++;
    sonidoPunto.play(); // Reproducir sonido de punto
    leerMarcador(); // Leer marcador en voz alta
    resetPelota();
  } else if (pelotaX > anchoPantalla) {
    puntajeJugador1++;
    sonidoPunto.play(); // Reproducir sonido de punto
    leerMarcador(); // Leer marcador en voz alta
    resetPelota();
  }

  // Mostrar el puntaje
  textSize(32);
  fill(255); // Blanco para el texto del puntaje
  text(puntajeJugador1, anchoPantalla / 4, 30);
  text(puntajeJugador2, (3 * anchoPantalla) / 4, 30);

  // Incrementar inteligencia de la raqueta enemiga para dificultad media
  if (pelotaX > anchoPantalla / 2 && velocidadX > 0) {
    if (raquetaDerechaY + altoRaqueta / 2 < pelotaY - 10) {
      raquetaDerechaY += velocidadRaquetaEnemigo * 1.2;
    } else if (raquetaDerechaY + altoRaqueta / 2 > pelotaY + 10) {
      raquetaDerechaY -= velocidadRaquetaEnemigo * 1.2;
    }
  }

  // Mover la raqueta del jugador con las flechas arriba y abajo
  if (keyIsDown(UP_ARROW)) {
    raquetaIzquierdaY -= velocidadRaquetaJugador;
  } else if (keyIsDown(DOWN_ARROW)) {
    raquetaIzquierdaY += velocidadRaquetaJugador;
  }

  // Limitar el movimiento de las raquetas dentro de la pantalla y fuera de los marcos
  raquetaIzquierdaY = constrain(
    raquetaIzquierdaY,
    altoMarco,
    height - altoRaqueta - altoMarco
  );
  raquetaDerechaY = constrain(
    raquetaDerechaY,
    altoMarco,
    height - altoRaqueta - altoMarco
  );
}

function resetPelota() {
  pelotaX = anchoPantalla / 2;
  pelotaY = altoPantalla / 2;
  velocidadX *= -1;
  anguloRotacion = 0; // Resetear la rotación al reiniciar la pelota
}

function leerMarcador() {
  // Cancelar cualquier narración en curso antes de iniciar una nueva
  speechSynthesis.cancel();

  let marcador = `El marcador va ${puntajeJugador1}. a ${puntajeJugador2}.`;
  let mensaje = new SpeechSynthesisUtterance(marcador);

  // Configurar el volumen de la voz
  mensaje.volume = 1; // Máximo volumen para el narrador
  speechSynthesis.speak(mensaje);
}

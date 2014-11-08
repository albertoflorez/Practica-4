/*

  Requisitos: 

  La nave del usuario disparar� 2 misiles si est� pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendr� un tiempo de recarga de 0,25s, no pudi�ndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificaci�n:

  - Hay que a�adir a la variable sprites la especificaci�n del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se a�adir�n
    misiles al tablero de juego en la posici�n en la que est� la nave
    del usuario. En el c�digo de la clase PlayerSip es donde tienen
    que a�adirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creaci�n de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declarar�n los m�todos de
    la clase en el prototipo

*/

describe("clase PlayerMissile", function(){
    
    var canvas, ctx;
    beforeEach(function(){

        loadFixtures('index.html');

	    canvas = $('#game')[0];
	    expect(canvas).toExist();

	    ctx = canvas.getContext('2d');
	    expect(ctx).toBeDefined();

		SpriteSheet = {
			map : {missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }},
			draw: function() {}
		};
	
	    oldGame = Game;
    });

    afterEach(function(){
	    Game = oldGame;
    }); 

    it("step", function(){
		var misil = new PlayerMissile(10,10);
		var b = {remove: function(obj) {},
                 collide: function(obj,type) {} };
		misil.board=b;
		spyOn(b, "remove"); 
		misil.step(1.0); 
		expect(b.remove).toHaveBeenCalled();
		expect(b.remove.calls[0].args[0]).toEqual(misil);
	});

    

    it("draw", function(){
		var misil = new PlayerMissile(0,0);
		spyOn(SpriteSheet, "draw");
		misil.draw(ctx); 
		expect(SpriteSheet.draw).toHaveBeenCalled();
		expect(SpriteSheet.draw.calls[0].args[0]).toEqual(ctx);
		expect(SpriteSheet.draw.calls[0].args[1]).toEqual("missile");
		expect(SpriteSheet.draw.calls[0].args[2]).toEqual(misil.x);
		expect(SpriteSheet.draw.calls[0].args[3]).toEqual(misil.y);
	});

    
    it("requesito disparo", function(){
        Game = {width: 320, height: 480, keys: {'fire': false}};
        SpriteSheet = {
			map : {missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
                    ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 }}
		};
        var nave = new PlayerShip();
		var b = {add: function() {}};
		nave.board=b;
		spyOn(b, "add");
        nave.step(1);
		expect(b.add).not.toHaveBeenCalled();
        Game.keys['fire'] = true;
        nave.step(1);
		expect(b.add).toHaveBeenCalled();
		expect(b.add).toHaveBeenCalled();
        nave.step(1);
	    expect(b.add.calls.length).toEqual(2);
    });

});

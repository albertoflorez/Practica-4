/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe("clase GameBoard", function(){
    
    var canvas, ctx;
    beforeEach(function(){

        loadFixtures('index.html');

	    canvas = $('#game')[0];
	    expect(canvas).toExist();

	    ctx = canvas.getContext('2d');
	    expect(ctx).toBeDefined();
	
	    oldGame = Game;
    });

    afterEach(function(){
	    Game = oldGame;
    }); 

    it("add", function(){
        var gb = new GameBoard();
        var objeto = "hola";
        expect(gb.add(objeto)).toEqual("hola");
        expect(gb.objects[0]).toEqual("hola");
        expect(gb.objects.length).toBe(1);
    });
    
    it("remove", function(){
        var gb = new GameBoard();
        var objeto = "hola";
	    spyOn(gb, "remove");
        gb.remove(objeto);
        expect(gb.remove).toHaveBeenCalled();
	    expect(gb.objects[0]).toEqual(undefined);
	    expect(gb.objects.length).toBe(0);
    });

    it ("resetRemoved", function(){
        var gb = new GameBoard();
        var objeto="hola";
        gb.add(objeto);
        gb.resetRemoved();
        gb.remove(objeto);
        expect(gb.removed[0]).toEqual("hola");
        expect(gb.removed.length).toBe(1);
    });

    it ("finalizeRemoved", function(){
        var gb = new GameBoard();
        var objeto="hola";
        gb.add(objeto);
        gb.resetRemoved();
        gb.remove(objeto);
        gb.finalizeRemoved();
        expect(gb.objects[0]).toEqual(undefined);
        expect(gb.objects.length).toBe(0);
    });

    it ("iterate", function(){
        var gb = new GameBoard();
        var objeto1 = {f:function(){}};
        var objeto2 = {f:function(){}};
        spyOn(objeto1,"f");
        spyOn(objeto2,"f");
        gb.add(objeto1);
        gb.add(objeto2);
        gb.iterate("f","arg");
        runs(function(){
            expect(objeto1.f).toHaveBeenCalled();
            expect(objeto2.f).toHaveBeenCalled();
            expect(objeto1.f.calls[0].args[0]).toEqual("arg");
            expect(objeto2.f.calls[0].args[0]).toEqual("arg");
        });
    }); 

    it ("detect",function(){
        var gb = new GameBoard();
        var objeto1 = {f:function(){return true;}};
        var objeto2 = {f:function(){return false;}};
        gb.add(objeto1);
        gb.add(objeto2);
        expect(gb.detect(objeto1.f)).toEqual(objeto1);
        expect(gb.detect(objeto2.f)).not.toEqual(objeto2);
        expect(gb.detect(objeto2.f)).toEqual(false);
    });

    it ("step",function(){
        var gb = new GameBoard();
        var objeto = {};
        spyOn(gb,"step");
        gb.add(objeto);
        gb.step(ctx);
        runs(function(){
            expect(gb.step).toHaveBeenCalled();
        });
    });   

    it ("draw",function(){
        var gb = new GameBoard();
        var objeto = {};
        spyOn(gb,"draw");
        gb.add(objeto);
        gb.draw(ctx);
        runs(function(){
            expect(gb.draw).toHaveBeenCalled();
        });
    });

    it ("overlap",function(){
        var gb = new GameBoard();
        var objeto1 = {x:100,y:50,h:25,w:10};
        var objeto2 = {x:100,y:50,h:25,w:10};
        var objeto3 = {x:50,y:100,h:25,w:10}
        gb.add(objeto1);
        gb.add(objeto2);
        gb.add(objeto3);
        expect(gb.overlap(objeto1,objeto2)).toEqual(true);
        expect(gb.overlap(objeto1,objeto3)).toEqual(false);
    });

    it ("collide",function(){
        var gb = new GameBoard();
        var objeto1 = {x:100,y:50,h:25,w:10};
        var objeto2 = {x:100,y:50,h:25,w:10};
        var objeto3 = {x:50,y:100,h:25,w:10}
        gb.add(objeto1);
        gb.add(objeto2);
        gb.add(objeto3);
        expect(gb.collide(objeto1)).toBe(objeto2);
        expect(gb.collide(objeto1,objeto2)).toBe(false);
        expect(gb.collide(objeto1,objeto3)).toBe(false);
    });

});


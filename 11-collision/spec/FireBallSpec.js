describe("clase FireBall", function() {

    var canvas, ctx;

    beforeEach(function(){

        loadFixtures('index.html');

	    canvas = $('#game')[0];
	    expect(canvas).toExist();

	    ctx = canvas.getContext('2d');
	    expect(ctx).toBeDefined();
	
        SpriteSheet.map = {
            explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
        }
        x=100;
        y=200;
        fireb = new FireBall(100, 200, 1);
        fireb.board = new GameBoard(); 
        fireb.board.remove = function(obj) {};

	    oldGame = Game;
    });

    afterEach(function(){
	    Game = oldGame;
    }); 

    it("add", function() {  
        fireb.board.add(fireb);
        expect(_.contains(fireb.board.objects, fireb)).toBe(true);
    }); 

    it("step", function() { 
        x = x - fireb.w/2;
        y = y - fireb.h/2;
        expect(fireb.x).toBe(x);
        expect(fireb.y).toBe(y); 

        dt = 25;
        x += 40*dt; 
        y += -300*dt;

        fireb.step(dt);
        expect(fireb.x).toBe(x);
        expect(fireb.y).toBe(y);

        spyOn(fireb.board, "remove");
        dt = 1000;
        fireb.step(dt); 
        expect(fireb.board.remove).toHaveBeenCalled();
    });

    it("draw", function() {
        spyOn(SpriteSheet, 'draw');
        fireb.draw(ctx);
        expect(SpriteSheet.draw).toHaveBeenCalledWith(ctx, 'explosion', fireb.x,        fireb.y, 1, 30, 30);
    });

});

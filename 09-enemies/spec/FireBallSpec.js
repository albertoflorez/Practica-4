describe("clase FireBall", function() {

    var canvas, ctx;

    beforeEach(function(){

        loadFixtures('index.html');

	    canvas = $('#game')[0];
	    expect(canvas).toExist();

	    ctx = canvas.getContext('2d');
	    expect(ctx).toBeDefined();
	
        SpriteSheet.map = {
            fireb: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
        }
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

});

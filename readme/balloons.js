 (function() {
    var canvas = document.createElement( 'canvas' );
    var container = document.querySelector( '.canvasRel' );
    container.appendChild( canvas );

    var Balloon, balloons, options, sketch, sortBySize;

    sketch = Sketch.create();

    balloons = [];

    options = {
        amount: 50,
        sizeMin: 1,
        sizeMax: 10
    };

    sortBySize = function(a, b) {
        if (a.size < b.size) {
            return 1;
        }
        if (a.size > b.size) {
            return -1;
        }
        return 0;
    };

    Balloon = function(config) {
        this.x = config.x;
        this.y = config.y;
        this.vx = 0;
        this.vy = 0;
        return this.size = config.size;
    };

    Balloon.prototype.update = function() {
        var dt;
        dt = sketch.dt <= 0 ? .001 : sketch.dt / 16;
        this.vx += this.size * (random(-1, 1) / 1000);
        this.x += this.vx * dt;
        this.vy -= this.size / 2000;
        this.y += this.vy * dt;
        if (this.y <= this.size * -0.9) {
            this.size = random(options.sizeMin, options.sizeMax);
            this.x = random(sketch.width);
            this.vx = 0;
            this.y = sketch.height + (this.size * 10.2);
            return this.vy = 0;
        }
    };

    Balloon.prototype.render = function() {
        sketch.save();
        sketch.translate(this.x, this.y);
        sketch.beginPath();
        sketch.moveTo(this.size * -0.5, 0);
        sketch.bezierCurveTo(this.size * -5, this.size * -1, this.size * -6, this.size * -10, 0, this.size * -10);
        sketch.bezierCurveTo(this.size * 6, this.size * -10, this.size * 5, this.size * -1, this.size * 0.5, 0);
        sketch.lineTo(this.size * 0.8, this.size * 0.7);
        sketch.lineTo(this.size * -0.8, this.size * 0.7);
        sketch.closePath();
        sketch.fillStyle = 'hsla( 0, 0%, ' + (0 + ((this.size / options.sizeMax) * 100)) + '%, .35 )';
        sketch.fill();
        sketch.lineWidth = this.size * 0.4;
        sketch.stroke();
        sketch.restore();
        sketch.save();
        sketch.translate(this.x - (this.size * 1.75), this.y - (this.size * 7.5));
        sketch.rotate(PI / 4);
        sketch.scale(1, 2);
        sketch.beginPath();
        sketch.arc(0, 0, this.size * 0.5, 0, TWO_PI);
        sketch.fillStyle = 'hsla( 0, 0%, 100%, .8 )';
        sketch.fill();
        return sketch.restore();
    };

    sketch.setup = function() {
        var i, _results;
        sketch.lineJoin = 'round';
        sketch.strokeStyle = 'hsla( 0, 0%, 100%, .75 )';
        i = options.amount;
        _results = [];
        while (i--) {
            _results.push(balloons.push(new Balloon({
                x: random(sketch.width),
                y: random(sketch.height),
                size: random(options.sizeMin, options.sizeMax)
            })));
        }
        return _results;
    };

    sketch.clear = function() {
        return sketch.clearRect(0, 0, sketch.width, sketch.height);
    };

    sketch.update = function() {
        var i, _results;
        balloons.sort(sortBySize);
        i = balloons.length;
        _results = [];
        while (i--) {
            _results.push(balloons[i].update(i));
        }
        return _results;
    };

    sketch.draw = function() {
        var i, _results;
        i = balloons.length;
        _results = [];
        while (i--) {
            _results.push(balloons[i].render(i));
        }
        return _results;
    };

}).call(this);
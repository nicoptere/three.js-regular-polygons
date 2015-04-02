var Tesselation = ( function( exports )
{
    var undef;

    var PI = Math.PI;
    var PI2 = Math.PI * 2;
    var PI_2 = Math.PI / 2;

    function initPolygon( x, y, radius, sides, angle, thickness, filled )
    {
        return {
            x : x || 0,
            y : y || 0,
            radius : radius || 1,
            sides : sides || 3,
            angle : angle || 0,
            thickness : thickness || 5,
            filled : filled || 0
        }
    }

    function getApothem( radius, sides )
    {
        return radius * Math.cos( Math.PI / sides );
    }

    function sideLength( radius, sides )
    {
        return 2 * radius * Math.sin( Math.PI / sides );
    }

    function regularTriangle( radius, width, height )
    {
        width = width || window.innerWidth;
        height = height || window.innerHeight;

        var scale = width;

        var rad = radius / scale;
        var apothem = getApothem( radius, 3 ) / scale;
        var side = sideLength( radius, 3 ) / scale;

        var array = [];
        var an = 0;
        var step = PI2 / 6;

        for( var i = 0; i < 6; i++ )
        {
            an = i * step;

            var p = initPolygon(    .5 + Math.cos( an ) * rad *.5,
                                    .5 + Math.sin( an ) * rad *.5,
                                    radius,
                                    3,
                                    i * step,
                                    1.5,
                                    0 );
            array.push( p )
        }

        array.push( initPolygon(.5,.5,getApothem(radius,6)*2,6, PI / 6, 2.5, 0 ) );

        return array;

    }


    exports.getApothem = getApothem;
    exports.sideLength = sideLength;
    exports.regularTriangle = regularTriangle;
    return exports;

}( {} ) );

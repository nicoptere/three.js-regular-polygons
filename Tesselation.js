var Tesselation = ( function( exports )
{
    var undef;

    var PI = Math.PI;
    var PI2 = Math.PI * 2;
    var PI_2 = Math.PI / 2;

    function getApothem( radius, sides )
    {
        return radius * Math.cos( Math.PI / sides );
    }

    function sideLength( radius, sides )
    {
        return 2 * radius * Math.sin( Math.PI / sides );
    }

    function initPolygon( x, y, radius, sides, angle, thickness, filled )
    {
        return {
            x : x || 0,
            y : y || 0,
            radius : radius || 1,
            sides : sides || 3,
            angle : angle || 0,
            thickness : thickness || 0,
            filled : filled || 1
        }
    }

    function gettrianglePatch( radius, width, height )
    {
        width = width || window.innerWidth;
        height = height || window.innerHeight;

        var scale = Math.min( width, height );

        var apothem = getApothem( radius, 3 ) / scale;
        var side = sideLength( radius, 3 ) / scale;

        console.log( apothem, side, radius )

        return [
            initPolygon( .5, .5, radius, 3, PI_2 ),
            initPolygon( .5, .5 + apothem,radius, 3, -PI_2 ),

            initPolygon( .5 + side *.5, .5, radius, 3, PI_2 ),
            initPolygon( .5, .5 + apothem,radius, 3, -PI_2 ),
        ]

    }

    function regularTriangle( radius, width, height )
    {
        return gettrianglePatch(radius,width, height);
        var scale = Math.min( width / radius, height/ radius );


        var objects = [];
        var inc = 1/scale;
        var step = Math.PI * 2 / 6;
        for( var i = 0; i < 6; i++ )
        {
            var angle = i * step;
            objects.push(
                {
                    x:.5 + Math.cos( angle ) / apothem,
                    y:.5 + Math.sin( angle ) / apothem,

                    radius:         radius,
                    sides:          3,
                    angle:          i * step,

                    thickness:      2,
                    filled:         0
                }

            );
        }
        return objects;
    }


    exports.getApothem = getApothem;
    exports.sideLength = sideLength;
    exports.regularTriangle = regularTriangle;
    return exports;

}( {} ) );

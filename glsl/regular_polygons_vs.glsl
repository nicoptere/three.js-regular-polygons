
const float PI = 3.1415926535897932384626433832795;

attribute vec3 polygon_rsa;
attribute vec2 polygon_tf;

uniform vec2 size;

varying vec3 rsa;
varying vec2 tf;
varying vec2 center;

void main()
{

    //stores the attributes as varyings
    rsa = polygon_rsa;
    tf = polygon_tf;



    float r0 = size.x / size.y;
    float r1 = size.y / size.x;
    float ratioX;
    float ratioY;
    if( r0 > r1 ) // landscape
    {
        ratioX = 1.;
        ratioY = r0;
    }
    else // portrait
    {
        ratioX = r1;
        ratioY = 1.;
    }

    center = ( .5 + position.xy * .5 ) * size;
    //center.x *= ratioX * size.x;
    //center.y *= ratioY * size.x;

    //computes the radius of the equilateral
    //triangle that encompasses the polygon

    //    float res       = ( 1. / max( size.x, size.y ) ) * 2.;   // screen resolution
    //    float apothem   = ( rsa[ 0 ] + tf[ 0 ] );              // apothem = radius + border thickness
    //    float cosSide   = cos( PI / 3. );

    //here's our radius for an equirectangular
    //triangle for the given apothem:

    //    float radius    = res * ( apothem / cosSide );

    //which rewrites to this one-liner:

    float radius    = 2. * ( 1. / max( size.x, size.y ) ) * ( ( rsa[ 0 ] + tf[ 0 ] ) / cos( PI / 3. ) );

    //computes the triangle's position
    vec3 p = position;
    p.x += cos( p.z ) * radius * ratioX;
    p.y += sin( p.z ) * radius * ratioY;
    p.z = 0.;

    //howdy!
    gl_Position = vec4( p, 1. );

}
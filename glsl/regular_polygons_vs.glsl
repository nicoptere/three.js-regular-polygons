
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

    center = ( .5 + position.xy * .5 ) * size;


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

    //width height ratio to expand the height of our triangle

    float ratio = size.x / size.y;

    //computes the triangle's position
    vec3 p = position;
    p.x += cos( p.z ) * radius;
    p.y += sin( p.z ) * radius * ratio;
    p.z = 0.;

    //howdy!
    gl_Position = vec4( p, 1. );

}
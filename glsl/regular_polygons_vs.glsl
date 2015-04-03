
const float PI = 3.1415926535897932384626433832795;
float lerp( float t, float a, float b ){ return a + t * ( b - a ); }
float norm( float t, float a, float b ){ return ( t - a ) / ( b - a ); }
float map( float t, float a0, float b0, float a1, float b1 ){ return lerp( norm( t, a0, b0 ), a1, b1 ); }


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


    if( r0 >= r1 )
    {
        ratioX = 1.;
        ratioY = r0;
    }
    else
    {
        ratioX = r1;
        ratioY = 1.;
    }
    center = position.xy * size;

    //float ratio = min( ratioX, ratioY );
    float ratio = min( r0, r1 );
    ratio = min( ratioX, ratioY );

    center = vec2(  map( position.x, -1., 1., 0., size.x * ratio ),
                    map( position.y, -1., 1., 0., size.y * ratio )  );


    float radius    = 2. * ( 1. / max( size.x, size.y ) ) * ( ( rsa[ 0 ] + tf[ 0 ] ) / cos( PI / 3. ) );

    vec3 p = position;

    p.x = map( position.x, -1., 1., 0., ratio * 2. ) - ratio;
    p.y = map( position.y, -1., 1., 0., ratio * 2. ) - ratio;

    p.x += cos( p.z ) * radius * ratioX;
    p.y += sin( p.z ) * radius * ratioY;
    p.z = 0.;

    //howdy!
    gl_Position = vec4( p, 1. );

}
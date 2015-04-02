
// regular polygon method
const float PI = 3.1415926535897932384626433832795;
const float PI2 = ( PI * 2. );

float getPolygonDistance( float angle, float radius, float sides, float offset )
{
    float Ia = ( ( PI - ( PI / sides ) * 2. ) * .5 );
    float Pa = PI - ( Ia + ( angle - offset + PI2 ) - ( ( floor( mod( ( ( angle - offset + PI2 ) / PI2 ) * sides, sides ) )  ) * (PI2 / sides) ) + PI2 );
    return ( radius / sin( Pa ) ) * sin( Ia );
}

//uniiforms & varyings

uniform float null;
uniform sampler2D texture;
uniform vec2 size;

varying vec2 center;
varying vec3 rsa;
varying vec2 tf;

void main()
{

    //tries to crop a color on the texture
    vec4 color = texture2D( texture, gl_FragCoord.xy / size );
    if( color.r == null )
    {
        color = vec4( gl_FragCoord.xy / size, 0., 1. );
    }


    //fragment to polygon distance
    vec2 delta = center.xy - gl_FragCoord.xy;

    //computes the distance to the regular polygon
    float radius = getPolygonDistance( atan( delta.y, delta.x ), rsa[ 0 ], rsa[ 1 ], rsa[ 2 ] );
    float thickness = tf[ 0 ];

    //computes the alpha
    float distance = length( delta );
    if( thickness != 0. )
    {
        if( distance <= ( radius + thickness )  )
        {
            color.a = smoothstep( ( radius + thickness ), radius, distance );

            //if object is not filled
            if( !bool( tf[ 1 ] ) )
            {
                if( distance >= ( radius - thickness ) )
                {
                    color.a *= smoothstep( ( radius - thickness ), radius, distance );
                }
                else
                {
                    color.a = 0.;
                }
            }

        }
        else
        {
            discard;
        }
    }
    else
    {
        if( distance < radius )
        {
            color.a = 1.;
        }
        else
        {
            discard;
        }
    }

    gl_FragColor = color;

}
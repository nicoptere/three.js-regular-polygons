var camera,
    backgroundScene,
    scene,
    foregroundScene,
    renderer,
    size,
    back,
    sphere,
    front;

function init( )
{
    //init
    var width = window.innerWidth;
    var height = window.innerHeight;

    backgroundScene = new THREE.Scene();
    scene           = new THREE.Scene();
    foregroundScene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 10e6);
    camera.position.z = 320;

    //setup renderer
    renderer =  new THREE.WebGLRenderer( { alpha: true, antialias:true });

    //important !
    renderer.autoClear = false;

    //important !
    size = new THREE.Vector2( width, height );

    window.onresize = resize;
    resize();

    document.body.appendChild( renderer.domElement );
}

function resize()
{

    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    //important!
    size.x = width;
    size.y = height;

}

function render()
{

    requestAnimationFrame( render );

    //important !
    //updates the size of the polygon materials uiform;
    size.x = window.innerWidth;
    size.y = window.innerHeight;

    animatePolygons( back.geometry );
    //animatePolygons( front.geometry );

    renderer.clear();
    renderer.render( backgroundScene, camera );

    renderer.clearDepth();
    renderer.render( scene, camera );

    renderer.clearDepth();
    renderer.render( foregroundScene, camera );

    sphere.rotation.x += Math.PI / 540;
    sphere.rotation.y += Math.PI / 800;

}


function createPolygons( polygons )
{

    var polygonCount = polygons.length;

    //create buffers
    var indices             = new Int16Array( polygonCount * 3 );
    var vertices            = new Float32Array( polygonCount * 3 * 3 );

    //radius / sides / angle
    var RSA        = new Float32Array( polygonCount * 3 * 3 );

    //thickness / filled
    var TF       = new Float32Array( polygonCount * 3 * 2 );

    var x, y, a, i, j;
    for( i = 0; i < polygonCount; i++ )
    {

        //radius / sides / angle
        var _r = polygons[ i ].radius;
        var _s = polygons[ i ].sides;
        var _a = polygons[ i ].angle;

        //thickness / filled
        var _t = polygons[ i ].thickness;
        var _f = polygons[ i ].filled;

        var rsa_id   = i * 9;
        var tf_id    = i * 6;

        for( j = 0; j < 3 ; j++ )
        {
            //radius / sides / offset angle
            RSA[ rsa_id++ ] = _r;
            RSA[ rsa_id++ ] = _s;
            RSA[ rsa_id++ ] = _a;

            //thickness / filled
            TF[ tf_id++ ] = _t;
            TF[ tf_id++ ] = _f;
        }

        var vertices_id    = i * 9;

        x = -1 + polygons[ i ].x * 2;
        y = -1 + polygons[ i ].y * 2;

        a = Math.PI / 2;
        for( j = 0; j < 3 ; j++ )
        {
            vertices[vertices_id++] = x;
            vertices[vertices_id++] = y;
            vertices[vertices_id++] = a;
            a -= ( Math.PI / 3 ) * 2;
        }

        var i4 = i * 3;
        var indices_id = i * 3;
        indices[ indices_id++ ] = i4 + 2;
        indices[ indices_id++ ] = i4 + 1;
        indices[ indices_id++ ] = i4;

    }

    var geom = new THREE.BufferGeometry( );
    geom.addAttribute( "index", new THREE.BufferAttribute( indices, 1 ) );
    geom.addAttribute( "position", new THREE.BufferAttribute( vertices, 3 ) );

    var attr_rsa = new THREE.BufferAttribute( RSA, 3 );
    geom.addAttribute( "polygon_rsa", attr_rsa );

    var attr_tf = new THREE.BufferAttribute( TF, 2 );
    geom.addAttribute( "polygon_tf", attr_tf );
    geom.needsUpdate = true;

    var polygonMaterial = new THREE.ShaderMaterial(
    {
        uniforms:
        {
            null:       {type: "f", value:null },
            texture :   {type: "t", value: null},
            size :      {type: "v2", value: size }
        },
        attributes :
        {
            polygon_rsa:    { type: 'v3', value: attr_rsa },
            polygon_tf:     { type: 'v2', value: attr_tf }
        },

        vertexShader:   ShaderLoader.get( 'regular_polygons_vs' ),
        fragmentShader: ShaderLoader.get( 'regular_polygons_fs' ),
        transparent:true

    } );

    return new THREE.Mesh( geom, polygonMaterial );

}

function getPolygonObjects( count, radius, jitter, delta )
{
    count = count || 50;
    radius = radius || 20;
    var objects = [];
    var space = ( 1 / count );

    jitter = jitter || 0;
    delta = delta || space;

    for ( var i = 0; i <= count; i++ )
    {
        for ( var j = 0; j < count; j++ ) {
            var poly =
            {
                x:              i * space        + ( Math.random() * jitter * delta ),
                y:              1 - j * space    + ( Math.random() * jitter * delta ),

                radius:         radius + Math.random() * radius,
                sides:          Math.floor( 3 + Math.random() * 6 ),
                angle:          Math.PI * 2 * Math.random(),

                thickness:      Math.random() * 5,
                filled:         ( Math.random() >.5 )? 1 : 0

            };
            objects.push(poly);
        }
    }
    return objects;
}

function animatePolygons( geom )
{

    var tf = geom.attributes.polygon_tf;
    var attr = geom.attributes.polygon_rsa;
    var array = attr.array;
    var count = array.length;
    for( i = 0; i < count; i+= attr.itemSize )
    {
        array[i + 2] += Math.PI / 180 * 2;
    }
    attr.needsUpdate = true;

    //move
    attr = geom.attributes.position;
    array = attr.array;
    count = array.length;
    for( i = 0; i < count; i+= attr.itemSize )
    {
        array[ i + 1 ] += .0025;
        if( array[ i + 1 ] >= 1 )array[ i + 1 ] = -1;
    }
    attr.needsUpdate = true;
}

function onShaderLoaded()
{
    init();

    var ice = THREE.ImageUtils.loadTexture( 'img/ice.jpg', null, function(){
        ice.needsUpdate = true;
    } );

    var fire = THREE.ImageUtils.loadTexture( 'img/fire.jpg', null, function(){
        fire.needsUpdate = true;
    } );


    // polygons in the background
    back = createPolygons( getPolygonObjects( 20, 10 ) );
    back.material.uniforms.texture.value = ice;
    backgroundScene.add( back );


    // polygons on top
    var objects = Tesselation.regularTriangle( 100, size.x, size.y );
    front = createPolygons(objects);
    front.material.uniforms.texture.value = fire;
    foregroundScene.add( front );

    // regular mesh in between
    sphere = new THREE.Object3D();
    scene.add( sphere );

    var geom = new THREE.IcosahedronGeometry(1,1);
    var flat = new THREE.Mesh( geom, new THREE.MeshPhongMaterial({color:0x303030, transparent:true, shading:THREE.FlatShading, opacity:.9 } ) );
    flat.scale.multiplyScalar( 50 );
    sphere.add( flat );

    var grid = new THREE.Mesh( geom, new THREE.MeshPhongMaterial({color:0x505050, transparent:true, shading:THREE.FlatShading, wireframe:true } ) );
    grid.scale.multiplyScalar( 50 );
    sphere.add( grid );

    var light = new THREE.PointLight( 0xFFFFFF, 1.5, 1000 );
    light.position.set( 0, 0, 150 );
    scene.add( light );

    render();
}
var sl = new ShaderLoader();
sl.loadShaders( "./glsl/", onShaderLoaded );

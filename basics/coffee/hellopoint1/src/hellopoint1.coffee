compileShader = (gl, src, type) ->
    shader = gl.createShader type

    gl.shaderSource shader, src

    gl.compileShader shader

    success = gl.getShaderParameter shader, gl.COMPILE_STATUS

    if !success
      console.error "could not compile shader " + gl.getShaderInfoLog shader
      return undefined

    shader

compileProgram = (gl, vertexShaderSrc, fragmentShaderSrc) ->
    vertexShader = compileShader gl, vertexShaderSrc, gl.VERTEX_SHADER
    fragmentShader = compileShader gl, fragmentShaderSrc, gl.FRAGMENT_SHADER

    program = gl.createProgram()

    gl.attachShader program, vertexShader
    gl.attachShader program, fragmentShader
    gl.linkProgram program

    linked = gl.getProgramParameter program, gl.LINK_STATUS

    if !linked
        error = gl.getProgramInfoLog program

        console.error "Error linking program: " + error

        gl.deleteProgram program
        gl.deleteShader fragmentShader
        gl.deleteProgram vertexShader

        return undefined

    program

# Main function

webgl = document.getElementById 'webgl'
gl = webgl.getContext 'webgl'

if !gl
    console.error "Cannot create WebGL context"
else
    program = compileProgram gl, vertex, fragment

    if !program
        console.error "Error cannot compile/link program"
    else
        gl.useProgram program
        gl.program = program

        gl.drawArrays gl.POINT, 0, 1

#out: ./rotatedtriangle.js

compileShader = (gl, src, type) ->
  shader = gl.createShader(type)

  gl.shaderSource shader, src

  gl.compileShader shader

  success = gl.getShaderParameter shader, gl.COMPILE_STATUS

  if !success
    info = gl.getShaderInfoLog shader
    console.error "compileShader - Could not compile shader: " + info
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

    console.error "compileProgram - Error linking program: " + error

    gl.deleteProgram program
    gl.deleteShader fragmentShader
    gl.deleteShader vertexShader

    return undefined

  program


initVertexBuffers = (gl) ->
  vertices = new Float32Array [
     0.0, 0.5,
    -0.5,-0.5,
     0.5,-0.5,
  ]

  n = 3

  vertexBuffer = gl.createBuffer()

  if !vertexBuffer
    console.error "initVertexBuffers - Failed to create the buffer object"
    return -1

  gl.bindBuffer gl.ARRAY_BUFFER, vertexBuffer
  gl.bufferData gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW

  a_Position = gl.getAttribLocation gl.program, 'a_Position'

  if a_Position < 0
    console.log "Failed to get the storage location of a_Position"
    return -1

  gl.vertexAttribPointer a_Position, 2, gl.FLOAT, false, 0, 0
  gl.enableVertexAttribArray a_Position

  n

VSHADER_SOURCE ="""
// x' = x cos b - y sin b
// y' = x sin b + y cos b
// z' = z
attribute vec4 a_Position;
uniform float u_CosB, u_SinB;
  void main() {
    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
}"""

FSHADER_SOURCE ="""
void main() {
  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}"""


canvas = document.getElementById 'webgl'

gl = canvas.getContext 'webgl'

if !gl
  console.error "Error creating WebGL context"

program = compileProgram gl, VSHADER_SOURCE, FSHADER_SOURCE

if !program
  console.error "Error cannot compile/link program"
else
  gl.useProgram program
  gl.program = program

console.log program

n = initVertexBuffers gl

console.log "vertices: " + n

if n < 0
  console.error "Failed to set the positions of the vertices"

ANGLE = 90.0
# Pass the data required to rotate the shape to the vertex shader
radian = Math.PI * ANGLE / 180.0 # Convert to radians

cosB = Math.cos radian
sinB = Math.sin radian

u_CosB = gl.getUniformLocation gl.program, 'u_CosB'
u_SinB = gl.getUniformLocation gl.program, 'u_SinB'

gl.uniform1f u_CosB, cosB
gl.uniform1f u_SinB, sinB

gl.clearColor 0, 0, 0, 1
gl.clear gl.COLOR_BUFFER_BIT

gl.drawArrays gl.TRIANGLES, 0, n

compileShader = (gl, src, type) ->
  shader = gl.createShader(type)

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

getAttributeLocation = (gl, attributeName) ->
  attributeLocation = gl.getAttribLocation gl.program, attributeName

  if attributeLocation < 0
    console.error "Failed to get storage location of " + attributeName
    undefined
  else
    attributeLocation

setPositionAttribute = (gl, attribute, coordinates) ->
  gl.vertexAttrib3f attribute, coordinates.x, coordinates.y, coordinates.z

setScalarAttribute = (gl, attribute, value) ->
  gl.vertexAttrib1f attribute, value

# Main

vertex = """
attribute vec4 a_Position;
attribute float a_PointSize;

void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}"""

fragment = """void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}"""


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

    a_PositionLocation = getAttributeLocation gl, 'a_Position'
    setPositionAttribute gl, a_PositionLocation, x: 0.0, y : 0.0, z: 0.0

    a_PointSizeLocation = getAttributeLocation gl, 'a_PointSize'
    setScalarAttribute gl, a_PointSizeLocation, 5.0

    gl.clearColor 0.0, 0.0, 0.0, 1.0
    gl.clear gl.COLOR_BUFFER_BIT

    gl.drawArrays gl.POINT, 0, 1

#out: ./webgl-utils.js

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

getUniformLocation = (gl, uniformName) ->
  uniformLocation = gl.getUniformLocation gl.program, uniformName

  if uniformLocation < 0
    console.error "Failed to get storage location of " + uniformName
    return
  else
    uniformLocation

setPositionAttribute = (gl, attribute, coordinates) ->
  gl.vertexAttrib3f attribute, coordinates.x, coordinates.y, coordinates.z

setScalarAttribute = (gl, attribute, value) ->
  gl.vertexAttrib1f attribute, value

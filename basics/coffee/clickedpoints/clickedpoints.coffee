#out: ./clickedpoints.js

vertex = """
attribute vec4 a_Position;

void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
}"""

fragment = """void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}"""


canvas = document.getElementById 'webgl'
gl = canvas.getContext 'webgl'

if !gl
  console.error "Cannot create WebGL context"
else
  program = compileProgram gl, vertex, fragment

  if !program
    console.error "Error cannot compile/link program"
  else
    gl.useProgram program
    gl.program = program

    a_Position = getAttributeLocation gl, 'a_Position'

    g_points = []

    gl.clearColor 0.0, 0.0, 0.0, 1.0

    click = (e, gl, canvas, a_Position) ->
      x = e.clientX
      y = e.clientY
      rect = e.target.getBoundingClientRect()

      # Traslazione                        # Normalizzazione
      x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)
      y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)

      g_points.push [x, y]

      gl.clear gl.COLOR_BUFFER_BIT

      len = g_points.length

      for xy in g_points
        gl.vertexAttrib3f a_Position, xy[0], xy[1], 0.0
        gl.drawArrays gl.POINTS, 0, 1

    # Register function (event handler) to be called on a mouse press
    canvas.onmousedown = (e) -> click e, gl, canvas, a_Position

    # Clear <canvas>
    gl.clear gl.COLOR_BUFFER_BIT

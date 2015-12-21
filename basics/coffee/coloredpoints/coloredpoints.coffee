vertex = """
attribute vec4 a_Position;

void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
}"""

fragment = """
precision mediump float;
uniform vec4 u_FragColor;

void main() {
    gl_FragColor = u_FragColor;
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
      u_FragColor = getUniformLocation gl, 'u_FragColor'

      g_points = []
      g_colors = []

      canvas.onmousedown = (e) -> click e, gl, canvas, a_Position, u_FragColor

      click = (e, gl, canvas, a_Position) ->
        x = e.clientX
        y = e.clientY
        rect = e.target.getBoundingClientRect()

        # Traslazione                        # Normalizzazione
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)

        g_points.push [x, y]

        if x >= 0.0 && y >= 0.0
          g_colors.push new Float32Array [1.0, 0.0, 0.0, 1.0]
        else if x < 0.0 && y < 0.0
          g_colors.push new Float32Array [0.0, 1.0, 0.0, 1.0]
        else
          g_colors.push new Float32Array [1.0, 1.0, 1.0, 1.0]

        gl.clear gl.COLOR_BUFFER_BIT

        len = g_points.length

        for i in [0..len - 1] by 1
          point = g_points[i]

          x = point[0]
          y = point[1]

          rgba = g_colors[i]

          # Set position in the vertex shader
          gl.vertexAttrib3f a_Position, x, y, 0.0

          # Set color in the fragment shader
          gl.uniform4fv u_FragColor, rgba

          gl.drawArrays gl.POINTS, 0, 1

        gl.clearColor 0.0, 0.0, 0.0, 1.0
        gl.clear gl.COLOR_BUFFER_BIT

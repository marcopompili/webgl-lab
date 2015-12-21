(function() {
  var a_Position, canvas, click, fragment, g_points, gl, program, vertex;

  vertex = "attribute vec4 a_Position;\n\nvoid main() {\n    gl_Position = a_Position;\n    gl_PointSize = 10.0;\n}";

  fragment = "void main() {\ngl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}";

  canvas = document.getElementById('webgl');

  gl = canvas.getContext('webgl');

  if (!gl) {
    console.error("Cannot create WebGL context");
  } else {
    program = compileProgram(gl, vertex, fragment);
    if (!program) {
      console.error("Error cannot compile/link program");
    } else {
      gl.useProgram(program);
      gl.program = program;
      a_Position = getAttributeLocation(gl, 'a_Position');
      g_points = [];
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      click = function(e, gl, canvas, a_Position) {
        var i, len, len1, rect, results, x, xy, y;
        x = e.clientX;
        y = e.clientY;
        rect = e.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
        g_points.push([x, y]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        len = g_points.length;
        results = [];
        for (i = 0, len1 = g_points.length; i < len1; i++) {
          xy = g_points[i];
          gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
          results.push(gl.drawArrays(gl.POINTS, 0, 1));
        }
        return results;
      };
      canvas.onmousedown = function(e) {
        return click(e, gl, canvas, a_Position);
      };
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }

}).call(this);

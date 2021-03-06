// Generated by CoffeeScript 1.10.0
(function() {
  var a_Position, canvas, click, compileProgram, compileShader, fragment, g_colors, g_points, getAttributeLocation, getUniformLocation, gl, program, setPositionAttribute, setScalarAttribute, u_FragColor, vertex;

  compileShader = function(gl, src, type) {
    var shader, success;
    shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      console.error("could not compile shader " + gl.getShaderInfoLog(shader));
      return void 0;
    }
    return shader;
  };

  compileProgram = function(gl, vertexShaderSrc, fragmentShaderSrc) {
    var error, fragmentShader, linked, program, vertexShader;
    vertexShader = compileShader(gl, vertexShaderSrc, gl.VERTEX_SHADER);
    fragmentShader = compileShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      error = gl.getProgramInfoLog(program);
      console.error("Error linking program: " + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(vertexShader);
      return void 0;
    }
    return program;
  };

  getAttributeLocation = function(gl, attributeName) {
    var attributeLocation;
    attributeLocation = gl.getAttribLocation(gl.program, attributeName);
    if (attributeLocation < 0) {
      console.error("Failed to get storage location of attribute: " + attributeName);
      return void 0;
    } else {
      return attributeLocation;
    }
  };

  getUniformLocation = function(gl, uniformName) {
    var uniformLocation;
    uniformLocation = gl.getUniformLocation(gl.program, uniformName);
    if (!uniformLocation) {
      return console.error("Failed to get storage location of uniform: " + uniformName);
    } else {
      return uniformLocation;
    }
  };

  setPositionAttribute = function(gl, attribute, coordinates) {
    return gl.vertexAttrib3f(attribute, coordinates.x, coordinates.y, coordinates.z);
  };

  setScalarAttribute = function(gl, attribute, value) {
    return gl.vertexAttrib1f(attribute, value);
  };

  vertex = "attribute vec4 a_Position;\n\nvoid main() {\n    gl_Position = a_Position;\n    gl_PointSize = 10.0;\n}";

  fragment = "precision mediump float;\nuniform vec4 u_FragColor;\n\nvoid main() {\n    gl_FragColor = u_FragColor;\n}";

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
      u_FragColor = getUniformLocation(gl, 'u_FragColor');
      g_points = [];
      g_colors = [];
      canvas.onmousedown = function(e) {
        return click(e, gl, canvas, a_Position, u_FragColor);
      };
      click = function(e, gl, canvas, a_Position) {
        var i, j, len, point, rect, ref, results, rgba, x, y;
        x = e.clientX;
        y = e.clientY;
        rect = e.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
        g_points.push([x, y]);
        if (x >= 0.0 && y >= 0.0) {
          g_colors.push(new Float32Array([1.0, 0.0, 0.0, 1.0]));
        } else if (x < 0.0 && y < 0.0) {
          g_colors.push(new Float32Array([0.0, 1.0, 0.0, 1.0]));
        } else {
          g_colors.push(new Float32Array([1.0, 1.0, 1.0, 1.0]));
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        len = g_points.length;
        results = [];
        for (i = j = 0, ref = len - 1; j <= ref; i = j += 1) {
          point = g_points[i];
          x = point[0];
          y = point[1];
          rgba = g_colors[i];
          gl.vertexAttrib3f(a_Position, x, y, 0.0);
          gl.uniform4fv(u_FragColor, rgba);
          results.push(gl.drawArrays(gl.POINTS, 0, 1));
        }
        return results;
      };
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }

}).call(this);

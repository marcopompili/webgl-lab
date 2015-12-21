(function() {
  var FSHADER_SOURCE, Tx, Ty, Tz, VSHADER_SOURCE, canvas, compileProgram, compileShader, gl, initVertexBuffers, n, program, u_Translation;

  compileShader = function(gl, src, type) {
    var info, shader, success;
    shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      info = gl.getShaderInfoLog(shader);
      console.error("compileShader - Could not compile shader: " + info);
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
      console.error("compileProgram - Error linking program: " + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return void 0;
    }
    return program;
  };

  initVertexBuffers = function(gl) {
    var a_Position, n, vertexBuffer, vertices;
    vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    n = 3;
    vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.error("initVertexBuffers - Failed to create the buffer object");
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log("Failed to get the storage location of a_Position");
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
  };

  VSHADER_SOURCE = "attribute vec4 a_Position;\nuniform vec4 u_Translation;\n    void main() {\n        gl_Position = a_Position + u_Translation;\n}";

  FSHADER_SOURCE = "void main() {\n    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n}";

  canvas = document.getElementById('webgl');

  gl = canvas.getContext('webgl');

  if (!gl) {
    console.error("Error creating WebGL context");
  }

  program = compileProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  if (!program) {
    console.error("Error cannot compile/link program");
  } else {
    gl.useProgram(program);
    gl.program = program;
  }

  console.log(program);

  n = initVertexBuffers(gl);

  console.log("vertices: " + n);

  if (n < 0) {
    console.error("Failed to set the positions of the vertices");
  }

  Tx = 0.5;

  Ty = 0.5;

  Tz = 0.0;

  u_Translation = gl.getUniformLocation(program, 'u_Translation');

  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

  gl.clearColor(0, 0, 0, 1);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

}).call(this);

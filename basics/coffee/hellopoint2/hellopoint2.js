// Generated by CoffeeScript 1.10.0
(function() {
  var a_PointSizeLocation, a_PositionLocation, compileProgram, compileShader, fragment, getAttributeLocation, gl, program, setPositionAttribute, setScalarAttribute, vertex, webgl;

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
      console.error("Failed to get storage location of " + attributeName);
      return void 0;
    } else {
      return attributeLocation;
    }
  };

  setPositionAttribute = function(gl, attribute, coordinates) {
    return gl.vertexAttrib3f(attribute, coordinates.x, coordinates.y, coordinates.z);
  };

  setScalarAttribute = function(gl, attribute, value) {
    return gl.vertexAttrib1f(attribute, value);
  };

  vertex = "attribute vec4 a_Position;\nattribute float a_PointSize;\n\nvoid main() {\n    gl_Position = a_Position;\n    gl_PointSize = a_PointSize;\n}";

  fragment = "void main() {\ngl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}";

  webgl = document.getElementById('webgl');

  gl = webgl.getContext('webgl');

  if (!gl) {
    console.error("Cannot create WebGL context");
  } else {
    program = compileProgram(gl, vertex, fragment);
    if (!program) {
      console.error("Error cannot compile/link program");
    } else {
      gl.useProgram(program);
      gl.program = program;
      a_PositionLocation = getAttributeLocation(gl, 'a_Position');
      setPositionAttribute(gl, a_PositionLocation, {
        x: 0.0,
        y: 0.0,
        z: 0.0
      });
      a_PointSizeLocation = getAttributeLocation(gl, 'a_PointSize');
      setScalarAttribute(gl, a_PointSizeLocation, 5.0);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINT, 0, 1);
    }
  }

}).call(this);


  var compileProgram, compileShader, getAttributeLocation, getUniformLocation, setPositionAttribute, setScalarAttribute;

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

  getUniformLocation = function(gl, uniformName) {
    var uniformLocation;
    uniformLocation = gl.getUniformLocation(gl.program, uniformName);
    if (uniformLocation < 0) {
      console.error("Failed to get storage location of " + uniformName);
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

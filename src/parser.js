/*
| -------------------------------------------------------------------
|  GEXF Parser
| -------------------------------------------------------------------
|
|
| Author : PLIQUE Guillaume (Yomguithereal)
| Version : 1.0
*/

;(function(undefined){

  "use strict";

  //------------------------------------------------------------------

  // Classes
  //===========

  // Graph Class
  //-------------
  function Graph(xml){

    // TODO: Add controls --> is that a good gexf?


    // Basic Properties
    //
    var self = this;
    var root_element = xml.getElementsByTagName("gexf")[0];
    var graph_element = xml.getElementsByTagName("graph")[0];
    var meta_element = xml.getElementsByTagName("meta")[0];
    var model_elements = xml.getElementsByTagName("attribute");
    var nodes_elements = xml.getElementsByTagName("node");
    var edges_elements = xml.getElementsByTagName("edge");

    // Parser Functions
    //

    // Graph Version
    function _version(){
      return root_element.getAttribute("version") || "1.0";
    }

    // Graph Mode
    function _mode(){
      return graph_element.getAttribute("mode") || "static";
    }

    // Default Edge Type
    function _defaultEdgeType(){
      return graph_element.getAttribute("defaultedgetype") || "undirected";
    }

    // Meta Data
    function _metaData(){

      var metas = {};
      if(!meta_element){
        return metas;
      }

      // Last modified date
      metas["lastmodifieddate"] = meta_element.getAttribute("lastmodifieddate");

      // Other information
      var meta_children = meta_element.childNodes.to_array();

      meta_children.map(function(child){
        metas[child.tagName] = child.textContent;
      });

      return metas;
    }

    // Models
    function _model(){
      var attributes = [];

      // Iterating through attributes
      model_elements.to_array().map(function(attr){

        // Properties
        var properties = {
          id: attr.getAttribute("id") || attr.getAttribute("for"),
          type: attr.getAttribute("type") || "string",
          title: attr.getAttribute("title") || ""
        };

        // Getting default
        var default_element = attr.childNodes.to_array();

        if(default_element.length > 0){
          properties['defaultValue'] = default_element[0].textContent;
        }

        // Creating attribute
        attributes.push(properties);
      });

      return {attributes: attributes};
    }

    // Nodes
    function _nodes(){
      var nodes = [];

      // Iteration through nodes
      nodes_elements.to_array().map(function(node){

        // Basic properties
        var properties = {
          id: node.getAttribute("id"),
          label: node.getAttribute("label") || ""
        };

        nodes.push(new Node(properties));
      });

      return nodes;
    }

    // Edges
    function _edges(default_type){
      var edges = [];

      // Iteration through edges
      edges_elements.to_array().map(function(edge){

        // Creating the edge
        var properties = edge.attributes.to_object();
        if(!'type' in properties){
          properties['type'] = default_type;
        }

        edges.push(new Edge(properties));
      });

      return edges;
    }


    // Properties
    //
    this.version = _version();
    this.mode = _mode();
    this.defaultEdgeType = _defaultEdgeType();
    this.meta = _metaData();
    this.model = _model();
    this.nodes = _nodes();
    this.edges = _edges();
  }


  // Node Class
  //------------
  function Node(properties){

    // Possible Properties
    this.id = properties.id;
    this.label = properties.label;
    this.attributes = properties.attributes || {};
  }


  // Edge Class
  //------------
  function Edge(properties){

    // Possible Properties
    this.id = properties.id;
    this.type = properties.type || "undirected";
    this.label = properties.label || "";
    this.source = properties.source;
    this.target = properties.target;
    this.weight = properties.weight || 1.0;
  }

  //------------------------------------------------------------------

  // Helpers
  //=========

  // Transform a NodeList Object to iterable array
  NodeList.prototype.to_array = function(){

    // Return array
    var children = [];

    // Iterating
    for(var i = this.length >>> 0; i--;){
      if(this[i].nodeName !== '#text'){
        children.push(this[i]);
      }
    }

    return children;
  }

  // Transform NamedNodeMap into hash of attributes
  NamedNodeMap.prototype.to_object = function(){

    // Return object
    var attributes = {};

    // Iterating
    for(var i = this.length >>> 0; i--;){
      attributes[this[i].name] = this[i].value;
    }

    return attributes;

  }

  //------------------------------------------------------------------

  // Inner Functions
  //=================

  // Fetching GEXF with XHR
  function __fetch(gexf_url){

    // XHR Request
    var request = new XMLHttpRequest();
    request.overrideMimeType('text/xml');
    request.open('GET', gexf_url, false);
    request.send();

    // Returning GEXF XML File
    return request.responseXML;
  }

  // Parsing the GEXF File
  function _parse(gexf_url){

    // Getting gexf
    var gexf = __fetch(gexf_url);
    return new Graph(gexf);
  }

  //------------------------------------------------------------------

  // Public API
  //============
  this.GexfParser = {

    // Functions
    parse: _parse,

    // Version
    version: '0.1'
  }

}).call(this);
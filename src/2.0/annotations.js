/**
 * @typedef {Object} Swagger20
 * Swagger 2.0 specification object
 *
 * @property {String} swagger Required. Specifies the Swagger Specification version being used. It can be used by the Swagger UI and other clients to interpret the API listing. The value MUST be "2.0".
 * @property {Swagger20InfoObject} info Required. Provides metadata about the API. The metadata can be used by the clients if needed.
 * @property {String} host The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port. If the host is not included, the host serving the documentation is to be used (including the port). The host does not support path templating.
 * @property {String} basePath The base path on which the API is served, which is relative to the host. If it is not included, the API is served directly under the host. The value MUST start with a leading slash (/). The basePath does not support path templating.
 * @property {Array.<string>} schemes  The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss". If the schemes is not included, the default scheme to be used is the one used to access the Swagger definition itself.
 * @property {Array.<string>} consumes A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls
 * @property {Array.<string>} produces A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls
 * @property {Object.<Swagger20PathObject>} paths Required. The available paths and operations for the API.
 */

/**
 * @typedef {Object} Swagger20PathObject
 * Swagger 2.0 api endpoints object
 *
 * @property {string} $ref Allows for an external definition of this path item. The referenced structure MUST be in the format of a Path Item Object. If there are conflicts between the referenced definition and this Path Item's definition, the behavior is undefined.
 * @property {Swagger20OperationDefinition} get A definition of a GET operation on this path.
 * @property {Swagger20OperationDefinition} put A definition of a PUT operation on this path.
 * @property {Swagger20OperationDefinition} post A definition of a POST operation on this path.
 * @property {Swagger20OperationDefinition} delete A definition of a DELETE operation on this path.
 * @property {Swagger20OperationDefinition} options A definition of a OPTIONS operation on this path.
 * @property {Swagger20OperationDefinition} head A definition of a HEAD operation on this path.
 * @property {Array.<Swagger20ParameterObject>|Array.<Swagger20ReferenceObject>} parameters A definition of a GET operation on this path.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathItemObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20OperationDefinition
 * Swagger 2.0 operation definition
 *
 * @property {Array.<string>} A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
 * @property {String} summary A short summary of what the operation does. For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.
 * @property {String} description A verbose explanation of the operation behavior
 * @property {Swagger20ExternalDocObject} externalDocs Additional external documentation for this operation.
 * @property {String} operationId Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is recommended to follow common programming naming conventions.
 * @property {Array.<string>} consumes A list of MIME types the operation can consume. This overrides the consumes definition at the Swagger Object. An empty value MAY be used to clear the global definition.
 * @property {Array.<string>} produces A list of MIME types the operation can produce. This overrides the produces definition at the Swagger Object. An empty value MAY be used to clear the global definition
 * @property {Array.<Swagger20ParameterObject>} parameters A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it, but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the Swagger Object's parameters. There can be one "body" parameter at most.
 * @property {Object.<Swagger20ResponseObject>|Object.<Swagger20ReferenceObject>} responses Required. The list of possible responses as they are returned from executing this operation.
 * @property {Array.<string>} schemes The transfer protocol for the operation. Values MUST be from the list: "http", "https", "ws", "wss"
 * @property {boolean} deprecated  Declares this operation to be deprecated. Usage of the declared operation should be refrained. Default value is false.
 * @property {Array.<Swagger20SecurityObject>} security A declaration of which security schemes are applied for this operation. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements)
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20SecurityObject
 * Swagger 20 security object
 *
 * @property {Array.<string>} {name} Each name must correspond to a security scheme which is declared in the Security Definitions. If the security scheme is of type "oauth2", then the value is a list of scope names required for the execution. For other security scheme types, the array MUST be empty.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityRequirementObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20ResponseObject
 * Swagger 2.0 response object
 *
 * @property {string} description Required. A short description of the response
 * @property {Object.<Swagger20SchemaObject>} schema A definition of the response structure. It can be a primitive, an array or an object. If this field does not exist, it means no content is returned as part of the response. As an extension to the Schema Object, its root type value may also be "file". This SHOULD be accompanied by a relevant produces mime-type.
 * @property {Object.<Swagger20HeaderObject>} headers A list of headers that are sent with the response.
 * @property {Object.<Swagger20ExampleObject>} examples An example of the response message.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#responseObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20ExampleObject
 * Example object
 *
 * @property {*} {mime type} The name of the property MUST be one of the Operation produces values (either implicit or inherited). The value SHOULD be an example of what such a response would look like.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#exampleObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20HeaderObject
 * Header object
 *
 * @property {String} description A short description of the header.
 * @property {String} type Required. The type of the object. The value MUST be one of "string", "number", "integer", "boolean", or "array".
 * @property {String} format The extending format for the previously mentioned type. See Data Type Formats for further details.
 * @property {Object.<Swagger20ItemObject>} items Required if type is "array". Describes the type of items in the array.
 * @property {String} collectionFormat Determines the format of the array if type array is used. Possible values are:
 * <ul>
 *   <li><code>csv</code> - comma separated values <code>foo,bar</code>.</li>
 *   <li><code>ssv</code> - space separated values <code>foo bar</code>.</li>
 *   <li><code>tsv</code> - tab separated values <code>foo\tbar</code>.</li>
 *   <li>pipes - pipe separated values <code>foo|bar</code>.</li>
 *   Default value is <code>csv</code>.
 * </ul>
 * @property {*} default Declares the value of the item that the server will use if none is provided. (Note: "default" has no meaning for required items.)
 * @property {Number} maximum @see  https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2.
 * @property {Boolean} exclusiveMaximum @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2.
 * @property {Number} minimum  @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3.
 * @property {Boolean} exclusiveMinimum @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3.
 * @property {Number} maxLength @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1.
 * @property {Number} minLength @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2.
 * @property {String} pattern @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3.
 * @property {Number} maxItems @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2.
 * @property {Number} minItems @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3.
 * @property {Boolean} uniqueItems @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4.
 * @property {Array.<*>} enum @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1.
 * @property {Number} multipleOf @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#headerObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20ItemObject
 * Item object
 *
 * @property {String} type Required. The type of the object. The value MUST be one of "string", "number", "integer", "boolean", or "array".
 * @property {String} format The extending format for the previously mentioned type. See Data Type Formats for further details.
 * @property {Object.<Swagger20ItemObject>} items Required if type is "array". Describes the type of items in the array.
 * @property {String} collectionFormat Determines the format of the array if type array is used. Possible values are:
 * <ul>
 *   <li><code>csv</code> - comma separated values <code>foo,bar</code>.</li>
 *   <li><code>ssv</code> - space separated values <code>foo bar</code>.</li>
 *   <li><code>tsv</code> - tab separated values <code>foo\tbar</code>.</li>
 *   <li>pipes - pipe separated values <code>foo|bar</code>.</li>
 *   Default value is <code>csv</code>.
 * </ul>
 * @property {*} default Declares the value of the item that the server will use if none is provided. (Note: "default" has no meaning for required items.)
 * @property {Number} maximum @see  https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2.
 * @property {Boolean} exclusiveMaximum @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2.
 * @property {Number} minimum  @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3.
 * @property {Boolean} exclusiveMinimum @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3.
 * @property {Number} maxLength @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1.
 * @property {Number} minLength @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2.
 * @property {String} pattern @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3.
 * @property {Number} maxItems @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2.
 * @property {Number} minItems @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3.
 * @property {Boolean} uniqueItems @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4.
 * @property {Array.<*>} enum @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1.
 * @property {Number} multipleOf @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20ReferenceObject
 * Swagger 2.0 response object
 *
 * @property string $ref Required. The reference string.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#referenceObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20ParameterObject
 *
 * @property {String} name Required. The name of the parameter. Parameter names are case sensitive.
 * @property {String} in Required. The location of the parameter. Possible values are "query", "header", "path", "formData" or "body".
 * @property {String} description A brief description of the parameter. This could contain examples of use. GFM syntax can be used for rich text representation.
 * @property {boolean} required Determines whether this parameter is mandatory. If the parameter is in "path", this property is required and its value MUST be true. Otherwise, the property MAY be included and its default value is false.
 * @property {Swagger20SchemaObject} schema Required if <i>in</i> is <code>"body"</code> . The schema defining the type used for the body parameter.
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20SchemaObject
 *
 * @property {String} title Required. The name of the parameter.
 * @property {String} format Data type format
 * @property {String} type Data type
 * @property {String} description Parameter description
 * @property {*} default Default parameter value
 * @property {String} description A short description for the tag
 * @property {String} discriminator Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the required property list. When used, the value MUST be the name of this schema or any schema that inherits it.
 * @property {boolean} readOnly Relevant only for Schema "properties" definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but MUST NOT be sent as part of the request. Properties marked as readOnly being true SHOULD NOT be in the required list of the defined schema. Default value is false.
 * @property {Swagger20XMLObject} xml  This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
 * @property {Swagger20ExternalDocObject} externalDocs Additional external documentation for this schema.
 * @property {*} example A free-form property to include an example of an instance for this schema.
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema-object
 * for more details
 */

/**
 * @typedef {Object} Swagger20XMLObject
 * @property {String} name Replaces the name of the element/attribute used for the described schema property. When defined within the Items Object (items), it will affect the name of the individual XML elements within the list. When defined alongside type being array (outside the items), it will affect the wrapping element and only if wrapped is true. If wrapped is false, it will be ignored.
 * @property {String} namespace The URL of the namespace definition. Value SHOULD be in the form of a URL.
 * @property {String} prefix The prefix to be used for the name.
 * @property {boolean} attribute Declares whether the property definition translates to an attribute instead of an element. Default value is false.
 * @property {boolean} wrapped MAY be used only for an array definition. Signifies whether the array is wrapped (for example, <books><book/><book/></books>) or unwrapped (<book/><book/>). Default value is false. The definition takes effect only when defined alongside type being array (outside the items).
 */

/**
 * @typedef {Object} Swagger20ExternalDocObject
 * Allows referencing an external resource for extended documentation.
 *
 * @property {String} description A short description of the target documentation. GFM syntax can be used for rich text representation.
 * @property {String} url Required. The URL for the target documentation. Value MUST be in the format of a URL.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#externalDocumentationObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20InfoObject
 * Swagger 20 info object
 *
 * @property {String} title Required. The title of the application.
 * @property {String} description A short description of the application
 * @property {String} termsOfService The Terms of Service for the API.
 * @property {Swagger20ContactObject} contact The contact information for the exposed API.
 * @property {Swagger20LicenseObject} license The license information for the exposed API.
 * @property {String} version Required Provides the version of the application API (not to be confused with the specification version).
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#infoObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20LicenseObject
 * Swagger 20 license object
 *
 * @property {String} name Required. The license name used for the API.
 * @property {String} url A URL to the license used for the API. MUST be in the format of a URL.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#licenseObject
 * for more details
 */

/**
 * @typedef {Object} Swagger20ContactObject
 * Swagger 20 contact information object
 *
 * @property {String} name The identifying name of the contact person/organization.
 * @property {String} url The URL pointing to the contact information. MUST be in the format of a URL.
 * @property {String} email The email address of the contact person/organization. MUST be in the format of an email address.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#contactObject
 * for more details
 */

/**
 * @typedef {Object} ParserOptions
 * @property {String} getTagCommand Command for get tag list
 * @property {String} repoPath Path to repository with project
 * @property {String} packageName Package name
 * @property {String} moduleName Module name
 * @property {String} className Class name
 */

// Package definitions

/**
 * @typedef {Object} SecurityObject
 * Definitions object (for model)
 *
 * @property {String} type Required. The type of the security scheme. Valid values are "basic", "apiKey" or "oauth2".
 * @property {String} description A short description for security scheme.
 * @property {String} name Required. The name of the header or query parameter to be used.
 * @property {String} in Required The location of the API key. Valid values are "query" or "header".
 * @property {String} flow Required. The flow used by the OAuth2 security scheme. Valid values are "implicit", "password", "application" or "accessCode".
 * @property {String} authorizationUrl Required. The authorization URL to be used for this flow. This SHOULD be in the form of a URL.
 * @property {String} tokenUrl Required. The token URL to be used for this flow. This SHOULD be in the form of a URL.
 * @property {Array.<Scope>} scopes Required. The available scopes for the OAuth2 security scheme.
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-scheme-object
 * for more information
 */

/**
 * @typedef {Object} Scope
 * Scope object
 *
 * @property {String} name Maps between a name of a scope to a short description of it (as the value of the property).
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#scopesObject
 * for more details
 */

/**
 * @typedef {Object} ParameterObject
 * Custom property object
 *
 * @property {String} name The name of the parameter. Parameter names are case sensitive.
 * @property {String} camelCaseName The name of the parameter. Parameter names are camelCase sensitive.
 * @property {String} description A brief description of the parameter
 * @property {boolean} required Determines whether this parameter is mandatory. If the parameter is in "path", this property is required and its value MUST be true. Otherwise, the property MAY be included and its default value is false.
 * @property {String} description Short parameter description
 *
 */

/**
 * @typedef {Object} HeaderObject
 * Header object
 *
 * @property {String} description Header description
 * @property {String} name Header name
 * @property {String} camelCaseName Header camelcase name
 * @property {Array.<String>} Header values
 *
 */

/**
 * @typedef {Object} ParameterParserOptionsObject
 * Parameters parser options object
 * @property {boolean} addEnumDescription Add description for enum. Default is true
 */

/**
 * @typedef {Object} MethodConfigObject
 * Parsed method object
 *
 * @property {String} path Method URL
 * @property {String} method HTTP request method
 * @property {Array.<String>} tags Mathod tags
 * @property {String} summary A short summary of what the operation does. For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.
 * @property {String} description A verbose explanation of the operation behavior
 * @property {Swagger20ExternalDocObject} externalDocs Additional external documentation for this operation.
 * @property {String} operationId Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is recommended to follow common programming naming conventions.
 * @property {Array.<string>} consumes A list of MIME types the operation can consume. This overrides the consumes definition at the Swagger Object. An empty value MAY be used to clear the global definition.
 * @property {Array.<string>} produces A list of MIME types the operation can produce. This overrides the produces definition at the Swagger Object. An empty value MAY be used to clear the global definition
 * @property {Array.<ParameterObject>} parameters A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it, but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the Swagger Object's parameters. There can be one "body" parameter at most.
 * @property {Array.<ParameterObject>} headers A list of headers that are applicable for this operation
 * @property {Array.<ParameterObject>} bodyParams A list of body request parameters that are applicable for this operation
 * @property {Array.<ParameterObject>} queryParams A list of query parameters that are applicable for this operation
 * @property {Array.<ParameterObject>} formDataParams A list of multipart/form-data parameters that are applicable for this operation
 * @property {Array.<ParameterObject>} pathParams A list of path parameters that are applicable for this operation
 * @property {Object.<Swagger20ResponseObject>|Object.<Swagger20ReferenceObject>} responses Required. The list of possible responses as they are returned from executing this operation.
 * @property {Array.<string>} schemes The transfer protocol for the operation. Values MUST be from the list: "http", "https", "ws", "wss"
 * @property {boolean} isDeprecated  Declares this operation to be deprecated. Usage of the declared operation should be refrained. Default value is false.
 * @property {boolean} isSecure Method has security schemes
 * @property {boolean} isGET Method is HTTP GET request
 * @property {boolean} isPUT Method is HTTP PUT request
 * @property {boolean} isDELETE Method is HTTP DELETE request
 * @property {boolean} isOPTIONS Method is HTTP OPTIONS request
 * @property {boolean} isHEAD Method is HTTP HEAD request
 * @property {boolean} isCONNECT Method is HTTP CONNECT request
 * @property {boolean} isTRACE Method is HTTP TRACE request
 * @property {boolean} isPATCH Method is HTTP PATCH request
 * @property {boolean} isPOST Method is HTTP POST request
 * @property {Array.<ParameterObject>} enums Enum list
 * @property {Array.<Swagger20SecurityObject>} security A declaration of which security schemes are applied for this operation. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements)
 *
 */

// Generator API

/**
 * @typedef {Object} GeneratorOptions
 *
 * @property {String} moduleName Module name
 * @property {String} className Class name
 * @property {String|undefined} outFile Destination swagger api object
 */
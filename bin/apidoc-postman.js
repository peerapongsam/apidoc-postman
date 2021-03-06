#!/usr/bin/env node

'use strict';

/*
 * apidoc
 * http://apidocjs.com
 *
 * Copyright (c) 2013-2016 inveris OHG
 * Author Peter Rottmann <rottmann@inveris.de>
 * Author Peerapong Samarnpont <peerapong_sam@hotmail.com>
 * Licensed under the MIT license.
 */

var path   = require('path');
var nomnom = require('nomnom');
var apidoc = require('../lib/index');

var argv = nomnom
    .option('file-filters', { abbr: 'f', 'default': '.*\\.(clj|cls|coffee|cpp|cs|dart|erl|exs?|go|groovy|ino?|java|js|jsx|kt|litcoffee|lua|p|php?|pl|pm|py|rb|scala|ts|vue)$',
            list: true,
            help: 'RegEx-Filter to select files that should be parsed (multiple -f can be used).' })

    .option('exclude-filters', { abbr: 'e', 'default': '', list: true,
            help: 'RegEx-Filter to select files / dirs that should not be parsed (many -e can be used).', })

    .option('input', { abbr: 'i', 'default': './', list: true, help: 'Input / source dirname.' })

    .option('output', { abbr: 'o', 'default': './doc/', help: 'Output dirname.' })

    .option('template', { abbr: 't', 'default': path.join(__dirname, '../template/'),
            help: 'Use template for output files.' })

    .option('config', { abbr: 'c', 'default': './', help: 'Path to directory containing config file (apidoc.json)' })

    .option('private', { abbr: 'p', 'default': false, help: 'Include private APIs in output.'})

    .option('verbose', { abbr: 'v', flag: true, 'default': false, help: 'Verbose debug output.' })

    .option('help', { abbr: 'h', flag: true, help: 'Show this help information.' })

    .option('debug', { flag: true, 'default': false, help: 'Show debug messages.' })

    .option('color', { flag: true, 'default': true, help: 'Turn off log color.' })

    .option('parse', { flag: true, 'default': false,
            help: 'Parse only the files and return the data, no file creation.' })

    .option('parse-filters'  , { list: true, help: 'Optional user defined filters. Format name=filename' })
    .option('parse-languages', { list: true, help: 'Optional user defined languages. Format name=filename' })
    .option('parse-parsers'  , { list: true, help: 'Optional user defined parsers. Format name=filename' })
    .option('parse-workers'  , { list: true, help: 'Optional user defined workers. Format name=filename' })

    .option('silent', { flag: true, 'default': false, help: 'Turn all output off.' })

    .option('simulate', { flag: true, 'default': false, help: 'Execute but not write any file.' })

    .option('markdown', { 'default': true, help: 'Turn off default markdown parser or set a file to a custom parser.' })

    .option('line-ending', { help: 'Turn off autodetect line-ending. Allowed values: LF, CR, CRLF.' })

    .option('encoding', { 'default': 'utf8', help : 'Set the encoding of the source code. [utf8].' })

    .parse()
;

/**
 * Transform parameters to object
 *
 * @param {String|String[]} filters
 * @returns {Object}
 */
function transformToObject(filters) {
    if ( ! filters)
        return;

    if (typeof(filters) === 'string')
        filters = [ filters ];

    var result = {};
    filters.forEach(function(filter) {
        var splits = filter.split('=');
        if (splits.length === 2) {
            var obj = {};
            result[splits[0]] = path.resolve(splits[1], '');
        }
    });
    return result;
}

var options = {
    excludeFilters: argv['exclude-filters'],
    includeFilters: argv['file-filters'],
    src           : argv['input'],
    dest          : argv['output'],
    template      : argv['template'],
    config        : argv['config'],
    apiprivate    : argv['private'],
    verbose       : argv['verbose'],
    debug         : argv['debug'],
    parse         : argv['parse'],
    colorize      : argv['color'],
    filters       : transformToObject(argv['parse-filters']),
    languages     : transformToObject(argv['parse-languages']),
    parsers       : transformToObject(argv['parse-parsers']),
    workers       : transformToObject(argv['parse-workers']),
    silent        : argv['silent'],
    simulate      : argv['simulate'],
    markdown      : argv['markdown'],
    lineEnding    : argv['line-ending'],
    encoding      : argv['encoding'],
};

if (apidoc.createDoc(options) === false) {
    process.exit(1);
}
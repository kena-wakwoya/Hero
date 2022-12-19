const colors = require('colors');
const ip = require('ip');
const ipAddress = ip?.address();

const _logger = require('tracer').colorConsole({
    filters: {
        log: colors.black,
        trace: colors.magenta,
        debug: colors.blue,
        info: colors.blue,
        warn: colors.yellow,
        error: [colors.red, colors.bold],
    },
    format: [
        `{{timestamp}}@${ipAddress} <{{title}}> PID:[${process.pid}] {{message}}`,
        {
            error: `{{timestamp}}@${ipAddress} <{{title}}> PID:[${process.pid}] {{message}} Call Stack:\n{{stack}}`,
        },
    ],
    dateformat: 'HH:MM:ss.L',
    preprocess: function (data) {
        data.title = data.title.toUpperCase();
    },
});

export default {
    error: (...data) => _logger.error(...data),
    info: (...data) => _logger.info(...data),
};

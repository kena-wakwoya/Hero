export default (channelName) => ({
    type: channelName?.indexOf('private-dial-') > -1 ? 'dial' : channelName?.indexOf('private-user-') ? 'user' : '',
    name: channelName?.replace('private-dial-', ''),
});
